importScripts("https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyD5Vqi4xCEikV19v4FB8mnbK95DjHmfp08",
    authDomain: "golden-deal-8b207.firebaseapp.com",
    projectId: "golden-deal-8b207",
    storageBucket: "golden-deal-8b207.appspot.com",
    messagingSenderId: "448538001181",
    appId: "1:448538001181:web:e21bce935245845ed56bf4"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload.notification);
});