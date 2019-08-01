'use strict'

const axios = require('axios')
const config = require('config')
const axiosDelay = require('axios-delay')

const { baseClient } = require('./base')
const { camundaClient } = require('./camunda')

const create = configPrefix => {
    const instance = axios.create({
        baseURL: config.get(`${configPrefix}.url`),
        timeout: config.get(`${configPrefix}.timeout`),
        adapter: axiosDelay.default(axios.defaults.adapter)
    })

    instance.configPrefix = configPrefix

    if (configPrefix === 'camunda') {
        return camundaClient(instance)
    }

    return baseClient(instance)
}

module.exports = create