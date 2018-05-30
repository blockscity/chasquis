import Messengers from './records/messengers';
import Medium from './records/medium';
import Ajv from 'ajv';


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

function errorify(err) {
    if (!(err instanceof Ajv.ValidationError)) {
        return {
            errors: [
                {
                    detail: JSON.stringify(err)
                }
            ]
        };
    }

    return {
        errors: err.errors.map(e => {
            return {
                status: "400",
                source: {
                    pointer: e.dataPath
                },
                title: e.keyword,
                detail: e.message
            }
        }).reduce((acc, item) => [...acc, item], [])
    };
}

let messengers = new Messengers(new Medium());

export const messengers_create = async (event, context, cb) => {
    var ajv = new Ajv({
        allErrors: false,
        jsonPointers: true,
    });
    let schema = {
        $async: true,
        title: "messengers request",
        type: "object",
        properties: {
            data: {
                type: "object",
                properties: {
                    attributes: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            }
                        },
                        required: ["id"]
                    }
                },
                required: ["attributes"]
            }
        },
        required: ["data"]
    };


    try {
        var validate = await ajv.compile(schema);
        let body = JSON.parse(event.body);
        let data = await validate(body).catch(err => {
            throw err
        });

        let messenger = await messengers.create(data);
        cb(null, created(messenger.toJson()));
    } catch (e) {
        if (!(e instanceof Ajv.ValidationError)) {
            cb(e)
        }

        cb(null, bad_request(errorify(e)))
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