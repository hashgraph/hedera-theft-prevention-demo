const sqlite3 = require('sqlite3').verbose()
const dotEnv = require('dotenv')

dotEnv.config()
const db = new sqlite3.Database(process.env.DATABASE_LOCATION)

const getItem = function (serial) {
  const sql = `SELECT serial, price, action, consensustime, posId FROM items WHERE serial = ? order by id`;
  return new Promise(function (resolve, reject) {
    db.all(sql, [serial], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    })
  })
}

const getItems = function () {
  const sql = `SELECT serial, price, action, consensustime, posId FROM items order by id desc`;
  return new Promise(function (resolve, reject) {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    })
  })
}

const addItem = function (serial, price, status, posId, consensustime) {
  let sql = 'INSERT INTO items (serial, price, action, posId, consensustime) VALUES (?, ?, ?, ?, ?)'
  return new Promise(function (resolve, reject) {
    if (status === undefined) {
      reject('status is undefined')
    } else {
      let data = [serial, price, status, posId, consensustime]
      db.run(sql, data, function (err) {
        if (err) {
          reject(err.message)
        } else {
          resolve(true)
        }
      })
    }
  })
}

module.exports = {
  addItem,
  getItem,
  getItems
}
