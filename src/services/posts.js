import { db, storage, auth } from './firebase';
import { getUser } from './profile';
import { randomNormalDistribution, randomInverseNormalDistribution, clamp, scale } from './math';

export const getPosts = async () => {
  const snapshot = await db.collection('posts').get();
  const posts = snapshot.docs.map(doc => {const myData = doc.data(); myData.id = doc.id; return myData;});
  const sortedPosts = posts.sort((a, b) => b.timestampToTake.toDate() - a.timestampToTake.toDate());
  return sortedPosts.slice(4);
}

export const getPost = async (postId) => {
  const snapshot = await db.collection('posts').doc(postId).get();
  const post = snapshot.data();
  post.id = snapshot.id;
  return post;
}

const assignTime = (date) => {
  const newDate = new Date(date);
  const mean = 540; // 9 am in minutes (7 am = 420, 11 am = 660)
  const stdDeviation = 60; // 1 hour in minutes

  // Generate a random number following a normal distribution
  const randomValue = randomNormalDistribution(mean, stdDeviation);

  // Clamp the value between 7 am (420 minutes) and 11 am (660 minutes)
  const clampedValue = clamp(randomValue, 420, 660);

  // Convert the minutes to hours and minutes
  const hours = Math.floor(clampedValue / 60);
  const minutes = Math.round(clampedValue % 60);

  newDate.setHours(hours);
  newDate.setMinutes(minutes);

  return newDate;
}


export const assignPoints = (time) => {
  const minTime = 7 * 60; // Convert 7am to minutes
  const maxTime = 11 * 60; // Convert 11am to minutes

  // Calculate the midpoint between the boundaries
  const midpoint = (minTime + maxTime) / 2;

  // Calculate the distance from the midpoint
  const distance = Math.abs(time - midpoint);

  // Calculate the maximum distance from the midpoint
  const maxDistance = (maxTime - minTime) / 2;

  // Calculate the weight based on the distance
  const weight = 1 - distance / maxDistance;

  // Calculate the points using the weight and range [0-100]
  const points = weight * 100;

  return Math.floor(points);
}

export const createFuturePosts = async () => {
  const options = {
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  };
  const estTimestamp = new Date().toLocaleString('en-US', options);

  try {
    let lastTimestamp = new Date(estTimestamp);

    // Query Firestore to get documents ordered by the 'timestampToTake' field in descending order
    const snapshot = await db.collection('posts').orderBy('timestampToTake', 'desc').limit(1).get();

    // Check if any documents are returned
    if (!snapshot.empty) {
      lastTimestamp = snapshot.docs[0].data().timestampToTake.toDate();
      lastTimestamp.setDate(lastTimestamp.getDate() + 1);
    }

    // Create date object for the 5 days in the future
    const futureDate = new Date(estTimestamp);
    futureDate.setDate(futureDate.getDate() + 5);

    const diff = futureDate.getTime() - lastTimestamp.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));


    for (let i = 0; i < diffDays; i++) {
      // Create date object for the next day
      const date = assignTime(lastTimestamp);
      date.setDate(date.getDate() + i);

      // Create a new post document
      await db.collection('posts').add({
        timestampToTake: date,
        status: 'future',
        points: assignPoints(date.getHours() * 60 + date.getMinutes()),
        message: "Good morning, baby!",
        photo: null,
        reaction: null,
        timestampTaken: null
      });
    }

    return;
  } catch (error) {
    console.log('Error getting latest date:', error);
    return;
  }
};

export const submitPost = async (photo, postId) => {
  return new Promise(function(resolve, reject) {
    // File Name
    const fileName = `photo-${Math.floor(new Date().getTime() / 1000)}.jpg`;
    
    // Convert Data URI to Blob
    const byteString = atob(photo.split(',')[1]);
    const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mimeString });

    // Create a storage reference with a unique filename
    const storageRef = storage.ref().child(`ootds-images/${fileName}`);

    // Upload the file to the storage reference
    const uploadTask = storageRef.put(blob);

    // Monitor the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track the upload progress (optional)
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        // Handle upload error
        console.error("Upload error:", error);
        reject()
      },
      () => {
        // Handle successful upload
        console.log("Upload completed");
        // Retrieve the download URL of the uploaded file
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          console.log("Download URL:", downloadURL);
          // You can save the download URL to a database or use it as needed

          // Update the post document
          await db.collection('posts').doc(postId).update({
            status: 'completed',
            photo: downloadURL,
            timestampTaken: new Date()
          })

          const userId = auth.currentUser.uid;
          const user = await getUser(userId);
          const post = await getPost(postId);

          const newPoints = parseInt(user.points) + parseInt(post.points);
          const newPosts = user.posts + 1;

          await db.collection('users').doc(userId).update({
            points: newPoints,
            posts: newPosts
          })

          resolve();

        })
      }
    );
  });
}