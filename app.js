

var express = require("express");
var jsdom= require("jsdom");
var JSDOM=jsdom.JSDOM;
var path=require("path");
var app = express();
var port = 3000;
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var springedge = require('springedge');
app.set('views',path.join(__dirname,'views'));
 app.engine('html', require('ejs').renderFile);
 app.set('view engine','html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var MongoClient = require('mongodb').MongoClient;
var db;
var url="mongodb://localhost:27017/DonationDB";//create a collection in mongoDB with name DonationDB
var Tx= require('ethereumjs-tx');
const Web3 = require('web3');
var web3Provider=null;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email@domain.com',
    pass: 'password'
  }
});
var web3;
    if(typeof web3 !== 'undefined'){
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/APIKEY"));//inser apikey of your infura project
}
const account2='0x.....'// enter the address of recipient to whom ethers to be transformed

mongoose.connect("mongodb://localhost:27017/DonationDB",function(err,database){// connection to mongoDB
  if(!err){ db=database;
      console.log('MongoDB connection succeeded')}
        else{console.log('Error in database connection:'+ err)}
});
var payapp=require('./routes/payapp');
app.set('views',path.join(__dirname,'views'));
 app.engine('html', require('ejs').renderFile);
 app.set('view engine','html');
app.use('/img', express.static(__dirname + '/img'));
// var numTickets=0;
// var varflyingto="";
// var varflyingfrom="";
// var varflightname="";
var nameSchema = new mongoose.Schema({ // creating a mongodb schema 
  projectname:String,
  donarname:String,
  amount:Number,
  address:String,
  email:String,
  phonenumber:String,
});
var registrationSchema = new mongoose.Schema({ // creating a mongodb schema 
 userEmail:String,
 userPassword:String,
 username:String
});

