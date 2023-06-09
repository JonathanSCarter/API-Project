import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import defaultImg from '../Groups/default.jpg'
import { useEffect, useState, useMemo } from "react";
import { fetchEvents, fetchEvent } from "../../store/events";

function BigEvents() {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const [eventIds, setEventIds] = useState([]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const events = useSelector((state) => state.events.allEvents);
  const history = useHistory();
  const handleClick = (event) => {
    history.push(`/events/${event.id}`);
  };

  useEffect(() => {
    if (events.length && !disabled) {
      setDisabled(true);
      const ids = events.map((event) => event.id);
      setEventIds(ids);
    }
  }, [events]);

  useEffect(() => {
    eventIds.forEach((id) => {
      dispatch(fetchEvent(id));
    });
  }, [eventIds]);

  const sortedEvents = useMemo(() => {
    return events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [events]);
  return (
    <div className="mainColumn">
      <div className="headers">
        <h2>
          <NavLink className='disabled' disabled={true} to='/events'>Events</NavLink>
        </h2>
        <h2>
          <NavLink className="notdisabled" to='/groups'>Groups</NavLink>
        </h2>
      </div>
      <div className="label">Events in MeatUp</div>
      {sortedEvents.map((event) => {
        const value = new Date(event.startDate);
        const date = value.toLocaleDateString();
        const time = value.toLocaleTimeString();
        return (

        <div className="event" onClick={() => handleClick(event)}>
          <div className="preview">
            <img src={event.previewImage ? event.previewImage : defaultImg} alt="Group Preview" />
          </div>
          <div className="notPreview">
          <div>{`${date} · ${time}`}</div>
            <h2>{event.name}</h2>
            {/* <div>{event.city}, {event.state}</div> */}
            <div>{event.about}</div>
            <div>{event.description}</div>
            <div className="bottom">

          </div>
          </div>

        </div>
      )})}
    </div>
  )
}

export default BigEvents
