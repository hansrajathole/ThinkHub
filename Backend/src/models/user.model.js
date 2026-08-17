import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../config/config.js"

const userSchema = mongoose.Schema({
    username : {
        type : String,
        unique : [true , "email is already exist"],
        required : [true , "email is required"],
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [15, 'Username must be at most 20 characters long'],
        trim: true,
        lowercase : true
    }, 
    googleId : {
        type : String,
        unique : true,
        sparse : true,
    },
    email : {
        type : String,
        unique : [true , "email is already exist"],
        required : [true , "email is required"],
        minLength: [3, 'Email must be at least 3 characters long'],
        maxLength: [40, 'Email must be at most 50 characters long'],
        trim: true,
        lowercase : true
    },
    password : {
        type : String,
        minLength: [6, 'password must be at least 6 characters long'],
        select : false
    }, 
    avatar :{
        type : String,
        default : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    }, 
    reputation : {
        type : Number,
        default : 0

    } , 
    badges : [
        {
            type : String,
            default : 0
        }
    ],
    location : {
        type : String,
        default : "India"
    },
    title : {
        type : String,
        default : "Developer"
    },
    about : {
        type : String,
        default :
            "Developer, tech enthusiast, and lifelong learner. Passionate about coding and sharing knowledge. Let's connect!"
    },
    skills: {
        type: [String], 
        default: () => ['problem', 'solving', 'teamwork', 'communication'],
      },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    questions : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }
    ],
    answers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },

    
}, { timestamps: true })


userSchema.statics.hashedPassword = async function(password) {
    if(!password) {
        throw new Error('Password is required')
    }

    return await bcrypt.hash(password, 10)
}

userSchema.methods.generateToken = async function() {
    return jwt.sign({
        id : this._id,
        username : this.username,
        email : this.email
    }, config.JWT_SECRET , {expiresIn : config.JWT_EXPAIRE_IN} )
}



userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("User" , userSchema)
export default userModel