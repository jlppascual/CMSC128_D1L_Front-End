import React from 'react';
import * as IoIcons from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { HiDocument } from 'react-icons/hi';

export const SidebarDataUser =  [
    {
        title: 'Add User',
        path: '/student/new',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'View / Delete User',
        path: '/users',
        icon: <IoIcons.IoPersonRemove />,
        cName: 'menu-side-item'
    },
    {
        title: 'View Logs',
        path: '/logs',
        icon: <BsClockHistory />,
        cName: 'menu-side-item'
    },
];

export const SidebarDataStudent =  [
    {
        title: 'Add Student',
        path: '/student/new',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'View Student',
        path: '/students',
        icon: <IoIcons.IoPerson />,
        cName: 'menu-side-item'
    },
    {
        title: 'Summary',
        path: '/summary',
        icon: <HiDocument />,
        cName: 'menu-side-item'
    },
];