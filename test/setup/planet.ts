import { Model, key, attr } from 'index'

export default class Planet extends Model {
    @key() remoteId: string | undefined;
    @attr('string') name: string | undefined;
}
