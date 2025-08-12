
"use client"
import React from "react";
import './loading.css'



const Loading = () => {
    return (
        <div className="loading-container">
            <img src={`/assets/images/loadingGif-unscreen.gif`} alt="Loading..." className="loading-gif" />
        </div>
    );
};

export default Loading;
