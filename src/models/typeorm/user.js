import { EntitySchema } from 'typeorm';

export const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            length: 100
        },
        email: {
            type: 'varchar',
            unique: true
        },
        password: {
            type: 'varchar'
        }
    }
});