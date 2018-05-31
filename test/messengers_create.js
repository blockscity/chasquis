import AWS from 'aws-sdk';
import Promise from 'bluebird';
import chai from 'chai';
import yaml from 'js-yaml';
import fs from 'fs';
import * as apis from '../apis';


const expect = chai.expect;


describe('messengers_create', () => {
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
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

    afterEach(async () => {
        var params = {
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

    it('should able to create the messenger', async () => {
        return Promise.promisify(apis.messengers_create)(
            {
                body: `${JSON.stringify({
                    data: {
                        id: "1",
                        type: "messengers",
                        attributes: {}
                    }
                })}`
            },
            {}
        ).then(response => {
            expect(response.statusCode).to.be.equal(201);
            expect(response).to.not.be.empty;
            expect(response.headers.Location).to.match(/messengers/)
        });
    }).timeout(5000);

    it('should not able to create the messenger if no id specified', async () => {
        return Promise.promisify(apis.messengers_create)(
            {
                body: "{}"
            },
            {}
        ).then(response => {
            expect(response.statusCode).to.be.equal(400);
            expect(response).to.not.be.empty;

            expect(JSON.parse(response.body).errors).to.eql([
                {
                    detail: "should have required property \'data\'",
                    source: {pointer: ""},
                    status: "400",
                    title: "required"
                }
            ])
        });
    });

    it('should not able to create the messenger with same id twice', async () => {
        return Promise.promisify(apis.messengers_create)(
            {
                body: `${JSON.stringify({
                    data: {
                        id: "1",
                        type: "messengers",
                        attributes: {}
                    }
                })}`
            },
            {}
        ).then(async (res) => {
            expect(res.statusCode).to.be.equal(201);
            return await Promise.promisify(apis.messengers_create)(
                {
                    body: `${JSON.stringify({
                        data: {
                            id: "1",
                            type: "messengers",
                            attributes: {}
                        }
                    })}`
                },
                {}
            )
        }).then(res => {
            expect(res.statusCode).to.be.equal(400);
        })
    }).timeout(5000);

});
