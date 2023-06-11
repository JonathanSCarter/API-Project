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
    if (!user) setIsOwner(false)
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

  // const goEdit = () => {
  //   history.push(`/events/${event.id}/edit`)
  // }

  const handleClick = () => {
    window.alert('Feature coming soon');
  };

  if (event) {
    return (
      <>
        <div className="mainColumn">
          <div className="headers eventHeaders">
            <h4>
              <NavLink to='/events'>Events</NavLink>
            </h4>
            <h1>{event.name}</h1>
            <div>Hosted by {owner.firstName} {owner.lastName}</div>
          </div>
        </div>
        <div className="eventDetailColumn">

          <div className="eventDetail">
            <div className="preview">
              <img src={event && event.previewImage ? event.previewImage : defaultImg} alt="Event Preview" />
            </div>
            <div className="notPreview">
              <div onClick={goGroup} className="groupForEvent">
                <div className="groupImageContainer">
                  <img src={group.previewImage ? group.previewImage : defaultImg}></img>
                </div>
                <div className="groupNotImage">
                  <h3>{group.name}</h3>
                  <div>{group.type}</div>
                </div>
              </div>
              <div className="eventStuff">
                <i class="fa-regular fa-clock" style={{ color: "#000000" }}></i>
                <div className="secondHalf">
                  <div>Start {`${date} · ${time}`}</div>
                  <div>End {`${date2} · ${time2}`}</div>
                </div>
                <i class="fa-solid fa-dollar-sign" style={{ color: "#000000" }}></i>
                <div className="secondHalf">
                  {event.price === 0 ? "FREE" : `$${event.price}`}</div>
                <i class="fa-solid fa-map-pin" style={{ color: "#000000" }}></i>
                <div className="secondHalfRow">
                  <div>
                    <div>
                    {event.type}
                    </div>
                  </div>
                  {isOwner && (
                    <>
                    <div className="buttonBucket">

                      <button >Update Event</button>
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId} />}
                        />
                        </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="eventDescription">
              <h1>Details</h1>
              <div>{event.description}</div>
              {isOwner && (
                <>
                  {/* <button onClick={handleClick}>Update Event</button> */}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default EventDetails
