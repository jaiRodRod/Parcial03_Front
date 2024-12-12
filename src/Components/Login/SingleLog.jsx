import { useState, useEffect } from 'react'
import { formatDateTime } from '../CommonOperations';

function SingleLog({data}) { 


    return (
        <div className='px-4 py-2 rounded-2xl border-gray-200 border-4'>
            <p>Fecha de login: {formatDateTime(data.timestamp)}</p>
            <p>Email: {data.email}</p>
        </div>
    )


}

export default SingleLog;