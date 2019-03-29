

var express = require("express");
var jsdom= require("jsdom");
var JSDOM=jsdom.JSDOM;
var path=require("path");
var springedge = require('springedge');// springedge
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.set('views',path.join(__dirname,'views'));
 app.engine('html', require('ejs').renderFile);
 app.set('view engine','html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var MongoClient = require('mongodb').MongoClient;
var db;
var url="mongodb://localhost:27017/DonationDB";
var Tx= require('ethereumjs-tx');
const Web3 = require('web3');
var web3Provider=null;
var varphonenumber='';
var web3;
    if(typeof web3 !== 'undefined'){
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/16e52454629a4586a80d4eaf9a88a0cd"));
}
//var account1='0x53b93e07bCb4b3de47535dbCa39Aa9f417D9d738'
const account2='0x45638F8B600e03E0A1e13D54e512aaF5D50e3018'
var newPassword=null;
// var privatekey1=Buffer.from('0e01525e0d90ef42c3de4dba059896277c5531fd28214bcd7d651dc607046a71','hex')
// var privatekey2=Buffer.from('3445c72dc66045d099b85585edae8ac7c517e1b5846a5ace572da98de106f61c','hex')
/*web3.eth.getBalance(account1,(err,bal)=>{
  console.log('account1 getBalance',web3.fromWei(bal,'ether'))
})*/

web3.eth.getBalance(account2,(err,bal)=>{
  console.log('account2 getBalance',web3.fromWei(bal,'ether'))
})
mongoose.connect("mongodb://localhost:27017/DonationDB",function(err,database){
  if(!err){ db=database;
      console.log('MongoDB connection succeeded')}
        else{console.log('Error in database connection:'+ err)}
});
var payapp=require('./routes/payapp');
app.set('views',path.join(__dirname,'views'));
 app.engine('html', require('ejs').renderFile);
 app.set('view engine','html');
app.use('/img', express.static(__dirname + '/img'));
var numTickets=0;
var varflyingto="";
var varflyingfrom="";
var varflightname="";
var nameSchema = new mongoose.Schema({
  projectname:String,
  donarname:String,
  amount:Number,
  address:String,
  email:String,
  phonenumber:String,
});

//var Payment=mongoose.model("payments",paymentschema);
var User = mongoose.model("user", nameSchema);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/start.html");
});
app.get("/index1", (req, res) => {
  // var name=document.getElementById('charityname').textContent+" charity";
   /* var name=$("#charityname").text()*/
   /*var name=req.body.donate;
  return res.render(__dirname + "/views/index.html", {name:name});*/
   return res.render('index',{
      title:'Add tour',

     });
});
app.get("/contact",function(req,res){
     return res.render('contact',{
      title:'contact',

     });
});
app.get('/view', function(req, res){

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
  account1=req.body.address;
  console.log(account1);
      privatekey1=Buffer.from(req.body.p,'hex')
varphonenumber='91'+req.body.phonenumber
new User({projectname:req.body.projectname,donarname:req.body.donarname,email:req.body.email,phonenumber:req.body.phonenumber,address:req.body.address,amount:req.body.amount}).save()
    .then(item => {
  
     web3.eth.getTransactionCount(account1, (err, txCount) => {
  
  const txObject = {
    nonce:    web3.toHex(txCount),
    to:       account2,
    value:    web3.toHex(web3.toWei(amount, 'ether')),
    gasLimit: web3.toHex(21000),
    gasPrice: web3.toHex(web3.toWei('10', 'gwei'))
  }

  
  const tx = new Tx(txObject)
 /* if(account1=="0xf6211984089A17e3F55BEEB7df690Cbc35EcFb43"){
    console.log(account1);
    privatekey1=Buffer.from('0e01525e0d90ef42c3de4dba059896277c5531fd28214bcd7d651dc607046a71','hex')
  }
  else if(account1=="0xFA7314024Ece55cAEE7B24C08291DAaB31ac1CD7"){
    privatekey1= Buffer.from('344516a4d6dcd9f5e3036becbc9d74a64dfc71dc8558a74bc6d1ec4c69db3b03','hex')

  }else if(account1=="0xf5A61e202fF434b72265B081AC6c08321eCA6fE4")
  {
          privatekey1=Buffer.from('cd7394aa6a0b7e222cd68f8bfd25a6bdf180b3afa831d1b177dd1922f091233d','hex')


  }*/
     
tx.sign(privatekey1)
  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')

  web3.eth.sendRawTransaction(raw, (err, txHash) => {
     web3.eth.getBalance(account1,(err,bal)=>{
  console.log('account1 getBalance',web3.fromWei(bal,'ether'))
     })

     web3.eth.getBalance(account2,(err,bal)=>{
  console.log('account2 getBalance',web3.fromWei(bal,'ether'))
      })

  })
})
var msg='funds have been tranformed from '+req.body.address+' to '+account2+' of amount' +req.body.amount
console.log(msg)
     var params = { 
'sender': 'SEDEMO', 'apikey': '6ubqq88255zc9v0071n9856gxsl09p10i', 'to': [ varphonenumber],
'message': msg, 'format': 'json' };
springedge.messages.send(params, 5000, function (err, response) {
  if (err) {
    return console.log(err);
    console.log(varphonenumber);
  }
  console.log(response);
});
     return res.render('pay',{
      title:'contact',

     });
     })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });

});

 
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
