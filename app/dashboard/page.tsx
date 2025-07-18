"use client";

import React from "react";
import {  Tooltip, AreaChart, Area, XAxis, YAxis,  ResponsiveContainer } from "recharts";
import styles from './dashboard.module.css'; 




const totalRoutes = 5;
const totalBuses = 7;
const totalStudents = 110;
const totalDrivers = 7;

const incidentsToday = 2; 


const routesOverviewData = [
  { id: 'R001', name: 'Tegeta Route', status: 'Active', currentBus: 'B001', driver: 'John Doe', students: 30, delay: 'None', eta: '15 min' },
  { id: 'R002', name: 'Kijitonyama Route', status: 'Active', currentBus: 'B002', driver: 'Jane Smith', students: 25, delay: '5 min', eta: '20 min' },
  { id: 'R003', name: 'Oysterbay Route', status: 'Active', currentBus: 'B003', driver: 'Mike Johnson', students: 20, delay: 'None', eta: '10 min' },
  { id: 'R004', name: 'Msasani Route', status: 'Inactive', currentBus: 'N/A', driver: 'N/A', students: 0, delay: 'N/A', eta: 'N/A' },
  { id: 'R005', name: 'Tabata Route', status: 'Active', currentBus: 'B004', driver: 'Sarah Lee', students: 35, delay: '10 min', eta: '30 min' },
];




const busSeatUtilization = [
  { busId: "B001", route: "Tegeta", totalSeats: 40, occupied: 30, available: 10 },
  { busId: "B002", route: "Kijitonyama", totalSeats: 40, occupied: 25, available: 15 },
  { busId: "B003", route: "Oysterbay", totalSeats: 40, occupied: 20, available: 20 },
  { busId: "B004", route: "Tabata", totalSeats: 40, occupied: 35, available: 5 },
  { busId: "B005", route: "Msasani", totalSeats: 40, occupied: 28, available: 12 },
  { busId: "B006", totalSeats: 40, occupied: 0, available: 40 }, 
  { busId: "B007", totalSeats: 40, occupied: 0, available: 40 }, 
];


const driverPerformanceData = [
  { name: "John Doe", bus: "B001", tripsToday: 2, speedingIncidents: 0, harshBrakingIncidents: 1, routeDeviationIncidents: 0, safetyScore: 95 },
  { name: "Jane Smith", bus: "B002", tripsToday: 2, speedingIncidents: 1, harshBrakingIncidents: 0, routeDeviationIncidents: 0, safetyScore: 88 },
  { name: "Mike Johnson", bus: "B003", tripsToday: 1, speedingIncidents: 0, harshBrakingIncidents: 0, routeDeviationIncidents: 0, safetyScore: 98 },
  { name: "Sarah Lee", bus: "B004", tripsToday: 2, speedingIncidents: 2, harshBrakingIncidents: 1, routeDeviationIncidents: 1, safetyScore: 70 },
  { name: "David Kim", bus: "B005", tripsToday: 1, speedingIncidents: 0, harshBrakingIncidents: 0, routeDeviationIncidents: 0, safetyScore: 99 },
];


const userActivityData = [
    { name: "Mon", current: 10, previous: 8 },
    { name: "Tue", current: 15, previous: 12 },
    { name: "Wed", current: 20, previous: 18 },
    { name: "Thu", current: 18, previous: 16 },
    { name: "Fri", current: 22, previous: 20 },
    { name: "Sat", current: 12, previous: 10 },
    { name: "Sun", current: 20, previous: 15 },
];


const recentAlerts = [
    { message: "Bus #1 (Tegeta) delayed by 5 mins due to traffic.", time: "10:30 AM", type: "warning", icon: "FaExclamationTriangle" },
    { message: "Bus #2 (Kijitonyama) arrived at school.", time: "9:15 AM", type: "success", icon: "FaCheckCircle" },
    { message: "Driver John Doe: Harsh braking incident near school.", time: "9:00 AM", type: "danger", icon: "FaExclamationTriangle" },
    { message: "Bus #5 fuel level low, needs refuel.", time: "8:30 AM", type: "info", icon: "FaBus" },
    { message: "New student added to Oysterbay route.", time: "7:45 AM", type: "info", icon: "FaUser" },
];


