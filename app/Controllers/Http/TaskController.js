'use strict'

const Task = use('App/Models/Task')

class TaskController {

  async index ({ request, response }) { 

    const pending = await Task.query().where("done", null).fetch();

    const completed = await Task.query().where("done", "=", true).fetch();

    const canceled = await Task.query().where("done", "=", false).fetch();

    return {completed, pending, canceled};

    
  }
 
  async store ({ request, response }) {
    const data = request.only(['description'])
    
    const taskExists = await Task.query().where('description', '=', data.description).fetch()
    // console.log(taskExists)
    // console.log(taskExists.toJSON().length)
    if(taskExists.toJSON().length === 0){
      return await Task.create(data)
    }

    return response.status(400).send({ error: 'Tarefa já existente.' })
  }

  async update ({ params, request, response }) {
    const data = request.only(['done'])

    const task = await Task.find(params.id)

    if(task){
      task.merge({ done: data.done })
      await task.save()

      return task
    }else{
      return response.status(401).send({error: 'Tarefa não existe.'})
    }
  }
}

module.exports = TaskController
