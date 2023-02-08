import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ children }) {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    // console.log('asasddffg')

    if(token) {
        return children
    } else {
        return <Navigate to="/" replace />
    }


    ///////////////////////// OUTDATED REACT_ROUTER_DOM_CODE 
    // return (
    // // this route takes other routes assigned to it from the App.js and return the same route if condition is met
    // <Route
    //   {...rest}
    //   render={(props) => {
    //     // get cookie from browser if logged in
    //     const token = cookies.get("TOKEN");

    //     // returns route if there is a valid token set in the cookie
    //     if (token) {
    //         console.log('yes')
    //       return <Component {...props} />;
    //     } else {
    //         console.log('no')
    //       // returns the user to the landing page if there is no valid token set
    //       return (
    //         <Navigate
    //           to={{
    //             pathname: "/",
    //             state: {
    //               // sets the location a user was about to access before being redirected to login
    //               from: props.location,
    //             },
    //           }}
    //         />
    //       );
    //     }
    //   }}
    // />
    //   );
}