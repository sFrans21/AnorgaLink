import React, { useState } from "react";
import { useAuth } from "../../App";
import styles from "./JualSampahPage.module.css";

const JualSampahPage = ({
  addDoc,
  collection,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  storage,
  db,
  auth,
}) => {
  const { userData } = useAuth();
  const [wasteType, setWasteType] = useState("Botol Plastik PET");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setMessage("");
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
      e.target.reset();
    } catch (err) {
      setMessage("Gagal membuat postingan. Silakan coba lagi.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Jual Sampah Anorganik</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="wasteType" className={styles.label}>
              Jenis Sampah
            </label>
            <select
              id="wasteType"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className={styles.selectInput}
            >
              <option>Botol Plastik PET</option>
              <option>Kardus/Karton</option>
              <option>Kertas HVS/Buku</option>
              <option>Kaleng Aluminium</option>
              <option>Besi/Logam Lainnya</option>
            </select>
          </div>
          <div>
            <label htmlFor="weight" className={styles.label}>
              Perkiraan Berat (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              placeholder="e.g., 5.5"
              className={styles.textInput}
            />
          </div>
          <div>
            <label className={styles.label}>
              Foto Sampah (Opsional, maks 2MB)
            </label>
            <div className={styles.imageUploadContainer}>
              <div className={styles.imagePreviewContainer}>
                {preview ? (
                  <img
                    className={styles.imagePreview}
                    src={preview}
                    alt="Pratinjau"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.placeholderIcon}
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
              <label className={styles.fileInputLabel}>
                <span className="sr-only">Pilih foto</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg"
                  className={styles.fileInput}
                />
              </label>
            </div>
          </div>

          {message && (
            <p
              className={`${styles.message} ${
                message.includes("berhasil") ? styles.success : styles.error
              }`}
            >
              {message}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Memposting..." : "Posting Sampah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JualSampahPage;
