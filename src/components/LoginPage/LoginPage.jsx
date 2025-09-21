import React, { useState } from "react";
import styles from "./LoginPage.module.css";

const InputField = (props) => (
  <div>
    <label htmlFor={props.id} className={styles.srOnly}>
      {props.placeholder}
    </label>
    <input required className={styles.inputField} {...props} />
  </div>
);

const LoginPage = ({ setPage, signInWithEmailAndPassword, auth }) => {
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
    } catch (err) {
      if (err.code === "auth/operation-not-allowed") {
        setError(
          "Error: Login dengan Email/Password belum aktif. Harap aktifkan di Firebase Console."
        );
      } else {
        setError("Nomor WhatsApp atau Kata Sandi salah.");
      }
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div>
          <h2 className={styles.title}>Masuk ke Akun Anda</h2>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
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
          {error && <p className={styles.errorText}>{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </form>
        <p className={styles.footerText}>
          Belum punya akun?{" "}
          <button
            onClick={() => setPage("register")}
            className={styles.linkButton}
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
