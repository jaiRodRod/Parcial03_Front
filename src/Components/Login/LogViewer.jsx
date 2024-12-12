import { useState, useEffect } from 'react'
import axios from 'axios';
import SingleLog from './SingleLog';

import Cookies from 'universal-cookie';
import url from '../../url.json';

const cookies = new Cookies();

function LogViewer() { 

    const email = cookies.get("email");

    const [reload, setReload] = useState(false);
    const [data, setData] = useState(null);
    const [logs, setLogs] = useState(null);
    const [show, setShow] = useState(false);

    const urlPeticion = `${url.active_urlBase}/log/?filter_user=${email}&sort=true`

    const toggleLogs = () => {
        setReload(!reload)
        setShow(!show);
    }

    useEffect(() => {
        const fetchData = async() => {
            try {
                if(urlPeticion) {
                    const response = await axios.get(urlPeticion);
                    setData(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [reload]);

    useEffect(() => {
        if(data !== null) {
            const logsComponented = data.map((log) => <SingleLog key={log._id} data={log}/>);
            setLogs(logsComponented);
        }
    }, [data]);

    return (
        <div className='flex justify-center'>
            {show ? (
                <div className='flex-col justify-center space-y-2'>
                    <div className='flex justify-center'>
                        <button onClick={toggleLogs}
                            className='font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-blue-200 focus:outline-none transition duration-300'
                        >Ocultar mis logs</button>
                    </div>
                    {logs}            
                </div>
            ) : (
                <button onClick={toggleLogs}
                    className='font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-blue-200 focus:outline-none transition duration-300'
                >Mostrar mis logs</button>
            )}
        </div>
    )
}

export default LogViewer