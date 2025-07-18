"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './reports.module.css'; // Import the CSS module

// Hardcoded data for demonstration
const studentData = [
  { id: 'S001', name: 'Austin Ndossa', route: 'Kijitonyama', attendance: 100, latePickups: 0, earlyDropoffs: 0, behaviorIncidents: 0 },
  { id: 'S002', name: 'Audrey Lyimo', route: 'Kijitonyama', attendance: 92, latePickups: 1, earlyDropoffs: 0, behaviorIncidents: 1 },
  { id: 'S003', name: 'Joey Tribbiani', route: 'Tegeta', attendance: 100, latePickups: 0, earlyDropoffs: 0, behaviorIncidents: 0 },
  { id: 'S004', name: 'Monica Geller', route: 'Oysterbay', attendance: 98, latePickups: 0, earlyDropoffs: 1, behaviorIncidents: 0 },
  { id: 'S005', name: 'Ross Geller', route: 'Msasani', attendance: 85, latePickups: 2, earlyDropoffs: 0, behaviorIncidents: 2 },
];

const busData = [
  { id: 'B001', model: 'Mercedes Sprinter', status: 'Active', lastInspection: '2025-06-01', issuesReported: 0 },
  { id: 'B002', model: 'Toyota Coaster', status: 'Active', lastInspection: '2025-05-10', issuesReported: 1 },
  { id: 'B003', model: 'Ford Transit', status: 'In Maintenance', lastInspection: '2025-06-25', issuesReported: 2 },
];

const driverData = [
  { id: 'D001', name: 'Sherlock Holmes', assignedBus: 'B001', tripsCompleted: 150, safetyScore: 95, speedingIncidents: 0, averageSpeed: 45 },
  { id: 'D002', name: 'Chandler Bing', assignedBus: 'B002', tripsCompleted: 145, safetyScore: 88, speedingIncidents: 1, averageSpeed: 40 },
  { id: 'D003', name: 'Phoebe Buffay', assignedBus: 'B003', tripsCompleted: 120, safetyScore: 75, speedingIncidents: 3,  averageSpeed: 50 },
  { id: 'D004', name: 'Sheldon Cooper', assignedBus: 'B001', tripsCompleted: 180, safetyScore: 99, speedingIncidents: 0, averageSpeed: 42 },
];


const CHART_COLORS = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#9370DB', '#8A2BE2']; 

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<string>('students');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(oneMonthAgo.toISOString().split('T')[0]);
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setGeneratedReport(null);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      let data: any[] = [];
      if (reportType === 'students') {
        data = studentData;
      } else if (reportType === 'buses') {
        data = busData;
      } else if (reportType === 'drivers') {
        data = driverData;
      }

      
      
      setGeneratedReport(data);
    } catch (err: any) {
      setError(`Failed to generate report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!generatedReport || generatedReport.length === 0) {
      setError("No data to export.");
      return;
    }

    const headers = Object.keys(generatedReport[0]);
    const csvContent = [
      headers.map(header => `"${header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}"`).join(','),
      ...generatedReport.map(row =>
        headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      
      
      const messageBox = document.createElement('div');
      messageBox.className = styles.modalOverlay;
      messageBox.innerHTML = `
        <div class="${styles.modalContent}">
          <p class="${styles.modalTitle}">Export Not Supported</p>
          <p class="${styles.modalText}">Your browser does not support automatic file downloads. Please copy the report data from the console manually.</p>
          <button id="closeMessageBox" class="${styles.modalButton}">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      document.getElementById('closeMessageBox')?.addEventListener('click', () => {
        document.body.removeChild(messageBox);
      });
      console.log(csvContent); 
    }
  };

  const renderReportTable = () => {
    if (!generatedReport || generatedReport.length === 0) {
      return <p className={styles.noReportData}>No data available for the selected report type or dates.</p>;
    }

    
    let displayHeaders = Object.keys(generatedReport[0]);
    if (reportType === 'buses') {
      displayHeaders = displayHeaders.filter(header => !['mileage', 'maintenanceDue', 'fuelEfficiency'].includes(header));
    } else if (reportType === 'drivers') {
      displayHeaders = displayHeaders.filter(header => header !== 'licenseExpiry');
    }

    return (
      <div className={styles.reportTableContainer}>
        <table className={styles.reportTable}>
          <thead>
            <tr>
              {displayHeaders.map(header => (
                <th key={header}>{header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {generatedReport.map((row, index) => (
              <tr key={index}>
                {displayHeaders.map(header => (
                  <td key={header}>{String(row[header])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderVisuals = () => {
    if (!generatedReport || generatedReport.length === 0) {
      return null;
    }

    if (reportType === 'students') {
      const attendanceData = generatedReport.map(s => ({ name: s.name, attendance: s.attendance }));
      const incidentData = generatedReport.map(s => ({ name: s.name, latePickups: s.latePickups, earlyDropoffs: s.earlyDropoffs, behaviorIncidents: s.behaviorIncidents }));

      return (
        <div className={styles.visualsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Student Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#FFA500" name="Attendance (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Student Incident Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              {/* Changed to horizontal bar chart */}
              <BarChart layout="vertical" data={incidentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="latePickups" fill="#FFBB28" name="Late Pickups" />
                <Bar dataKey="earlyDropoffs" fill="#00C49F" name="Early Dropoffs" />
                <Bar dataKey="behaviorIncidents" fill="#FF8042" name="Behavior Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else if (reportType === 'buses') {
      const statusData = generatedReport.reduce((acc, b) => {
        const existing = acc.find((item: any) => item.name === b.status);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: b.status, value: 1 });
        }
        return acc;
      }, []);

      return (
        <div className={styles.visualsGridSingleColumn}> {/* Changed to single column as mileage chart is removed */}
          <div className={`${styles.chartCard} ${styles.centerChart}`}>
            <h3 className={styles.chartTitle}>Bus Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else if (reportType === 'drivers') {
      const incidentSummaryData = generatedReport.map(d => ({
        name: d.name,
        speeding: d.speedingIncidents,
        harshBraking: d.harshBrakingIncidents,
        routeDeviation: d.routeDeviationIncidents,
      }));

      const safetyScoreData = generatedReport.map(d => ({ name: d.name, safetyScore: d.safetyScore }));

      return (
        <div className={styles.visualsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Driver Incident Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incidentSummaryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="speeding" fill="#FF8042" name="Speeding Incidents" />
                <Bar dataKey="harshBraking" fill="#FFBB28" name="Harsh Braking Incidents" />
                <Bar dataKey="routeDeviation" fill="#8884d8" name="Route Deviation Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Driver Safety Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safetyScoreData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="safetyScore" fill="#00C49F" name="Safety Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reports Dashboard</h1>
      <p className={styles.description}>
        Generate various reports to get insights into your school bus operations, including student attendance, bus performance, and driver behavior.
      </p>

      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            className={styles.select}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="students">Student Reports</option>
            <option value="buses">Bus Reports</option>
            <option value="drivers">Driver Reports</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          className={styles.generateButton}
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {generatedReport && (
        <div className={styles.reportResult}>
          <h2 className={styles.reportHeading}>Generated Report ({reportType.toUpperCase()})</h2>
          {renderReportTable()}
          {renderVisuals()}
          <div className={styles.exportButtonContainer}>
            <button
              className={styles.exportButton}
              onClick={handleExportReport}
            >
              Export to CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
