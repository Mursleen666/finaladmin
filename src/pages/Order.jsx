import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backEndUrl, Currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Order = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await axios.post(
        backEndUrl + '/api/order/list',
        {},
        { headers: { token } }
      )
      if (res.data.success) {
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : [])
      } else {
        toast.error(res.data.msg || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching admin orders:', error)
      const errorMsg = error.response?.data?.msg || (error.code === 'ERR_NETWORK' ? 'Backend server (port 8000) is unreachable' : error.message)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const res = await axios.post(
        backEndUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(`Order status updated to: ${newStatus}`)
        await fetchAllOrders()
      } else {
        toast.error(res.data.msg || 'Update failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update order status')
    }
  }

  const handlePaymentToggle = async (orderId, currentPayment) => {
    try {
      const res = await axios.post(
        backEndUrl + '/api/order/status',
        { orderId, payment: !currentPayment },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(`Payment status marked as: ${!currentPayment ? 'Paid' : 'Unpaid'}`)
        await fetchAllOrders()
      } else {
        toast.error(res.data.msg || 'Payment toggle failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to update payment status')
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  // Order Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + (o.amount || 0) : sum), 0)
  const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-xl font-bold text-gray-800'>Customer Orders Management</h3>
        <button
          onClick={fetchAllOrders}
          className='px-3 py-1.5 border bg-white rounded text-sm hover:bg-gray-50 flex items-center gap-1'
        >
          ↻ Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-4 border rounded shadow-sm'>
          <p className='text-xs text-gray-500 uppercase font-semibold'>Total Orders</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{orders.length}</p>
        </div>
        <div className='bg-white p-4 border rounded shadow-sm'>
          <p className='text-xs text-gray-500 uppercase font-semibold'>Active / In Progress</p>
          <p className='text-2xl font-bold text-amber-600 mt-1'>{pendingOrders}</p>
        </div>
        <div className='bg-white p-4 border rounded shadow-sm'>
          <p className='text-xs text-gray-500 uppercase font-semibold'>Delivered</p>
          <p className='text-2xl font-bold text-green-600 mt-1'>{deliveredOrders}</p>
        </div>
        <div className='bg-white p-4 border rounded shadow-sm'>
          <p className='text-xs text-gray-500 uppercase font-semibold'>Estimated Revenue</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{Currency}{totalRevenue}</p>
        </div>
      </div>

      {loading ? (
        <p className='text-gray-400 py-10 text-center'>Loading customer orders...</p>
      ) : orders.length === 0 ? (
        <div className='text-center py-16 bg-white border rounded'>
          <p className='text-gray-500'>No orders placed by customers yet.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order, index) => {
            const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div
                key={order._id || index}
                className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1.5fr_1fr_1fr] gap-4 items-start border-2 border-gray-200 p-5 md:p-6 rounded-lg bg-white shadow-sm text-xs sm:text-sm text-gray-700'
              >
                {/* Parcel Icon */}
                <img className='w-12 mx-auto sm:mx-0' src={assets.parcel_icon} alt='Parcel' />

                {/* Items & Customer address */}
                <div>
                  <div className='font-medium text-gray-900 mb-2'>
                    {order.items?.map((item, idx) => (
                      <p key={idx} className='py-0.5'>
                        {item.name} x {item.quantity} {item.size ? `(${item.size})` : ''}
                      </p>
                    ))}
                  </div>

                  <p className='font-semibold text-gray-900 mt-3'>
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className='text-gray-500'>{order.address?.street},</p>
                  <p className='text-gray-500'>
                    {order.address?.city}, {order.address?.state}, {order.address?.country}, {order.address?.zipcode}
                  </p>
                  <p className='text-gray-600 mt-1 font-medium'>📞 {order.address?.phone}</p>
                  {order.address?.email && (
                    <p className='text-gray-400 text-xs'>✉ {order.address?.email}</p>
                  )}
                </div>

                {/* Order Meta */}
                <div>
                  <p className='text-sm sm:text-[15px] font-semibold text-gray-800'>
                    Items: {order.items?.length}
                  </p>
                  <p className='mt-2'>
                    Method: <span className='font-semibold text-gray-900'>{order.paymentMethod}</span>
                  </p>
                  <p className='mt-1 flex items-center gap-1.5'>
                    Payment:
                    <span
                      onClick={() => handlePaymentToggle(order._id, order.payment)}
                      className={`cursor-pointer px-2 py-0.5 rounded text-xs font-semibold ${
                        order.payment ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.payment ? 'Paid (Click to toggle)' : 'Unpaid (Due at COD)'}
                    </span>
                  </p>
                  <p className='text-gray-400 text-xs mt-2'>Date: {formattedDate}</p>
                </div>

                {/* Amount */}
                <div className='font-bold text-lg text-gray-900 sm:text-right lg:text-left'>
                  {Currency}{order.amount}
                </div>

                {/* Status Dropdown */}
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e, order._id)}
                    className='w-full p-2 font-semibold border rounded bg-gray-50 focus:outline-black'
                  >
                    <option value='Order Placed'>Order Placed</option>
                    <option value='Packing'>Packing</option>
                    <option value='Shipped'>Shipped</option>
                    <option value='Out for delivery'>Out for delivery</option>
                    <option value='Delivered'>Delivered</option>
                    <option value='Cancelled'>Cancelled</option>
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Order
