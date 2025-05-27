exports.fetchAll = async function fetchAll(db, sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

exports.getUserById = async function getUserById(db, id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        })
    })
}

exports.getUserByEmail = async function getUserByEmail(db, email) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}


exports.createUser = async function createUser(db, [email, passwordHash, token]) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users(email, password, telegram_token) VALUES (?, ?, ?)`,
            [email, passwordHash, token],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        )
    })
}