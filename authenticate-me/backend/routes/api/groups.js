const express = require('express');
const { Op } = require('sequelize')
const { Group, Membership, GroupImage, Venue, Event, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
  let member = await Membership.findAll({
    where: {
      userId: req.user.id
    },
    attributes: ['groupId']
  })
  let groupIds = member.map(member => member.get('groupId'))
  let groups = await Group.findAll({
    where: {
      [Op.or]: [
        { organizerId: req.user.id },
        { id: { [Op.in]: groupIds } }
      ]
    }
  });
  let groupArray = await Promise.all(groups.map(async group => {
    const numMembers = await group.getMemberships();
    const imageArray = await group.getGroupImages({
      where: {
        preview: true
      },
      limit: 1,
      attributes: ['url']
    });
    let image = imageArray[0]
    group = group.toJSON(),
      group.numMembers = numMembers.length
    if (image) group.previewImage = image.url
    return group
  }))

  let Groups = groupArray

  return res.json({ Groups })
})

router.get('/:groupId/events', requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    },
    attributes: ['id', 'name', 'city', 'state']
  })
  if (!group) throw new Error("Group couldn't be found")

  let Events = await Event.findAll({
    where: {
      groupId: group.id
    }
  })
  Events = await Promise.all(Events.map(async event => {
    event = event.toJSON();
    const venue = await Venue.findOne({
      where: {
        id: event.venueId
      },
      attributes: ['id', 'city', 'state']
    })
    event.Group = group
    event.Venue = venue

    return event
  }))

  res.json({ Events })
})

router.get('/:groupId/venues', requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId)
  if (!group) throw new Error("Group couldn't be found")
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
    },
    attributes: ['id']
  });
  const ids = groups.map(id => id.get('id'));

  const Venues = await Venue.findAll({
    where: {
      [Op.and]: [
        { groupId: { [Op.in]: ids } },
        { groupId: req.params.groupId }
      ]
    }
  })

  res.json({ Venues })
})

router.get('/:groupId/members', async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) throw new Error("Group couldn't be found");
  console.log(req.user.id);
  console.log(req.params.groupId);
  const member = await Membership.findAll({
    where: {
      status: { [Op.in]: ['co-host', 'host'] },
      groupId: req.params.groupId
    },
    attributes: ['userId']
  });

  const members = await Membership.findAll({
    where: {
      groupId: req.params.groupId
    },
    attributes: ['userId']
  });

  let Members = [];
  const ownerIds = member.map(member => member.userId);
  console.log(members.map(e => e.userId));

  if (ownerIds.includes(req.user.id)) {
    console.log('Entering if statement');
    Members = await Promise.all(members.map(async member => {
      let userInfo = await User.findOne({
        where: {
          id: member.userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });
      const memberstatus = await Membership.findOne({
        where: {
          userId: member.userId,
          groupId: req.params.groupId
        },
        attributes: ['status']
      });
      userInfo = userInfo.toJSON();
      userInfo.Membership = memberstatus;
      return userInfo;
    }));

    return res.json(Members);
  } else {
    console.log('Entering else statement');
    Members = await Promise.all(members.map(async member => {
      let userInfo = await User.findOne({
        where: {
          id: member.userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });
      const memberstatus = await Membership.findOne({
        where: {
          userId: member.userId,
          status: { [Op.notIn]: ['pending'] },
          groupId: req.params.groupId
        },
        attributes: ['status']
      });
      if (memberstatus) {
        userInfo = userInfo.toJSON();
        userInfo.Membership = memberstatus;
        return userInfo;
      }
    }));
    Members = Members.filter(Boolean)
    return res.json({ Members });
  }
});

router.get('/:groupId', async (req, res) => {
  let group = await Group.findByPk(req.params.groupId)
  const numMembers = await group.getMemberships();
  const imageArray = await group.getGroupImages({
    attributes: ['id', 'url', 'preview']
  });
  const organizer = await group.getUser({
    attributes: ['id', 'firstName', 'lastName']
  })
  const venues = await group.getVenues({
    attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
  });
  group = group.toJSON(),
    group.numMembers = numMembers.length
  if (imageArray) group.GroupImages = imageArray
  group.Organizer = organizer
  if (venues) group.Venues = venues;
  return res.json(group)
})


router.get('/', async (req, res) => {
  let groups = await Group.findAll();

  let groupArray = await Promise.all(groups.map(async group => {
    const numMembers = await group.getMemberships();
    const imageArray = await group.getGroupImages({
      where: {
        preview: true
      },
      limit: 1,
      attributes: ['url']
    });
    let image = imageArray[0]
    group = group.toJSON(),
      group.numMembers = numMembers.length
    if (image) group.previewImage = image.url
    else group.previewImage = null
    return group
  }))

  let Groups = groupArray

  return res.json({ Groups })
});

router.post('/:groupId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const group = await Group.findByPk(req.params.groupId)
  if (!group) throw new Error("Group couldn't be found")
  if (req.user.id !== group.organizerId) throw new Error('Current User must be the organizer for the group')



  const image = await GroupImage.create({
    groupId: req.params.groupId,
    url,
    preview
  })

  const imageJson = {}
  imageJson.id = image.id
  imageJson.url = image.url
  imageJson.preview = image.preview

  return res.json( imageJson )

})

