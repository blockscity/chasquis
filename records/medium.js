'use strict';
import Promise from 'bluebird';

export default class Medium {
    constructor(client) {
        this.client = client;
    }

    async create(params) {
        const timestamp = new Date().getTime();
        const expired = new Date(timestamp + 30 * 60000).getTime();
        return await Promise.promisify(this.client.put, {context: this.client})(
            {
                TableName: `${process.env.DYNAMODB_TABLE_PREFIX}_${params.type.toUpperCase()}`,
                Item: {
                    id: params.id,
                    attributes: JSON.stringify(params.attributes || {}),
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

    async update(id, type, data) {
        const timestamp = new Date().getTime();
        let params = {
            TableName: `${process.env.DYNAMODB_TABLE_PREFIX}_${type.toUpperCase()}`,
            Key: {
                id: id,
            },
            ExpressionAttributeValues: {
                ':attributes': JSON.stringify(data.attributes || {}),
                ':updated_at': timestamp
            },
            UpdateExpression: 'SET attributes = :attributes, updated_at = :updated_at',
            ReturnValues: 'ALL_NEW',
        };
        let result = await Promise.promisify(this.client.update, {context: this.client})(params).catch(err => {
            throw err;
        });
        return {
            id: id,
            attributes: JSON.parse(result.Attributes.attributes)
        }
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
            attributes: JSON.parse(ofId.Item.attributes)
        }
    }

    async delete(id, type, params) {
        await Promise.promisify(this.client.delete, {context: this.client})(
            {
                TableName: `${process.env.DYNAMODB_TABLE_PREFIX}_${type.toUpperCase()}`,
                Key: {
                    id: `${id}`
                }
            }
        ).catch(err => {
            throw err;
        });
    }
}