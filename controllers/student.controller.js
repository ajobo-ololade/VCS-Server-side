const studentModel= require('../models/student.model')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const cloudinary = require ('cloudinary')
const path = require('path')
const jwt = require("jsonwebtoken")
const JWT = process.env.JWT_SECRET
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const num = "FL" + Math.floor(100 + Math.random()*9000)
 // initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
);
// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};
const display = ((req,res)=>{
    res.send(`I'm Actively working`)
})

const displaySignup=async function (req,res){
    
    studentModel.findOne({email:req.body.email},(err,result)=>{
        if (err) {
            console.log(`An error occured`,err)
            
        } else {
            const newStudent = req.body
            const firstname=req.body.firstname
            const lastname=req.body.lastname
            const email=req.body.email
            const password=req.body.password
            const gender= req.body.gender
            const studentdetails ={
                firstname,
                lastname,
                email,
                password,
                gender,
                matricNo: num

            }
            if (result) {
                res.send({message:`Email already exist`,status:false})
                console.log('email already exist')
                
            } else {
                const form = new studentModel(studentdetails)
                form.save((err)=>{
                    if (err) {
                        console.log(`an error occured in signing up`,err)
                        res.send({message:"Sign up failed, please try again later", status:false})
                        
                    } else {
                       // use a template file with nodemailer
                       transporter.use('compile', hbs(handlebarOptions))
                       
                       
                       var mailOptions = {
                        from: `"Alixem" ${process.env.EMAIL}` , // sender address
                        to: newStudent.email, // list of receivers
                        subject: 'Welcome!',
                        template: 'MatricNo', // the name of the template file i.e email.handlebars
                        context: {
                            name: firstname && lastname, // replace {{name}} with Adebola
                            company: 'Grad School',
                            email: email,
                            matricNo: num,
                          
                           
                        },
                    };
                    // trigger the sending of the E-mail
                    transporter.sendMail(mailOptions, function (error, result) {
                        if (error) {
                            console.log(error);
                            res.send({ status: false, message: "error sending token" })
                        }
                        else if(result!==null) {

                            res.send({ status: true, uniqueId: num, email:email,response:"Ticket Generated" })
                            console.log('Message sent: ' + result.response);
                            //         res.send({message:"registration successful",status:true})
                        }
                    });

                       
                        
                    }
                })
                
            }
            
        }
    })
}
const displaySignin = ((req,res)=>{
    const matricNo = req.body.matricNo
    const password = req.body.password
    studentModel.findOne({matricNo:matricNo},(err,user)=>{
        if (err) {
            res.status(501).send({message:`Server Error`,status:false})
             
         } else {
             if (!user) {
                 console.log(err)
                 res.send({message:`Email not found`,status:false})
                 
             } else {
                 user.validatePassword(password,(err,result)=>{
                     if (err) {
                         console.log(`ERROR IN GENERATING TOKEN`)
                         
                     } else {
                         if (result) {

                             const token = jwt.sign({matricNo},JWT,{expiresIn:3600})
                             
                             res.send({message:`Correct password`,status:true,user,token})
                             
                         } else {
                             res.send({message:`Invalid Password`,status:false})
                         }
                         
                     }
                 })
                 
             }
             
         }

    }) 
    
    
})
module.exports={displaySignup,displaySignin,display}