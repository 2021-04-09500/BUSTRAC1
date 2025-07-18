"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { MdNotifications } from "react-icons/md";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      
      <div className="styles.icons"> 
        <MdNotifications size={20} />
      </div>
    </div>
  );
};

export default Navbar;
