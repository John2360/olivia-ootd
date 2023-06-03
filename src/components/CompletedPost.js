import React from 'react'
import ImageLoader from './ImageLoader';
import {formatDateToString} from '../services/date';

function CompletedPost(props) {
  const { id, date, points, image, reaction } = props;
  return (
    <div className='post-container'>
      <div className='post-header-wrapper'>
        <div>
          <div className='post-header'>
            {formatDateToString(date.toDate())}
          </div>
          <div className='subheader'>
          🔥 {points} points
          </div>
        </div>
        <span className='icon'>{reaction}</span>
      </div>
      <ImageLoader src={image} alt="Post Image" />
    </div>
  )
}

export default CompletedPost