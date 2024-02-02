import { Router } from 'express';
import mysqlDb from '../mysqlDb';
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {imagesUpload} from "../multer";
import {Category, Item, UpdateValues} from "../types";

export const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const [results] = await mysqlDb
        .getConnection()
        .query(
            'SELECT id, name FROM categories',
        );
    res.send(results);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.get('/:id', async (req, res,next)=>{
  try {
    const [results] = await mysqlDb
        .getConnection()
        .query(
            'SELECT * FROM categories WHERE i.id = ?',
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

categoriesRouter.post('/',  async (req, res, next) => {

  try{

  const category: Category = {
    name: req.body.name,
    description: req.body.description
  }

  const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO categories (name, description)' +
      'VALUES (?,?)',
      [category.name, category.description],
  ) as ResultSetHeader[]

  res.send({
    ...category,
    id: result.insertId,
  })
  }catch (e){
    next(e)
  }

})

categoriesRouter.delete('/:id', async (req,res,next)=>{
  try{

    const [isExist] = await mysqlDb.getConnection().query(
        'SELECT id FROM categories WHERE id = ?',
        [req.params.id]
    ) as RowDataPacket[];

    if (isExist.length === 0) {
      return res.status(404).send(`There is no category with id: ${req.params.id}` );
    }

    const checkResult= await mysqlDb.getConnection().query(
        'SELECT COUNT(*) as count FROM categories WHERE id = ?', [req.params.id]
    ) as RowDataPacket


    if(checkResult[0].count !== 0){
      return res.status(400).send('Operation refused');
    }
    await mysqlDb.getConnection().query(
        'DELETE FROM categories WHERE id = ?', [req.params.id]
    );
    res.send(`Category with id: ${req.params.id} from table 'categories' has been deleted`)
  }catch (e){
    next(e)
  }
})

categoriesRouter.put('/:id', async (req,res,next)=>{
  try {
    const updateFields: string[] = [];
    const updateValues: UpdateValues[] = [];

    console.log(req.body)

    const [isExist] = await mysqlDb.getConnection().query(
        'SELECT id FROM categories WHERE id = ?', [req.params.id]
    ) as RowDataPacket[]

    if(isExist.length === 0){
      return res.status(404).send(`There is no category with id: ${req.params.id}`)
    }

    if (req.body.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(req.body.name);
    }

    if (req.body.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(req.body.description);
    }

    if (updateFields.length === 0) {
      return res.status(400).send('No values for update');
    }

    const updateQuery = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`;

    console.log('updateQuery ', updateQuery)
    const updateParams = [...updateValues, req.params.id];
    console.log('updateParams ', updateParams)

    await mysqlDb.getConnection().query(updateQuery, updateParams);

    const [result]=await mysqlDb.getConnection().query(
        'SELECT * FROM categories WHERE id = ?', [req.params.id]
    ) as RowDataPacket[]

    res.send(result[0])
  } catch (e) {
    next(e);
  }

})

