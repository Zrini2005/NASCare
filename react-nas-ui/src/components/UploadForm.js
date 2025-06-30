import React, { useState } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';


const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [generatedReport, setGeneratedReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPredictionResult(null);
    setGeneratedReport("");
    setError(null);
  };

  const generateReport = async (tumorType) => {
    if (GEMINI_API_KEY !== process.env.REACT_APP_GEMINI_API_KEY) {
        setError("Please enter your Gemini API key above.");
        setLoading(false);
        return;
    }
    const prompt = `You are a medical assistant. Based on a brain MRI image, a deep learning model predicts the tumor type is "${tumorType}". Generate a short, structured diagnostic report. Include: General Information, Typical Location, Possible Symptoms, and Recommended Next Steps.`;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setGeneratedReport(response.text());
    } catch (e) {
      console.error("Error generating report:", e);
      setError("Failed to generate diagnostic report from Gemini.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setPredictionResult(null);
    setGeneratedReport("");

    try {
      // Step 1: Get the prediction from our backend
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.data && res.data.predicted_class) {
        setPredictionResult(res.data);
        // Step 2: Generate report using the prediction
        await generateReport(res.data.predicted_class);
      } else {
        setError("Invalid response from the prediction server.");
      }
    } catch (err) {
      const errorMsg = err.response ? err.response.data.detail || "Server Error" : "Could not connect to the prediction server.";
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="w-[48rem] mx-auto p-8 bg-slate-50 rounded-lg shadow-md">
        <h1 className="text-5xl font-extrabold text-center mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                NASCare
            </span>
        </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">MRI Image (PNG, JPG, etc.)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
        </div> 

        {file && (
          <div className="text-center">
            <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-48 h-48 object-cover mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600 mt-2">{file.name}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors duration-300"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      </form>

      {loading && (
        <div className="mt-6 text-center">
          <div className="spinner"></div>
          <p className="text-gray-600 mt-2">Analyzing image and generating report...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 text-center text-lg font-semibold text-red-100 bg-red-600 rounded-lg">
          Error: {error}
        </div>
      )}

      {predictionResult && !error && (
        <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Complete</h2>
          <div className="mb-4">
            <span className="font-semibold text-gray-700">Predicted Tumor Type:</span>
            <span className="ml-2 text-lg text-indigo-700 font-medium bg-indigo-100 py-1 px-3 rounded-full">{predictionResult.predicted_class}</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Generated Diagnostic Report</h3>
            {generatedReport ? (
              <ReactMarkdown children={generatedReport} />
            ) : (
                <p>Generating report...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
