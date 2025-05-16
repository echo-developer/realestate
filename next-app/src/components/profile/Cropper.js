import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageHelper"; // custom helper to crop the image

const CropperModal = ({ image, onClose, onCropDone }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleDone = async () => {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, {
            width: 1920,
            height: 200,
        });
        onCropDone(croppedImage);
        onClose();
    };

    return (
        <>
            <div className="crop-container position-relative w-100" style={{ height: 400 }}>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1920 / 200} // aspect ratio 9.6
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <div className="mt-3 text-end">
                <button className="btn btn-primary" onClick={handleDone}>
                    Crop & Save
                </button>
            </div>

        </>
    );
};

export default CropperModal;
