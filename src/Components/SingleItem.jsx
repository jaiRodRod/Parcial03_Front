import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from '../url.json'
import { formatDateTime } from "./CommonOperations";

function SingleItem({data, user, cleanItems}) { 

    const navigate = useNavigate();

    const deleteItem = async() => {
        const urlPeticion = `${url.active_urlBase}/event/${data._id}`;
        await axios.delete(urlPeticion);
        cleanItems();
    }

    const navigateEditar = () => {
        const urlNav = `/editarItem/${data._id}`
        navigate(urlNav);
    }

    return (
        <div className="flex justify-center flex-wrap">
            <div className="flex-col w-fit px-4 py-2 rounded-2xl border-gray-200 border-4">
                <p><b>Nombre del item:</b> {data.nombre}</p>
                <p><b>Fecha:</b> {formatDateTime(data.date)}</p>
                <p><b>Creador:</b> {data.email}</p>
                <p><b>Direccion:</b> {data.lugar}</p>
                {data.url && (
                    <div className="flex-col w-fit">
                        <p><b>Imagen asociada</b> (click en ella para ver mejor):</p>
                        <div className="flex justify-center">
                            <a href={data.url} target="_blank"><img src={data.url} alt="user image" className="w-32 h-32"/></a>
                        </div>
                    </div>
                )}
                {user == data.email && (
                    <div className="flex-col justify-center space-y-4 flex-wrap">
                        <div className="flex justify-center">
                            <button onClick={deleteItem}
                                className="font-bold bg-gray-100 px-4 py-1 rounded-full hover:bg-red-200 focus:outline-none transition duration-300 flex-shrink-0"
                            >Borrar mi item</button>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={navigateEditar}
                                className="font-bold bg-gray-100 px-4 py-1 rounded-full hover:bg-yellow-200 focus:outline-none transition duration-300 flex-shrink-0"
                            >Editar mi item</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SingleItem;