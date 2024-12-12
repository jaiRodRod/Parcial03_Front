import { useEffect, useState } from "react";
import CustomMap from "./CustomMap";
import axios from "axios";

import url from '../../url.json'

function MapComp() {

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
                            children: "Mi localizacion!",
                            color: "me"
                        },
                    ]);
                    setLocation({latitude, longitude});
                    fetchMarkersFromAPI();
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

    const updateUserLocation = () => {
        setMarkers([
            {
                key: "Me",
                position: [newMarker[0],newMarker[1]],
                children: "Mi localizacion!",
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

    const fetchMarkersFromAPI = async () => {
        if(location) {
            console.log(location);
            try {
                const urlPeticion = `${url.active_urlBase}/event/?latitude=${location.latitude}&longitude=${location.longitude}`//&radius=200`
                const response = await axios.get(urlPeticion);
                console.log(response);
                const eventMarkers = response.data.map((event) => ({
                    key: event._id,
                    position: [event.lat, event.lon],
                    children: {
                        nombre: event.nombre,
                        fecha: event.date,
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
    }, []);

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
                    {newMarker ? (
                        <div className="flex justify-center mb-4">
                            {/*<p>Posicion seleccionada: {newMarker[0]}, {newMarker[1]}</p>*/}
                            <button onClick={updateUserLocation}
                                className='font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-blue-200 focus:outline-none transition duration-300'
                            >
                                Seleccionar la seleccionada como mi ubicacion
                            </button>
                        </div>
                    ) : null}
                    <CustomMap lat={location.latitude} lng={location.longitude} markers={markers} zoom={13} setNewMarker={setNewMarker} wiper={wiper}/>
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