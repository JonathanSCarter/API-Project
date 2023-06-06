import { NavLink, useHistory, useParams } from "react-router-dom"
import './SingleGroup.css'
import { useDispatch, useSelector } from "react-redux"
import { getAllGroups, fetchGroups, fetchEventsByGroup, fetchGroup, getGroupThunk, getAllEventsByGroup, fetchMembersByGroup, getMembersThunk } from "../../store/group"
import { useEffect, useState } from "react"
import defaultImg from '../Groups/default.jpg'
import { fetchEvents, getAllEvents } from "../../store/events"


function SingleGroups() {
  const [owner, setOwner] = useState({})

  const { groupId } = useParams();
  const dispatch = useDispatch()

  const group = useSelector(getGroupThunk)[0]
  const events = useSelector(getAllEventsByGroup)[1]
  const members = useSelector(getMembersThunk)[2]

  useEffect(() => {
    if (members) {
      const host = members.Members.find(member => member.Membership.status === 'host')
      setOwner(host)
    }
  }, [members])

  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchEventsByGroup(groupId))
    dispatch(fetchMembersByGroup(groupId))
  }, [dispatch]);



  console.log(owner);
  return (
    <div className="mainColumn">
      <div className="headers">
        <h4>
          <NavLink to='/groups'>Groups</NavLink>
        </h4>
      </div>
      <div className="groupDetail">
        <div className="preview">
          <img src={group.previewImage ? group.previewImage : defaultImg} alt="Group Preview"></img>
        </div>
        <div className="notPreview">
          <h1>{group.name}</h1>
          <div>{group.city}, {group.state}</div>
          {/* <div>{group.about}</div> */}
          <div className="bottom">
            <div> {(() => {
              if (events) {

                if (events.Events.length !== undefined) {
                  if (events.Events.length === 1) {
                    return '1 Event';
                  } else {
                    return `${events.Events.length} Events`;
                  }
                } else {
                  return '0 Events';
                }
              }
            })()}</div>
            <div>·</div>
            <div>{(() => group.private ? "private" : "public")()}</div>
          </div>
          <div>Organized by {owner.firstName} {owner.lastName}</div>
          <button>Join Group</button>
        </div>
      </div>
    </div>
  )
}

export default SingleGroups
