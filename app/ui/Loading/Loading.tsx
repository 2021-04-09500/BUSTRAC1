"use client";

import styles from "./loading.module.css";

const Loading = () => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading...</p>
        </div>
    );
};

export default Loading;