import Messenger from './messenger';


export default class Messengers {
    constructor(medium) {
        this.medium = medium;
    }

    async create(params) {
        try {
            await this.medium.create({
                id: params.id,
                type: Messenger.type
            }).catch(err => {
                if (err.code === 'ConditionalCheckFailedException') {
                    throw "Already exists";
                }
                throw err;
            });
            return new Messenger(params.id, {}, this.medium);
        } catch (e) {
            throw e;
        }
    };

    async of(mid) {
        try {
            let rehydrated = await this.medium.of(mid, Messenger.type).catch(err => {
                throw err;
            });
            return new Messenger(mid, rehydrated.content, this.medium);
        } catch (e) {
            throw e;
        }
    };

    async delete(mid) {
        try {
            await this.medium.delete(mid, Messenger.type).catch(err => {
                throw err;
            });
        } catch (e) {
            throw e;
        }
    };
}