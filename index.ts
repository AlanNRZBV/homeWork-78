import express from 'express'
import {productsRouter} from "./routers/products";
import cors from 'cors'

const app = express();
const port = 8000;

app.use(express.static('public'))
app.use(express.json())
app.use(cors())
app.use('/products', productsRouter)


app.listen(port, ()=>{
  console.log(`Server start on ${port} port`)
})
