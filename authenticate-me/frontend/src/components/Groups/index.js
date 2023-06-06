import { NavLink, useHistory } from "react-router-dom"
import './Groups.css'
import { useDispatch, useSelector } from "react-redux"
import { getAllGroups, fetchGroups } from "../../store/group"
import { useEffect } from "react"
import defaultImg from './default.jpg'
import { fetchEvents, getAllEvents } from "../../store/events"
function Groups() {
  const dispatch = useDispatch()
  const history = useHistory();
  useEffect(() => {
    dispatch(fetchGroups());
  }, []);
  useEffect(() => {
    dispatch(fetchEvents())
  }, []);

  const groups = useSelector(getAllGroups)[0].Groups
  const events = useSelector(getAllEvents)[0].Events

  useEffect(() => {
    console.log(groups);
    if (events) {
      events.forEach(event => {
        const groupId = event.groupId;
        groups[groupId].eventCount ? groups[groupId].eventCount = groups[groupId].eventCount + 1 : groups[groupId].eventCount = 1;
      });
    }
  }, [events, groups]);


  const handleClick = (group) => {
    console.log(group);
    history.push(`/groups/${group.id}`)
  }

  return (
    <div className="mainColumn">
      <div className="headers">
        <h2>
          <NavLink className='notdisabled' to='/events'>Events</NavLink>
        </h2>
        <h2>
          <NavLink className="disabled" disabled={true} to='/groups'>Groups</NavLink>
        </h2>
      </div>
      <div className="label">Groups in MeatUp</div>
      {groups && groups.map((group) => {
        return (

          <div className="group" onClick={() => handleClick(group)}>
            <div className="preview">
            <img src={group.previewImage ? group.previewImage : defaultImg} alt="Group Preview"></img>
            </div>
            <div className="notPreview">
            <h2>{group.name}</h2>
            <div>{group.city}, {group.state}</div>
            <div>{group.about}</div>
            <div className="bottom">
            <div> {(() => {
              if (group.eventCount !== undefined) {
                if (group.eventCount === 1) {
                  return '1 Event';
                } else {
                  return `${group.eventCount} Events`;
                }
              } else {
                return '0 Events';
              }
            })()}</div>
            <div>·</div>
            <div>{(() => group.private ? "private" : "public")()}</div>
            </div>
            </div>
          </div>

        )
      })}
    </div>
  )
}

export default Groups
