const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./models/db.json')

const db = low(adapter)

const getUser = () => db.getState().user
const getWorks = () => db.getState().works
const saveWork = ({ name, link, desc, picture }) =>
  db
    .get('works')
    .push({
      name,
      link,
      desc,
      picture,
    })
    .write()
const saveUser = ({ login, hash, salt }) =>
  db.set('user', { login, hash, salt }).write()

module.exports = {
  getUser,
  getWorks,
  saveWork,
  saveUser,
}
