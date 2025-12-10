import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-3xl">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Task Manager</h2>
            <p className="mt-2 text-sm text-gray-600">
              Organize your work and life, finally.
            </p>
          </div>
          
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center px-8">
            <h3 className="text-4xl font-bold text-white mb-4">Welcome to Task Manager</h3>
            <p className="text-xl text-blue-100 max-w-lg mx-auto">
              Streamline your workflow, boost productivity, and achieve more with our intuitive task management platform.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout