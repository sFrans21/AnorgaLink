AnorgaLink
Ikhtisar Proyek
Latar Belakang
Aplikasi ini bertujuan untuk mengatasi inefisiensi dalam pengelolaan sampah anorganik. Aplikasi ini menghubungkan warga yang memiliki sampah terpilah (seperti plastik, kardus, dan kaleng) dengan pengepul. Tujuannya adalah untuk menggantikan proses yang tidak terstruktur dengan sistem digital yang lebih terorganisir.

Tujuan
Meluncurkan MVP (Minimum Viable Product) fungsional yang bertindak sebagai katalisator transaksi sampah anorganik.

Fitur Fungsional
Pendaftaran Akun: Pengguna dapat mendaftar sebagai Warga atau Pengepul dengan mengisi nama, nomor WhatsApp, dan kata sandi.

Login & Otentikasi: Pengguna yang terdaftar dapat masuk ke aplikasi. Email pengguna dibuat dari nomor WhatsApp (contoh: 081234567890@cinunuk.app).

Membuat Postingan Sampah (Warga): Pengguna dengan peran Warga dapat membuat postingan baru, memilih jenis sampah, memasukkan perkiraan berat, dan mengunggah foto opsional.

Melihat Daftar Sampah (Pengepul): Pengguna dengan peran Pengepul dapat melihat daftar real-time dari semua postingan sampah yang tersedia.

Hubungi via WhatsApp: Pengepul dapat mengklik tombol pada setiap postingan untuk menghubungi penjual secara langsung melalui WhatsApp dengan pesan yang sudah diformat.

Aturan Keamanan Firebase: Aturan keamanan yang ketat diterapkan untuk memastikan pengguna hanya dapat memodifikasi datanya sendiri dan hanya Pengepul yang terautentikasi dapat membaca semua postingan.

Teknologi yang Digunakan
Frontend: Next.js 13+ (App Router, Server Components & Client Components)

UI Framework: Chakra UI

Manajemen Form: React Hook Form

Backend: Firebase (Firestore, Authentication, Cloud Storage)

Deployment: Netlify

Panduan Setup
Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah berikut:

Clone Repositori:

Bash

git clone [URL_REPOSITORI_ANDA]
cd anorgalink
Instal Dependensi:

Bash

npm install
Konfigurasi Firebase:
Anda perlu membuat file .env.local di direktori root dan menambahkan kredensial Firebase Anda.

Cuplikan kode

VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
Jalankan Aplikasi:

Bash

npm run dev
Aplikasi akan berjalan di http://localhost:3000.

Penjelasan Dukungan AI
Proses perencanaan dan arsitektur proyek ini dibantu oleh AI (Gemini). AI digunakan untuk merancang struktur data JSON yang optimal untuk Firestore, memastikan desain database yang efisien dan mencegah masalah performa di masa depan. Dengan bertindak sebagai "arsitek sistem junior", AI membantu tim developer menghemat waktu riset dan menerapkan praktik terbaik sejak awal.
