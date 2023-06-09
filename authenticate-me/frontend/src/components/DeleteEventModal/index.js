import { useModal } from '../../context/Modal'
import { fetchEventDelete } from '../../store/events'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function DeleteGroupModal(props) {
  const { eventId } = props
  const dispatch = useDispatch()
  const history = useHistory()
  const goDelete = () => {
    dispatch(fetchEventDelete(eventId))
    closeModal();
    history.push('/events')
  }
  const { closeModal } = useModal()
  return (
    <div>
      <h1>Confirm Delete</h1>
      <div>Are you sure you want to remove this event?</div>
      <button onClick={goDelete}>Yes(Delete Event)</button>
      <button onClick={closeModal}>No (Keep Event)</button>
    </div>
  )
}

export default DeleteGroupModal
