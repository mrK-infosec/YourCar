const express = require('express');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(createCar);

router.route('/:id')
  .get(getCarById)
  .put(updateCar)
  .delete(deleteCar);

module.exports = router;
