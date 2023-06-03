import React, {useEffect, useState} from 'react';
import { getPosts, createFuturePosts } from '../services/posts';
import FuturePost from '../components/FuturePost';
import CompletedPost from '../components/CompletedPost';
import ActivePost from '../components/ActivePost';


function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatePosts, setUpdatePosts] = useState(false);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const results = await getPosts();
      setPosts(results);
      setLoading(false);
      setUpdatePosts(false);
    }
    
    // call the data fetching function
    fetchData().catch(console.error);
  }, [updatePosts]);

  if (loading) {
    return (<div className="lds-ring"><div></div><div></div><div></div><div></div></div>)
  } else {
    return (<div className='posts-container'>
      {posts.map((res, index) => {
        if (res.status === 'future' && res.timestampToTake.toDate() > new Date()) {
          return <FuturePost key={index} id={res.id}  date={res.timestampToTake} points={res.points} image={""} reaction={""} />
        } else if (res.status == 'completed') {
          return <CompletedPost key={index} id={res.id}  date={res.timestampTaken} points={res.points} image={res.photo} reaction={res.reaction} />
        } else if (res.timestampToTake.toDate() < new Date()) {
          return <ActivePost key={index} id={res.id} date={res.timestampToTake} points={res.points} image={""} reaction={""} callUpdatePosts={setUpdatePosts} />
        }
      })}
    </div>)
  }
}

export default Posts