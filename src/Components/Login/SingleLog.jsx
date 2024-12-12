import { useState, useEffect } from 'react'

function SingleLog({data}) { 


    return (
        <div className='px-4 py-2 rounded-2xl border-gray-200 border-4'>
            <p>Fecha de login: {data.timestamp}</p>
            <p>Email: {data.email}</p>
        </div>
    )


}

export default SingleLog;