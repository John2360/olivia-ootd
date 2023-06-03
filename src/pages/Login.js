import React, {useEffect, useState} from 'react'
import { signInWithGoogle, isLoggedIn } from '../services/firebase'
import { Navigate } from 'react-router-dom';

function Login(props) {
  const { user } = props;
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (isLoggedIn(user)) {
      setLogin(true);
    }
  }, [user]);

  if (!login) {
    return (
      <div className='login-background'>
        <div className='login-wrapper'>
            <div className='login-container'>
                <div className='login-header'>
                    <h1>Olivia's OOTD</h1>
                    <p>Let's get started. Sign in below to open up the dashboard.</p>
                </div>
                <div className='login-form'>
                    <button className="button" onClick={signInWithGoogle}><i className="fab fa-google"></i>Sign in with Google</button>
                </div>
            </div>
        </div>
      </div>
    )
  } else {
    return (<Navigate to="/dashboard" />)
  }
}

export default Login