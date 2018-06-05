import Messenger from './messenger';


export default class Messengers {
    constructor(medium) {
        this.medium = medium;
    }

    async create(data) {
        try {
            await this.medium.create({
                id: data.id,
                type: Messenger.type,
                attributes: data.attributes || {}
            }).catch(err => {
                if (err.code === 'ConditionalCheckFailedException') {
                    throw "Already exists";
                }
                throw err;
            });
            return new Messenger(data.id, {}, this.medium);
        } catch (e) {
            throw e;
        }
    };

    async of(mid) {
        try {
            let rehydrated = await this.medium.of(mid, Messenger.type).catch(err => {
                throw err;
            });
            return new Messenger(mid, rehydrated.attributes, this.medium);
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