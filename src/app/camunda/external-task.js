'use strict'

const logger = require('node-winston-logging')
const utils = require('node-config-utils')

const endpoint = `/external-task`
const { inspect } = utils.objects

module.exports = instance => {
    return {
        // paulo.sales: Woring In Process
        fetchAndLock: async (
            workerId,
            topicName,
            fcallback,
            variables = [],
            maxTasks = 10,
            usePriority = true,
            lockDuration = 3000
        ) => {
            const body = {
                workerId,
                maxTasks,
                // usePriority,
                // variables,
                topics: [{ topicName: topicName, lockDuration: lockDuration }]
            }

            logger.silly(`[Http Client][Camunda]: Fetch And Lock body:${inspect(body)}`)
            try {
                const tasks = await instance.post(`${endpoint}/fetchAndLock`)
                logger.silly(
                    `[Http Client][Camunda]: Fetch And Lock Success tasks: ${inspect(tasks)}`
                )
                if (fcallback) fcallback(tasks, this)
                return tasks
            } catch (e) {
                console.log('>>>>>>>>>ERROR:', e)
                throw e
            }
        },
        complete: async (workerId, task, processVariables = [], localVariables = []) => {}
    }
}
