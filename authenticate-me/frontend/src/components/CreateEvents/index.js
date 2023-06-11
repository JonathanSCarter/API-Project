import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchGroup } from "../../store/group"
import { fetchEventCreate, fetchEventImageCreate } from "../../store/events"
import './CreateEvent.css'
function CreateEvents() {
  const { groupId } = useParams()
  const history = useHistory()
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [capacity, setCapacity] = useState(10)
  const [price, setPrice] = useState(null)
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState("")
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  const dispatch = useDispatch()
  const payload = {
    venueId: 1,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  }

  const group = useSelector(state => state.groups.singleGroup)


  useEffect(() => {
    dispatch(fetchGroup(groupId))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};

    if (name.length < 5) newErrors.name = "Name must be 5 or more characters";
    if (name.length === 0) newErrors.name = "Name is required";
    if (type === "") newErrors.type = "Event type is required";
    if (startDate === "") {
      newErrors.startDate = "Event start is required";
    } else {
      const startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        newErrors.startDate = "Please provide a valid date and time for the start";
      } else if (startDateObj <= currentDateTime) {
        newErrors.startDate = "Start date and time must be in the future";
      }
    }
    console.log(endDate);
    if (endDate === "") {
      newErrors.endDate = "Event end is required";
    } else {
      const endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        newErrors.endDate = "Please provide a valid date and time for the end";
      } else if (endDateObj <= currentDateTime) {
        newErrors.endDate = "End date and time must be in the future";
      }
    }
    if (isNaN(price)) {newErrors.price = "Please provide a valid number for the price"}
    if (image === "" || !(image.endsWith(".png") || image.endsWith(".jpg") || image.endsWith(".jpeg"))) {
      newErrors.image = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if(description.length < 30) newErrors.description = "Description must be at least 30 characters long"
    setErrors(newErrors);



    if (Object.keys(newErrors).length === 0) {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = async () => {

    const response = await dispatch(
      fetchEventCreate({ ...payload, price: parseFloat(price) }, groupId)
    );
    await dispatch(fetchEventImageCreate({url: image, preview: true}, response))
    history.push(`/events/${response}`)
  };
  return (
    <div className="centerCol">
      <div className="formGroup">

    <h1>Create an event for {group.name}</h1>

    <h3>What is the name of your event?</h3>
    <input placeholder="Event Name" type="text" value={`${name}`} onChange={(val) => { setName(val.target.value) }}></input>
    <p>{errors.name}</p>
    <div className="line"></div>

    <h3>Is this an in person or online event?</h3>
    <select value={type} onChange={(e) => setType(e.target.value)}>
      <option value="" disabled hidden>
        (select one)
      </option>
      <option value="In person">In person</option>
      <option value="Online">Online</option>
    </select>
    <p>{errors.type}</p>
    <div className="line"></div>

    <h3>What is the price for your event?</h3>
    <input
  placeholder="0"
  type="number"
  step="0.01"
  value={price === null ? "" : price}
  onChange={(val) => {
    const inputValue = val.target.value;
    let parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      parsedValue = parseFloat(parsedValue.toFixed(2));
    }
    setPrice(parsedValue);
  }}

/>
    <p>{errors.price}</p>
    <div className="line"></div>

    <h2>Now describes what your group will be about</h2>

    <h3>When does your event start?</h3>


    <input className="timeTop" placeholder="MM/DD/YYYY HH:mm AM" value={startDate} onChange={(val) => setStartDate(val.target.value)}></input>
    <p>{errors.startDate}</p>
    <input className="timeBottom" placeholder="MM/DD/YYYY HH:mm PM" value={endDate} onChange={(val) => setEndDate(val.target.value)}></input>
    <p>{errors.endDate}</p>
    <div className="line"></div>



    <div>Please add an image url for your event below:</div>
    <input placeholder="Image Url" type="text" value={image} onChange={(val) => setImage(val.target.value)}></input>
    <p>{errors.image}</p>
    <div className="line"></div>


    <textarea placeholder="Please write at least 30 characters" value={description} onChange={(val) => setDescription(val.target.value)}></textarea>
    <p>{errors.description}</p>



    <button onClick={handleSubmit}>Create Event</button>
    </div>

    </div>
  )
}

export default CreateEvents
