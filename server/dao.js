'use strict';
const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('q.db', (err) => {
  if(err) throw err;
});

exports.getallQs = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM questionari';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const qs = rows.map((e) => ({id:e.id,name:e.name,authName:e.authName,authId:e.authId,ncompil:e.ncompilazioni}));
        resolve(qs);
      });
    });
};
exports.getQbyId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM questionari WHERE id = ?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const qs = rows.map((e) => ({id:e.id,name:e.name,authName:e.authName,authId:e.authId,ncompil:e.ncompilazioni}));
      resolve(qs);
    });
  });
};
exports.getQsbyAdmin = (adminId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM questionari WHERE authId=?';
        db.all(sql, [adminId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }else if (rows == undefined) {
                resolve({error: 'Nessun questionario trovato'});
            }else{
                const qs = rows.map((e) => ({id:e.id,name:e.name,authId:e.authId,ncompil:e.ncompilazioni}));
                resolve(qs);
            }
        });
    });
};
exports.getDsbyQId = (qId) =>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM domande WHERE qId=?';
        db.all(sql, [qId], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          if (rows == undefined) {
            resolve({error: 'Nessuna domanda trovata'});
          } else {
            const ds = rows.map((e) => ({id:e.id,text:e.text,qId:e.qId,close:e.close,min:e.min,max:e.max,nrispmult:e.nrispmult}));
            resolve(ds);
          }
        });
      });
}
exports.getRbyQ_user=(qId,user)=>{
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM risposte WHERE qId=? AND user=?';
      db.all(sql, [qId,user], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows == undefined) {
          resolve({error: 'Nessuna risposta trovata per questo user/domanda.'});
        } else {
          const r = rows.map((e) => ({id:e.id,text:e.text,qId:e.qId,dId:e.dId,user:e.user}));
          resolve(r);
        }
      });
    });
}
exports.getMultipleRbyD = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM rispostemultiple WHERE dId=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Risposte non trovate.'});
      } else {
        const answers = rows.map((e) => e.text);
        resolve(answers);
      }
    });
  });
};

exports.getUtentibyQId = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT user FROM compilazioni WHERE qId=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Risposte non trovate.'});
      } else {
        const answers = rows.map((e) => e.user);
        resolve(answers);
      }
    });
  });
};

exports.createQ= (q) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO questionari(name, authId, ncompilazioni,authName) VALUES(?,?,?,?)';
    db.run(sql, [q.name, q.authId, q.ncompil,q.authN], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}
exports.createD = (d) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO domande(text, qId, min, max, close,ordine) VALUES(?,?,?,?,?,?)';
    db.run(sql, [d.text, d.qId, d.min, d.max,d.close,d.ordine], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}
exports.createR = (r) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO risposte(user, text,dId, qId) VALUES(?,?,?,?)';
    db.run(sql, [r.user, r.text,r.dId, r.qId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}
exports.createRmult = (rm) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO rispostemultiple(text, dId) VALUES(?,?)';
    db.run(sql, [rm.text, rm.dId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
exports.createCompilazione = (comp) =>{
  return new Promise((resolve,reject) =>{
    const sql = 'INSERT INTO compilazioni(user,qId) VALUES(?,?)';
    db.run(sql,[comp.user,comp.qId],function (err){
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}
exports.addCompilazioneQ = (qId) =>{
  return new Promise((resolve,reject) =>{
    const sql = 'UPDATE questionari SET ncompilazioni = ncompilazioni+1 WHERE id = ?';
    db.run(sql,[qId],function (err){
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}