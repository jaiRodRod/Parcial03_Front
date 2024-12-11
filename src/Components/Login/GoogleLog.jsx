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
                postLog();
            }
        },
        [profile]
    );

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        cookies.remove('email', { path: '/' });
        funLogout();
    };

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

    return (
        <div>
            {profile ? (
                <div>
                    {/*<img src={profile.picture} alt="user image" />  SOLO POSIBLE BAJO HTTPS*/}
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <button onClick={logOut}>Salir</button>
                </div>
                ) : (
                <div className='my-2'>
                    <button onClick={login}>Login con Google</button>
                </div>
                )
            }
        </div>
    )
}

export default GoogleLog