import { db } from './firebase';

export const getUser = (userId) => {
    // Reference to the user's document
    const userRef = db.collection('users').doc(userId);
  
    // Get the document snapshot
    return userRef.get()
      .then((doc) => {
        if (doc.exists) {
          // User document already exists
          return doc.data();
        } else {
          console.error('User document does not exist');
        }
      })
      .catch((error) => {
        // Handle errors during document retrieval
        console.error('Error checking user document:', error);
      });
};