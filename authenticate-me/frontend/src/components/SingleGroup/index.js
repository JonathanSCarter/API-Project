import { NavLink, useParams, useHistory } from "react-router-dom";
import './SingleGroup.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsByGroup, fetchGroup, fetchMembersByGroup, fetchGroupDelete } from "../../store/group";
import { useEffect, useState } from "react";
import defaultImg from '../Groups/default.jpg';
import Events from "../Events";
import OpenModalButton from "../OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";

function SingleGroups() {
  const [owner, setOwner] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isNotMember, setIsNotMember] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const group = useSelector(state => state.groups.singleGroup);
  const members = useSelector(state => state.groups.singleGroup.members);
  const user = useSelector(state => state.session.user);
  const events = useSelector(state => state.events.allEvents);



  useEffect(() => {
    if (members) {
      const host = members.Members.find(member => member.Membership.status === 'host');
      setOwner(host);
      if (user) {
        setLoggedIn(true);
        if (host.id === user.id) {
          setIsOwner(true);
          setIsNotMember(false);
        }
        const isMember = members.Members.find(member => member.Membership.id === user.id);
        if (isMember) setIsNotMember(false);
      } else {
        setLoggedIn(false);
      }
    }
  }, [members, user]);

  useEffect(() => {
    setIsOwner(false);
    setLoggedIn(false);
    setIsNotMember(false);
  }, [user]);

  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchEventsByGroup(groupId));
    dispatch(fetchMembersByGroup(groupId));
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || isOwner || isNotMember) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [loggedIn, isOwner, isNotMember]);

  useEffect(() => {
    if (!loggedIn || isOwner) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [loggedIn, isOwner]);

  const handleClick = () => {
    window.alert('Feature coming soon');
  };

  const goUpdate = () => {
    history.push(`/groups/${groupId}/edit`)
  }

  const goEventCreate = () => {
    history.push(`/groups/${groupId}/events/new`)
  }

console.log(events);

  return (
    <>
    <div className="mainColumn">
      <div className="headers">
        <h4>
          <NavLink to='/groups'>Groups</NavLink>
        </h4>
      </div>
      <div className="groupDetail">
        <div className="preview">
          <img src={group && group.previewImage ? group.previewImage : defaultImg} alt="Group Preview" />
        </div>
        <div className="notPreview">
          <div class="someDetails">

            <h1>{group.name}</h1>
            <div>{group.city}, {group.state}</div>
            <div className="bottom">
              <div>
                {events && events.length
                  ? (events.length === 1 ? '1 Event' : `${events.length} Events`)
                  : '0 Events'
                }
              </div>
              <div>·</div>
              <div>{group.private ? "private" : "public"}</div>
            </div>
            <div>{owner && `Organized by ${owner.firstName} ${owner.lastName}`}</div>
          </div>
          <div className="buttonDown">
            {!hidden && (
              <button onClick={handleClick} disabled={disabled} className={disabled ? "disabled" : "notDisabled"}>
                Join Group
              </button>
            )}
            {isOwner && (
              <>
                <button onClick={goEventCreate} className="ownerButtons" hidden={!isOwner}>Create event</button>
                <button onClick={goUpdate} className="ownerButtons" hidden={!isOwner}>Update</button>
                <OpenModalButton
                  style={{
                    backgroundColor: "darkslategray",
                    color: "white",
                    height: "40px",
                    width: "fit-content",
                    borderRadius: "0px",
                    marginRight: "10px",
                    boxShadow: "5px 5px black"
                  }}
                  buttonText="Delete"
                  modalComponent={<DeleteGroupModal groupId={groupId} />}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    <div className="detailsCol">
      <div className="details">
        <h2>Organizer</h2>
        <div>{owner.firstName} {owner.lastName}</div>
        <h2>What we're about</h2>
        <div>{group.about}</div>
        {events.length > 0 && <Events events={events} />}
      </div>
    </div>
    </>
  );
}

export default SingleGroups;
