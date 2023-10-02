import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDZxMbH6vvau_LoZkr8SRQDMUM4RQvg6Sc",
    authDomain: "nerdmoney-e8558.firebaseapp.com",
    projectId: "nerdmoney-e8558",
    storageBucket: "nerdmoney-e8558.appspot.com",
    messagingSenderId: "918577320402",
    appId: "1:918577320402:web:8636c8f9910e37510db80b",
    measurementId: "G-EQ8W524SY7",
};

function createFirebaseApp(config: FirebaseOptions) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}

const firebaseApp = createFirebaseApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);