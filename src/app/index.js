'use strict'

const axios = require('axios')
const config = require('config')
const axiosDelay = require('axios-delay')

const baseClient = require('./base')
const camundaClient = require('./camunda')

const create = configOrPrefix => {
    const opts = {
        baseURL: configOrPrefix.url || config.get(`${configOrPrefix}.url`),
        timeout: configOrPrefix.timeout || config.get(`${configOrPrefix}.timeout`),
        adapter: axiosDelay.default(axios.defaults.adapter),
        headers:
            configOrPrefix.headers ||
            (config.has(`${configOrPrefix}.headers`)
                ? config.get(`${configOrPrefix}.headers`)
                : axios.defaults.headers)
    }

    const instance = axios.create(opts)
    instance.configPrefix = configOrPrefix

    if (
        (typeof configOrPrefix === 'string' && configOrPrefix.includes('camunda')) ||
        (configOrPrefix.url && configOrPrefix.url.includes('engine-rest'))
    ) {
        return camundaClient(instance)
    }

    return baseClient(instance)
}

module.exports = create
