const tourService = require('../services/tour.service');

async function getTours(req, res, next) {
  try {
    res.json(await tourService.getTours(req.query));
  } catch (error) {
    next(error);
  }
}

async function getFeaturedTours(req, res, next) {
  try {
    res.json(await tourService.getFeaturedTours());
  } catch (error) {
    next(error);
  }
}

async function getTourDetail(req, res, next) {
  try {
    const tour = await tourService.getTourDetail(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    next(error);
  }
}

async function createTour(req, res, next) {
  try {
    res.status(201).json(await tourService.createTour(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateTour(req, res, next) {
  try {
    res.json(await tourService.updateTour(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteTour(req, res, next) {
  try {
    res.json(await tourService.deleteTour(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTours,
  getFeaturedTours,
  getTourDetail,
  createTour,
  updateTour,
  deleteTour,
};
