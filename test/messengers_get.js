import * as apis from '../apis';
import Promise from 'bluebird';
import chai from 'chai';
import AWS from 'aws-sdk';
import yaml from 'js-yaml';
import fs from 'fs';

const expect = chai.expect;


describe('messengers_get', () => {
    let dynamodb;
    before(async () => {
        dynamodb = new AWS.DynamoDB({
            endpoint: 'http://localhost:8000'
        });
        process.env.DYNAMODB_TABLE_PREFIX = "test";
    });

    beforeEach(async () => {
        try {
            let sls = yaml.safeLoad(fs.readFileSync('./serverless.yml', 'utf8'));
            let table = sls['resources']['Resources']['Messengers']['Properties'];
            table.TableName = `${process.env.DYNAMODB_TABLE_PREFIX}_${"messengers".toUpperCase()}`;

            await Promise.promisify(dynamodb.createTable, {context: dynamodb})(table);
            await Promise.promisify(apis.messengers_create)(
                {
                    body: `${JSON.stringify({
                        data: {
                            id: "1",
                            type: "messengers",
                            attributes: {
                                content: {
                                    access_token: "access_token"
                                }
                            }
                        }
                    })}`
                },
                {}
            )
        } catch (e) {
            throw e;
        }
    });

    afterEach(async () => {
        const params = {
            TableName: `${process.env.DYNAMODB_TABLE_PREFIX}_${"messengers".toUpperCase()}`
        };

        try {
            await Promise.promisify(dynamodb.deleteTable, {context: dynamodb})(params);
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

    after(() => {
        process.env.DYNAMODB_TABLE_PREFIX = undefined;
    });

    it('should able to get the messenger by id', async () => {
        return Promise.promisify(apis.messengers_of)(
            {
                pathParameters: {
                    id: '1'
                }
            },
            {}
        ).then(response => {
            expect(response.statusCode).to.be.equal(200);
            expect(JSON.parse(response.body).data.id).to.be.equal('1')
            expect(JSON.parse(response.body).data.attributes.content.access_token).to.equal("access_token")
        });
    });
});
