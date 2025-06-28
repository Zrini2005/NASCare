import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Ensure predicted_class exists
      if (res.data && res.data.predicted_class) {
        setPrediction(res.data.predicted_class);
      } else {
        console.error("Malformed response:", res.data);
        setPrediction("Error: Invalid response from server.");
      }
    } catch (err) {
      if (err.response) {
        console.error("Server error:", err.response.data);
      } else if (err.request) {
        console.error("No response from server:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }
      setPrediction("Error: Could not predict.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Brain Tumor Classifier</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-40 h-40 object-cover mx-auto rounded"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      {prediction && (
        <div className={`mt-4 text-center text-lg font-semibold ${
          prediction.startsWith("Error") ? "text-red-600" : "text-green-700"
        }`}>
          Result: {prediction}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
