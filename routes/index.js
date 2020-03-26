const Router = require('koa-router')
const router = new Router()
const koaBody = require('koa-body')
const controllers = require('../controllers')
const validation = require('../libs/validation')

router.get('/', controllers.index)
router.get('/my-work', controllers.myWorks)
router.get('/contact-me', controllers.contactMe)
router.get('/login', controllers.login)

router.post(
  '/my-work',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/upload',
    },
  }),
  validation.isValidFile,
  validation.isValidDescFile,
  controllers.upload,
)
router.post('/login', koaBody(), validation.isValidAuth, controllers.auth)
router.post(
  '/contact-me',
  koaBody(),
  validation.isValidEmail,
  controllers.email,
)

module.exports = router
