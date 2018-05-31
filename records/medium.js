'use strict';
import AWS from 'aws-sdk';
import Promise from 'bluebird';


export default class Medium {
    constructor(options) {
        let _options = options || {};

        // connect to local DB if running offline

        options = {
            region: 'eu-west-2',
            endpoint: 'http://localhost:8000',
            credentials: {
                accessKeyId: "test",
                secretAccessKey: "test"
            }
        };
        // AWS.config.
        this.client = new AWS.DynamoDB.DocumentClient(options);
    }

    async create(params) {
        const timestamp = new Date().getTime();
        const expired = new Date(timestamp + 30 * 60000);
        return await Promise.promisify(this.client.put, {context: this.client})(
            {
                TableName: `${process.env.DYNAMODB_TABLE_PREFIX}_${params.type.toUpperCase()}`,
                Item: {
                    id: params.id,
                    content: params.content,
                    expired: expired,
                    created_at: timestamp,
                    updated_at: timestamp,
                },
                ConditionExpression: "attribute_not_exists(id)"
            }
        ).catch(err => {
            throw err;
        })
    }

    update(params) {

    }

    async of(id, type, params) {
        let ofId = await Promise.promisify(this.client.get, {context: this.client})(
            {
                TableName: `${process.env.DYNAMODB_TABLE_PREFIX}_${type.toUpperCase()}`,
                Key: {
                    id: `${id}`
                }
            }
        ).catch(err => {
            throw err;
        });

        return {
            id: id,
            content: ofId.Item.content
        }
    }

    delete(id) {

    }
}