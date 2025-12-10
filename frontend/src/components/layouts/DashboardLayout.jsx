import React, { useContext } from 'react'
import { UserContext } from '../../context/useContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'


const DashboardLayout = ({ children,activeMenu }) => {

    const {user} = useContext(UserContext)

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar activeMenu={activeMenu}/>
        
        <div className="flex flex-1">
            {user && (
                <>
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <SideMenu activeMenu={activeMenu}/>
                    </div>
                    <div className="flex-1 overflow-auto p-5 bg-gray-50">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
  )
}

export default DashboardLayout