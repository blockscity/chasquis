import Messenger from './messenger';


export default class Messengers {
    constructor(medium) {
        this.medium = medium;
    }

    async create(params) {
        return new Messenger();
    };

    async of(mid) {
        return new Messenger();
    };
}