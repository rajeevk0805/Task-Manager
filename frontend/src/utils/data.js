import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut
} from 'react-icons/lu'

export const SIDE_MENU_DATA = [
    {
        id:"01",
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: LuLayoutDashboard
    },
    
    {
        id:"02",
        name: 'Manage Tasks',
        path: '/admin/tasks',
        icon: LuClipboardCheck 
    },
    {
        id:"03",
        name: 'Create Task',
        path: '/admin/create-task',
        icon: LuSquarePlus 
    },
    {
        id:"04",
        name: 'Team Members',
        path: '/admin/users',
        icon: LuUsers 
    },
    {
        id:"05",
        name: 'Logout',
        path: '/logout',
        icon: LuLogOut 
    }
]

export const SIDE_MENU_USER_DATA = [
    {
        id:"01",
        name: 'Dashboard',
        path: '/user/dashboard',
        icon: LuLayoutDashboard 
    },
    {
        id:"02",
        name: 'My Tasks',
        path: '/user/tasks',
        icon: LuClipboardCheck 
    },
    {
        id:"05",
        name: 'Logout',
        path: '/logout',
        icon: LuLogOut 
    },
]

export const PRIORITY_DATA=[
    {label:"Low", value:"Low"},
    {label:"Medium", value:"Medium"},
    {label:"High", value:"High"}
]

export const STATUS_DATA=[
    {label:"Pending", value:"Pending"},
    {label:"In Progress", value:"In Progress"},
    {label:"Completed", value:"Completed"}
]