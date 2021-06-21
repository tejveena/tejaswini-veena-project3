import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBgvVKGfnSRe3gvvzz0VgV4gQShhvghtjk",
  authDomain: "tasksfirebase-c494d.firebaseapp.com",
  projectId: "tasksfirebase-c494d",
  storageBucket: "tasksfirebase-c494d.appspot.com",
  messagingSenderId: "289252172275",
  appId: "1:289252172275:web:0ace987f265708f7bbb286"
};
firebase.initializeApp(firebaseConfig);
export default firebase;
