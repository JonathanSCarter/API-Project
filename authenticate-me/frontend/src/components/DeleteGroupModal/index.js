import { useModal } from '../../context/Modal'
import { fetchGroupDelete } from '../../store/group'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function DeleteGroupModal(props) {
  const { groupId } = props
  console.log(groupId);
  const dispatch = useDispatch()
  const history = useHistory()
  const goDelete = () => {
    dispatch(fetchGroupDelete(groupId))
    closeModal();
    history.push('/groups')
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
