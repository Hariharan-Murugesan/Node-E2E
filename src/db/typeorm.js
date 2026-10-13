import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [],
    migrations: []
});


// import { AppDataSource } from './data-source.js';
// import { User } from '../models/typeorm/user.js';

// await AppDataSource.initialize();

// const userRepository = AppDataSource.getRepository(User);

// // CREATE
// const newUser = userRepository.create({
//     name: 'Hari',
//     email: 'hari@example.com',
//     password: 'hashed-password'
// });

// await userRepository.save(newUser);

// // READ
// const users = await userRepository.find();
// console.log(users);

// // READ ONE
// const user = await userRepository.findOneBy({
//     email: 'hari@example.com'
// });

// // UPDATE
// await userRepository.update(
//     { email: 'hari@example.com' },
//     { name: 'Hariharan' }
// );

// // DELETE
// await userRepository.delete({
//     email: 'hari@example.com'
// });