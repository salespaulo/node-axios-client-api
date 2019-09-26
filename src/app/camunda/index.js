'use strict'

const base = require('../base')
const core = require('./core')

module.exports = (instance, config) => {
    const basicInstance = base(instance, config)

    return {
        ...basicInstance,
        ...core(basicInstance)
    }
}
