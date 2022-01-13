import Model from 'src/model';

import { ModelDefinition, RecordSchema, RecordSchemaSettings } from '@orbit/records';
import { Dict } from '@orbit/utils';

type SchemaInjections = { modelNames?: string[] } & RecordSchemaSettings;

export let Owner = {};

export function initialize(mapping: { [key: string]: Model }) {
    Owner = mapping;
    SchemaFactory.create();
}

const SchemaFactory = {
    create(injections: SchemaInjections = {}): RecordSchema {
        if (injections.models === undefined) {
            const modelSchemas: Dict<ModelDefinition> = {};

            // const modelNames = injections.modelNames ?? models;
            const modelNames = Object.keys(Owner) as Array<keyof typeof Owner>;

            for (const name of modelNames) {
                const { keys, attributes, relationships } = Owner[name];

                modelSchemas[name] = {
                    keys,
                    attributes,
                    relationships,
                };
            }

            injections.models = modelSchemas;
        }

        // injections.version ??= orbitConfig.schemaVersion;

        return new RecordSchema(injections);
    },
};

export default SchemaFactory;
