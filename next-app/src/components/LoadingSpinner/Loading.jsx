// "use client"
// import React from "react";
// import "../LoadingSpinner/loading.css";

// const Loading = () => {
//     return (
//         <div>
//             <div className="lds-spinner">
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//             </div>
//         </div>
//     );
// };

// export default Loading;


"use client"
import React from "react";
import './loading.css'
// import loaderGif from "../../../public/assets/images/loadingGif.gif"; // Adjust path if needed

const Loading = () => {
    return (
        <div className="loading-container">
            <img src={`/assets/images/loadingGif-unscreen.gif`} alt="Loading..." className="loading-gif" />
        </div>
    );
};

export default Loading;
