'use strict'

const config = require('config')
const logger = require('node-winston-logging')
const utils = require('node-config-utils')

const { inspect, toError } = utils.objects

const setDelay = (configPrefix, opts = {}) => {
    const optsWithDelay = { ...opts, delay: config.get(`${configPrefix}.delay`) }
    return optsWithDelay
}

const baseClient = instance => {
    return {
        get: async (url, opts = {}) => {
            try {
                return await instance.get(url, setDelay(instance.configPrefix, opts))
            } catch (e) {
                logger.error(`[Http Client]: [GET] ${url}; Error: ${inspect(toError(e))}`)
                throw e
            }
        },

        delete: async (url, opts = {}) => {
            try {
                return await instance.delete(url, setDelay(instance.configPrefix, opts))
            } catch (e) {
                logger.error(`[Http Client]: [DELETE] ${url}; Error: ${inspect(toError(e))}`)
                throw e
            }
        },
        put: async (url, body = null, opts = {}) => {
            try {
                return await instance.put(url, body, setDelay(instance.configPrefix, opts))
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
                return await instance.post(url, body, setDelay(instance.configPrefix, opts))
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

module.exports = {
    baseClient
}
