const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')
const { restoreUser } = require("../../utils/auth.js");

console.log('test');
router.use(restoreUser);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

router.use('/users', usersRouter);

router.use('/session', sessionRouter);

router.use('/groups', groupsRouter);


module.exports = router;
