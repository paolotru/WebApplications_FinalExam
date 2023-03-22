'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('q.db', (err) => {
  if(err) throw err;
});
const bcrypt = require('bcrypt');

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.username};
                
        bcrypt.compare(password, row.hash).then(result => {
          if(result) 
            resolve(user);
          else 
            resolve(false);
        });
      }
    });
  });
};
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM admins WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) { 
          reject(err); 
        }
        else if (row === undefined) { 
          resolve({error: 'User not found!'}); 
        }
        else {
          const user = {id: row.id, username: row.username};
          resolve(user);
        }
      });
    });
  };