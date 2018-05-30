import * as apis from '../apis';
import Promise from 'bluebird';
import chai from 'chai';

var expect = chai.expect;


describe('messengers_create', () => {
    before((done) => {
        done();
    });

    it('should able to create the messenger', async () => {
        return Promise.promisify(apis.messengers_create)(
            {
                body: `${JSON.stringify({
                    data: {attributes: {id: "1"}}
                })}`
            },
            {}
        ).then(response => {
            expect(response).to.not.be.empty;
            expect(response.headers.Location).to.match(/messengers/)
        });
    });

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
});
