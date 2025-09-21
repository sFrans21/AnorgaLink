import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import komponen-komponen dari file terpisah
import Navbar from "./components/Navbar/Navbar.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.jsx";
import JualSampahPage from "./components/JualSampahPage/JualSampahPage.jsx";
import DaftarSampahPage from "./components/DaftarSampahPage/DaftarSampahPage.jsx";
// --- PERBAIKAN DI SINI ---
// AuthProvider diimpor sebagai default (tanpa {}), useAuth sebagai named (dengan {})
import AuthProvider, { useAuth } from "./authContext.jsx";

// --- Konfigurasi & Inisialisasi Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBmaSP5ZirgAzFYAqWLTaH_PQxEmS6yt4E",
  authDomain: "anorganik.firebaseapp.com",
  projectId: "anorgalink",
  storageBucket: "anorgalink.firebasestorage.app",
  messagingSenderId: "104981036064",
  appId: "1:104981036064:web:d7b305bf0c2d23d9c25045",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Komponen Konten Utama & Logika Halaman ---
function AppContent() {
  const [page, setPage] = useState("login");
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        setPage(userData?.role === "warga" ? "jual" : "daftar");
      } else {
        setPage("login");
      }
    }
  }, [user, userData, loading]);

  // Fungsi untuk menampilkan halaman yang sesuai
  const renderPage = () => {
    if (loading) {
      return (
        <div
          style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem" }}
        >
          Memuat aplikasi...
        </div>
      );
    }

    if (!user) {
      return page === "register" ? (
        <RegisterPage setPage={setPage} />
      ) : (
        <LoginPage setPage={setPage} />
      );
    }

    if (userData?.role === "warga") {
      return <JualSampahPage />;
    } else if (userData?.role === "pengepul") {
      return <DaftarSampahPage />;
    }

    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Memuat data pengguna...
      </div>
    );
  };

  return (
    <div>
      <Navbar setPage={setPage} auth={auth} signOut={signOut} />
      <main>{renderPage()}</main>
    </div>
  );
}

// --- Komponen App Pembungkus ---
export default function App() {
  return (
    <AuthProvider auth={auth} db={db}>
      <AppContent />
    </AuthProvider>
  );
}
