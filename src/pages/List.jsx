import React, { useEffect, useState } from 'react'
import { backEndUrl, Currency } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const delData = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const deleter = await axios.post(
        backEndUrl + '/api/product/remove',
        { id },
        { headers: token ? { token } : {} }
      )
      if (deleter.data.success) {
        toast.success('Product deleted successfully!')
        fetchList()
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete product')
    }
  }

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backEndUrl + '/api/product/list')
      if (response.data && response.data.data) {
        setList(response.data.data)
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error fetching product list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg font-bold text-gray-800'>All Products ({list.length})</p>
        <button onClick={fetchList} className='text-xs px-3 py-1.5 border rounded hover:bg-gray-100'>
          ↻ Refresh
        </button>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1.5fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-semibold'>
          <b>Image</b>
          <b>Product Name</b>
          <b>Category / Sub</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {loading ? (
          <p className='text-gray-400 py-8 text-center'>Loading catalog...</p>
        ) : list.length === 0 ? (
          <p className='text-gray-400 py-8 text-center'>No products added yet.</p>
        ) : (
          list.map((item, index) => {
            const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image
            return (
              <div
                className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1.5fr_1fr_1fr] items-center gap-3 py-2 px-3 border text-sm hover:bg-slate-50 bg-white rounded'
                key={index}
              >
                <img className='w-14 h-14 object-cover rounded border' src={imgSrc || assets.upload_area} alt='' />
                <div>
                  <p className='font-medium text-gray-900'>{item.name}</p>
                  {item.bestSeller && (
                    <span className='text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded'>
                      Best Seller
                    </span>
                  )}
                </div>
                <div>
                  <span className='font-medium text-gray-800'>{item.category}</span>
                  {item.subCategory && (
                    <span className='text-xs text-gray-500 block'>{item.subCategory}</span>
                  )}
                </div>
                <p className='font-bold text-gray-900'>{Currency}{item.price}</p>

                <div className='text-center'>
                  <button
                    onClick={() => delData(item._id)}
                    className='text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition'
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

export default List
