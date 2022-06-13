/*
    Source code description: this source code contains the data of the options that will be mapped
    to the Menu sidebar containing the title option, the path where the option will redirect to,
    the icon, and cName for css. 
*/

// import necessary packages
import React from 'react';
import * as IoIcons from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { HiDocument } from 'react-icons/hi';

// an array of maps used for storing the data that will be mapped for the user operations in the sidebar
export const SidebarDataUser =  [
    {
        title: 'Create User',
        path: '/users/new',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'Users',
        path: '/users',
        icon: <IoIcons.IoPerson />,
        cName: 'menu-side-item'
    },
    {
        title: 'Logs',
        path: '/logs',
        icon: <BsClockHistory />,
        cName: 'menu-side-item'
    },
];


// an array of maps used for storing the data that will be mapped for the student operations in the sidebar
export const SidebarDataStudent =  [
    {
        title: 'Create Student',
        path: '/student/new',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'Students',
        path: '/students',
        icon: <IoIcons.IoPerson />,
        cName: 'menu-side-item'
    },
    {
        title: 'Student Summary',
        path: '/summary',
        icon: <HiDocument />,
        cName: 'menu-side-item'
    },
];