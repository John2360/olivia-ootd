import React, {useEffect, useState} from 'react'
import { isLoggedIn } from '../services/firebase'
import { Navigate } from 'react-router-dom';
import Profile from './Profile';
import Posts from './Posts';

function Dashboard(props) {
  const { user } = props;
  const [login, setLogin] = useState(true);

  const [tab, setTab] = useState('Posts');

  useEffect(() => {
    if (!isLoggedIn(user)) {
      setLogin(false);
    }
  }, [user]);


  if (login) {
    return (
      <div className='dashboard-wrapper'>
        <div className='tabs-container'>
          <div className={`tab ${tab=='Posts' ? "active" : ""}`} onClick={() => setTab('Posts')}>Posts</div>
          <div className={`tab ${tab=='Shop' ? "active" : ""}`} onClick={() => setTab('Shop')}>Shop</div>
          <div className={`tab ${tab=='Me' ? "active" : ""}`} onClick={() => setTab('Me')}>{user?.displayName.split(" ")[0]} ❤️</div>
        </div>
        <div className='dashboard-container'>
          {tab == 'Posts' && (
            <Posts />
          )}
          {tab == 'Shop' && (
            <p>Comming Soon!</p>
          )}
          {tab == 'Me' && (
            <Profile pic={user?.photoURL} name={user?.displayName} userId={user?.uid} />
          )}
        </div>
      </div>
    )
  } else {
    return (<Navigate to="/login" />)
  }
}

export default Dashboard