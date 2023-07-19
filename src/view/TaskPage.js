import React, { useState, useEffect } from 'react';
import { TextField, Button, Select } from '@mui/material';
import TaskItem from '../component/TaskItem';
import UserList from '../component/UsersList';
import { db, auth } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import '../App.css';
import { useAuthState } from "react-firebase-hooks/auth";

const q = query(collection(db, 'task'), orderBy('created', 'desc'));

function Task() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);

    useEffect(() => {
        onSnapshot(q, (snapshot) => {
            setTasks(snapshot.docs.map(doc => ({
                id: doc.id,
                item: doc.data()
            })))
        })
        serviceOnLine();
        getUsers();
    }, [input]);

    const addTask = (e) => {
        e.preventDefault();
        addDoc(collection(db, 'task'), {
            description: input,
            created: serverTimestamp(),
            blockedByCreater: false,
            completed: false,
            user: {
                id: user?.uid,
                name: user?.displayName
              },
        })
        setInput('')
    };

    const serviceOnLine = () => {
        setInterval(() => {
            localStorage.getItem('UserId');
            const docRef = doc(db, "user", localStorage.getItem('UserId'));
            const data = {
            lastLogin: serverTimestamp()
            };
            updateDoc(docRef, data).then(docRef => {
                console.log("Dados atualizados");
            }).catch(error => {
                console.log("erro", error);
            })
        }, 60000);
    }

    const getUsers = () => {
        const q2 = query(collection(db, 'user'), orderBy('name', 'asc'));
        onSnapshot(q2, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc._document.data.value.mapValue.fields.name.stringValue,
                email: doc._document.data.value.mapValue.fields.email.stringValue,
                online: Math.floor((Math.abs(new Date(doc._document.data.value.mapValue.fields.lastLogin.timestampValue) - new Date())/1000)/60) > 2 ? 0 : 1
            })))
        })
    }

    const [selected, setSelected] = useState("all");

    const handleChange = event => {
        console.log(event.target.value);
        setSelected(event.target.value);
    };

    return (
        <div className="App space__40">
            <h2>Lista de Tarefas</h2>
            <form className='space__20'>
                <TextField id="outlined-basic" label="Decrição" variant="outlined" style={{ margin: "0px 5px", width: "500px" }} size="small" value={input} onChange={e => setInput(e.target.value)} />
                <Button variant="contained" color="primary" onClick={addTask}  >Adicionar</Button>
            </form>
            <div className='space__20'>
                <hr />   
            </div>
            <div className='row'>
                <div className='col-60'>
                    <div className='text-center'>
                        <h4>Lista de tarefas</h4>
                    </div>
                    <div className='row col-40 text-center'>
                            <span>Status</span>
                            <span>&nbsp;&nbsp;</span>
                            <Select
                                native
                                value={selected}
                                onChange={handleChange}
                                autoWidth
                            >
                                <option value="all">Todos</option>
                                <option value="1">Concluídos</option>
                                <option value="0">Abertos</option>
                            </Select>
                    </div>
                    {tasks.filter(x => ( selected == "all" ? x.item : x.item.completed == selected )).map(item => <TaskItem key={item.id} arr={item} />)}
                </div>
                <div className='col-20 boder__left v_top'>
                    <div className='text-center'>
                        <h4> Lista de Usuários (online)</h4>
                    </div>
                    
                    {users.filter(x => x.online == 1).map(item => <UserList key={item.id} arr={item} />)}

                    <div className='text-center'>
                        <h4> Lista de Usuários (offline)</h4>
                    </div>
                    
                    {users.filter(x => x.online == 0).map(item => <UserList key={item.id} arr={item} />)}
                </div>
            </div>
        </div>
    );
}
export default Task;
