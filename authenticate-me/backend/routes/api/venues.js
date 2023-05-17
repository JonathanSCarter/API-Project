const express = require('express');
const { Op } = require('sequelize')
const { Venue, Membership, Group } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.put('/:venueId', requireAuth, async (req, res) => {
  const { address, city, state, lat, lng } = req.body

  let auth = false

  const venue = await Venue.findByPk(req.params.venueId)

  if (!venue) throw new Error("Venue couldn't be found");

  const group = await Group.findByPk(venue.groupId)

  if(group.organizerId === req.user.id){
    auth = true;
  }

  const member = await Membership.findAll({
    where: {
      groupId: group.id,
      status: 'co-host',
      userId: req.user.id
    }
  })
  if(member) auth = true
  if(auth === false) throw new Error("Venue couldn't be found");

  
  if(address) venue.address = address
  if(city) venue.city = city
  if(state) venue.state = state
  if(lat) venue.lat = lat
  if(lng) venue.lng = lng

  venue.save();

  return res.json(venue)

})



module.exports = router;
