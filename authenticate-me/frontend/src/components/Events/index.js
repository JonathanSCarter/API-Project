import { fetchEventsByGroup } from "../../store/group"
import { useParams, useHistory } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import defaultImg from '../Groups/default.jpg';
import { fetchEvent } from "../../store/events";
import './Events.css'
function Events() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [futureEvents, setFutureEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([]);
  const [futureEvents2, setFutureEvents2] = useState([])
  const [pastEvents2, setPastEvents2] = useState([]);
  const [eventIds, setEventIds] = useState([])
  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch()
  const events = useSelector(state => state.events.allEvents)
  console.log('test');

  const history = useHistory();
  const {groupId} = useParams
  const separateEventsByDate = (events) => {
    const futureEventsArr = [];
    const pastEventsArr = [];
    events.forEach(event => {
      const eventStartDate = new Date(event.startDate);
      if (eventStartDate > currentDate) {
        futureEventsArr.push(event);
      } else {
        pastEventsArr.push(event);
      }
    });
    setFutureEvents(futureEventsArr);
    setPastEvents(pastEventsArr);
  };

  useEffect(() => {
    if(events && !disabled){
      setDisabled(true)
      const ids = [];
      events.forEach(event => {
        ids.push(event.id)
      })
      setEventIds(ids)
    }
  }, [events])

  useEffect(() => {
    eventIds.forEach(id => {
      dispatch(fetchEvent(id))
    })
  }, [eventIds])

  useEffect(() => {
    if (events) separateEventsByDate(events);
  }, [events]);

  useEffect(() => {
    if (futureEvents.length > 0) {
      const sortedFutureEvents = futureEvents.slice().sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });
      setFutureEvents2(sortedFutureEvents);
    }
  }, [events, futureEvents]);

  useEffect(() => {
    if (pastEvents.length > 0) {
      const sortedPastEvents = pastEvents.slice().sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });
      setPastEvents2(sortedPastEvents);
    }
  }, [events, pastEvents]);

  const handleClick = (eventId) => {
    history.push(`/events/${eventId}`);
  };


  return (
    <>
      <h2>Upcoming Events ({futureEvents.length})</h2>
      {futureEvents2 && events ? (
        futureEvents2.map(event => {
          const value = new Date(event.startDate);
          const date = value.toLocaleDateString();
          const time = value.toLocaleTimeString();


          return (
            <div className="imageContainer" onClick={()=>handleClick(event.id)}>
              <img src={event.previewImage ? event.previewImage : defaultImg} alt="Event Preview" />
              <div className="eventDetails">
              <div>{`${date} · ${time}`}</div>
              <h2>{event.name}</h2>
              <div>SomeCity, SomeState</div>
              </div>
              <div className="descrip">{event.description}</div>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
      <div>
      {pastEvents2 && events ? (
        pastEvents2.map(event => {
          const value = new Date(event.startDate);
          const date = value.toLocaleDateString();
          const time = value.toLocaleTimeString();

          return (
            <div className="imageContainer" onClick={()=>handleClick(event.id)}>
              <img src={event.previewImage ? event.previewImage : defaultImg} alt="Event Preview" />
              <div className="eventDetails">
              <h4>{`${date} · ${time}`}</h4>
              <h2>{event.name}</h2>
              <h4>SomeCity, SomeState</h4>
              <div className="descrip">{event.description}</div>
              </div>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
      </div>
    </>
  );
}
export default Events
