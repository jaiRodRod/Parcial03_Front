import React, { useState, useRef } from 'react';
import NavBar from '../Components/NavBar';
import LogViewer from '../Components/Login/LogViewer';

import MapComp from '../Components/Maps/MapComp.jsx';
import GetItemsFromGeocode from '../Components/GetItemsFromGeocode.jsx';

import { useSession } from '../Components/SessionProvider.jsx';
import { useNavigate } from 'react-router-dom';


function Home() {

    const { isLoggedIn } = useSession();
    const navigate = useNavigate();

    const goToCreate = () => {
        navigate("/crearItem");
    }

    return (
        <div className='bg-white my-4'>
            {isLoggedIn && (
                <div className='space-y-4'>
                    <LogViewer/>
                    <div className='flex justify-center'>
                        <button onClick={goToCreate}
                            className='font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-green-200 focus:outline-none transition duration-300'
                        >Crear un item</button>
                    </div>
                </div>
            )}
            <GetItemsFromGeocode/>
        </div>
    )
}

export default Home