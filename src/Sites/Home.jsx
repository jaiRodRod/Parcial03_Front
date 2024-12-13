import React, { useState, useRef } from 'react';
import NavBar from '../Components/NavBar';
import LogViewer from '../Components/Login/LogViewer';

import MapComp from '../Components/Maps/MapComp.jsx';

import { useSession } from '../Components/SessionProvider.jsx';
import { useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';
const cookies = new Cookies();


function Home() {

    const { isLoggedIn } = useSession();
    const navigate = useNavigate();

    const goToCreate = () => {
        navigate("/crearLocalizacion");
    }

    const email = cookies.get("email");

    return (
        <div className='flex-row'>
            <div className='flex justify-center items-center my-4 font-bold w-full flex-wrap'>
                <p>Bienvenido a MiMapa!</p>
            </div>
            {!isLoggedIn ? (
                <div className='flex justify-center items-center my-4 w-full flex-wrap'>
                    <p>Si desea hacer uso de la web debe iniciar sesion (en la barra superior)</p>
                </div>
            ) : (
                <div>
                    <div className='flex justify-center pb-4'>
                        <button onClick={goToCreate}
                            className='font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-green-200 focus:outline-none transition duration-300'
                        >Añadir un sitio a mi mapa personal</button>
                    </div>
                    <LogViewer/>
                    <MapComp user_email={email}/>
                </div> 
            )}
        </div>
    )
}

export default Home