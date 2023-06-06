import { useEffect } from "react";
import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    console.log(isLoggedIn);
    const token = localStorage.getItem("access_token");
    const getToken = JSON.parse(token);
    console.log(getToken);
    if (getToken) {
      setIsLoggedIn(true);
      getUser(getToken);
    }
    console.log(isLoggedIn);
  }, [isLoggedIn]);
  const getUser = async (token) => {
    const decodedJWT = jwt_decode(token);
    console.log(decodedJWT.sub);
    setUsername(decodedJWT.sub);
    const response = await axios.post("http://localhost:8080/user/getUser", {
      username,
    });
    console.log(response.data, "hahahah");
    setUser(response.data);
    const rr = response.data.roles.map((e) => e.name);
    setRoles([...roles, ...rr]);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        user,
        setUser,
        roles,
        setRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
