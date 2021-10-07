import React from "react";
import './CatchError.css';

export default function CatchError  (props){
   
    const tryAgain=()=>{
        props.callBack(props.fromCatch); 
    }
   
        return (
            <div className='error-container'>
                <div className='catch-error'>
                    <h2>Error</h2>
                    <h3>Oops!! Something Went Wrong</h3>
                    <div>We are sorry for the inconvenience.</div>
                    <div>
                        <button className='error-try-again' onClick={tryAgain}>Try Again</button>
                    </div>
                </div>
            </div>
        );
    

        }