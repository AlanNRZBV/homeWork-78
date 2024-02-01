import express from 'express'
import {categoriesRouter} from "./routers/categories";
import cors from 'cors'
import mysqlDb from "./mysqlDb";

const app = express();
const port = 8000;

app.use(express.static('public'))
app.use(express.json())
app.use(cors())
app.use('/categories', categoriesRouter)



const run = async ()=>{
  await mysqlDb.init()
  app.listen(port, ()=>{
    console.log(`Server start on ${port} port`)
  })
}

void  run();