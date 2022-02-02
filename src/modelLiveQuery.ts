// import { RequestOptions } from '@orbit/data';
// import {
//     RecordCacheQueryOptions,
//     RecordCacheTransformOptions,
//     SyncLiveQuery,
//     SyncRecordCache,
// } from '@orbit/record-cache';
// import { LiveQuerySettings } from '@orbit/record-cache/src/live-query/live-query';
// import { RecordQuery, RecordQueryBuilder, RecordQueryResult, RecordTransformBuilder } from '@orbit/records';

// export interface SyncLiveQueryUpdateSettings<
//     QO extends RequestOptions = RecordCacheQueryOptions,
//     TO extends RequestOptions = RecordCacheTransformOptions,
//     QB = RecordQueryBuilder,
//     TB = RecordTransformBuilder,
// > {
//     cache: SyncRecordCache<QO, TO, QB, TB>;
//     query: RecordQuery;
// }

// export class SyncLiveQueryUpdate<
//     QO extends RequestOptions = RecordCacheQueryOptions,
//     TO extends RequestOptions = RecordCacheTransformOptions,
//     QB = RecordQueryBuilder,
//     TB = RecordTransformBuilder,
// > {
//     private _cache: SyncRecordCache<QO, TO, QB, TB>;
//     private _query: RecordQuery;

//     constructor(settings: SyncLiveQueryUpdateSettings<QO, TO, QB, TB>) {
//         this._cache = settings.cache;
//         this._query = settings.query;
//     }

//     query<Result extends RecordQueryResult = RecordQueryResult>(): Result {
//         return this._cache.query(this._query);
//     }
// }

// export interface SyncLiveQuerySettings<
//     QO extends RequestOptions = RecordCacheQueryOptions,
//     TO extends RequestOptions = RecordCacheTransformOptions,
//     QB = RecordQueryBuilder,
//     TB = RecordTransformBuilder,
// > extends LiveQuerySettings {
//     cache: SyncRecordCache<QO, TO, QB, TB>;
// }

// export class ModelLiveQuery<
//     QO extends RequestOptions = RecordCacheQueryOptions,
//     TO extends RequestOptions = RecordCacheTransformOptions,
//     QB = RecordQueryBuilder,
//     TB = RecordTransformBuilder,
// > extends SyncLiveQuery {
//     private get _update() {
//         return new SyncLiveQueryUpdate<QO, TO, QB, TB>({
//             cache: this.cache,
//             query: this._query,
//         });
//     }
// }
