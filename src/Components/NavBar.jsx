import { useState } from 'react'

import GoogleLog from './Login/GoogleLog'
import { useNavigate } from 'react-router-dom'

function NavBar() {

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  }

  const goToMapView = () => {
    navigate("/mapa");
  }

  return (
    <div className="flex items-center justify-end bg-blue-200 px-4 py-2 flex-wrap space-x-4 sm:space-x-10 lg:space-x-20">
      <div>
        <button 
          onClick={goToHome} 
          className="font-bold px-4 py-2 hover:shadow-md rounded-full hover:bg-white focus:outline-none transition duration-300">
          Inicio
        </button>
      </div>

      <div>
        <button 
          onClick={goToMapView} 
          className="font-bold px-4 py-2 hover:shadow-md rounded-full hover:bg-white focus:outline-none transition duration-300">
          Mapa
        </button>
      </div>
      <div>
        <GoogleLog />
      </div>
    </div>
  )
}

export default NavBar
