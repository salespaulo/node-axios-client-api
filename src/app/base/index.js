'use strict'

const logger = require('node-winston-logging')
const utils = require('node-config-utils')

const { inspect, toError } = utils.objects

const setDelay = (opts, delay) => {
    const optsWithDelay = { ...opts, delay }
    return optsWithDelay
}

module.exports = (instance, delay = 300) => {
    return {
        get: async (url, opts = {}) => {
            try {
                return await instance.get(url, setDelay(opts, delay))
            } catch (e) {
                logger.error(`[Http Client]: [GET] ${url}; Error: ${inspect(toError(e))}`)
                throw e
            }
        },

        delete: async (url, opts = {}) => {
            try {
                return await instance.delete(url, setDelay(opts, delay))
            } catch (e) {
                logger.error(`[Http Client]: [DELETE] ${url}; Error: ${inspect(toError(e))}`)
                throw e
            }
        },
        put: async (url, body = null, opts = {}) => {
            try {
                return await instance.put(url, body, setDelay(opts, delay))
            } catch (e) {
                logger.error(
                    `[Http Client]: [PUT] ${url}; body=${inspect(body)}; Error: ${inspect(
                        toError(e)
                    )}`
                )
                throw e
            }
        },
        post: async (url, body = null, opts = {}) => {
            try {
                return await instance.post(url, body, setDelay(opts, delay))
            } catch (e) {
                logger.error(
                    `[Http Client]: [POST] ${url}; body=${inspect(body)}; Error: ${inspect(
                        toError(e)
                    )}`
                )
                throw e
            }
        }
    }
}
