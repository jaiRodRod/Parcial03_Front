import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useSession } from '../SessionProvider'; // Usamos el contexto
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import url from '../../url.json';

function GoogleLog() {

    const { funLogin, funLogout } = useSession();

    let now = new Date();
    
    const [user, setUser] = useState(null);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => { setUser(codeResponse); seslogin(); },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        funLogin(res.data.email);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user,login ]
    );
    
    useEffect (
        () => {
            if (profile) {
                console.log(profile);
                cookies.set('email', profile.email, { path: '/' });
                cookies.set('access_token', user.access_token, {path:'/'})
            }
        },
        [profile]
    );

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        cookies.remove('email', { path: '/' });
        cookies.remove('access_token', {path:'/'});
        funLogout();
    };

    /*
    const postLog = async() => {
        const payload = {
            timestamp: new Date(now.getTime()),
            email: profile.email,
            caducidad: new Date(now.getTime() + user.expires_in * 1000),
            token: user.access_token,
        };
    
        try {
            const response = await axios.post(`${url.active_urlBase}/log/`, payload, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            console.error("Error posting data:", error);
          } finally {
            cookies.set('email', profile.email, { path: '/' });
          }
    }
    */

    return (
        <div>
            {profile ? (
                <div className='flex-row font-bold px-4 py-2 rounded-lg bg-white'>
                    <div className='flex justify-center'>
                        <img src={profile.picture} alt="user image" className='rounded-full w-8 h-8 object-cover font-normal' />
                    </div>
                    <div className='flex-col flex-wrap font-normal'>
                        <p>Nombre: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                    </div>
                    <div className='flex justify-center'>
                        <button onClick={logOut} 
                            className='px-1 hover:shadow-md rounded-md hover:bg-gray-100 focus:outline-none transition duration-300'
                        >Salir</button>
                    </div>
                </div>
                ) : (
                <div>
                    <button onClick={login}
                        className='font-bold px-4 py-2 hover:shadow-md rounded-full hover:bg-white focus:outline-none transition duration-300'
                    >Login con Google</button>
                </div>
                )
            }
        </div>
    )
}

export default GoogleLog