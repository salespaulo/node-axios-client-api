'use strict'

const convertToCamundaVariables = vars => {
    const keys = Object.keys(vars)
    const variables = {}

    for (let k in keys) {
        if (k === 'businessKey') {
            continue
        }

        const key = keys[k]
        let value = !vars[key] ? 'null' : vars[key]
        let type = 'string'

        const typeOfValue = typeof value

        switch (typeOfValue) {
            case 'boolean':
                type = 'boolean'
                break
            case 'object':
            case 'array':
                type = 'json'
                break
            default:
                if (value.toString().length > 3999) {
                    type = 'json'
                    value = JSON.stringify(value)
                } else {
                    type = 'string'
                }
        }

        variables[`${keys[k]}`] = {
            value,
            type,
        }
    }

    return variables
}

module.exports = instance => {
    return {
        // Tasks
        getTasksByDefinitionKey: async (tenantId, processDefinitionKey, taskDefinitionKey) => {
            return await instance.get(
                `/engine-rest/task?tenantIdIn=${tenantId}&processDefinitionKey=${processDefinitionKey}&taskDefinitionKey=${taskDefinitionKey}`,
            )
        },
        doTaskClaim: async (taskId, username) => {
            return await instance.post(`/engine-rest/task/${taskId}/claim`, {
                userId: username,
            })
        },
        getTaskVariables: async taskId => {
            const resVariables = await instance.get(`/engine-rest/task/${taskId}/variables`)
            const variables = resVariables.data

            if (!variables) {
                return { data: {} }
            }

            const vars = {}
            const keys = Object.keys(variables)

            for (let k in keys) {
                vars[`${keys[k]}`] = variables[`${keys[k]}`].value
            }

            return { data: vars }
        },
        doTaskComplete: async (taskId, vars) => {
            const keys = Object.keys(vars)
            const variables = {}

            for (let k in keys) {
                const value = !vars[keys[k]] ? 'null' : vars[keys[k]].toString().substr(0, 4000)
                variables[`${keys[k]}`] = {
                    value,
                    type: 'String',
                }
            }

            return await instance.post(`/engine-rest/task/${taskId}/complete`, {
                variables,
            })
        },
        // Process
        getProcessInstanceByTaskId: async taskId => {
            const resTask = await instance.get(`/engine-rest/task/${taskId}`)
            const task = resTask.data
            const resInstance = await instance.get(
                `/engine-rest/process-instance/${task.processInstanceId}`,
            )
            return resInstance
        },
        doUpdateVariables: async (taskId, vars) => {
            const variables = convertToCamundaVariables(vars)

            return await instance.post(`/engine-rest/task/${taskId}/variables`, {
                modifications: variables,
            })
        },
        doStart: async (tenantId, processKey, vars) => {
            const variables = convertToCamundaVariables(vars)

            return await instance.post(
                `/engine-rest/process-definition/key/${processKey}/tenant-id/${tenantId}/start`,
                {
                    businessKey: vars.businessKey,
                    variables,
                },
            )
        },
    }
}
