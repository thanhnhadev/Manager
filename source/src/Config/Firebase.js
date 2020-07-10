import firebase from "firebase";
//import firestore from "firebase/firestore";

const config = {
    apiKey: "AIzaSyCaImxAuN241t4Jg4W-uu4j_xMc6rOwEbc",
    authDomain: "project-all-184716.firebaseapp.com",
    databaseURL: "https://project-all-184716.firebaseio.com",
    projectId: "project-all-184716",
    storageBucket: "project-all-184716.appspot.com",
    messagingSenderId: "439401437274",
    appId: "1:439401437274:web:ff08f5d70b1a9512"
};

firebase.initializeApp(config);

export default firebase;