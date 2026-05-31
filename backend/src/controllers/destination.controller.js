const destinationService = require('../services/destination.service');

async function getDestinations(req, res, next) {
  try {
    res.json(await destinationService.getDestinations(req.query));
  } catch (error) {
    next(error);
  }
}

async function getFeaturedDestinations(req, res, next) {
  try {
    res.json(await destinationService.getFeaturedDestinations());
  } catch (error) {
    next(error);
  }
}

async function getDestinationDetail(req, res, next) {
  try {
    const destination = await destinationService.getDestinationDetail(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    next(error);
  }
}

async function createDestination(req, res, next) {
  try {
    res.status(201).json(await destinationService.createDestination(req.body));
  } catch (error) {
    next(error);
  }
}

async function updateDestination(req, res, next) {
  try {
    res.json(await destinationService.updateDestination(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function deleteDestination(req, res, next) {
  try {
    res.json(await destinationService.deleteDestination(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDestinations,
  getFeaturedDestinations,
  getDestinationDetail,
  createDestination,
  updateDestination,
  deleteDestination,
};
