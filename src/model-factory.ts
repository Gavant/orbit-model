import Orbit from '@orbit/core';
import { cloneRecordIdentity, RecordIdentity } from '@orbit/records';
import { Dict } from '@orbit/utils';

import Cache from './cache';
import { Owner } from './factories/schema-factory';
import Model, { ModelSettings } from './model';

const { assert } = Orbit;

interface Factory {
    create(settings: ModelSettings): Model;
}

// class ModelFactoryClass implements Factory {
//     create(model: Model, settings: ModelSettings) {
//         return Model.create(settings);
//     }
// }

export default class ModelFactory {
    #cache: Cache;
    #modelFactoryMap: Dict<Factory>;

    constructor(cache: Cache) {
        this.#cache = cache;
        this.#modelFactoryMap = {};
    }

    create(identity: RecordIdentity): Model {
        const modelFactory = this.modelFactoryFor(identity.type);

        return modelFactory.create({
            identity: cloneRecordIdentity(identity),
            cache: this.#cache,
        });
    }

    private modelFactoryFor(type: string): Factory {
        let modelFactory = this.#modelFactoryMap[type];

        if (!modelFactory) {
            modelFactory = Owner[type as keyof typeof Owner] as Factory;

            assert(`An ember-orbit model for type ${type} has not been registered.`, modelFactory !== undefined);

            this.#modelFactoryMap[type] = modelFactory;
        }

        return modelFactory;
    }
}
