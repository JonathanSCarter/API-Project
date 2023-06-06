import { NavLink, useHistory, useParams } from "react-router-dom"
import './SingleGroup.css'
import { useDispatch, useSelector } from "react-redux"
import { getAllGroups, fetchGroups, fetchEventsByGroup, fetchGroup, getGroupThunk, getAllEventsByGroup } from "../../store/group"
import { useEffect } from "react"
import defaultImg from '../Groups/default.jpg'
import { fetchEvents, getAllEvents } from "../../store/events"


function SingleGroups() {
  const { groupId } = useParams();
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchEventsByGroup(groupId))
  }, [dispatch]);
  const group = useSelector(getGroupThunk)[0]
  useEffect(() => {
  }, [])
  const events = useSelector(getAllEventsByGroup)[1]

  // let group
  // if(groups) {group = groups.find((group) => group.groupId === groupId)}
  // useEffect(() => {
  //   dispatch(fetchEventsByGroup(groupId))
  // }, [dispatch])

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
          <h2>{group.name}</h2>
          <div>{group.state}, {group.city}</div>
          <div>{group.about}</div>
          <div className="bottom">
            <div> {(() => {
              if(events){

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
        </div></div>
    </div>
  )
}

export default SingleGroups
