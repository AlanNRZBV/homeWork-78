import { Router } from 'express';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {imagesUpload} from "../multer";
import {ItemWithoutId, UpdateValues} from "../types";

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

  res.send({
    ...item,
    id: result.insertId,
  })
})

itemsRouter.delete('/:id', async (req,res,next)=>{
  try{

    const [checkExistResult] = await mysqlDb.getConnection().query(
        'SELECT id FROM items WHERE id = ?',
        [req.params.id]
    ) as RowDataPacket[];

    if (checkExistResult.length === 0) {
      return res.status(404).send(`There is no item with id: ${req.params.id}` );
    }

    const [checkResult]= await mysqlDb.getConnection().query(
        'SELECT COUNT(*) as count FROM categories WHERE id = ?', [req.params.id]
    ) as RowDataPacket[]

    if(checkResult[0].count > 0){
      return res.status(400).send('Operation refused');
    }
     await mysqlDb.getConnection().query(
      'DELETE FROM items WHERE id = ?', [req.params.id]
  );
  res.send(`Item with id: ${req.params.id} from table 'items' has been deleted`)
  }catch (e){
    next(e)
  }
})

itemsRouter.put('/:id', imagesUpload.single('image'), async (req,res,next)=>{
  try {
    const updateFields: string[] = [];
    const updateValues: UpdateValues[] = [];

    const [isExist] = await mysqlDb.getConnection().query(
        'SELECT id FROM items WHERE id = ?', [req.params.id]
    ) as RowDataPacket[]

    if(isExist.length === 0){
      return res.status(404).send(`There is no item with id: ${req.params.id}`)
    }

    if (req.body.categoryId !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(parseFloat(req.body.categoryId));
    }

    if (req.body.placeId !== undefined) {
      updateFields.push('place_id = ?');
      updateValues.push(parseFloat(req.body.placeId));
    }

    if (req.body.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(req.body.name);
    }

    if (req.body.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(req.body.description);
    }

    if (req.body.createdAt !== undefined) {
      updateFields.push('created_at = ?');
      updateValues.push(req.body.createdAt);
    }

    if (req.file) {
      updateFields.push('image = ?');
      updateValues.push(req.file.filename);
    }

    if (updateFields.length === 0) {
      return res.status(400).send('No valid fields provided for update');
    }

    const updateQuery = `UPDATE items SET ${updateFields.join(', ')} WHERE id = ?`;
    const updateParams = [...updateValues, req.params.id];

    await mysqlDb.getConnection().query(updateQuery, updateParams);

    const [result]=await mysqlDb.getConnection().query(
        'SELECT * FROM items WHERE id = ?', [req.params.id]
    ) as RowDataPacket[]
    
    res.send(result[0])
  } catch (e) {
    next(e);
  }

})

