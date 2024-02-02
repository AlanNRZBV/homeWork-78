import { Router } from 'express';
import mysqlDb from '../mysqlDb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Category, Item, Place, UpdateValues } from '../types';

export const placesRouter = Router();

placesRouter.get('/', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query('SELECT id, name FROM places');
    res.send(results);
  } catch (e) {
    next(e);
  }
});

placesRouter.get('/:id', async (req, res, next) => {
  try {
    const [results] = (await mysqlDb
      .getConnection()
      .query('SELECT * FROM places WHERE id = ?', [req.params.id])) as RowDataPacket[];
    const product = results[0];

    if (!product) {
      return res.status(404).send({ error: 'Not found!' });
    }
    res.send(product);
  } catch (e) {
    next(e);
  }
});

placesRouter.post('/', async (req, res, next) => {
  try {
    const place: Place = {
      name: req.body.name,
      description: req.body.description,
    };

    const [result] = (await mysqlDb
      .getConnection()
      .query('INSERT INTO places (name, description)' + 'VALUES (?,?)', [
        place.name,
        place.description,
      ])) as ResultSetHeader[];

    res.send({
      ...place,
      id: result.insertId,
    });
  } catch (e) {
    next(e);
  }
});

placesRouter.delete('/:id', async (req, res, next) => {
  try {
    const [isExist] = (await mysqlDb
      .getConnection()
      .query('SELECT id FROM places WHERE id = ?', [req.params.id])) as RowDataPacket[];

    if (isExist.length === 0) {
      return res.status(404).send(`There is no place with id: ${req.params.id}`);
    }

    await mysqlDb.getConnection().query('DELETE FROM places WHERE id = ?', [req.params.id]);
    res.send(`Place with id: ${req.params.id} from table 'places' has been deleted`);
  } catch (e) {
    next(e);
  }
});

placesRouter.put('/:id', async (req, res, next) => {
  try {
    const updateFields: string[] = [];
    const updateValues: UpdateValues[] = [];

    const [isExist] = (await mysqlDb
      .getConnection()
      .query('SELECT id FROM places WHERE id = ?', [req.params.id])) as RowDataPacket[];

    if (isExist.length === 0) {
      return res.status(404).send(`There is no place with id: ${req.params.id}`);
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

    const updateQuery = `UPDATE places SET ${updateFields.join(', ')} WHERE id = ?`;
    const updateParams = [...updateValues, req.params.id];

    await mysqlDb.getConnection().query(updateQuery, updateParams);

    const [result] = (await mysqlDb
      .getConnection()
      .query('SELECT * FROM places WHERE id = ?', [req.params.id])) as RowDataPacket[];

    res.send(result[0]);
  } catch (e) {
    next(e);
  }
});
