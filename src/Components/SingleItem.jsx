
function SingleItem({data}) { 


    return (
        <div>
            <p>{data.nombre}</p>
            <p>{data.date}</p>
            <p>{data.email}</p>
        </div>
    )
}

export default SingleItem;