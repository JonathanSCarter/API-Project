import { NavLink, useParams } from "react-router-dom"
import './SingleGroup.css'
import { useDispatch, useSelector } from "react-redux"
import { fetchEventsByGroup, fetchGroup, fetchMembersByGroup } from "../../store/group"
import { useEffect, useState } from "react"
import defaultImg from '../Groups/default.jpg'
import Events from "../Events"


function SingleGroups() {
  const [owner, setOwner] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isNotMember, setIsNotMember] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [hidden, setHidden] = useState(true)
  const { groupId } = useParams();
  const dispatch = useDispatch()

  const group = useSelector(state => state.groups)
  const members = useSelector(state => state.groups.members)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    if (members) {
      const host = members.Members.find(member => member.Membership.status === 'host')
      setOwner(host)
      if (user) {
        setLoggedIn(true)
        if (host.id === user.id) {
          setIsOwner(true)
          setIsNotMember(false)
        }
        const isMember = members.Members.find(member => member.Membership.id === user.id)
        if (isMember) setIsNotMember(false)
      }
      else setLoggedIn(false)
    }
  }, [members, user])

  useEffect(() => {
    setIsOwner(false)
    setLoggedIn(false)
    setIsNotMember(false)
  }, [user])

  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchEventsByGroup(groupId))
    dispatch(fetchMembersByGroup(groupId))
    console.log('test');
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || isOwner || isNotMember) setDisabled(true)
    else (setDisabled(false))
  }, [loggedIn, isOwner, !isNotMember])

  useEffect(() => {
    if (!loggedIn || isOwner) setHidden(true)
    else (setHidden(false))
    console.log(hidden, 'hidden', !loggedIn, isOwner);
  }, [loggedIn, isOwner])

  const handleClick = () => {
    window.alert('Feature coming soon');
  };

  return (
    <div className="mainColumn">
      <div className="headers">
        <h4>
          <NavLink to='/groups'>Groups</NavLink>
        </h4>
      </div>
      <div className="groupDetail">
        <div className="preview">
          <img src={group && group.previewImage ? group.previewImage : defaultImg} alt="Group Preview"></img>
        </div>
        <div className="notPreview">
          <h1>{group.name}</h1>
          <div>{group.city}, {group.state}</div>
          <div className="bottom">
            <div>
              {group && group.events && group.events.length
                ? (group.events.length === 1 ? '1 Event' : `${group.events.length} Events`)
                : '0 Events'
              }
            </div>
            <div>·</div>
            <div>{(() => group.private ? "private" : "public")()}</div>
          </div>
          <div>
            {owner && `Organized by ${owner.firstName} ${owner.lastName}`}
          </div>
          <div className="buttonDown">
            {!hidden && (
              <button onClick={handleClick} disabled={disabled} className={disabled ? "disabled" : "notDisabled"}>
                Join Group
              </button>
            )}
            {isOwner && (
              <>
              <button className="ownerButtons" hidden={!isOwner}>Create event</button>
              <button className="ownerButtons" hidden={!isOwner}>Update</button>
              <button className="ownerButtons" hidden={!isOwner}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="details">
      <h2>What we're about</h2>
      <div>{group.about}</div>
        <Events />
      </div>
    </div>
  )
}

export default SingleGroups
