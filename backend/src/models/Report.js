import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const reportSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: "",
    }
    
},{timestamps: true}); //createdAt, updatedAt

//pre hook
//pswd hashing -> convert pswd to something gibberish
userSchema.pre("save",async function(next) {
    if(!this.isModified("password"))     return next(); // skip hashing if pswd is not modified 

    try{
        const salt = await bcrypt.genSalt(10);  // 10 -> number of rounds
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next(error);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword){
    const isPasswordCorrect = await  bcrypt.compare(enteredPassword,this.password);
};

const Report = mongoose.model('Report',reportSchema);
export default Report;