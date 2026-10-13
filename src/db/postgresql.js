import pg from 'pg';
const { Pool } = pg;

export const postgresConnection = new Pool({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 5432),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    max: 10
});

// try {
//     const result = await postgresConnection.query(
//         'SELECT * FROM users WHERE id = $1',
//         [1]
//     );

//     console.log('PostgreSQL connected successfully');
//     console.log(result.rows);
// } catch (error) {
//     console.error('PostgreSQL connection failed:', error.message);
// }