import { Router } from 'express';
import mysqlDb from '../mysqlDb';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
  const [results] = await mysqlDb.getConnection().query('SELECT * FROM categories');
  res.send(results);
});
