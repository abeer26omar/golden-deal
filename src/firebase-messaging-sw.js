importScripts("https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyDWCchVr5xKwG67w1tqhiV3HwYH0fg9l6I",
    authDomain: "golden-deal-angular.firebaseapp.com",
    projectId: "golden-deal-angular",
    storageBucket: "golden-deal-angular.appspot.com",
    messagingSenderId: "789293992920",
    appId: "1:789293992920:web:a60de3b33a404ebbde00ad",
    measurementId: "G-086W67L99V"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload.notification);
});