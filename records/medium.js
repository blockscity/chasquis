'use strict';

import AWS from 'aws-sdk';


export default class Medium {
    constructor(options) {
        let _options = options || {};

        // connect to local DB if running offline
        if (process.env.IS_OFFLINE) {
            options = {
                region: 'localhost',
                endpoint: 'http://localhost:8000',
            };
        }
        this.client = new AWS.DynamoDB.DocumentClient(options);
    }

    create(params) {
        this.client.put()
    }

    update(params) {

    }

    of(id, params) {

    }

    delete(id) {

    }
}