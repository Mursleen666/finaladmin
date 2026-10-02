import axios from 'axios'
import React, { useState } from 'react'
import { backEndUrl } from "../App"
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(backEndUrl + "/api/user/admin", { email, password })
            if (response.data.success) {
                const token = response.data.token || response.data.tokens
                if (token) {
                    setToken(token)
                    localStorage.setItem("token", token)
                    toast.success("Admin login successful")
                } else {
                    toast.error("Failed to retrieve admin token")
                }
            } else {
                toast.error(response.data.msg || "Invalid admin credentials")
            }
        } catch (error) {
            console.error("Login error:", error)
            toast.error(error.response?.data?.msg || "Unable to connect to backend server")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-slate-50'>
            <div className='bg-white shadow-md rounded-lg px-8 py-8 max-w-md w-full border'>
                <h1 className='text-2xl font-bold mb-2 text-gray-800 text-center'>Admin Panel</h1>
                <p className='text-xs text-gray-500 mb-6 text-center'>Manage your apparel & jewelry store catalog and orders</p>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-4'>
                        <p className='text-sm font-medium text-gray-700 mb-1.5'>Admin Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className='rounded w-full px-3 py-2 border border-gray-300 outline-none focus:border-black text-sm'
                            type="email"
                            placeholder='admin@example.com'
                            required
                        />
                    </div>
                    <div className='mb-5'>
                        <p className='text-sm font-medium text-gray-700 mb-1.5'>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className='rounded w-full px-3 py-2 border border-gray-300 outline-none focus:border-black text-sm'
                            type="password"
                            placeholder='Enter password'
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className='w-full py-2.5 px-4 rounded text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition text-sm font-medium'
                        type='submit'
                    >
                        {loading ? 'Signing in...' : 'Sign In as Admin'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