const AREA_CHART_COLORS = ['#3B82F6', '#60A5FA']; 

   
const IconBus = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M544 256c0-17.7-14.3-32-32-32H448V160c0-17.7-14.3-32-32-32H320c-17.7 0-32 14.3-32 32v64H160c-17.7 0-32 14.3-32 32v64H64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V256zM128 352c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm320 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>;
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h283.4C560.2 304 640 383.8 640 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>;
const IconRoute = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M384 160c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V192c0-17.7-14.3-32-32-32zM192 64c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V96c0-17.7-14.3-32-32-32zM48 256c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V288c0-17.7-14.3-32-32-32z"/></svg>;
const IconExclamationTriangle = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.5 442.7L320 19.3c-11.3-19.6-32.1-19.6-43.4 0L6.5 442.7c-11.3 19.6-1.9 44.3 21.7 44.3h522.6c23.6 0 33-24.7 21.7-44.3zM288 352c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm0-96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32v64c0 17.7-14.3 32-32 32z"/></svg>;
const IconCheckCircle = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0L143 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>;
const IconEye = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 144a112 112 0 1 0 0 224 112 112 0 1 0 0-224zm0 288C129.5 432 0 288 0 288S129.5 144 288 144c158.5 0 288 144 288 144s-129.5 144-288 144zM288 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>;
const IconUser = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 64C81.8 320 0 401.8 0 500.3c0 11.3 9.1 20.3 20.3 20.3h407.5c11.3 0 20.3-9.1 20.3-20.3C448 401.8 366.2 320 269.7 320H178.3z"/></svg>;
const IconTools = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.5l-137.4 117.9c-12.8 11-30.8 12.8-45.1 4.6l-20.9-12.1c-17.7-10.2-39.4-10.2-57.1 0L193.5 315c-14.3 8.3-32.3 6.5-45.1-4.6L11 191.1c-6.9-6.1-9.6-15.8-6.4-24.5l24.7-67.4c3.2-8.7 11.9-14.2 21.5-14.2h402.6c9.7 0 18.3 5.5 21.5 14.2l24.7 67.4zM256 0a256 256 0 1 0 0 512 256 256 0 1 0 0-512zM128 256a128 128 0 1 1 256 0 128 128 0 1 1 -256 0z"/></svg>;
const IconTachometerAlt = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256S114.6 512 256 512s256-114.6 256-256S397.4 0 256 0zM256 128a128 128 0 1 1 0 256 128 128 0 1 1 0-256zM256 192a64 64 0 1 0 0 128 64 64 0 1 0 0-128zM256 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"/></svg>;


const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case "FaBus": return IconBus;
        case "FaUsers": return IconUsers;
        case "FaRoute": return IconRoute;
        case "FaExclamationTriangle": return IconExclamationTriangle;
        case "FaCheckCircle": return IconCheckCircle;
        case "FaEye": return IconEye;
        case "FaUser": return IconUser;
        case "FaTools": return IconTools;
        case "FaTachometerAlt": return IconTachometerAlt;
        default: return null;
    }
};

