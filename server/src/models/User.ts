import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    id: string
    username: string,
    email: string,
    password: string,
}
const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    username : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: false
    },
    password : {
        type : String,
        required: false
    },
    date : {
        type : Date,
        default: Date.now
    }
});


const User = mongoose.model<IUser>('users', UserSchema);

export{User}