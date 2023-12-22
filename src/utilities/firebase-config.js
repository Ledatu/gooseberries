import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
const firebaseConfig = {
    apiKey: 'AIzaSyDbWybGdo6lXYkK4Hk8R5qtBBgXwSxC4ms',
    authDomain: 'market-manager-wb.firebaseapp.com',
    projectId: 'market-manager-wb',
    storageBucket: 'market-manager-wb.appspot.com',
    messagingSenderId: '415304595683',
    appId: '1:415304595683:web:6b9dce3883b49657906dd6',
    measurementId: 'G-QFYZJGNVPZ',
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
