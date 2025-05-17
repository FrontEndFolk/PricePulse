-- SQLite
CREATE TABLE IF NOT EXISTS sizes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        size TEXT NOT NULL,
        stock INTEGER,
        FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );