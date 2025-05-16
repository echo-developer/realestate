export default function getCroppedImg(
  imageSrc,
  pixelCrop,
  outputSize = { width: 1920, height: 200 }
) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // If needed, especially when loading external images
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outputSize.width;
      canvas.height = outputSize.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputSize.width,
        outputSize.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
        resolve(file); // Return the File object
      }, "image/jpeg");
    };

    image.onerror = (e) => reject(new Error("Image load error: " + e.message));
  });
}
