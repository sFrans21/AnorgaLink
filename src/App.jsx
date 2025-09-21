import React, { useState, useEffect, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Firebase Configuration & Initialization ---
// PENTING: Ganti nilai-nilai placeholder di bawah ini dengan kredensial dari proyek Firebase Anda!
// Anda bisa mendapatkannya dari Project Settings > General di Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyBmaSP5ZirgAzFYAqWLTaH_PQxEmS6yt4E",
  authDomain: "anorganik.firebaseapp.com",
  projectId: "anorgalink",
  storageBucket: "anorgalink.firebasestorage.app",
  messagingSenderId: "104981036064",
  appId: "1:104981036064:web:d7b305bf0c2d23d9c25045",
};

let auth, db, storage;
let firebaseInitialized = false;

// A function to show a prominent error on the screen if config is missing
const RenderConfigError = () => (
  <div
    style={{
      fontFamily: "sans-serif",
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "#fff5f5",
      color: "#c53030",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      Konfigurasi Firebase Tidak Lengkap
    </h1>
    <p style={{ marginTop: "1rem", maxWidth: "600px" }}>
      Aplikasi tidak dapat diinisialisasi. Silakan buka file{" "}
      <strong>src/App.jsx</strong> dan ganti semua nilai placeholder{" "}
      <code>GANTI_DENGAN_...</code> dengan kredensial asli dari proyek Firebase
      Anda.
    </p>
  </div>
);

// Check if the essential config key has been changed from the placeholder
if (
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "GANTI_DENGAN_API_KEY_ANDA"
) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    firebaseInitialized = true;
  } catch (error) {
    console.error("Firebase Initialization Failed:", error.message);
  }
} else {
  console.error(
    "Firebase config is using placeholder values. Please replace them in app.jsx."
  );
}

// --- 1. AUTHENTICATION CONTEXT ---
// Manages user state throughout the app
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseInitialized) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData(null); // User exists in Auth but not in Firestore
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, userData, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = () => {
  return useContext(AuthContext);
};

// --- MAIN APP COMPONENT & ROUTING ---
function AppContent() {
  // Simple state-based routing
  const [page, setPage] = useState("login");
  const { user, userData } = useAuth();

  useEffect(() => {
    if (user) {
      setPage(userData?.role === "warga" ? "jual" : "daftar");
    } else {
      setPage("login");
    }
  }, [user, userData]);

  const renderPage = () => {
    if (!user) {
      switch (page) {
        case "register":
          return <RegisterPage setPage={setPage} />;
        default:
          return <LoginPage setPage={setPage} />;
      }
    }

    if (userData?.role === "warga") {
      return <JualSampahPage />;
    } else if (userData?.role === "pengepul") {
      return <DaftarSampahPage />;
    }
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-gray-500">Memuat data pengguna...</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar setPage={setPage} />
      <main>{renderPage()}</main>
    </div>
  );
}

