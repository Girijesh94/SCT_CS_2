import React, { useState, useRef } from 'react';

export default function ImageEncryptor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [encryptedImage, setEncryptedImage] = useState(null);
  const [method, setMethod] = useState('invert');
  const canvasRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setOriginalImage(img);
        setEncryptedImage(null);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const applyEncryption = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (method) {
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];     // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B
        }
        break;

      case 'brightness':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(data[i] + 50, 255);
          data[i + 1] = Math.min(data[i + 1] + 50, 255);
          data[i + 2] = Math.min(data[i + 2] + 50, 255);
        }
        break;

      case 'xor':
        const key = 123;
        for (let i = 0; i < data.length; i += 4) {
          data[i] ^= key;
          data[i + 1] ^= key;
          data[i + 2] ^= key;
        }
        break;

        case 'reverse': {
  const reversed = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const j = data.length - 4 - i;
    reversed[i] = data[j];
    reversed[i + 1] = data[j + 1];
    reversed[i + 2] = data[j + 2];
    reversed[i + 3] = data[j + 3];
  }
  for (let i = 0; i < data.length; i++) {
    data[i] = reversed[i];
  }
  break;
}

case 'shuffle': {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(data.slice(i, i + 4));
  }

  for (let i = pixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
  }

  for (let i = 0; i < pixels.length; i++) {
    const [r, g, b, a] = pixels[i];
    const offset = i * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = a;
  }
  break;
}


      default:
        return;
    }

    ctx.putImageData(imageData, 0, 0);
    const encryptedURL = canvas.toDataURL();
    setEncryptedImage(encryptedURL);
  };

  const resetImage = () => {
    if (originalImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(originalImage, 0, 0);
      setEncryptedImage(null);
    }
  };

  const downloadImage = () => {
    if (encryptedImage) {
      const link = document.createElement('a');
      link.download = 'encrypted-image.png';
      link.href = encryptedImage;
      link.click();
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      <select
  value={method}
  onChange={(e) => setMethod(e.target.value)}
  className="mb-4 px-4 py-2 rounded text-black"
>
  <option value="invert">Invert Colors</option>
  <option value="brightness">Increase Brightness</option>
  <option value="xor">XOR with Key</option>
  <option value="reverse">Reverse Pixels</option>
  <option value="shuffle">Random Shuffle Pixels</option>
</select>


      <div className="flex gap-4 mb-4">
        <button
          onClick={applyEncryption}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Encrypt / Apply
        </button>
        <button
          onClick={resetImage}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
        >
          Reset
        </button>
        <button
          onClick={downloadImage}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Download
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-6 mt-6">
        {originalImage && (
          <div>
            <p className="mb-2 text-center">Original</p>
            <img src={originalImage.src} alt="original" className="max-w-xs rounded" />
          </div>
        )}
        {encryptedImage && (
          <div>
            <p className="mb-2 text-center">Encrypted</p>
            <img src={encryptedImage} alt="encrypted" className="max-w-xs rounded" />
          </div>
        )}
      </div>
    </div>
  );
}
