import React, {useAuthState} from 'react'; 
import { db, auth, googleProvider } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { Button } from '@mui/material';

const LoginButton = () => {
  const navigate = useNavigate()

  const SignInWithGoogle = async () => {
    
    await signInWithPopup(auth,googleProvider).then(async (result) => {
      await registerLogin(result.user)
      navigate('/ListPage')
    })
    .catch(() => {
      window.alert('Erro ao realizar o login')
    })
  };

  const registerLogin = async (user) => {
    try{
      let idUser = "";
      const userRef = collection(db, "user");
      const q = query(userRef, where("email", "==", user.email)); // user.email
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => { 
        idUser = doc.id;
        localStorage.setItem('UserId', idUser);
      });

      if(idUser != ""){
        const docRef = doc(db, "user", idUser);
        const data = {
          lastLogin: serverTimestamp()
        };
        updateDoc(docRef, data).then(docRef => {
            console.log("Dados atualizados");
        }).catch(error => {
            console.log("erro", error);
        })
      }
      else {
        const result = await addDoc(collection(db, 'user'), {
          lastLogin: serverTimestamp(),
          name: user.displayName,
          email: user.email
        })
      }
      
    } catch (err) {
      window.alert('Erro ao realizar o login')
      console.log(err)
    }
  }

  return (
    <Button variant="contained" color="primary" onClick={SignInWithGoogle}>Login com Google</Button>
  );
};



export default LoginButton;