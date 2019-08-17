'use strict'

const base = require('../base')
const core = require('./core')
const externalTask = require('./external-task')

module.exports = (instance, config) => {
    const basicInstance = base(instance, config)

    return {
        ...basicInstance,
        ...core(basicInstance),
        ...externalTask(basicInstance)
    }
}