export default function App() {
  if (!firebaseInitialized) {
    return <RenderConfigError />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// --- UI COMPONENTS & PAGES ---

// --- Navbar Component ---
const Navbar = ({ setPage }) => {
  const { user, userData } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    setPage("login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <svg
              className="h-10 w-10 text-green-600"
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
            <span className="ml-3 text-2xl font-bold text-gray-800">
              AnorgaLink
            </span>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden md:block">
                Halo, {userData?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Login Page ---
const LoginPage = ({ setPage }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = `${phone}@cinunuk.app`;
      await signInWithEmailAndPassword(auth, email, password);
      // Auth listener will handle redirect
    } catch (err) {
      if (err.code === "auth/operation-not-allowed") {
        setError(
          "Error: Login dengan Email/Password belum aktif. Harap aktifkan di Firebase Console > Authentication > Sign-in method."
        );
      } else {
        setError("Nomor WhatsApp atau Kata Sandi salah.");
      }
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke Akun Anda
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              id="phone"
              name="phone"
              type="tel"
              placeholder="Nomor WhatsApp (e.g., 0812...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <button
            onClick={() => setPage("register")}
            className="font-medium text-green-600 hover:text-green-500"
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Register Page ---
const RegisterPage = ({ setPage }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("warga");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Konfirmasi Kata Sandi tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setError("Kata Sandi minimal 8 karakter.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const email = `${phone}@cinunuk.app`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phone,
        role,
      });
      // Auth listener will handle redirect
    } catch (err) {
      if (err.code === "auth/operation-not-allowed") {
        setError(
          "Error: Registrasi dengan Email/Password belum aktif. Harap aktifkan di Firebase Console > Authentication > Sign-in method."
        );
      } else if (err.code === "auth/email-already-in-use") {
        setError("Nomor WhatsApp ini sudah terdaftar.");
      } else {
        setError("Pendaftaran gagal. Silakan coba lagi.");
      }
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Buat Akun Baru
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <InputField
              id="name"
              name="name"
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              id="phone-reg"
              name="phone-reg"
              type="tel"
              placeholder="Nomor WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputField
              id="password-reg"
              name="password-reg"
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium text-gray-700">
                Saya adalah seorang:
              </label>
              <div className="mt-2 flex space-x-4">
                <RadioOption
                  id="warga"
                  name="role"
                  value="warga"
                  checked={role === "warga"}
                  onChange={(e) => setRole(e.target.value)}
                  label="Warga"
                />
                <RadioOption
                  id="pengepul"
                  name="role"
                  value="pengepul"
                  checked={role === "pengepul"}
                  onChange={(e) => setRole(e.target.value)}
                  label="Pengepul"
                />
              </div>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <button
            onClick={() => setPage("login")}
            className="font-medium text-green-600 hover:text-green-500"
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Jual Sampah Page (Warga) ---
const JualSampahPage = () => {
  const { userData } = useAuth();
  const [wasteType, setWasteType] = useState("Botol Plastik PET");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        setMessage("Ukuran file maksimal 2MB.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) {
      setMessage("Perkiraan berat wajib diisi.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = null;
      if (image) {
        const storageRef = ref(
          storage,
          `waste_images/${auth.currentUser.uid}_${Date.now()}`
        );
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "waste_listings"), {
        sellerUid: auth.currentUser.uid,
        sellerName: userData.name,
        sellerPhone: userData.phone,
        wasteType,
        estimatedWeightKg: parseFloat(weight),
        imageUrl,
        status: "available",
        createdAt: serverTimestamp(),
      });

      setMessage("Postingan berhasil dibuat!");
      setWasteType("Botol Plastik PET");
      setWeight("");
      setImage(null);
      setPreview(null);
      e.target.reset(); // reset file input
    } catch (err) {
      setMessage("Gagal membuat postingan. Silakan coba lagi.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Jual Sampah Anorganik
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="wasteType"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Sampah
            </label>
            <select
              id="wasteType"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option>Botol Plastik PET</option>
              <option>Kardus/Karton</option>
              <option>Kertas HVS/Buku</option>
              <option>Kaleng Aluminium</option>
              <option>Besi/Logam</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Perkiraan Berat (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              placeholder="e.g., 5.5"
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto Sampah (Opsional)
            </label>
            <div className="mt-1 flex items-center space-x-6">
              <div className="shrink-0">
                {preview ? (
                  <img
                    className="h-16 w-16 object-cover rounded-md"
                    src={preview}
                    alt="Pratinjau"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </label>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm p-2 rounded-md ${
                message.includes("berhasil")
                  ? "text-green-800 bg-green-100"
                  : "text-red-800 bg-red-100"
              }`}
            >
              {message}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {loading ? "Memposting..." : "Posting Sampah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Daftar Sampah Page (Pengepul) ---
const DaftarSampahPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "waste_listings"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const listingsData = [];
        querySnapshot.forEach((doc) => {
          listingsData.push({ id: doc.id, ...doc.data() });
        });
        setListings(listingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching listings: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Daftar Sampah Tersedia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Daftar Sampah Tersedia
      </h2>
      {listings.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Belum ada postingan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Warga belum ada yang memposting sampah untuk dijual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <WasteCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Waste Card Component ---
const WasteCard = ({ listing }) => {
  const {
    sellerName,
    wasteType,
    estimatedWeightKg,
    imageUrl,
    sellerPhone,
    createdAt,
  } = listing;

  const handleContact = () => {
    const phone = sellerPhone.startsWith("0")
      ? "62" + sellerPhone.substring(1)
      : sellerPhone;
    const message = `Halo ${sellerName}, saya tertarik dengan postingan sampah ${wasteType} Anda di Aplikasi AnorgaLink.`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img
        className="h-56 w-full object-cover"
        src={
          imageUrl ||
          "https://placehold.co/400x400/e2e8f0/64748b?text=Tanpa+Gambar"
        }
        alt={`Sampah ${wasteType}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/400x400/e2e8f0/64748b?text=Gagal+Muat";
        }}
      />
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-gray-500">
          {createdAt?.toDate().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h3 className="text-xl font-bold text-gray-900 mt-2">{wasteType}</h3>
        <p className="text-gray-700 mt-1">
          Estimasi:{" "}
          <span className="font-semibold">{estimatedWeightKg} kg</span>
        </p>
        <p className="text-gray-700">
          Penjual: <span className="font-semibold">{sellerName}</span>
        </p>
        <div className="mt-auto pt-4">
          <button
            onClick={handleContact}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.828 8.828 0 01-4.32-1.142L2 18l1.142-3.678A8.963 8.963 0 012 10c0-4.418 4.03-8 9-8s8 3.582 8 8zM7.34 16.142c.22-.1.43-.22.63-.35.2-.13.4-.26.58-.4.2-.13.38-.27.55-.42.18-.15.34-.3.5-.47.16-.17.3-.34.44-.53.14-.18.26-.38.37-.58.1-.2.18-.4.25-.6.07-.2.12-.4.15-.6.03-.2.05-.4.05-.6 0-.2-.02-.4-.05-.6s-.08-.38-.15-.56c-.07-.18-.16-.36-.28-.52s-.25-.3-.4-.44c-.15-.13-.3-.26-.48-.36s-.37-.2-.58-.27c-.2-.08-.4-.13-.6-.16-.2-.04-.4-.05-.6-.05-.2 0-.4.02-.58.05-.2.03-.38.08-.55.13-.17.06-.33.13-.48.2-.15.08-.28.17-.4.26-.12.1-.23.2-.32.3-.1.1-.18.2-.25.3-.07.1-.13.2-.18.3-.05.1-.08.2-.1.3s-.05.18-.05.27c0 .1.02.18.05.26.03.08.08.16.13.24.05.08.1.15.18.22.07.07.15.14.22.2.08.07.16.13.24.18.08.05.16.1.25.14.08.04.17.08.26.1.1.03.18.05.28.06.1.02.2.02.3 0 .1 0 .2 0 .28-.02.1-.02.18-.04.26-.06.08-.04.15-.08.22-.1.07-.06.14-.1.2-.14.07-.04.13-.08.18-.1.05-.03.1-.05.14-.06.04-.01.08-.2.1-.02.04 0 .08 0 .1.02.03 0 .05.02.08.02.02 0 .04.02.06.03.02.01.04.02.06.04.02.01.03.03.05.04.02.02.03.04.04.06.02.02.02.05.03.07.01.02.02.05.02.08 0 .03-.01.06-.02.08-.01.03-.02.05-.04.08-.02.02-.04.05-.06.07-.02.02-.05.04-.08.06-.03.02-.06.04-.1.05-.03.02-.07.03-.1.04-.04.01-.08.02-.12.03-.04.01-.08.02-.13.02s-.1.01-.14.01c-.05 0-.1 0-.14-.01s-.08-.01-.12-.02c-.04-.01-.08-.02-.12-.03-.04-.01-.08-.02-.1-.04-.03-.01-.06-.02-.08-.04-.02-.01-.04-.03-.06-.04-.02-.02-.04-.03-.05-.05-.02-.02-.03-.04-.04-.06-.01-.02-.02-.04-.02-.06 0-.03.01-.06.02-.08.01-.03.02-.05.04-.08.02-.02.04-.05.06-.07.02-.02.05-.04.08-.06.03-.02.06-.04.1-.05.03-.02.07-.03.1-.04.04-.01.08-.02.12-.03.04-.01.08-.02.13-.02s.1-.01.14-.01z"
                clipRule="evenodd"
              />
            </svg>
            <span>Hubungi via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-56 w-full bg-gray-300"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mt-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
      <div className="h-10 bg-gray-300 rounded-lg mt-6"></div>
    </div>
  </div>
);

// --- Reusable Form Field Components ---
const InputField = ({ id, ...props }) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {props.placeholder}
    </label>
    <input
      id={id}
      required
      className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
      {...props}
    />
  </div>
);

const RadioOption = ({ id, label, ...props }) => (
  <div className="flex items-center">
    <input
      id={id}
      type="radio"
      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
      {...props}
    />
    <label
      htmlFor={id}
      className="ml-3 block text-sm font-medium text-gray-700"
    >
      {label}
    </label>
  </div>
);
