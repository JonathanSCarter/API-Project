import './HomePage.css'
import bacon from './images/bacon-solid.svg'
import group from './images/user-group-solid.svg'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function HomePage() {
  const [disabled, setDisabled] = useState(true)
  const [container1Height, setContainer1Height] = useState(600);

  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const handleResize = () => {
      const height = document.querySelector('.container1').offsetHeight;
      setContainer1Height(height);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const container2Style = {
    marginTop: `${container1Height + 150}px`,
  };
  useEffect(() => {
    if(sessionUser) setDisabled(false)
  }, [sessionUser])

  const handleClick = (e) => {
    if(disabled) e.preventDefault()
  }
  return (
    <>
      {/* <div className='container1parent'> */}

        <div className='container1 column1'>
          <div className='title'>
            <h1>MeatUp - meet friends who like meat too!</h1>
            <div>Everyone likes to eat meat - now you can do it with your friends! Create and Join Groups of fellow meat eaters!</div>
          </div>
          <div className='rightImage column1'><img src={bacon} alt=""></img></div>
        {/* </div> */}
      </div>
      <div className='container2' style={container2Style}>
        <h2>How MeatUp works</h2>
        <div>MeatUp lets you create events to eat meat with your friends!</div>
      </div>
      <div className="container3">
        <div className="column">
          <img src={group} alt=""></img>
          <NavLink to='/groups'>See all groups</NavLink>
        </div>
        <div className="column">
          <img src={group} alt=""></img>
          <NavLink to='/events'>Find an event</NavLink>
        </div>
          <div className="column">
            <img src={group} alt=""></img>
            <NavLink className={disabled ? 'disabled' : ''}to='/events/create' onClick={(e) => handleClick(e)}>Start a group</NavLink></div>
        </div>
        <div className='container4'>
          <button className='join' >Join Meetup</button>
        </div>
      </>
      )
}

      export default HomePage
