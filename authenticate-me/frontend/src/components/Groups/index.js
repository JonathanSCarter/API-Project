import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import defaultImg from './default.jpg';
import { fetchGroups, fetchEventsByGroup, fetchEventsByGroupTwo } from "../../store/group";
import './Groups.css';

function Groups() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [disabled, setDisabled] = useState(false);
  const [disabled2, setDisabled2] = useState(false);


  useEffect(() => {
    dispatch(fetchGroups());
    setDisabled(false);
  }, [dispatch]);

  const groups = useSelector(state => state.groups.allGroups);

useEffect(() => {
  if(Array.isArray(groups) && !disabled2){
    setDisabled2(true)
    groups.forEach(group => {
      dispatch(fetchEventsByGroupTwo(group.id))
    })
  }
}, [groups])


  const handleClick = (group) => {
    history.push(`/groups/${group.id}`);
  };
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
      {groups && Array.isArray(groups) && groups.map((group) => (

        <div className="group" onClick={() => handleClick(group)}>
          <div className="preview">
            <img src={group.previewImage ? group.previewImage : defaultImg} alt="Group Preview" />
          </div>
          <div className="notPreview">
            <h2>{group.name}</h2>
            <div>{group.city}, {group.state}</div>
            <div>{group.about}</div>
            <div className="bottom">
              <div>
                {group && group.events
                  ? (group.events.length === 1 ? '1 Event' : `${group.events.length} Events`)
                  : '0 Events'
                }
              </div>
              <div>·</div>
              <div>{group.private ? "private" : "public"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Groups;
