import React from 'react'
import { formatTime, getTimeDifference } from '../services/date';

function FuturePost(props) {
  const { id, date, points, image, reaction } = props;
  return (
    <div className='post-container' id='todo'>
      <div className='post-header' id='todo'><span className='icon'>📸</span> in {getTimeDifference(date.toDate())}</div>
      <div className='post-body'>
        Get ready, Olivia! An OOTD post is dropping @ {formatTime(date.toDate())} EST. 
      </div>
    </div>
  )
}

export default FuturePost