const Joi = require('joi')
const fs = require('fs')
const util = require('util')
const unlink = util.promisify(fs.unlink)

module.exports.isValidFile = async (ctx, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(1).max(300).required(),
    size: Joi.number().integer().min(1).required(),
    projectName: Joi.string().min(1).max(30).required(),
    projectUrl: Joi.string().max(256).required(),
    text: Joi.string().required(),
    fileurl: Joi.string().allow('').optional(),
  })
  const { name, size } = ctx.request.files.file
  const { error } = schema.validate({ ...ctx.request.body, name, size })
  if (error) {
    const { path } = ctx.request.files.file
    await unlink(path)

    ctx.status = 400
    return (ctx.body = {
      mes: error,
      status: 'Error',
    })
  }
  return next()
}

module.exports.isValidEmail = (ctx, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    message: Joi.string().max(1200).required(),
  })
  const { error } = schema.validate(ctx.request.body)
  if (error) {
    ctx.status = 400
    return (ctx.body = {
      mes: error,
      status: 'Error',
    })
  }
  next()
}

module.exports.isValidAuth = (ctx, next) => {
  const schema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
  })
  const { error } = schema.validate(ctx.request.body)
  if (error) {
    ctx.status = 400
    return (ctx.body = {
      mes: error,
      status: 'Error',
    })
  }
  console.log('Next auth')
  next()
}
