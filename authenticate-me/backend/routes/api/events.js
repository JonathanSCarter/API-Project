const express = require('express');
const { Op } = require('sequelize')
const { Event, Venue, Group, Membership, GroupImage, EventImage } = require('../../db/models');
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

  if (!event) throw new Error("Event couldn't be found")


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

router.post('/:eventId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;

  const test = await Event.findByPk(req.params.eventId)
  if (!test) throw new Error("Event couldn't be found")

  const member = await Membership.findAll({
    where: {
      userId: req.user.id,
      status: 'co-host'
    },
    attributes: ['groupId']
  })
  const groupIds = member.map(member => member.get('groupId'))

  const groups = await Group.findAll({
    where: {
      [Op.or]: [
        { organizerId: req.user.id },
        { id: { [Op.in]: groupIds } }
      ],
      id: req.params.eventId
    },
    attributes: ['id']
  });

  const id = groups.map(id => id.get('id'));
  if (!id.length) throw new Error("Bad request")

  const event = await Event.findOne({
    where: {
      id: req.params.eventId,
      id: { [Op.in]: id }
    }
  })

  const image = await EventImage.create({
    eventId: event.id,
    url,
    preview

  })
  return res.json(image)
})

router.put('/:eventId', requireAuth, async (req, res) => {
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

  if (venueId) {
    const testTwo = await Venue.findByPk(venueId)
    if (!testTwo) throw new Error("Venue couldn't be found")
  }

  const member = await Membership.findAll({
    where: {
      userId: req.user.id,
      status: 'co-host'
    },
    attributes: ['groupId']
  })
  const groupIds = member.map(member => member.get('groupId'))

  const groups = await Group.findAll({
    where: {
      [Op.or]: [
        { organizerId: req.user.id },
        { id: { [Op.in]: groupIds } }
      ],
      id: req.params.eventId
    },
    attributes: ['id']
  });

  const id = groups.map(id => id.get('id'));
  if (!id.length) throw new Error("Bad request")


  const event = await Event.findOne({
    where: {
      [Op.and]: [
        { id: req.params.eventId},
        { id: { [Op.in]: id } }
      ]
    },
    attributes: {
    exclude: ['createdAt', 'UpdatedAt']
  }
  })
if (!event) throw new Error("Event couldn't be found")

if (venueId) event.venueId = venueId
if (name) event.name = name
if (type) event.type = type
if (capacity) event.capacity = capacity
if (price) event.price = price
if (description) event.description = description
if (startDate) event.startDate = startDate
if (endDate) event.endDate = endDate

event.save();

return res.json(event)
})


router.delete('/:eventId', requireAuth, async (req, res) => {

  const member = await Membership.findAll({
    where: {
      userId: req.user.id,
      status: 'co-host'
    },
    attributes: ['groupId']
  })
  const groupIds = member.map(member => member.get('groupId'))

  const groups = await Group.findAll({
    where: {
      [Op.or]: [
        { organizerId: req.user.id },
        { id: { [Op.in]: groupIds } }
      ],
      id: req.params.eventId
    },
    attributes: ['id']
  });

  const id = groups.map(id => id.get('id'));
  if (!id.length) throw new Error("Bad request")


  const event = await Event.findOne({
    where: {
      [Op.and]: [
        { id: req.params.eventId},
        { id: { [Op.in]: id } }
      ]
    },
    attributes: {
    exclude: ['createdAt', 'UpdatedAt']
  }
  })
  event.destroy();

  return res.json({message: "Successfully deleted"})
})
module.exports = router;