var User = mongoose.model("user", nameSchema);// creating a DB object
var Register = mongoose.model("Registercredentials", registrationSchema);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/loginpage.html");//sending login page to server
});
app.post("/login",function(req,res){//login page
  var email=req.body.email;
  var password=req.body.password;
  Register.findOne({userEmail:email,userPassword:password}).then(function(result){// search in mango inbuild
    if(result===null)
    {
        
         return res.render('loginpage',{
      title:'logout',

     });
    }else{
      return res.render('Start',{
      title:'start',

     });
    }
  })
})
app.post("/homepage",function(req,res){
 // if(req.body.psw==req.body.psw1){
new Register({userEmail:req.body.email,userPassword:req.body.psw,username:req.body.name}).save()
    .then(item => { 
      var mailOptions = {
           from: 'emailaddress',
            to: req.body.email,
            subject: 'You have successfully registered',
            text: 'you have successfully registered with the email '+ req.body.email+' password '+req.body.psw
                      };

           transporter.sendMail(mailOptions, function(error, info){
           if (error) {
               console.log(error);
             } else {
              console.log('Email sent: ' + info.response);
             }
           });
          return res.render('Start',{
      title:'start',

     });

    }).catch(err => {
       return res.render('loginpage',{
      title:'loginpage',

     });
      res.status(400).send("unable to save to database");
    });
  /* }else{
    return res.render('registerpage',{
      title:'Register',

     });
   }*/
})
app.get("/registerpage", (req, res) => {
  
   return res.render('registerpage',{
      title:'Register',

     });
});
app.get("/home", (req, res) => {
  
   return res.render('Start',{
      title:'Start ',

     });
});
app.get("/index1", (req, res) => {
  
   return res.render('index',{
      title:'Index',

     });
});
app.get("/contact",function(req,res){
     return res.render('contact',{
      title:'contact',

     });
});
app.get('/view', function(req, res){ // setting data from mongodb in tabular form

      User.find({}, function(err, docs){
        if(err) res.json(err);
        else {  
            
             
            var html = "<h1 align=center><font color=Black>Details Of Donars</font><h1><br/><table border='1|1' align=center>";
            html+="<tr>";
        html+="<td>"+"projectname"+"</td>";
        html+="<td>"+"address"+"</td>";
        html+="<td>"+"amount"+"</td>";
    for (var i = 0; i < docs.length; i++) {
        html+="<tr>";
        html+="<td>"+docs[i].projectname+"</td>";
        html+="<td>"+docs[i].address+"</td>";
        html+="<td>"+docs[i].amount+"</td>";
        html+="</tr>";
    }
    html+="</table>";
    res.send(html);

            }
    });
     
});
 

 app.post("/pay",function(req,res){
   
  var amount=req.body.amount;
      console.log(amount);
  account1=req.body.address;// take address from sender
  console.log(account1);
      privatekey1=Buffer.from(req.body.p,'hex') // take privatekey from sender
varphonenumber='91'+req.body.phonenumber // change country code if not india
if(amount>=1){
new User({projectname:req.body.projectname,donarname:req.body.donarname,email:req.body.email,phonenumber:req.body.phonenumber,address:req.body.address,amount:req.body.amount}).save()
    .then(item => {
     web3.eth.getTransactionCount(account1, (err, txCount) => {
  const txObject = {// creating a transaction object
    nonce:    web3.toHex(txCount),
    to:       account2,
    value:    web3.toHex(web3.toWei(amount, 'ether')),
    gasLimit: web3.toHex(21000),
    gasPrice: web3.toHex(web3.toWei('10', 'gwei'))
  }

  const tx = new Tx(txObject)// converting into ethereum transaction object
     
tx.sign(privatekey1) // signing the object
  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')

  web3.eth.sendRawTransaction(raw, (err, txHash) => { // sending or performing the transaction
     web3.eth.getBalance(account1,(err,bal)=>{
  console.log('account1 getBalance',web3.fromWei(bal,'ether'))
     })

     web3.eth.getBalance(account2,(err,bal)=>{
  console.log('account2 getBalance',web3.fromWei(bal,'ether'))
      })

  })
})
      var mailOptions = { // using nodemailer to send mail to sender mail id
           from: '',
            to:req.body.email,
            subject: 'you have successfully transferred funds',
            text: req.body.donarname+' has transferred the amount '+req.body.amount+' from '+req.body.address+' to '+account2
            };

           transporter.sendMail(mailOptions, function(error, info){
           if (error) {
               console.log(error);
             } else {
              console.log('Email sent: ' + info.response);
             }
           });
     console.log("after payment");
var msg='funds have been tranformed from '+req.body.address+' to '+account2+' of amount' +req.body.amount
console.log(msg)
// sending message to the mobile using the springedge api
     var params = { 
'sender': 'SEDEMO', 'apikey': '6ubqq88255zc9v0071n9856gxsl09p10i', 'to': [varphonenumber],
'message': 'transaction completed message', 'format': 'json' };
springedge.messages.send(params, 5000, function (err, response) {
  if (err) {
    return console.log(err);
    console.log(varphonenumber);
  }
  console.log(response);
});
     return res.render('pay',{
      title:'pay',

     });
     })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
  }else{
    return res.render('error',{
      title:'error',

     });
  }
});

 app.post("/feedback", (req, res) => {
  var passengername=req.body.name;
  var passengeremail=req.body.email;
  var passengercomments=req.body.comments;

             var mailOptions = {
           from: 'emailaddress',
            to: 'toemailaddress',
            subject: 'feedback of passenger',
            text: passengername+' has sent the following feed back '+passengercomments+' and his email id '+passengeremail
            };

           transporter.sendMail(mailOptions, function(error, info){
           if (error) {
               console.log(error);
             } else {
              console.log('Email sent: ' + info.response);
             }
           });
           return res.send('thanks for your feedback');
});
 app.get("/logout", (req, res) => {
return res.render('loginpage',{
      title:'loginpage',

     });

 })

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
