import { fetchEventsByGroup } from "../../store/group"
import { useParams, useHistory } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import defaultImg from '../Groups/default.jpg';
import { fetchEvent } from "../../store/events";

function Events({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [futureEvents, setFutureEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([]);
  const dispatch = useDispatch()

  const eventsState = useSelector(state => state.groups.singleGroup.events)

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
    if(events) events.forEach(event => {
      dispatch(fetchEvent(event.id))
    })
  }, [events])

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
      setFutureEvents(sortedFutureEvents);
    }
  }, [events]);

  useEffect(() => {
    if (pastEvents.length > 0) {
      const sortedPastEvents = pastEvents.slice().sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });
      setPastEvents(sortedPastEvents);
    }
  }, [events]);

  const handleClick = (eventId) => {
    history.push(`/events/${eventId}`);
  };

  return (
    <>
      <h2>Upcoming Events ({futureEvents.length})</h2>
      {futureEvents && eventsState ? (
        futureEvents.map(event => {
          const value = new Date(event.startDate);
          const date = value.toLocaleDateString();
          const time = value.toLocaleTimeString();
          const moreEvent = eventsState.find(eventsStateEvent => eventsStateEvent.id === event.id)
          const description = moreEvent?.description

          return (
            <div onClick={()=>handleClick(event.id)}>
              <img src={event.previewImage ? event.previewImage : defaultImg} alt="Event Preview" />
              <div>{`${date} · ${time}`}</div>
              <div>{event.name}</div>
              <div>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : "Location Unknown"}</div>
              <div>{description ? description : ''}</div>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
      <div>
      {pastEvents && eventsState ? (
        pastEvents.map(event => {
          const value = new Date(event.startDate);
          const date = value.toLocaleDateString();
          const time = value.toLocaleTimeString();
          const moreEvent = eventsState.find(eventsStateEvent => eventsStateEvent.id === event.id)
          const description = moreEvent?.description
          return (
            <div onClick={()=>handleClick(event.id)}>
              <img src={event.previewImage ? event.previewImage : defaultImg} alt="Event Preview" />
              <div>{`${date} · ${time}`}</div>
              <div>{event.name}</div>
              <div>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : "Location Unknown"}</div>
              <div>{description ? description : ''}</div>
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
