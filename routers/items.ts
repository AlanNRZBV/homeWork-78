import {Router} from "express";
import mysqlDb from "../mysqlDb";

export const itemsRouter = Router()

itemsRouter.get('/', async (req,res)=>{
  const [results]=await mysqlDb.getConnection().query(
      'select i.id, i.description, i.image, i.created_at, i.name, c.name category_name, d.name place_name FROM items i left join office.places d on i.place_id = d.id')
})