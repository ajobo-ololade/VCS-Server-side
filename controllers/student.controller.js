const studentModel= require('../models/student.model')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

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

const displaySignup=((req,res)=>{
    
    studentModel.findOne({email:req.body.email},(err,result)=>{
        if (err) {
            console.log(`An error occured`,err)
            
        } else {
            const newStudent = req.body
            const studentdetails ={
                newStudent,
                matricNo: uniqueId

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
                       const num = "FL" + Math.floor(100 + Math.random()*9000)
                       
                       var mailOptions = {
                        from: `"Alixem" ${process.env.EMAIL}` , // sender address
                        to: newStudent.email, // list of receivers
                        subject: 'Welcome!',
                        template: 'MatricNo', // the name of the template file i.e email.handlebars
                        context: {
                            name: newStudent.fullname, // replace {{name}} with Adebola
                            company: 'Grad School',
                            email: newStudent.email,
                            uniqueId: num,
                           
                        },
                    };
                    // trigger the sending of the E-mail
                    transporter.sendMail(mailOptions, function (error, result) {
                        if (error) {
                            console.log(error);
                            res.send({ status: false, message: "error sending token" })
                        }
                        else if(result!==null) {

                            res.send({ status: true, message: num, email:email,response:"Ticket Generated" })
                            console.log('Message sent: ' + result.response);
                            //         res.send({message:"registration successful",status:true})
                        }
                    });

                       
                        
                    }
                })
                
            }
            
        }
    })
})
const displaySignin = ((req,res)=>{
    
    
})
module.exports={displaySignup,displaySignin}