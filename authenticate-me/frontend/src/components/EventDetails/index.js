import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams, NavLink, useHistory } from "react-router-dom"
import { fetchEventSingle, fetchEventDelete } from "../../store/events";
import defaultImg from "../Groups/default.jpg"
import { fetchGroup, fetchMembersByGroup } from "../../store/group";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal"
import "./EventDetails.css"
function EventDetails() {
  const dispatch = useDispatch();
  const { eventId } = useParams()
  const history = useHistory();
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [value, setValue] = useState("")
  const [date2, setDate2] = useState("")
  const [time2, setTime2] = useState("")
  const [value2, setValue2] = useState("")
  const [isOwner, setIsOwner] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [owner, setOwner] = useState({});
  const [disabled, setDisabled] = useState(false);


  const user = useSelector(state => state.session.user);
  const members = useSelector(state => state.groups.singleGroup.members);
  const event = useSelector(state => state.events.singleEvent)
  const group = useSelector(state => state.groups.singleGroup)
  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      setValue(startDate);
      setDate(startDate.toLocaleDateString());
      setTime(startDate.toLocaleTimeString());

      const endDate = new Date(event.endDate);
      setValue2(endDate);
      setDate2(endDate.toLocaleDateString());
      setTime2(endDate.toLocaleTimeString());
    }
  }, [event]);

  useEffect(() => {
    if(!user) setIsOwner(false)
    if (members) {
      const host = members.Members.find(member => member.Membership.status === 'host');
      setOwner(host);
      if (user) {
        setLoggedIn(true);
        if (host.id === user.id) {
          setIsOwner(true);
        }
      } else {
        setLoggedIn(false);
        setIsOwner(false)
      }
    }
  }, [members, user]);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventSingle(eventId))
    }
  }, [])

  useEffect(() => {
    if (group.id && !disabled) {
      setDisabled(true)
      dispatch(fetchMembersByGroup(group.id));
    }
  }, [group])

  useEffect(() => {
    if (event.groupId) dispatch(fetchGroup(event.groupId))
  }, [event])

  const goGroup = () => {
    history.push(`/groups/${event.groupId}`)
  }

  const goEdit = () => {
    history.push(`/events/${event.id}/edit`)
  }

  if (event) {
    return (
      <div className="mainColumn">
        <div className="headers">
          <h4>
            <NavLink to='/events'>Events</NavLink>
          </h4>
          <h1>{event.name}</h1>
          <div>Hosted by {owner.firstName} {owner.lastName}</div>
        </div>
        <div className="eventDetail">
          <div className="preview">
            <img src={event && event.previewImage ? event.previewImage : defaultImg} alt="Event Preview" />
          </div>
          <div className="notPreview">
            <div onClick={goGroup}>
            <img src={group.previewImage ? group.previewImage : defaultImg}></img>
            <h1>{group.name}</h1>
            <div>{group.type}</div>
            </div>
          </div>
          <div>
            <div>Clock icon</div>
            <div>Start</div>
            <div>{`${date} · ${time}`}</div>
            <div>End</div>
            <div>{`${date2} · ${time2}`}</div>
            <div>MoneySign</div>
            <div>{event.price === 0 ? "FREE" : `$${event.price}`}</div>
            <div>pinIcon</div>
            <div>{event.type}</div>
          </div>
          <div>
            <h2>Details</h2>
            <div>{event.description}</div>
          </div>
          {isOwner && (
            <>
            <button onClick={goEdit}>Update Event</button>
            <OpenModalButton
                  buttonText="Delete Event"
                  modalComponent={<DeleteEventModal eventId={eventId}/>}
                />
            </>
          )}
        </div>
      </div>
    )
  }
}

export default EventDetails
