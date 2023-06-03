import React, {useState, useEffect} from 'react'
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { getTimeDifference } from '../services/date';
import { submitPost } from '../services/posts';

function ActivePost(props) {
  const { id, date, points, image, reaction, callUpdatePosts } = props;
  const [takePhoto, setTakePhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      setLoading(true);
      setTakePhoto(false);
      const results = await submitPost(photo, id);
      setLoading(false);
      callUpdatePosts(true);

    }
    
    // call the data fetching function
    if (photo) {
      fetchData().catch(console.error);
    }
  }, [photo]);

  return (
    <div className='post-container'>
      <div className='post-header' id='todo'><span className='icon'>⏰</span> It's Time!</div>
      <div className='post-body'>
        Olivia! It's time to post your OOTD. You are going to look amazing today. {getTimeDifference(date.toDate())} have elapsed since the OOTD opened.
      </div>
      {takePhoto && !loading && (<Camera onTakePhoto = { (dataUri) => { setPhoto(dataUri); } }/>) }
      {!takePhoto && !loading && (<button className='button' onClick={() => setTakePhoto(true)}>Take Photo</button>)}
      {loading && (<div class="lds-ring"><div></div><div></div><div></div><div></div></div>)}
    </div>
  )
}

export default ActivePost