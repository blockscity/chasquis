import Messenger from './messenger';


export const create = async (params) => {
    return new Messenger();
};

export const of = async (mid) => {
    return new Messenger();
};