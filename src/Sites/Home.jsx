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
        <div className='bg-blue-100'>
            {isLoggedIn && (
                <div>
                    <LogViewer/>
                    <button onClick={goToCreate}>Crear un item</button>
                </div>
            )}
            <GetItemsFromGeocode/>
            <MapComp/>
        </div>
    )
}

export default Home