import { Orbit } from '@orbit/core';
import { AttributeDefinition } from '@orbit/records';

import Model from '../model';
import { defineAttribute } from '../utils/model-definition';

const { assert } = Orbit;

export interface TrackedAttr {
    get(this: Model): unknown;
    set(this: Model, value: unknown): void;
}

export default function attr(type?: string): any;
export default function attr(def: AttributeDefinition): any;
export default function attr(typeOrDef?: string | AttributeDefinition, def?: AttributeDefinition): any {
    let attrDef: AttributeDefinition;

    if (typeof typeOrDef === 'string') {
        attrDef = def ?? {};
        attrDef.type = typeOrDef;
    } else {
        attrDef = typeOrDef ?? {};

        assert(
            '@attr can be defined with a `type` and `definition` object but not two `definition` objects',
            def === undefined,
        );
    }

    return (target: Model, property: string): TrackedAttr => {
        function get(this: Model): unknown {
            return this.$getAttribute(property);
        }

        function set(this: Model, value: unknown) {
            const oldValue = this.$getAttribute(property);

            if (value !== oldValue) {
                this.$replaceAttribute(property, value);
            }
        }

        defineAttribute(target, property, attrDef);

        return { get, set };
    };
}
