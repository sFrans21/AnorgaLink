import React from "react";
import { useAuth } from "../../authContext"; // Mengambil data user dari context
import styles from "./Navbar.module.css"; // Mengimpor style dari file CSS terpisah

const Navbar = ({ setPage, auth, signOut }) => {
  const { user, userData } = useAuth();

  const handleLogout = async () => {
    try {
      // Menggunakan fungsi signOut yang dikirim dari App.jsx
      await signOut(auth);
      setPage("login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <svg
            className={styles.logoIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className={styles.logoText}>Cinunuk Lestari</span>
        </div>
        {user && (
          <div className={styles.userInfo}>
            <span className={styles.greeting}>Halo, {userData?.name}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
