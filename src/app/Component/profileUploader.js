import React,{useState} from 'react';
import profile from './../../assets/profile.jfif';

export default function ProfileUploader() {
    const [pic, setPic] = useState(profile)
    const [error, setError] = useState("")

    function check(e) {
        const reader = new FileReader;
        reader.onload=()=>{
            if (reader.readyState === 2) {
                setPic({ pic: reader.result });
            }
        }
        if (e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpg') {
            const error = "selected file is not an image";
            setError({ error: error });
        }
        else {
            if (e.target.files[0].size > 2e+6) {
                const error = "image size must be less than 2 Mb";
                setError({ error: error })
            }
            else {
                setError({ error: "" })
                reader.readAsDataURL(e.target.files[0])
            }
        }
    }

    return (
        <div className="Profileuploader">
            <label>Choose profile</label>
            <label className="profile">
                <div className="imageForUpload" >
                    <img className="pic" alt='profile pic' src={pic} width="45" height="35" />
                </div>
                <input id="photo-upload" type="file" accept="image/*" onChange={check} style={{ display: "none" }} />
            </label>
            <div style={{ color: "red" }}>{error}</div>

        </div>
    )
}
