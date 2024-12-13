import { useState } from 'react'

import GoogleLog from './Login/GoogleLog'
import { useSession } from '../Components/SessionProvider.jsx';
import { useNavigate } from 'react-router-dom'

function NavBar() {

  const { isLoggedIn } = useSession();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  }

  const goToVisitMap = () => {
    navigate("/visitMap");
  }

  return (
    <div className="flex items-center justify-end bg-blue-200 px-4 py-2 flex-wrap space-x-4 sm:space-x-10 lg:space-x-20">
      {isLoggedIn && (
        <>
          <div>
            <button 
              onClick={goToHome} 
              className="font-bold px-4 py-2 hover:shadow-md rounded-full hover:bg-white focus:outline-none transition duration-300">
              Mi Mapa
            </button>
          </div>

          <div>
            <button 
              onClick={goToVisitMap} 
              className="font-bold px-4 py-2 hover:shadow-md rounded-full hover:bg-white focus:outline-none transition duration-300">
              Buscar mapa
            </button>
          </div>
        </>
      )}
      <div>
        <GoogleLog />
      </div>
    </div>
  )
}

export default NavBar
