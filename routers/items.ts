import { Router } from 'express';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {imagesUpload} from "../multer";
import {ItemWithoutId} from "../types";

export const itemsRouter = Router();

itemsRouter.get('/', async (req, res, next) => {
  try {
    const [results] = await mysqlDb
      .getConnection()
      .query(
        'SELECT i.id, i.description, i.image, i.created_at, i.name, c.name category_name, d.name place_name FROM items i LEFT JOIN office.categories c on i.category_id = c.id LEFT JOIN office.places d on i.place_id = d.id',
      );
    res.send(results);
  } catch (e) {
    next(e);
  }
});

itemsRouter.get('/:id', async (req, res,next)=>{
  try {
    const [results] = await mysqlDb
        .getConnection()
        .query(
            'SELECT i.id, i.description, i.image, i.created_at, i.name, c.name category_name, d.name place_name FROM items i ' +
            'LEFT JOIN office.categories c on i.category_id = c.id ' +
            'LEFT JOIN office.places d on i.place_id = d.id ' +
            'WHERE i.id = ?',
            [req.params.id]
        ) as RowDataPacket[];
    const product = results[0];

    if(!product){
      return res.status(404).send({error: 'Not found!'});
    }
      res.send(product);
  } catch (e) {
    next(e);
  }
})

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {

  const item: ItemWithoutId = {
    id: parseFloat(req.body.id),
    categoryId: parseFloat(req.body.categoryId),
    placeId: parseFloat(req.body.placeId),
    name: req.body.name,
    description: req.body.description,
    createdAt: req.body.createdAt,
    image: req.file ? req.file.filename : null
  }

  const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO items (category_id, place_id, name, description, created_at, image)' +
      'VALUES (?,?,?,?,?,?)',
      [item.categoryId, item.placeId, item.name, item.description, item.createdAt, item.image],
  ) as ResultSetHeader[]

  console.log(result.insertId)


  res.send({
    ...item,
    id: result.insertId,
  })
})