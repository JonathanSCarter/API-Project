import './HomePage.css'
import bacon from './images/bacon-solid.svg'
import group from './images/user-group-solid.svg'
import { NavLink } from 'react-router-dom'

function HomePage() {
  return (
    <>
      <div className='container1parent'>

        <div className='container1'>
          <div className='title'>
            <h1>MeatUp - meet friends who like meat too!</h1>
            <div>Everyone likes to eat meat - now you can do it with your friends! Create and Join Groups of fellow meat eaters!</div>
          </div>
          <div className='rightImage'><img src={bacon}></img></div>
        </div>
      </div>
      <div className='container2'>
        <h2>How MeatUp works</h2>
        <div>MeatUp lets you create events to eat meat with your friends!</div>
      </div>
      <div className="container3">
        <div className="column">
          <img src={group}></img>
          <NavLink to='/groups'>See all groups</NavLink>
        </div>
        <div className="column">Find an event</div>
        <div className="column">Start a new group</div>
      </div>
      <div className='container4'>
        <button className='join'>Join Meetup</button>
      </div>
    </>
  )
}

export default HomePage
