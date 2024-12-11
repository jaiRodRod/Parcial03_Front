import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from '../url.json'

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
        <div>
            <p>{data.nombre}</p>
            <p>{data.date}</p>
            <p>{data.email}</p>
            {user == data.email && (
                <div>
                    <div>
                        <button onClick={deleteItem}>Borrar mi item</button>
                    </div>
                    <div>
                        <button onClick={navigateEditar}>Editar mi item</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleItem;