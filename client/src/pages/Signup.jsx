import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          navigate("/dashboard");
          return false;
        },
      },
      signInFlow: "popup",
      signInSuccessUrl: "/dashboard",
    });
  }, [navigate]);

  return (
    <div>
      <h2>Sign Up or Log In</h2>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Signup;
