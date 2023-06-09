const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')
const venuesRouter = require('./venues.js')
const eventsRouter = require('./events.js')
const groupImagesRouter = require('./group-images.js')
const eventImagesRouter = require('./event-images.js')

const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.use('/group-images', groupImagesRouter);

router.use('/event-images', eventImagesRouter);

router.use('/events', eventsRouter);

router.use('/venues', venuesRouter);

router.use('/users', usersRouter);

router.use('/session', sessionRouter);

router.use('/groups', groupsRouter);


module.exports = router;
