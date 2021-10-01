import React, { useEffect } from 'react';
import './loader.css';
import { loaderService } from '../../service/loaderService';
export default function Loader() {
    useEffect(() => {
        console.log(document.getElementById("loader"));
        loaderService.createLoaderElement(document.getElementById("loader"));
    }, []);
    return (
        <div className="loader-overlay" id="loader">
            <div className="loader" >
            </div>
        </div>
    )
}
