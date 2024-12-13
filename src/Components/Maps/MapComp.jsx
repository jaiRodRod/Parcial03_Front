import { useEffect, useState } from "react";
import CustomMap from "./CustomMap";
import axios from "axios";

import url from '../../url.json'

function MapComp({user_email}) {

    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [newMarker, setNewMarker] = useState(null);
    const [wiper, setWiper] = useState(false);
    const [dots, setDots] = useState(1);
    const [endAnimation, setEndAnimation] = useState(true);

    const getUserLocation = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setMarkers([
                        {
                            key: "Me",
                            position: [latitude,longitude],
                            children: "Mi localizacion actual",
                            color: "me"
                        },
                    ]);
                    setLocation({latitude, longitude});
                    //fetchMarkersFromAPI();
                },
                (error) => {
                    console.error("Error al obtener la localizacion:", error);
                    const latitude = 51.507471363524196;
                    const longitude = -0.1354435485616046;
                    setLocation({latitude, longitude});
                }
            );
        }
        else {
            console.error("Localizacion no soportada por el navegador");
        }
    };

    /*
    const updateUserLocation = () => {
        setMarkers([
            {
                key: "Me",
                position: [newMarker[0],newMarker[1]],
                children: "Mi localizacion actual",
                color: "me"
            },
        ]);
        const latitude = newMarker[0];
        const longitude = newMarker[1];
        setLocation({latitude, longitude});
        fetchMarkersFromAPI();
        setWiper(!wiper);
        //map.removeLayer(markerRef.current);
    }
    */

    const fetchMarkersFromAPI = async () => {
        if(location) {
            console.log(location);
            try {
                const urlPeticion = `${url.active_urlBase}/localizacion/?user_email=${user_email}`
                const response = await axios.get(urlPeticion);
                console.log(response);
                const eventMarkers = response.data.map((event) => ({
                    key: event._id,
                    position: [event.lat, event.lon],
                    children: {
                        nombre: event.nombre,
                        email: event.email,
                        url: event.url,
                    },
                    color: "blue", // Puedes ajustar el color según sea necesario
                }));
                setMarkers((prev) => [...prev, ...eventMarkers]);
            } catch (error) {
                console.error("Error al obtener eventos desde la API:", error);
            }
        }
    };

    useEffect(() => {
        getUserLocation();
        fetchMarkersFromAPI();
    }, []);

    useEffect(() => {
        fetchMarkersFromAPI();
    }, [location])

    useEffect(() => {
        if(!location && endAnimation) {
            setEndAnimation(false)
            setDots(1);
            setTimeout(() => {
                setDots((prev) => prev + 1);
            }, 500);
            setTimeout(() => {
                setDots((prev) => prev + 1);
            }, 1000);
            setTimeout(() => {
                setEndAnimation(true);
            }, 1500)
        }
    },[endAnimation])

    //Por defecto toma la localizacion, si se desea cambiar se hace click y con un boton cambiará mostrando los eventos cercanos, añadir el geocoding en la creacion

    return (
        <div className="flex-row flex-wrap items-center justify-center w-full max-h-full py-4">
            {location ? (
                <div>
                    <CustomMap lat={location.latitude} lng={location.longitude} markers={markers} zoom={4} wiper={wiper}/>
                </div>
            ) : (
                <div className="flex flex-wrap items-center justify-center h-full w-full font-bold">
                    {dots == 1 && (<p>Cargando componente del mapa.</p>)}
                    {dots == 2 && (<p>Cargando componente del mapa..</p>)}
                    {dots == 3 && (<p>Cargando componente del mapa...</p>)}
                </div>
            )}
        </div>
    );
}

export default MapComp;