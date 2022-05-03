import React from 'react';
import * as IoIcons from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';

export const SidebarDataUser =  [
    {
        title: 'Add User',
        path: '/add-user',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'View / Delete User',
        path: '/view-users',
        icon: <IoIcons.IoPersonRemove />,
        cName: 'menu-side-item'
    },
    {
        title: 'View Logs',
        path: '/',
        icon: <BsClockHistory />,
        cName: 'menu-side-item'
    },
];

export const SidebarDataStudent =  [
    {
        title: 'Add Student',
        path: '/add-student',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'Delete Student',
        path: '/',
        icon: <IoIcons.IoPersonRemove />,
        cName: 'menu-side-item'
    },
    {
        title: 'View Student',
        path: '/view-student',
        icon: <IoIcons.IoPerson />,
        cName: 'menu-side-item'
    }
];