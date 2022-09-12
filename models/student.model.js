const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    fullName:{
        require:true,
        type:String,

    },
    email:{
        require:true,
        type:String,

    },
    matricNo:{
        require:true,
        type:String,

    },

})
let saltRound = 5;
userSchema.pre('save',function(next){
    bcrypt.hash(this.password,saltRound,(err,hashedPassword)=>{
        if (err) {
            console.log(`error in hashing password `)
            
        } else {
            this.password = hashedPassword
            next()
            
        }
    })
})
userSchema.methods.validatePassword = function(password,callback)
{
    bcrypt.compare(password,this.password,(err,same)=>{
        if (!err) {
            callback(err,same)
            
        } 
        else {
           next()
            
        }
    })
}
let studentModel = mongoose.model('student_tb',userSchema)
module.exports= studentModel