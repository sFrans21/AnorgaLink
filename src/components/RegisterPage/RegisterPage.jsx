import React, { useState } from "react";
import styles from "./RegisterPage.module.css";

const InputField = (props) => (
  <div>
    <label htmlFor={props.id} className={styles.srOnly}>
      {props.placeholder}
    </label>
    <input required className={styles.inputField} {...props} />
  </div>
);

const RadioOption = ({ id, label, ...props }) => (
  <div className={styles.radioContainer}>
    <input id={id} type="radio" className={styles.radioInput} {...props} />
    <label htmlFor={id} className={styles.radioLabel}>
      {label}
    </label>
  </div>
);

const RegisterPage = ({
  setPage,
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  db,
  auth,
}) => {
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
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Nomor WhatsApp ini sudah terdaftar.");
      } else {
        setError("Pendaftaran gagal. Silakan coba lagi.");
      }
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div>
          <h2 className={styles.title}>Buat Akun Baru</h2>
        </div>
        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
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
              <label className={styles.roleLabel}>Saya adalah seorang:</label>
              <div className={styles.radioGroup}>
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
          {error && <p className={styles.errorText}>{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </div>
        </form>
        <p className={styles.footerText}>
          Sudah punya akun?{" "}
          <button
            onClick={() => setPage("login")}
            className={styles.linkButton}
          >
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
