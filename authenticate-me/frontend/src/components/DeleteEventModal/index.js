import { useModal } from '../../context/Modal'
import { fetchEventDelete } from '../../store/events'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function DeleteGroupModal(props) {
  const { eventId } = props
  const dispatch = useDispatch()
  const history = useHistory()
  const goDelete = () => {
    dispatch(fetchEventDelete(parseInt(eventId)))
    closeModal();
    history.push('/events')
  }
  const { closeModal } = useModal()
  return (
    <div className='delete'>
      <h1>Confirm Delete</h1>
      <div>Are you sure you want to remove this event?</div>
      <button style={{backgroundColor:"red"}} onClick={goDelete}>Yes(Delete Event)</button>
      <button style={{backgroundColor:"black"}} onClick={closeModal}>No (Keep Event)</button>
    </div>
  )
}

export default DeleteGroupModal
