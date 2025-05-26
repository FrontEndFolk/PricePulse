exports.fetchAll = async function fetchAll(db, sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};


exports.getUserByEmail = async function getUserByEmail(db, email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

exports.createUser = async function createUser(db, params) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (email,password,chat_id) VALUES(?,?,?)`, params, (err, rows) => {
            if (err) reject(err);
            resolve({ "result": "ok" });
        })
    })
}