const express = require('express');
const { Op } = require('sequelize')
const { Event, Venue, Group, Membership, GroupImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


router.get('/:eventId', async (req, res) => {
  let event = await Event.findOne({
    where: {
      id: req.params.eventId
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })

  if(!event) throw new Error("Event couldn't be found")


  const place = await Venue.findOne({
    where: {
      id: event.venueId,
    },
    attributes: ['id', 'city', 'state', 'lat', 'lng']
  })
  const group = await Group.findOne({
    where: {
      id: event.groupId,
    },
    attributes: ['id', 'name', 'city', 'state', 'private']
  })
  if (!group) throw new Error("Group couldn't be found")
  const members = await Membership.findAll({
    where: {
      groupId: group.id
    }
  })
  const image = await GroupImage.findAll({
    where: {
      groupId: group.id,
    }
  })
  event = event.toJSON(),
    event.Venue = place
  event.Group = group
  event.numAttending = members.length
  if (image) event.EventImages = image




  res.json(event)
})

router.get('/', async (req, res) => {
  const events = await Event.findAll({
    attributes: {
      exclude: ['description', 'price', 'capacity', 'createdAt', 'updatedAt']
    }
  })



  let eventArray = await Promise.all(events.map(async event => {
    const place = await Venue.findOne({
      where: {
        id: event.venueId,
      },
      attributes: ['id', 'city', 'state']
    })
    const group = await Group.findOne({
      where: {
        id: event.groupId,
      },
      attributes: ['id', 'name', 'city', 'state']
    })
    if (!group) throw new Error("Group couldn't be found")
    const members = await Membership.findAll({
      where: {
        groupId: group.id
      }
    })
    const image = await GroupImage.findOne({
      where: {
        groupId: group.id,
        preview: true
      }
    })
    event = event.toJSON(),
      event.Venue = place
    event.Group = group
    event.numAttending = members.length
    if (image) event.previewImage = image.url
    return event
  }))

  const Events = eventArray

  res.json({ Events })
})





module.exports = router;
