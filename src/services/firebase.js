import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};

// Initialize Firebase 
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();


const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  auth.signInWithPopup(provider).then((result) => {
    const auth = result.user;
    if (isLoggedIn(auth)) {
      // Reference to the user's document
      const userRef = db.collection('users').doc(auth.uid);
  
      // Get the document snapshot
      userRef.get()
        .then((doc) => {
          if (doc.exists) {
            // User document already exists
            console.log('User document already exists');
          } else {
            // User document doesn't exist, create a new document
            userRef.set({
              name: auth.displayName,
              email: auth.email,
              photoURL: auth.photoURL,
              createdAt: new Date(),
              points: 0,
              posts: 0
            })
              .then(() => {
                // Document created successfully
                console.log('User document created');
              })
              .catch((error) => {
                // Handle errors during document creation
                console.error('Error creating user document:', error);
              });
          }
        })
        .catch((error) => {
          // Handle errors during document retrieval
          console.error('Error checking user document:', error);
        });
    }

  }).catch((error) => {
    console.log(error);
  });
};

export const isLoggedIn = (auth) => {
  if (auth && (auth.email == "oliviaqsuomi@gmail.com" || auth.email == "johnbfinberg@gmail.com")) {
    return true;
  }
  return false;
}

export default firebase;