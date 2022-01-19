import { KeyDefinition } from '@orbit/records';

import Model from '../model';
import { defineKey } from '../utils/model-definition';

export interface TrackedKey {
    get(this: Model): string;
    set(this: Model, value: string): void;
}

export default function key(options: KeyDefinition = {}): any {
    return (target: Model, property: string): TrackedKey => {
        function get(this: Model): string {
            return this.$getKey(property) ?? '';
        }

        function set(this: Model, value: string) {
            const oldValue = this.$getKey(property);

            if (value !== oldValue) {
                this.$replaceKey(property, value);
            }
        }

        defineKey(target, property, options as KeyDefinition);

        return { get, set };
    };
}