const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
        
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>Admin Dashboard</h1>
                <div className={styles.headerUser}>
                    <span className={styles.headerWelcome}>Welcome, Admin!</span>
                    
                </div>
            </header>

        
            <main className={styles.mainGrid}>
                
                <section className={`${styles.kpiSection} ${styles.kpiGrid}`}>
                    
                    <div className={`${styles.kpiCard} ${styles.kpiCardOrange}`}>
                        <IconRoute className={styles.kpiIcon} />
                        <h2 className={styles.kpiValue}>{totalRoutes}</h2>
                        <p className={styles.kpiLabel}>Total Routes</p>
                    </div>

                    
                    <div className={`${styles.kpiCard} ${styles.kpiCardGreen}`}>
                        <IconBus className={styles.kpiIcon} />
                        <h2 className={styles.kpiValue}>{totalBuses}</h2>
                        <p className={styles.kpiLabel}>Total Buses</p>
                    </div>

                
                    <div className={`${styles.kpiCard} ${styles.kpiCardPurple}`}>
                        <IconUsers className={styles.kpiIcon} />
                        <h2 className={styles.kpiValue}>{totalStudents}</h2>
                        <p className={styles.kpiLabel}>Total Students</p>
                    </div>

                    
                    <div className={`${styles.kpiCard} ${styles.kpiCardRed}`}>
                        <IconUser className={styles.kpiIcon} />
                        <h2 className={styles.kpiValue}>{totalDrivers}</h2>
                        <p className={styles.kpiLabel}>Total Drivers</p>
                    </div>
                </section>

               

                
                <section className={`${styles.tableCard} ${styles.colSpan2}`}>
                    <h2 className={styles.tableTitle}>Route Performance Overview</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader}>Route ID</th>
                                    <th className={styles.tableHeader}>Route Name</th>
                                    <th className={styles.tableHeader}>Status</th>
                                    <th className={styles.tableHeader}>Current Bus</th>
                                    <th className={styles.tableHeader}>Driver</th>
                                    <th className={styles.tableHeader}>Students</th>
                                    <th className={styles.tableHeader}>Delay</th>
                                    <th className={styles.tableHeader}>ETA</th>
                                    <th className={styles.tableHeader}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routesOverviewData.map((route) => (
                                    <tr key={route.id}>
                                        <td className={styles.tableCell}>{route.id}</td>
                                        <td className={styles.tableCell}>{route.name}</td>
                                        <td className={styles.tableCell}>
                                            <span className={`${styles.statusBadge} ${route.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                                                {route.status}
                                            </span>
                                        </td>
                                        <td className={styles.tableCell}>{route.currentBus}</td>
                                        <td className={styles.tableCell}>{route.driver}</td>
                                        <td className={styles.tableCell}>{route.students}</td>
                                        <td className={styles.tableCell}>{route.delay}</td>
                                        <td className={styles.tableCell}>{route.eta}</td>
                                        <td className={styles.tableCellActions}>
                                            <a href="#" className={styles.actionLink}>View</a>
                                            <a href="#" className={`${styles.actionLink} ${styles.actionLinkDanger}`}>Manage</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Bus Seat Utilization</h2>
                    <div className={styles.utilizationList}>
                        {busSeatUtilization.map((bus) => (
                            <div key={bus.busId} className={styles.utilizationItem}>
                                <span className={styles.utilizationBusId}>{bus.busId}</span>
                                <div className={styles.progressBarBackground}>
                                    <div
                                        className={styles.progressBarFill}
                                        style={{ width: `${(bus.occupied / bus.totalSeats) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={styles.utilizationText}>{bus.occupied}/{bus.totalSeats} seats</span>
                            </div>
                        ))}
                    </div>
                </section>

                
                <section className={`${styles.tableCard} ${styles.colSpan2}`}>
                    <h2 className={styles.tableTitle}>Driver Performance</h2>
                    <div className={styles.tableContainer}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader}>Driver Name</th>
                                    <th className={styles.tableHeader}>Bus</th>
                                    <th className={styles.tableHeader}>Trips Today</th>
                                    <th className={styles.tableHeader}>Speeding Incidents</th>
                                    <th className={styles.tableHeader}>Harsh Braking</th>
                                    <th className={styles.tableHeader}>Safety Score</th>
                                    <th className={styles.tableHeader}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverPerformanceData.map((driver) => (
                                    <tr key={driver.name}>
                                        <td className={styles.tableCell}>{driver.name}</td>
                                        <td className={styles.tableCell}>{driver.bus}</td>
                                        <td className={styles.tableCell}>{driver.tripsToday}</td>
                                        <td className={styles.tableCell}>{driver.speedingIncidents}</td>
                                        <td className={styles.tableCell}>{driver.harshBrakingIncidents}</td>
                                        <td className={styles.tableCellScore} style={{ color: driver.safetyScore > 85 ? '#4CAF50' : driver.safetyScore > 70 ? '#FFC107' : '#F44336' }}>
                                            {driver.safetyScore}
                                        </td>
                                        <td className={styles.tableCellActions}>
                                            <a href="#" className={styles.actionLink}>View</a>
                                            <a href="#" className={`${styles.actionLink} ${styles.actionLinkDanger}`}>Alert</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                
                <section className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>User Activity (Last 7 Days)</h2>
                    <div className={styles.chartContainer}> {/* Added container for ResponsiveContainer */}
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" className={styles.chartAxisLabel} />
                                <YAxis className={styles.chartAxisLabel} />
                                <Tooltip />
                                <Area type="monotone" dataKey="current" stroke={AREA_CHART_COLORS[0]} fillOpacity={1} fill={`url(#colorCurrent)`} name="Current Week" />
                                <Area type="monotone" dataKey="previous" stroke={AREA_CHART_COLORS[1]} fillOpacity={1} fill={`url(#colorPrevious)`} name="Previous Week" />
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={AREA_CHART_COLORS[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={AREA_CHART_COLORS[0]} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={AREA_CHART_COLORS[1]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={AREA_CHART_COLORS[1]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

            
                <section className={`${styles.card} ${styles.colSpan2}`}>
                    <h2 className={styles.cardTitle}>Recent Alerts ({incidentsToday} Today)</h2>
                    <div className={styles.alertsList}>
                        {recentAlerts.map((alert, index) => {
                            const Icon = getIconComponent(alert.icon);
                            let alertClass = '';
                            switch (alert.type) {
                                case 'warning':
                                    alertClass = styles.alertWarning;
                                    break;
                                case 'success':
                                    alertClass = styles.alertSuccess;
                                    break;
                                case 'danger':
                                    alertClass = styles.alertDanger;
                                    break;
                                case 'info':
                                    alertClass = styles.alertInfo;
                                    break;
                                default:
                                    alertClass = '';
                            }

                            return (
                                <div key={index} className={`${styles.alertItem} ${alertClass}`}>
                                    {Icon && <Icon className={styles.alertIcon} />}
                                    <div>
                                        <p className={styles.alertMessage}>{alert.message}</p>
                                        <p className={styles.alertTime}>{alert.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

               
            </main>
        </div>
    );
};

export default Dashboard;
