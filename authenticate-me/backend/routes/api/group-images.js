const express = require('express');
const { Op } = require('sequelize')
const { Event, Venue, Group, Membership, GroupImage, EventImage, Attendance, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
  const image = await GroupImage.findByPk(req.params.imageId)
  if(!image) throw new Error("Group Image couldn't be found")

  const membership = await Membership.findOne({
    where:{
      userId: req.user.id,
      groupId: image.groupId,
      status: { [Op.in]: ['co-host', 'host'] }
    }
  })

  if(!membership) throw new Error("You lack authorization to delete this image")

  image.destroy();

  return res.json({message: "Successfully deleted"})

})


module.exports = router;
