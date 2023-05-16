const express = require('express');
const { Op } = require('sequelize')
const { Group, Membership, GroupImage } = require('../../db/models');
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
        {organizerId: req.user.id},
        {id: {[Op.in]: groupIds}}
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

router.get('/:groupId', async (req, res) => {
  let group = await Group.findByPk(req.params.groupId)
  const numMembers = await group.getMemberships();
  const imageArray = await group.getGroupImages({
    attributes: ['id','url', 'preview']
  });
  const organizer = await group.getUser({
    attributes: ['id','firstName','lastName']
  })
  const venues = await group.getVenues({
    attributes: ['id','groupId','address', 'city','state','lat','lng']
  });
  group = group.toJSON(),
  group.numMembers = numMembers.length
  if (imageArray) group.GroupImages = imageArray
  group.Organizer = organizer
  if(venues) group.Venues = venues;
  return res.json( group )
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
    return group
  }))

  let Groups = groupArray

  return res.json({ Groups })
});

router.post('/:groupId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const group = await Group.findByPk(req.params.groupId)
  if(!group) throw new Error("Group couldn't be found")
  if(req.user.id !== group.organizerId) throw new Error('Current User must be the organizer for the group')

  const image = await GroupImage.create({
    groupId: req.params.groupId,
    url,
    preview
  })

  const imageJson = {}
  imageJson.id = image.id
  imageJson.url = image.url
  imageJson.preview = image.preview

  return res.json({ imageJson })

})

router.post('/', requireAuth, async (req, res) => {
  const { name, about, type, private, city, state} = req.body;
  const Groups = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state
  })
  res.json(Groups)
})

module.exports = router;
