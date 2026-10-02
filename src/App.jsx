import React, { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import Sidebar from './components/sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from "./pages/List"
import Order from './pages/Order'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import 'react-toastify/dist/ReactToastify.css';


export const backEndUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
export const Currency = "$"

const App = () => {
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      setToken(storedToken)
    } else {
      localStorage.removeItem("token")
      setToken("")
    }
  }, [])
  return (
    <div className='bg-slate-50 min-h-screen'>
      <ToastContainer />
      {token === "" ? <Login setToken={setToken} />
        :
        <>
          <NavBar setToken={setToken} />
          <hr />

          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/order' element={<Order token={token} />} />
              </Routes>
            </div>
          </div>
        </>

      }

    </div>
  )
}

export default App
