import { deserializeRecordIdentity, RecordIdentity, serializeRecordIdentity } from '@orbit/records';

export class RecordIdentitySerializer {
    serialize(identity: RecordIdentity) {
        return serializeRecordIdentity(identity);
    }
    deserialize(identifier: string) {
        return deserializeRecordIdentity(identifier);
    }
}

const recordIdentitySerializer = new RecordIdentitySerializer();

export default recordIdentitySerializer;
