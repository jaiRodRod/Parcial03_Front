import { useState } from 'react'

import GoogleLog from './Login/GoogleLog'
import { useNavigate } from 'react-router-dom'

function NavBar() {

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  }

  return (
    <div className='flex-row flex-wrap bg-gray-200'>
      <div>
        <button onClick={goToHome}>Inicio</button>
      </div>
      <div className='flex justify-end'>
        <GoogleLog/>
      </div>
    </div>
  )
}

export default NavBar
