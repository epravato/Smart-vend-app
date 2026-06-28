import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project config.
// Go to https://console.firebase.google.com → your project → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: 'AIzaSyAH4ofgtAVtfT341MxSOBZy6vFYmLvsqRU',
  authDomain: 'vend-smart.firebaseapp.com',
  projectId: 'vend-smart',
  storageBucket: 'vend-smart.firebasestorage.app',
  messagingSenderId: '80172679067',
  appId: '1:80172679067:web:d350617706d89ead836b3e',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
