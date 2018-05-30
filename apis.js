import * as messengers from './records/messengers';


function ok(data) {
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}

function created(data) {
    return {
        statusCode: 201,
        body: JSON.stringify(data),
        headers: {
            Location: `/messengers/${data.id}`
        }
    };
}

function bad_request(data) {
    return {
        statusCode: 400,
        body: JSON.stringify(data),
    };
}

function errorify(data) {
    return {
        errors: [
            {
                detail: JSON.stringify(data)
            }
        ]
    };
}

export const messengers_create = async (event, context, cb) => {
    try {
        let body = JSON.parse(event.body);
        let messenger = await messengers.create(body);
        cb(null, created(messenger.toJson()));
    } catch (e) {
        cb(e, bad_request(errorify(e)))
    }
};


export const messengers_of = async (event, context, cb) => {
    try {
        let id = event.pathParameters.id;
        let messenger = await messengers.of(id);
        cb(null, ok(messenger.toJson()));
    } catch (e) {
        cb(e, bad_request(errorify(e)))
    }
};


export const messengers_update = async (event, context, cb) => {
    try {
        let body = JSON.parse(event.body);
        let id = event.pathParameters.id;
        let messenger = await messengers.of(id);
        await messenger.update(body);
        cb(null, ok(messenger.toJson()));
    } catch (e) {
        cb(e, bad_request(errorify(e)))
    }
};