const nodemailer = require('nodemailer');
const sgTransport = require("nodemailer-sendgrid-transport")

let mailConfig;

console.log(".....................................")
if(process.env.NODE_ENV === "production"){
  const options = {
    auth: {
      api_key: process.env.SENDGRID_API_SECRET
    }
  }
  mailConfig = sgTransport(options)
}
else{
  if(process.env.NODE_ENV == "staging"){
    console.log("XXXXXX")
    const options = {
      auth: {
        api_key: process.env.SENDGRID_API_SECRET
      }
    }
    mailConfig = sgTransport(options)
  }
  else{
    const host = "smtp.ethereal.email"
    const port = 587
    const auth = {
      user: process.env.ETHEREAL_USER, 
      pass: process.env.ETHEREAL_PASS 
    }
    
    mailConfig = {
      host: host,
      port: port,
      auth: auth
    }
  }
}



module.exports = nodemailer.createTransport(mailConfig)