router.post('/:groupId/venues', requireAuth, async (req, res) => {

  const { address, city, state, lat, lng } = req.body;

  const group = await Group.findByPk(req.params.groupId)
  if(!group) throw new Error("Group couldn't be found")


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
      id: req.params.groupId
    },
    attributes: ['id']
  });


  const id = groups.map(id => id.get('id'));
  if (!id) throw new Error("Group couldn't be found")

  const venue = await Venue.create({
    groupId: req.params.groupId,
    address,
    city,
    state,
    lat,
    lng
  })

  res.json(venue)
})


router.post('/:groupId/events', requireAuth, async (req, res) => {
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
  const venue = await Venue.findByPk(venueId)
  const group = await Group.findByPk(req.params.groupId)
  if(!group) throw new Error("Group couldn't be found")

  if (!venue) throw new Error("Venue does not exist")
  if (name.length < 5) throw new Error("Name must be at least 5 characters")
  if (type !== 'Online' && type !== 'In person') throw new Error("Type must be Online or In person")
  if (typeof capacity !== 'number') throw new Error('Capacity must be an integer')
  if (typeof price !== 'number') throw new Error('Price is invalid')
  if (!description) throw new Error("Description is required")
  let date = new Date()
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  console.log(parsedStartDate.getTime());
  console.log(parsedEndDate.getTime());
  if (parsedStartDate.getTime() <= date.getTime()) throw new Error("Start date must be in the future");
  if (parsedStartDate.getTime() >= parsedEndDate.getTime()) throw new Error("End date is less than start date");


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
      id: req.params.groupId
    },
    attributes: ['id']
  });

  const id = groups.map(id => id.get('id'));
  if (!id) throw new Error("Bad request")

  const event = await Event.create({
    groupId: Number(req.params.groupId),
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
  })
  console.log(event);
  const response = {
    id: event.id,
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
  }

  res.json(response)
})

router.post('/:groupId/membership', requireAuth, async (req, res) => {

  const members = await Membership.findAll({
    where: {
      groupId: req.params.groupId
    }
  })
  if (!members.length) throw new Error("Group couldn't be found")
  const isMember = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id
    }
  })
  if(isMember){
    if (isMember.status === 'pending') throw new Error("Membership has already been requested")
    else throw new Error("User is already a member of the group")
  }

  const member = await Membership.create({
    userId: req.user.id,
    groupId: req.params.groupId,
    status: 'pending'
  })


  const application = {}
  application.memberId = req.user.id;
  application.status = member.status;

  return res.json({ application })
})

router.post('/', requireAuth, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const Groups = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state
  })
  return res.json(Groups)
})

router.put('/:groupId/membership', requireAuth, async (req, res) => {
  const { memberId, status } = req.body;

  const member = await Membership.findOne({
    where: {
      id: memberId,
      groupId: req.params.groupId
    }
  })
  const user = await User.findByPk(memberId)
  const group = await Group.findByPk(req.params.groupId)
  const ownerCheck = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      status: { [Op.in]: ['host', 'co-host'] }
    }
  })
  if (!group || !ownerCheck) throw new Error("Group couldn't be found")
  if (status === 'pending') throw new Error("Cannot change a membership status to pending")
  if (!member) throw new Error("Membership between the user and the group does not exist")
  if (!user) throw new Error("User couldn't be found")



  member.status = status;

  const response = {}
  response.id = member.id;
  response.groupId = req.params.groupId;
  response.memberId = memberId;
  response.status = status;

  member.save();

  return res.json({ response })
})

router.put('/:groupId', requireAuth, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const group = await Group.findByPk(req.params.groupId);
  if (!group) throw new Error("Group couldn't be found")
  if (name.length > 60) throw new Error("Name must be 60 characters or less")
  if (about.length < 50) throw new Error("About must be 50 characters or more")
  if (type !== 'Online' && type !== 'In person') throw new Error("Type must be 'Online' or 'In person")
  if (typeof private !== 'boolean') throw new Error('Private must be a boolean')

  if (req.user.id !== group.organizerId) throw new Error('Current User must be the organizer for the group')


  if (name) group.name = name;
  if (about) group.about = about;
  if (type) group.type = type;
  if (private) group.private = private;
  if (city) group.city = city;
  if (state) group.state = state;

  group.save();

  return res.json(group)

})

router.delete('/:groupId/membership', requireAuth, async (req, res) => {
  const { memberId } = req.body;

  const group = await Group.findByPk(req.params.groupId)
  if(!group) throw new Error("Group couldn't be found")

  const cohostCheck = await Membership.findAll({
    where: {
      userId: req.user.id,
      groupId: req.params.groupId,
      status: {[Op.in]: ['host', 'co-host']}
    }
  })

  if (req.user.id !== group.organizerId && !cohostCheck) throw new Error('Current User must be the organizer or co-host of the group')



  const member = await Membership.findByPk(memberId)
  if(!member) throw new Error("Membership couldn't be found")

  const ownerCheck = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      status: { [Op.in]: ['host', 'co-host'] }
    }
  })
  if(!ownerCheck)throw new Error("'Current User must be the organizer or co-host of the group'")

  member.destroy();

  return res.json({ message: "Successfully deleted" })

})

router.delete('/:groupId', requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) throw new Error("Group couldn't be found")
  if (req.user.id !== group.organizerId) throw new Error('Current User must be the organizer for the group')

  group.destroy();

  return res.json({ message: "Successfully deleted" })
})



module.exports = router;
