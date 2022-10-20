import React, { createContext, useState, useEffect } from "react";

// create context
const AuthStateContext= createContext();

const AuthStateProvider = ({ children }) => {
  // the value that will be given to the context
  const [$authState, $setAuthState] = useState({});

  //Authenticate using firebase
  // useEffect((phone) => {
  //   //TODO authenticate with firebase logic goes in here
  //   $setAuthState({ ...$authState, ...{ phone, codeSent: true } });
  //   }, []);

  return (
    // the Provider gives access to the context to its children
    <AuthStateContext.Provider value={{$authState, $setAuthState}}>
      {children}
    </AuthStateContext.Provider>
  );
};

export { AuthStateContext, AuthStateProvider };
