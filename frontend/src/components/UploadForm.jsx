import React, { useState } from "react";
import { uploadFile } from "../services/api";
import Button from '@mui/material/Button';
import styles from "./uploadForm.module.css"

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();  

    if (!file) {
      setMessage("Please select a file!");
      return;
    }

    try {
      const response = await uploadFile(file);
      console.log("Upload Response:", response.data); 

      setMessage("File uploaded successfully!");
      onUploadSuccess(response.data); 
      setFile(null); 
    } catch (error) {
      setMessage("Upload failed!");
      console.error("Upload Error:", error);
    }
  };

  return (
    <form className={ styles.formDetails} onSubmit={handleUpload}> 
      <input className={ styles.inputField} type="file" accept=".xml" onChange={handleFileChange} />
      <Button type="submit" variant="contained">Upload</Button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UploadForm;
