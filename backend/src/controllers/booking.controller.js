const bookingService = require('../services/booking.service');

async function getBookings(req, res, next) {
  try {
    res.json(await bookingService.getBookings(req.query));
  } catch (error) {
    next(error);
  }
}

async function getMyBookings(req, res, next) {
  try {
    res.json(await bookingService.getMyBookings(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function getBooking(req, res, next) {
  try {
    res.json(await bookingService.getBooking(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    res.status(201).json(await bookingService.createBooking(req.user.id, req.body));
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    res.json(await bookingService.updateBookingStatus(req.params.id, req.body.status));
  } catch (error) {
    next(error);
  }
}

async function cancelMyBooking(req, res, next) {
  try {
    res.json(await bookingService.cancelMyBooking(req.params.id, req.user.id));
  } catch (error) {
    next(error);
  }
}

async function deleteBooking(req, res, next) {
  try {
    res.json(await bookingService.deleteBooking(req.params.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBookings,
  getMyBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelMyBooking,
  deleteBooking,
};
