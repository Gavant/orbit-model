# orbit-model

This package contains a wrapper layer which gives the ability to use models with orbit.js.

## Highlights

-   Access to the full power of Orbit and its ecosystem, including compatible
    sources, buckets, and coordination strategies.

-   A data schema that's declared through simple model definitions.

-   Stores that wrap Orbit sources and provide access to their underlying data as
    easy to use records and record arrays. These stores can be forked, edited in
    isolation, and merged back to the original as a coalesced changeset.

-   The full power of Orbit's composable query expressions.

-   The ability to connect any number of sources together with Orbit coordination
    strategies.

-   Orbit's git-like deterministic change tracking and history manipulation
    capabilities.

## Relationship to Orbit

Orbit Model provides a thin layer over the top of some core
primitives from Orbit, including `Store`, `Cache`, and `Model` classes. Most
common developer interactions with Orbit will be through these classes.

> **Important**: It's strongly recommended that you read the Orbit guides at
> [orbitjs.com](https://orbitjs.com) before using OrbitModel, since an understanding of
> Orbit is vital to making the most of OrbitModel.

## Installation

Install OrbitModel in your project with:

```
yarn add @gavant/orbit-model
```

### Defining models

Models are used to access the underlying data in an EO `Store`.
They provide a proxy to get and set attributes and relationships. In addition,
models are used to define the schema that's shared by the sources in your
Orbit application.

The easiest way to create a `Model` class is with the `data-model` generator:

```
ember g data-model planet
```

This will create the following module in `app/data-models/planet.js`:

```js
import { Model } from '@gavant/orbit-model';

export default class Planet extends Model {}
```

You can then extend your model to include keys, attributes, and relationships:

```js
import { Model, attr, hasOne, hasMany, key } from '@gavant/orbit-model';

export default class Planet extends Model {
    @key() remoteId;
    @attr('string') name;
    @hasMany('moon', { inverse: 'planet' }) moons;
    @hasOne('star') sun;
}
```

You can create polymorphic relationships by passing in an array of types:

```js
import { Model, attr, hasOne, hasMany } from '@gavant/orbit-model';

export default class PlanetarySystem extends Model {
    @attr('string') name;
    @hasMany(['moon', 'planet']) bodies;
    @hasOne(['star', 'binaryStar']) star;
}
```
