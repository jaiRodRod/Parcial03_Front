import { useState, useEffect } from 'react'
import axios from 'axios';
import SingleLog from './SingleLog';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

function LogViewer() { 

    const email = cookies.get("email");

    const [reload, setReload] = useState(false);
    const [data, setData] = useState(null);
    const [logs, setLogs] = useState(null);
    const [show, setShow] = useState(false);

    const urlPeticion = `http://localhost:8000/log/?filter_user=${email}&sort=true`

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
        <div className='flex-col'>
            {show ? (
                <div className='flex-col'>
                    <button onClick={toggleLogs}>Ocultar logs</button>
                    {logs}            
                </div>
            ) : (
                <button onClick={toggleLogs}>Mostrar logs</button>
            )}
        </div>
    )
}

export default LogViewer