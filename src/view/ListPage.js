import React from 'react';
import LogoutButton from '../component/LogoutButton';
import Task from './TaskPage';

const ListPage = () => {
    return (
        <div className='background'>
            <Task />
            <LogoutButton/>
        </div>
    );
};

export default ListPage;
