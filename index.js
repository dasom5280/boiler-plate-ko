const express = require('express')
const app = express()
const port = 5000


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dasom:12345@boilerplate.kxodt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => console.log('MongoDB Conneted...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('hell world')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})