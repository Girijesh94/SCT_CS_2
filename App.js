import React from 'react';
import ImageEncryptor from './components/Encryptor';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🖼️ Image Encryption Tool 🔐</h1>
      <ImageEncryptor />
    </div>
  );
}
