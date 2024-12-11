import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from '../Components/SessionProvider.jsx';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import keys from '../../keys.json';
import url from '../url.json';

const cookies = new Cookies();

function Create() {
    const { isLoggedIn } = useSession();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        timestamp: "",
        place: "",
        image: "",
    });
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [email, setEmail] = useState("");
    const [geocodeCoord, setGeocodeCoord] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);

    // Bandera para prevenir actualizaciones en componentes desmontados
    let isMounted = true;

    useEffect(() => {
        setEmail(cookies.get("email"));
        return () => {
            isMounted = false; // Marca el componente como desmontado
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const sanitizeString = (str) => str?.replace(/[\u200B-\u200D\uFEFF]/g, '');

    useEffect(() => {
        const createItem = async () => {
            //console.log(done);
            if (((formData['image'] && uploadedUrl) || formData['image']=="") && geocodeCoord && !done) {
                setDone(true);
                const payload = {
                    date: sanitizeString(formData.timestamp),
                    email: sanitizeString(email),
                    lat: geocodeCoord?.lat || 0,
                    lon: geocodeCoord?.lng || 0,
                    lugar: sanitizeString(formData.place),
                    nombre: sanitizeString(formData.name),
                    url: uploadedUrl || null,
                };

                try {
                    //console.log(payload);
                    //console.log(done);
                    await axios.post(`${url.active_urlBase}/event/`, payload, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    alert("Item creado correctamente");
                    navigate('/');
                } catch (err) {
                    console.error("Error al crear el item:", err);
                    alert("Fallo en la creación");
                    navigate('/');
                }
            }
        };

        createItem();
    }, [uploadedUrl, geocodeCoord, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files[0],
            }));
        }
    };

    const uploadImage = async () => {
        if (formData.image){
            const image = formData.image;
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', image);
            formDataToUpload.append('upload_preset', 'Parcial_upload_preset');
            formDataToUpload.append('cloud_name', 'dlj4y9vd3');

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dlj4y9vd3/upload',
                    formDataToUpload
                );
                if (isMounted) setUploadedUrl(response.data.url);
                alert('Archivo subido correctamente');
            } catch (err) {
                console.error('Error al subir la imagen:', err);
                if (isMounted) setError('Error al subir la imagen');
            }
        }
    };

    const getCoords = async () => {
        const API_KEY = keys.OpenCage_API_KEY;

        try {
            const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
                params: {
                    q: formData.place,
                    key: API_KEY,
                    language: "es",
                    limit: 1,
                },
            });

            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry;
                if (isMounted) setGeocodeCoord(location);
            } else {
                alert("No se encontraron resultados para esa dirección.");
            }
        } catch (err) {
            console.error("Error al obtener coordenadas:", err);
            if (isMounted) setError("Error al obtener coordenadas");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log("Submitting:",formData);
        try {
            await uploadImage();
            await getCoords();
        } finally {
            if (isMounted) setIsLoading(false);
        }
    };

    return (
        <div className="bg-blue-100">
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md"
                >
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Formulario</h1>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Introduce tu nombre"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Timestamp
                        </label>
                        <input
                            type="datetime-local"
                            name="timestamp"
                            value={formData.timestamp}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Lugar
                        </label>
                        <input
                            type="text"
                            name="place"
                            value={formData.place}
                            onChange={handleChange}
                            placeholder="Introduce un lugar"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Imagen
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            accept="image/*"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={isLoading}
                        >
                            {isLoading ? "Cargando..." : "Enviar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Create;
