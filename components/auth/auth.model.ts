import {Schema, model, connect } from 'mongoose'
import bcrypt from 'bcrypt'

interface UserDoc {
    name: string;
    email: string;
    password: string;
    token: string;
    loginOtp:Number;
    isEmailVerified:boolean;
    createdAt: Date;
    confirmPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDoc>({
    name: {type: String},
    email: { type: String, required: true},
    password: {type: String, required: true},
    token: {type: String}, //required:true
    loginOtp: {type: Number}, //required: true
    isEmailVerified: {type: Boolean, default:false},
}, {
    timestamps: true,
})

UserSchema.pre('save', async function() {
    let user = this as UserDoc;
    if(user.password){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash
    }
});

UserSchema.methods.confirmPassword = async function(password: string){
    const user = this as UserDoc;
    return bcrypt.compare(password, user.password);
}

const User = model<UserDoc>('User', UserSchema);

export default User;