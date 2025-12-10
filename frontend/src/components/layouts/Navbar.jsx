import React, { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import SideMenu from './SideMenu'

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 ">
        <button onClick={() => setOpenSideMenu(!openSideMenu)} className="block lg:hidden text-black">
            {
                openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )
            }
        </button>
        <h2 className="text-lg font-semibold text-black">Task Manager</h2>

        {openSideMenu && 
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpenSideMenu(false)}>
                <div className="fixed top-0 left-0 h-full w-64 bg-white z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end p-4">
                        <button onClick={() => setOpenSideMenu(false)} className="text-gray-500 hover:text-gray-700">
                            <HiOutlineX className="text-2xl" />
                        </button>
                    </div>
                    <SideMenu activeMenu={activeMenu} />
                </div>
            </div>
        }
    </div>
  )
}

export default Navbar