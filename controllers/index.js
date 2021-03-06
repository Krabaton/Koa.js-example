const db = require('../models/db')
const psw = require('../libs/password')
const path = require('path')
const fs = require('fs')
const util = require('util')
const rename = util.promisify(fs.rename)
const sgMail = require('@sendgrid/mail')
require('dotenv').config()

module.exports.index = async (ctx) => {
  await ctx.render('pages/index')
}

module.exports.myWorks = async (ctx) => {
  const works = db.getWorks() || []
  await ctx.render('pages/my-work', {
    items: works,
    authorized: ctx.session.isAuth,
  })
}
module.exports.upload = async (ctx) => {
  const { name, path: filePath } = ctx.request.files.file

  const { projectName, projectUrl, text } = ctx.request.body
  console.log(__dirname)
  console.log(process.cwd())
  let fileName = path.join(process.cwd(), 'public', 'upload', name)
  const errUpload = await rename(filePath, fileName)
  if (errUpload) {
    return (ctx.body = {
      mes: 'Something went wrong try again...',
      status: 'Error',
    })
  }
  db.saveWork({
    name: projectName,
    link: projectUrl,
    desc: text,
    picture: path.join('upload', name),
  })

  ctx.body = {
    mes: 'Picture success upload!',
    status: 'OK',
  }
}

module.exports.contactMe = async (ctx) => {
  await ctx.render('pages/contact-me')
}

module.exports.login = async (ctx) => {
  await ctx.render('pages/login')
}

module.exports.auth = async (ctx) => {
  const { login, password } = ctx.request.body
  const user = db.getUser()
  if (user.login === login && psw.validPassword(password)) {
    ctx.session.isAuth = true
    ctx.body = {
      mes: 'Done',
      status: 'OK',
    }
  } else {
    ctx.status = 403
    ctx.body = {
      mes: 'Forbiden',
      status: 'Error',
    }
  }
}

module.exports.email = async (ctx) => {
  const { name, email, message } = ctx.request.body
  try {
    console.log(process.env.SEND_GRID_API_KEY)
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
    const msg = {
      to: 'krabat@ex.ua',
      from: email,
      subject: `Sending email from ${name}`,
      text: message,
    }
    await sgMail.send(msg)
  } catch (err) {
    return (ctx.body = {
      mes: err.message,
      status: 'Error',
    })
  }
  ctx.body = {
    mes: 'Done',
    status: 'OK',
  }
}
