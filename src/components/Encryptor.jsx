import React, { useState } from "react";

const ImageEncryptor = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [encryptedImage, setEncryptedImage] = useState(null);
  const [method, setMethod] = useState("invert");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setOriginalImage(imgURL);
      setEncryptedImage(null); // Reset on new image
    }
  };

  const getMethodDescription = (method) => {
    switch (method) {
      case "invert":
        return "(Inverts the color of each pixel (like a photo negative).)";
      case "brightness":
        return "(Increases the brightness of each pixel.)";
      case "xor":
        return "(Applies a bitwise XOR operation using a key.)";
      case "reverse":
        return "(Reverses the order of all pixel data.)";
      case "shuffle":
        return "(Randomly shuffles all pixel positions.)";
      default:
        return "";
    }
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handleEncrypt = () => {
    if (!originalImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = originalImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      switch (method) {
        case "invert":
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
          break;

        case "brightness":
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] + 40, 255);
            data[i + 1] = Math.min(data[i + 1] + 40, 255);
            data[i + 2] = Math.min(data[i + 2] + 40, 255);
          }
          break;

        case "xor":
          const key = 123;
          for (let i = 0; i < data.length; i += 4) {
            data[i] ^= key;
            data[i + 1] ^= key;
            data[i + 2] ^= key;
          }
          break;

        case "reverse":
          const reversed = new Uint8ClampedArray(data.length);
          for (let i = 0; i < data.length; i += 4) {
            const j = data.length - 4 - i;
            reversed[i] = data[j];
            reversed[i + 1] = data[j + 1];
            reversed[i + 2] = data[j + 2];
            reversed[i + 3] = data[j + 3];
          }
          imageData.data.set(reversed);
          break;

        case "shuffle":
          for (let i = data.length - 4; i > 0; i -= 4) {
            const j = Math.floor(Math.random() * (i / 4)) * 4;
            for (let k = 0; k < 4; k++) {
              const temp = data[i + k];
              data[i + k] = data[j + k];
              data[j + k] = temp;
            }
          }
          break;

        default:
          break;
      }

      ctx.putImageData(imageData, 0, 0);
      const encryptedURL = canvas.toDataURL();
      setEncryptedImage(encryptedURL);
    };
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEncryptedImage(null);
  };

  const handleDownload = () => {
    if (!encryptedImage) return;
    const link = document.createElement("a");
    link.href = encryptedImage;
    link.download = `encrypted-${method}.png`;
    link.click();
  };

  return (
    <div className="w-full max-w-5xl p-6 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
        🖼️ Image Encryption Tool 🔐
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      <select
        value={method}
        onChange={handleMethodChange}
        className="bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
      >
        <option style={{ color: "black", backgroundColor: "white" }} value="invert">Invert Colors</option>
        <option style={{ color: "black", backgroundColor: "white" }} value="brightness">Brightness Adjustment</option>
        <option style={{ color: "black", backgroundColor: "white" }} value="xor">XOR with Key</option>
        <option style={{ color: "black", backgroundColor: "white" }} value="reverse">Reverse Pixels</option>
        <option style={{ color: "black", backgroundColor: "white" }} value="shuffle">Shuffle Pixels</option>
      </select>

      <p className="text-sm text-gray-300 italic text-center max-w-md">
        {getMethodDescription(method)}
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {originalImage && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Original Image</h3>
            <img
              src={originalImage}
              alt="Original"
              style={{ width: '320px', height: '320px', objectFit: 'contain' }}
              className="border border-gray-500 rounded-lg"
            />
          </div>
        )}

        {encryptedImage && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Encrypted Image – {method.charAt(0).toUpperCase() + method.slice(1)}
            </h3>
            <img
              src={encryptedImage}
              alt="Encrypted"
              style={{ width: '320px', height: '320px', objectFit: 'contain' }}
              className="border border-gray-500 rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <button
          onClick={handleEncrypt}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-medium"
        >
          Encrypt
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white font-medium"
        >
          Reset
        </button>
        {encryptedImage && (
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-medium"
          >
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageEncryptor;
