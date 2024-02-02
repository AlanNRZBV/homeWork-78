import express from 'express'
import {categoriesRouter} from "./routers/categories";
import cors from 'cors'
import mysqlDb from "./mysqlDb";
import {itemsRouter} from "./routers/items";
import {placesRouter} from "./routers/places";

const app = express();
const port = 8000;

app.use(express.static('public'))
app.use(express.json())
app.use(cors())
app.use('/categories', categoriesRouter)
app.use('/places', placesRouter)
app.use('/items', itemsRouter)



const run = async ()=>{
  await mysqlDb.init()
  app.listen(port, ()=>{
    console.log(`Server start on ${port} port`)
  })
}

void  run();