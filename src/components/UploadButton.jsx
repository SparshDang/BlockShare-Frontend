import React from 'react'

export default function UploadButton({retrieveImage}) {
    
    

    return (
        <input type="file" name="file" id="file" onChange={retrieveImage} />
    )
}
