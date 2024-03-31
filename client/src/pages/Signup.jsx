import React from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";

const Signup = () => {
  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // Action if the user is authenticated successfully
          return true;
        },
        uiShown: function () {
          // This is what should happen when the form is full loaded. In this example, I hide the loader element.
          document.getElementById("loader").style.display = "none";
        },
        signInFailure: function (error) {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != "firebaseui/anonymous-upgrade-merge-conflict") {
            return Promise.resolve();
          }
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // Copy data from anonymous user to permanent user and delete anonymous
          // user.
          // ...
          // Finish sign-in after data is copied.
          return firebase.auth().signInWithCredential(cred);
        },
      },
      signInSuccessUrl: "/", // This is where should redirect if the sign in is successful.

      autoUpgradeAnonymousUsers: true,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      ],
      tosUrl: "https://www.example.com/terms-conditions", // URL to you terms and conditions.
      privacyPolicyUrl: function () {
        // URL to your privacy policy
        window.location.assign("https://www.example.com/privacy-policy");
      },
    });
  }, []);

  return (
    <div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
  );
};

export default Signup;
