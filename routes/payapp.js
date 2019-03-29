var express = require('express');
var route=express.Router();
var Tx= require('ethereumjs-tx');
const Web3 = require('web3');
var web3Provider=null;

var web3;
    if(typeof web3 !== 'undefined'){
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}
var account1='0xf6211984089A17e3F55BEEB7df690Cbc35EcFb43'
const account2='0x45638F8B600e03E0A1e13D54e512aaF5D50e3018'
var newPassword=null;
var privatekey1=Buffer.from('0e01525e0d90ef42c3de4dba059896277c5531fd28214bcd7d651dc607046a71','hex')
var privatekey2=Buffer.from('3445c72dc66045d099b85585edae8ac7c517e1b5846a5ace572da98de106f61c','hex')
web3.eth.getBalance(account1,(err,bal)=>{
  console.log('account1 getBalance',web3.fromWei(bal,'ether'))
})

web3.eth.getBalance(account2,(err,bal)=>{
  console.log('account2 getBalance',web3.fromWei(bal,'ether'))
})
route.get('/',function(req,res,next)
{
  var amount=req.body.name1;
  account1=req.body.address1;
  
     web3.eth.getTransactionCount(account1, (err, txCount) => {
  
  const txObject = {
    nonce:    web3.toHex(txCount),
    to:       account2,
    value:    web3.toHex(web3.toWei(amount, 'ether')),
    gasLimit: web3.toHex(21000),
    gasPrice: web3.toHex(web3.toWei('10', 'gwei'))
  }

 
  const tx = new Tx(txObject)
  if(account1=="0xf6211984089A17e3F55BEEB7df690Cbc35EcFb43"){
   
    privatekey1=Buffer.from('0e01525e0d90ef42c3de4dba059896277c5531fd28214bcd7d651dc607046a71','hex')
  }
  else if(account1=="0xFA7314024Ece55cAEE7B24C08291DAaB31ac1CD7"){
    privatekey1= Buffer.from('344516a4d6dcd9f5e3036becbc9d74a64dfc71dc8558a74bc6d1ec4c69db3b03','hex')

  }else if(account1=="0xf5A61e202fF434b72265B081AC6c08321eCA6fE4")
  {
          privatekey1=Buffer.from('cd7394aa6a0b7e222cd68f8bfd25a6bdf180b3afa831d1b177dd1922f091233d','hex')


  }
      

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

    return res.render('payapphtml',{
      title:'Home',
     });
});
module.exports=route;