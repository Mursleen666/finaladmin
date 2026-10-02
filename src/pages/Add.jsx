import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backEndUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestSeller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)

  const handleCategoryChange = (e) => {
    const val = e.target.value
    setCategory(val)
    if (val === 'Jewelry') {
      setSubCategory('Necklace')
      setSizes(['One Size'])
    } else {
      setSubCategory('Topwear')
      setSizes(['M'])
    }
  }

  const myForm = async (e) => {
    e.preventDefault()
    if (!image1 && !image2 && !image3 && !image4) {
      toast.error('Please upload at least one product image')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestSeller', bestSeller)
      formData.append('sizes', JSON.stringify(sizes.length > 0 ? sizes : ['One Size']))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(
        backEndUrl + '/api/product/add',
        formData,
        { headers: token ? { token } : {} }
      )

      if (response.data.success) {
        toast.success('Product added successfully!')
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setSizes([])
      } else {
        toast.error(response.data.msg || 'Failed to add product')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error adding product')
    } finally {
      setLoading(false)
    }
  }

  const toggleSize = (sizeVal) => {
    setSizes(prev =>
      prev.includes(sizeVal)
        ? prev.filter(item => item !== sizeVal)
        : [...prev, sizeVal]
    )
  }

  return (
    <form onSubmit={myForm} className='flex flex-col w-full items-start gap-6 max-w-2xl'>
      <h3 className='text-lg font-bold text-gray-800'>Add New Product (Clothing & Jewelry)</h3>

      <div>
        <p className='mb-2 text-sm font-medium'>Upload Images (Max 4)</p>
        <div className='flex gap-3 flex-wrap'>
          <label htmlFor='image1'>
            <img className='w-24 h-24 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt='' />
            <input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden />
          </label>
          <label htmlFor='image2'>
            <img className='w-24 h-24 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt='' />
            <input onChange={(e) => setImage2(e.target.files[0])} type='file' id='image2' hidden />
          </label>
          <label htmlFor='image3'>
            <img className='w-24 h-24 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt='' />
            <input onChange={(e) => setImage3(e.target.files[0])} type='file' id='image3' hidden />
          </label>
          <label htmlFor='image4'>
            <img className='w-24 h-24 object-cover border-2 border-dashed border-gray-300 rounded cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt='' />
            <input onChange={(e) => setImage4(e.target.files[0])} type='file' id='image4' hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2 text-sm font-medium'>Product Name</p>
        <input
          className='w-full py-2 px-3 border rounded text-sm focus:outline-black'
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder='e.g. Classic Silk Kurti / 18K Gold Plated Necklace'
          type='text'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2 text-sm font-medium'>Product Description</p>
        <textarea
          rows={4}
          className='w-full py-2 px-3 border rounded text-sm focus:outline-black'
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder='Describe material, style, occasion, craftsmanship, and fit...'
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div className='flex-1'>
          <p className='mb-2 text-sm font-medium'>Product Category</p>
          <select
            className='w-full px-3 py-2 border rounded text-sm focus:outline-black'
            value={category}
            onChange={handleCategoryChange}
          >
            <option value='Men'>Men's Clothing</option>
            <option value='Women'>Women's Clothing</option>
            <option value='Kids'>Kids' Clothing</option>
            <option value='Jewelry'>Jewelry & Accessories</option>
          </select>
        </div>

        <div className='flex-1'>
          <p className='mb-2 text-sm font-medium'>Sub Category</p>
          <select
            className='w-full px-3 py-2 border rounded text-sm focus:outline-black'
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            {category === 'Jewelry' ? (
              <>
                <option value='Necklace'>Necklace / Pendant</option>
                <option value='Ring'>Ring / Band</option>
                <option value='Earrings'>Earrings / Studs</option>
                <option value='Bracelet'>Bracelet / Bangle</option>
              </>
            ) : (
              <>
                <option value='Topwear'>Topwear</option>
                <option value='Bottomwear'>Bottomwear</option>
                <option value='Winterwear'>Winterwear</option>
              </>
            )}
          </select>
        </div>

        <div className='w-full sm:w-32'>
          <p className='mb-2 text-sm font-medium'>Price ($)</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full px-3 py-2 border rounded text-sm focus:outline-black'
            type='number'
            placeholder='99'
            min='1'
            required
          />
        </div>
      </div>

      <div>
        <p className='mb-2 text-sm font-medium'>
          {category === 'Jewelry' ? 'Sizes / Fitting Options' : 'Product Sizes'}
        </p>
        <div className='flex gap-2 flex-wrap'>
          {category === 'Jewelry' ? (
            ['One Size', 'Adjustable', 'Small', 'Medium', 'Large'].map((s) => (
              <div key={s} onClick={() => toggleSize(s)}>
                <p className={`${sizes.includes(s) ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1 text-xs font-semibold rounded cursor-pointer border`}>
                  {s}
                </p>
              </div>
            ))
          ) : (
            ['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <div key={s} onClick={() => toggleSize(s)}>
                <p className={`${sizes.includes(s) ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1 text-xs font-semibold rounded cursor-pointer border`}>
                  {s}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className='flex items-center gap-2 mt-1'>
        <input
          onChange={() => setBestSeller(prev => !prev)}
          checked={bestSeller}
          id='bestSeller'
          type='checkbox'
          className='w-4 h-4 accent-black'
        />
        <label className='cursor-pointer text-sm font-medium text-gray-700' htmlFor='bestSeller'>
          Feature in Best Sellers Section
        </label>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='px-8 py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 disabled:opacity-50 transition'
      >
        {loading ? 'Adding Product...' : 'ADD PRODUCT'}
      </button>
    </form>
  )
}

export default Add
