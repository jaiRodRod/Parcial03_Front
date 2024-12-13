import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import LogViewer from '../Components/Login/LogViewer';
import axios from 'axios';
import url from '../url.json'

import MapComp from '../Components/Maps/MapComp.jsx';

import { useSession } from '../Components/SessionProvider.jsx';
import { useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';
const cookies = new Cookies();


function VisitMap() {

    const { isLoggedIn } = useSession();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null);
    const [user2Query, setUser2Query] = useState(null);

    let now = new Date();

    const goToHome = () => {
        navigate("/");
    }

    useEffect(() => {
        if (!isLoggedIn){
            goToHome();
        }
    },[isLoggedIn])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUser2Query(null);
        setTimeout(() => {
            setUser2Query(userEmail);
        }, 0)
    }

    const actualEmail = cookies.get("email");
    const access_token = cookies.get("access_token");


    useEffect(() => {
        if(user2Query) {
            saveLog();
        }
    }, [user2Query]);

    const saveLog = async() => {
        const payload = {
            timestamp: new Date(now.getTime()),
            email: actualEmail,
            usuario_visitado: user2Query,
            token: access_token,
        };
        console.log(payload);
        try {
            const response = await axios.post(`${url.active_urlBase}/log/`, payload, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
        } catch (error) {
            console.error("Error posting data:", error);
        }
    }

    return (
        <div className='flex-col'>
            <div className='flex justify-center items-center my-4 font-bold w-full flex-wrap'>
                <p>Bienvenido al buscador de mapas.</p>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-wrap justify-center w-full lg:w-[50%]">
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <label htmlFor="userEmail" className="flex-shrink-0">Email del usuario:</label>
                        <input
                            type="text"
                            id="userEmail"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Introduce una dirección"
                            required
                            className="appearance-none caret-gray-800 border-gray-300 border-b-2 focus:outline-none w-full sm:flex-grow px-2 py-1"
                        />
                        <button
                            type="submit"
                            className="font-bold bg-gray-100 px-4 py-1 rounded-full hover:bg-blue-200 focus:outline-none transition duration-300 flex-shrink-0"
                        >
                            Buscar
                        </button>
                    </form>
                </div>
            </div>
            {!user2Query ? (
                <div className='flex justify-center items-center my-4 w-full flex-wrap'>
                    <p>Si desea hacer una visita busque por el email del usuario</p>
                </div>
            ) : (
                <div>
                    <MapComp user_email={user2Query}/>
                </div> 
            )}
        </div>
    )
}

export default VisitMap