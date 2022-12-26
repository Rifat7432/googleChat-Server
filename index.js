const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5555
const app = express()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
  res.send("GoogleChat real time server is working");
});


const uri = "mongodb+srv://md:<password>@cluster0.bwyqvv1.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = ()=>{
  try{

  }
  finally{
  }
}
run().catch(console.dir);

app.listen(port,()=>{
console.log(`server is running on ${port}`)
})