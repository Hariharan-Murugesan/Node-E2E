import mongoose from "mongoose";

export const mongooseConnect = () => {
    mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DB_NAME})
        .then(result => {
            console.log('connected to mongoose DB!')
        }).catch(err => {
            console.log(err);
        });
}