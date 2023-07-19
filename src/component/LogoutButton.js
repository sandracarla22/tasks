import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
    await signOut(auth)
      localStorage.clear();
      localStorage.setItem('UserId', "");
      navigate("/");
    } catch (err){
      console.error(err);
    }
  };
  
    return (
      <div className='logout'>
        <Button variant="outlined" color="error" onClick={ () => LogOut() }>Sair do sistema</Button>
      </div>
    );
};

export default LogoutButton;
