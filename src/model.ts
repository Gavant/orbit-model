import { Assertion, Orbit } from '@orbit/core';
import { DefaultRequestOptions, RequestOptions } from '@orbit/data';
import {
    AttributeDefinition,
    InitializedRecord,
    KeyDefinition,
    ModelDefinition,
    RecordIdentity,
    RelationshipDefinition,
} from '@orbit/records';
import { Dict } from '@orbit/utils';

import Cache from './cache';
import { getModelDefinition } from './utils/model-definition';

const { assert } = Orbit;

export interface ModelSettings {
    cache: Cache;
    identity: RecordIdentity;
}
export default class Model {
    #cache?: Cache;
    #identity: RecordIdentity;

    constructor(settings: ModelSettings) {
        const { cache, identity } = settings;

        assert('Model must be initialized with a cache', cache !== undefined);

        this.#cache = cache;
        this.#identity = identity;
    }

    get $identity(): RecordIdentity {
        return this.#identity;
    }

    get id(): string {
        return this.#identity.id;
    }
    set id(value: string) {
        this.#identity.id = value;
    }

    get type(): string {
        return this.#identity.type;
    }

    $getData(): InitializedRecord | undefined {
        return this.$cache.getRecordData(this.type, this.id);
    }

    $getKey(field: string): string | undefined {
        return this.$getData()?.keys?.[field];
    }

    $replaceKey(key: string, value: string, options?: DefaultRequestOptions<RequestOptions>): void {
        this.$cache.update(t => t.replaceKey(this.#identity, key, value), options);
    }

    $getAttribute(attribute: string): unknown {
        return this.$getData()?.attributes?.[attribute];
    }

    $replaceAttribute(attribute: string, value: unknown, options?: DefaultRequestOptions<RequestOptions>): void {
        this.$cache.update(t => t.replaceAttribute(this.#identity, attribute, value), options);
    }

    $notifyPropertyChange(_key: string) {}

    $getRelatedRecord(relationship: string): Model | null | undefined {
        const cache = this.$cache;
        const relatedRecord = cache.sourceCache.getRelatedRecordSync(this.#identity, relationship);
        if (relatedRecord) {
            return cache.lookup(relatedRecord) as Model;
        } else {
            return relatedRecord;
        }
    }

    $replaceRelatedRecord(
        relationship: string,
        relatedRecord: Model | null,
        options?: DefaultRequestOptions<RequestOptions>,
    ): void {
        this.$cache.update(
            t => t.replaceRelatedRecord(this.#identity, relationship, relatedRecord ? relatedRecord.$identity : null),
            options,
        );
    }

    $getRelatedRecords(relationship: string): ReadonlyArray<Model> | undefined {
        const cache = this.$cache;
        const relatedRecords = cache.sourceCache.getRelatedRecordsSync(this.#identity, relationship);

        if (relatedRecords) {
            return relatedRecords.map(r => cache.lookup(r));
        } else {
            return undefined;
        }
    }

    $addToRelatedRecords(relationship: string, record: Model, options?: DefaultRequestOptions<RequestOptions>): void {
        this.$cache.update(t => t.addToRelatedRecords(this.#identity, relationship, record.$identity), options);
    }

    $removeFromRelatedRecords(
        relationship: string,
        record: Model,
        options?: DefaultRequestOptions<RequestOptions>,
    ): void {
        this.$cache.update(t => t.removeFromRelatedRecords(this.#identity, relationship, record.$identity), options);
    }

    $update(properties: Dict<unknown>, options?: DefaultRequestOptions<RequestOptions>): void {
        this.$cache.update(
            t =>
                t.updateRecord({
                    ...properties,
                    ...this.#identity,
                }),
            options,
        );
    }

    $remove(options?: DefaultRequestOptions<RequestOptions>): void {
        this.$cache.update(t => t.removeRecord(this.#identity), options);
    }

    $disconnect(): void {
        this.#cache = undefined;
    }

    $destroy(): void {}

    get $cache(): Cache {
        if (!this.#cache) {
            throw new Assertion('Record has been disconnected from its cache.');
        }

        return this.#cache;
    }

    static get definition(): ModelDefinition {
        return getModelDefinition(this.prototype);
    }

    static get keys(): Dict<KeyDefinition> {
        return getModelDefinition(this.prototype).keys ?? {};
    }

    static get attributes(): Dict<AttributeDefinition> {
        return getModelDefinition(this.prototype).attributes ?? {};
    }

    static get relationships(): Dict<RelationshipDefinition> {
        return getModelDefinition(this.prototype).relationships ?? {};
    }

    static create(injections: ModelSettings) {
        const { identity, cache, ...otherInjections } = injections;
        const record = new this({ identity, cache });
        const finalizedRecord = Object.assign(record, otherInjections);
        const attributes = this.attributes;
        const relationships = this.relationships;
        const handler: ProxyHandler<any> = {
            get(target, property: string) {
                if (property === 'id') {
                    return finalizedRecord.$identity.id;
                } else if (property === 'type') {
                    return finalizedRecord.$identity.type;
                } else if (relationships[property]) {
                    const kind = relationships[property].kind;
                    if (kind === 'hasOne') {
                        return finalizedRecord.$getRelatedRecord(property);
                    } else {
                        return finalizedRecord.$getRelatedRecords(property);
                    }
                } else if (attributes[property]) {
                    return finalizedRecord.$getAttribute(property as string);
                } else {
                    // this allows a getter declared on the model definition to return a value
                    return target[property];
                }
            },
            set(_target, property: string, value) {
                if (property === 'id') {
                    finalizedRecord.id = value;
                } else if (relationships[property]) {
                    const kind = relationships[property].kind;
                    if (kind === 'hasOne') {
                        finalizedRecord.$replaceRelatedRecord(property, value);
                    }
                } else {
                    finalizedRecord.$replaceAttribute(property as string, value);
                }

                return true;
            },
        };
        const proxy = new Proxy(finalizedRecord, handler);
        return proxy;
    }
}
