import React, { useEffect, useState } from "react";
import UploadForm from "../components/UploadForm";
import ReportList from "../components/ReportList";
import { getReports } from "../services/api";
import styles from "./Homen.module.css"
const Home = () => {
  const [reports, setReports] = useState([]); 

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      setReports(response.data || []); 
    } catch (error) {
      console.error("Error fetching reports", error);
      setReports([]);  // 
    }
  };

  const handleNewReport = (newReport) => {
    setReports((prevReports) => [...prevReports, newReport]);
  };

  return (
    <div>
      <h1 className={styles.heading }>Experian Credit Report Uploader</h1>
      <UploadForm onUploadSuccess={handleNewReport} />
      <ReportList reports={reports} /> 
    </div>
  );
};

export default Home;
