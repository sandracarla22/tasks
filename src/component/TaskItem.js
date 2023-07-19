import React, { useState } from 'react';
import { Checkbox, Modal, Box, Button, TextField, Tooltip } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from '@mui/icons-material/Block';
import { db, auth } from "../config/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TaskItem = ({ arr }) => {
  const [description, setDescription] = useState(arr.item.description);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [user] = useAuthState(auth);

  const updateItem = async () => {
    if (window.confirm("Confirma alteração do item?")){
      const docRef = doc(db, "task", arr.id);
      const data = {
        description: description
      };
      updateDoc(docRef, data)
      .then(docRef => {
          console.log("Dados atualizados");
          handleClose(false)
      })
      .catch(error => {
          console.log(error);
      })
    }
  }

  const updateCompleted = async () => {
    const finalizado = arr.item.completed;
    let msg = "Deseja finalizar o item?"
    if(finalizado){
      msg = "Deseja reabrir o item?"
    }

    if (window.confirm(msg)){
      const docRef = doc(db, "task", arr.id);
      const data = {
        completed: !arr.item.completed
      };
      updateDoc(docRef, data)
      .then(docRef => {
          if(finalizado){
            console.log("Tarefa finalizada");
          }
          else {
            console.log("Tarefa reaberta");
          }
          handleClose(false)
      })
      .catch(error => {
          console.log(error);
      })
    }
  }

  const blockItem = async () => {
    const bloqueado = arr.item.blockedByCreater;
    let msg = "Deseja bloquear o item?"
    if(bloqueado){
      msg = "Deseja desbloquear o item?"
    }

    if (window.confirm(msg)){
      const docRef = doc(db, "task", arr.id);
      const data = {
        blockedByCreater: !arr.item.blockedByCreater
      };
      updateDoc(docRef, data)
      .then(docRef => {
          if(bloqueado){
            console.log("Tarefa bloqueada");
          }
          else {
            console.log("Tarefa desbloqueada");
          }
          handleClose(false)
      })
      .catch(error => {
          console.log(error);
      })
    }
  }

  const deleteItem = async () => {
    if (window.confirm("Confirma a exclusão do item?")){
      deleteDoc(doc(db, "task", arr.id));
    }
  }

  function ButtonDelete({blocked}) {
    if (blocked){
      return (  
          <Tooltip title="Tarefa bloqueada">
            <IconButton>
              <DeleteIcon color="disabled" style={{ opacity: 0.9 }}/>
            </IconButton>
          </Tooltip>
        );
    } 

    return (
        <Tooltip title="Excluir">
          <IconButton>
            <DeleteIcon style={{ opacity: 0.9 }} onClick={() => { deleteItem() }} />
          </IconButton>
        </Tooltip>
      );
  };

  function ButtonEdit({blocked}) {
    if (blocked){
      return (  
        <Tooltip title="Tarefa bloqueada">
          <IconButton>
            <EditIcon color="disabled" style={{ opacity: 0.9 }} />
          </IconButton>
        </Tooltip>
      )
    }

    return (
      <Tooltip title="Editar">
        <IconButton>
          <EditIcon style={{ opacity: 0.9 }} onClick={handleOpen} />
        </IconButton>
        </Tooltip>
      );
  };
 
  function ButtonBlocked({blocked, userId}) {

    if (userId === user.uid){
      if (blocked){
        return (
          <Tooltip title="Desbloquear">
            <IconButton>
              <BlockIcon style={{ opacity: 0.9 }} onClick={() => { blockItem() }}/>
            </IconButton>
          </Tooltip>
        );
      } else {
        return (
          <Tooltip title="Bloquear">
            <IconButton>
              <BlockIcon style={{ opacity: 0.9 }} onClick={() => { blockItem() }}/>
            </IconButton>
          </Tooltip>
        );
      }

    }
   
    return (  
      <Tooltip title="Bloqueio somente pelo usuário criador">
          <IconButton>
            <BlockIcon color="disabled" style={{ opacity: 0.9 }}/>
          </IconButton>
        </Tooltip>
      )
  };

  function DescriptionStatus({blocked, completed}){
    if (completed) {
      return "Status: Finalizado"
    } else if (blocked) {
      return "Status: Bloqueado"
    } else {
      return "Status: Aberto"
    }
  }

  function Description({completed, desc}){
    if (completed) {
      return <span className="task-completed">{desc}</span>
    } 
    
    return <span>{desc}</span>
  }

  function subtractHours(date, hours) {
    const dateCopy = new Date(date);
  
    dateCopy.setHours(dateCopy.getHours() - hours);
  
    return dateCopy;
  }

  function formatDate(date) 
  {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
  }

  function DateTimeDisplay(){
    let dateItem = new Date();
    if(arr.item.created){
      dateItem = subtractHours(new Date(new Date(1970, 0, 1).setSeconds(arr.item.created.seconds)), 3);
    }
    return (
        <span>{formatDate(dateItem)}</span>
    )
  };

  return (
    <div>
      <div className='row space__20'>
        <div className='col-5'>
          <Checkbox checked={arr.item.completed} onChange={() => updateCompleted()}/>
        </div>
        <div className='col-50 v_middle'>
          <div className='row text-left'>
            <div className='col-100'>
              <Description desc={arr.item.description} completed={arr.item.completed}></Description>
            </div>
          </div>
          <div className='row text-left'>
            <div className='col-100 subItem'>
              Criado por: {arr.item.user.name} em <DateTimeDisplay/>
            </div>
            <div className='col-100 subItem'>
              <DescriptionStatus blocked={arr.item.blockedByCreater} completed={arr.item.completed}></DescriptionStatus>
            </div>
          </div>
        </div>
        <div className='col-20'>
          <ButtonDelete blocked={arr.item.blockedByCreater}></ButtonDelete>
          <ButtonEdit blocked={arr.item.blockedByCreater}></ButtonEdit>
          <ButtonBlocked locked={arr.item.blockedByCreater} userId={arr.item.user.id}></ButtonBlocked>   
        </div>
      </div>

      <Modal open={open} onClose={handleClose} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description" >
        <Box sx={style}>
          <h2 className='mt0'>Alterar item</h2>
          <div className='space_top'>
            <TextField id="outlined-basic" label="Decrição" variant="outlined" style={{ width: "100%" }} size="small" value={description} onChange={e => setDescription(e.target.value)}/>
          </div>
          <div className='space_top'>
            <Button variant="contained" onClick={ () => updateItem() }>Salvar</Button>
            <Button style={{ marginLeft: "20px" }} variant="contained" onClick={handleClose }>Fechar</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export default TaskItem;