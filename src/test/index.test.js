'use strict'

const server = require('node-express-server-api')
const chai = require('chai')

const client = require('../index')
const testClient = client('testclient')
const testCamunda = client('testcamunda')

let instance = null

const baseCheck = result => {
    chai.assert(!!result, 'Result Is Null!')
    chai.assert(!!result.data, 'Result Data Is Null!')
}

const healthCheck = result => {
    baseCheck(result)
    chai.assert(!!result.data.health, 'Result Data health Property Is Null!')
}

const baseResultCheck = result => {
    baseCheck(result)
    chai.assert(!!result.data.result, 'Result Data Is Null!')
}

describe('# Testing Axios Client Api', () => {
    before(() =>
        server()
            .map(server => {
                server.post('/camunda/external-task/fetchAndLock', (req, res) => {
                    console.log('>>>> MOCK')
                    res.status(200).json([])
                })
                return server
            })
            .map(s => (instance = s.instance)),
    )
    after(() =>
        instance.close(() => {
            console.log('[INFO] Server Close')
        }),
    )

    describe('Passing config by param - OK', () => {
        it('# Testing GET 200', done => {
            try {
                const configClient = client({
                    url: 'http://localhost:9990',
                    timeout: 30000,
                })
                testClient
                    .get('/support/ping')
                    .then(result => {
                        console.log('[INFO] Result ', result.data)
                        baseResultCheck(result)
                        chai.assert(result.data.result == 'pong', 'Result Data Is Not Pong Value!')
                        done()
                    })
                    .catch(done)
            } catch (e) {
                done(e)
            }
        })
    })

    it('# Testing GET 404', done => {
        try {
            testClient
                .get('/support/404')
                .then(result => {
                    done('URL nao existe, deveria dar erro 404!')
                })
                .catch(_e => done())
        } catch (e) {
            done(e)
        }
    })

    it('# Testing POST 404', done => {
        try {
            testClient
                .post('/support/post/404')
                .then(result => {
                    done('URL nao existe, deveria dar erro 404!')
                })
                .catch(_e => done())
        } catch (e) {
            done(e)
        }
    })
    it('# Testing Support Ping', done => {
        try {
            testClient
                .get('/support/ping')
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    baseResultCheck(result)
                    chai.assert(result.data.result == 'pong', 'Result Data Is Not Pong Value!')
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })

    it('# Testing Support Echo', done => {
        try {
            testClient
                .get('/support/echo/testing')
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    baseResultCheck(result)
                    chai.assert(
                        result.data.result == 'testing',
                        'Result Data Is Not testing Value!',
                    )
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })

    it('# Testing Support Health', done => {
        try {
            testClient
                .get('/support/health')
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    healthCheck(result)
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })

    // paulo.sales: Work In Process
    xit('# Testing Camunda Fetch And Lock', done => {
        try {
            testCamunda
                .fetchAndLock('workerIdTest', 'topicIdTest', (_tasks, context) =>
                    console.log(`test OK context:`, context),
                )
                .then(result => {
                    console.log('[INFO] Result ', result.data)
                    done()
                })
                .catch(done)
        } catch (e) {
            done(e)
        }
    })
})
