import React, { useState } from 'react';
import { storage } from '../firebase.config'; // Make sure this is correctly configured
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ProductImageUpload = ({ form, setForm }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `webpImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setForm((prev) => ({ ...prev, image_url: downloadURL }));
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700">Upload Product Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="block w-full mt-1 text-sm text-gray-700"
      />

      {uploading && (
        <div className="mt-2 text-sm text-blue-600">
          Uploading: {uploadProgress.toFixed(0)}%
        </div>
      )}

      {form.image_url && (
        <div className="mt-3">
          <img src={form.image_url} alt="Uploaded" className="h-24 w-auto border rounded" />
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
