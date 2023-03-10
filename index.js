const { spawn } = require('child_process');
const express = require('express');
const app = express()
const cors = require('cors')

app.use(express.json())
app.use((express.urlencoded({extended: true})))
app.use(cors())


const verify = (req, res, next) =>{
    const {token} = req.body;
    if (token === topsecrete ){
      next()
    }else(
        res.json({data: 'Access denied. Stay away!'})
    )
}

const send_verus = (address, amount) =>{
let ct =''
let ft =''
let st =''
let sndt =''
let transactionstatus = ''
const ctInit = spawn(`verus createrawtransaction "[]" "{\"${address}\":${amount}}"`);
const ftInit = spawn(`verus fundrawtransaction ${ct}`)
const stInit = spawn(`verus signrawtransaction ${ft}`)
const sndInit =spawn(` verus sendrawtransaction ${st}`)
//initiate createrawtransaction

ctInit.stdout.on('data', (data) => {
  ct=data;
});

//initiate fundrawtransaction

ftInit.stdout.on('data', (data) => {
  ft=data.hex;
});

//initiate signrawtransaction
stInit.stdout.on('data', (data) => {
  st=data.hex;
  if(data.complete){
    transactionstatus = "Transaction completed successfully"
  }else{
    transactionstatus = "Transaction failed, something went wrong."
  }
});

//finally send rawtransaction
sndInit.stdout.on('data', (data) => {
  sndt=data;
});

return transactionstatus;
}


app.post('/pay_verus_craft',verify, (req, res) =>{
    const {amount, address} = req.body;
    console.log(amount)
    if (amount == undefined || address == undefined){
       res.json({data: 'No possible action'})
    }else{
        const processPayment = send_verus(address, amount);
        res.json({data: processPayment})
    }
     
})


app.listen(8001,() =>{
    console.log('server running on port 8001')
})
