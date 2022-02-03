import { Orbit } from '@orbit/core';
import { HasOneRelationshipDefinition } from '@orbit/records';

import Model from '../model';
import { defineRelationship } from '../utils/model-definition';
import { camelize } from '../utils/string';

const { assert } = Orbit;

export interface TrackedHasOne {
    get(this: Model): Model | null;
    set(this: Model, value: Model | null): void;
}

export default function hasOne(type: string | string[]): any;
export default function hasOne(def: Partial<HasOneRelationshipDefinition>): any;
export default function hasOne(type: string | string[], def?: Partial<HasOneRelationshipDefinition>): any;
export default function hasOne(
    typeOrDef: string | string[] | Partial<HasOneRelationshipDefinition>,
    def?: Partial<HasOneRelationshipDefinition>,
): any {
    let relDef: Partial<HasOneRelationshipDefinition>;

    if (typeof typeOrDef === 'string' || Array.isArray(typeOrDef)) {
        relDef = def ?? {};
        relDef.type = typeOrDef;
    } else {
        relDef = typeOrDef;

        assert(
            '@hasOne can be defined with a `type` and `definition` object but not two `definition` objects',
            def === undefined,
        );
    }

    if (relDef.type !== undefined) {
        relDef.kind = 'hasOne';
        relDef.type = Array.isArray(relDef.type) ? relDef.type.map(type => camelize(type)) : camelize(relDef.type);
    } else {
        assert('@hasOne() requires a `type` argument.', relDef?.type !== undefined);
    }

    return (target: Model, property: string): TrackedHasOne => {
        function get(this: Model): Model | null {
            return this.$getRelatedRecord(property) as Model | null;
        }

        function set(this: Model, value: Model | null) {
            const oldValue = this.$getRelatedRecord(property);

            if (value !== oldValue) {
                this.$replaceRelatedRecord(property, value);
            }
        }

        defineRelationship(target, property, relDef as HasOneRelationshipDefinition);

        return { get, set };
    };
}
