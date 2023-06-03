import React, {useEffect, useState} from 'react'
import { getUser } from '../services/profile';

function Profile(props) {
  const { pic, name, userId } = props;
  const [userInfo, setUserInfo] = useState({points: 0, posts: 0});

  useEffect(() => {
    const fetchData = async () => {
      const results = await getUser(userId);
      setUserInfo(results);
    }

    fetchData().catch(console.error);
  }, [userId]);

  return (
    <div className='post-container'>
        <div className='profile-header'>
            <img src={pic} referrerPolicy="no-referrer" />
            <div className='profile-header-text'>
                <h1>{name}</h1>
                <p>Since 2023</p>
            </div>
        </div>
        <div className='badges'>
            <div className='badge'>
                🔥 {userInfo?.points}
            </div>
            <div className='badge'>
                📸 {userInfo?.posts}
            </div>
        </div>
    </div>
  )
}

export default Profile