'use strict'

const base = require('../base')
const core = require('./core')
const externalTask = require('./external-task')

module.exports = instance => {
    const basicInstance = base(instance)

    return {
        ...basicInstance,
        ...core(basicInstance),
        ...externalTask(basicInstance)
    }
}
