import mysql from 'mysql2/promise';

export const mysqlConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// // Execute query
// const [rows] = await mysqlConnection.execute('SELECT * FROM users WHERE id = ?', [1]);

// console.log(rows);