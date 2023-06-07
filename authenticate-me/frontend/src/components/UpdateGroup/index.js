import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchGroupUpdate, fetchGroup } from "../../store/group"

function UpdateGroup() {

  const history = useHistory()
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [type, setType] = useState("")
  const [isPrivate, setIsPrivate] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [cityState, setCityState] = useState("")
  const [image, setImage] = useState("")
  const dispatch = useDispatch()
  const { groupId } = useParams();

  const payload = {
    name,
    about,
    type,
    private: isPrivate,
    city,
    state
  }
  const group = useSelector(state => state.groups.groups);
  console.log(group);
  useEffect(() => {
    if (cityState.includes(', ')) {
      const values = cityState.split(', ')
      setCity(values[0])
      setState(values[1])
      console.log(`${values[0]},${values[1]}`);
      if (values[2]) setCityState(`${values[0]}, ${values[1]}`)
    } else {
      if (cityState) setCity(cityState)
      else setCity("")
      setState('')
    }
  }, [cityState])

    useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch]);

  useEffect(() => {
    setAbout(group.about)
    setCity(group.city)
    setIsPrivate(group.private)
    setName(group.name)
    setState(group.state)
    setType(group.type)
    setCityState(`${group.city}, ${group.state}`)
  }, [group])

  const handleSubmit = async () => {
    const id = await dispatch(fetchGroupUpdate(payload, groupId))
    history.push(`/groups/${groupId}`)
  }

  return (
    <>
      <h4>UPDATE YOUR GROUP'S INFORMATION</h4>
      <h2>We'll walk you through a few steps to update your group's information</h2>
      <div>line</div>
      <h2>First, set your group's location.</h2>
      <div>Meetup groups meet localy, in person and online. We'll connect you with people in your area, and more can join you online.</div>
      <input placeholder="City, STATE" type="text" value={`${cityState}`} onChange={(val) => { setCityState(val.target.value) }}></input>
      <h2>What is the name of your group?</h2>
      <div>Choose a name that will give people a clear idea of what the group is about. Feel Free to get creative! You can edit this later if you change your mind.</div>
      <input placeholder="What is your group name?" type="text" value={name} onChange={(val) => setName(val.target.value)}></input>
      <h2>Now describes what your group will be about</h2>
      <div>People will see this when we promote your group, but you'll be able to add to it later, too.</div>
      <ol>
        <li>What's the purpose of the group?</li>
        <li>Who should join?</li>
        <li>What will you do at your events?</li>
      </ol>
      <textarea placeholder="Please write at least 30 characters" value={about} onChange={(val) => setAbout(val.target.value)}></textarea>
      <h2>Final steps...</h2>
      <div>Is this an in person or online group?</div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="" disabled hidden>
          (select one)
        </option>
        <option value="In person">In person</option>
        <option value="Online">Online</option>
      </select>
      <div>Is this group private or public?</div>
      <select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)}>
        <option value="" disabled hidden>
          (select one)
        </option>
        <option value={true}>private</option>
        <option value={false}>public</option>
      </select>
      <button onClick={handleSubmit}>Update Group</button>
    </>
  )
}

export default UpdateGroup
