import React, { useState } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import * as jwtDecode from "jwt-decode";


const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  const login = async (data) => {
    const result = await axios.post('http://localhost:4000/users/login',data)
    const token = result.data.token;
    localStorage.setItem("token",token)
    const userDataFromToken = jwtDecode(token);
    setState({...state,user:userDataFromToken})
    navigate('/')
  };

  const register =async (data) => {
    await axios.post('http://localhost:4000/users/register', data)
    navigate('/login')
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ ...state});
    navigate("/login");
  };
  

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
