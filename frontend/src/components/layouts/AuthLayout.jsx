import React from 'react'

const AuthLayout = ({ children }) => {
  return (
   <div className='flex'>
    <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-2xl font-semibold text-black hover:font-bold">Task Manager</h2>
        {children}
    </div>
    <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-[url('/bg-img.jpg')] bg-cover bg-center bg-no-repeat"></div>
   </div>
  
  )
}

export default AuthLayout