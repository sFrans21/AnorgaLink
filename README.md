# AnorgaLink

## Ikhtisar Proyek

### Latar Belakang

Aplikasi ini bertujuan untuk mengatasi inefisiensi dalam pengelolaan sampah anorganik. Aplikasi ini menghubungkan warga yang memiliki sampah terpilah (seperti plastik, kardus, dan kaleng) dengan pengepul. Tujuannya adalah untuk menggantikan proses yang tidak terstruktur dengan sistem digital yang lebih terorganisir.

### Tujuan

Meluncurkan MVP (Minimum Viable Product) fungsional yang bertindak sebagai katalisator transaksi sampah anorganik.

### Fitur Fungsional

1. Pendaftaran Akun: Pengguna dapat mendaftar sebagai Warga atau Pengepul dengan mengisi nama, nomor WhatsApp, dan kata sandi.

2. Login & Otentikasi: Pengguna yang terdaftar dapat masuk ke aplikasi. Email pengguna dibuat dari nomor WhatsApp (contoh: 081234567890@cinunuk.app).

3. Membuat Postingan Sampah (Warga): Pengguna dengan peran Warga dapat membuat postingan baru, memilih jenis sampah, memasukkan perkiraan berat, dan mengunggah foto opsional.

4. Melihat Daftar Sampah (Pengepul): Pengguna dengan peran Pengepul dapat melihat daftar real-time dari semua postingan sampah yang tersedia.

5. Hubungi via WhatsApp: Pengepul dapat mengklik tombol pada setiap postingan untuk menghubungi penjual secara langsung melalui WhatsApp dengan pesan yang sudah diformat.

6. Aturan Keamanan Firebase: Aturan keamanan yang ketat diterapkan untuk memastikan pengguna hanya dapat memodifikasi datanya sendiri dan hanya Pengepul yang terautentikasi dapat membaca semua postingan.

### Teknologi yang Digunakan

1. Frontend: Next.js 13+ (App Router, Server Components & Client Components)

2. UI Framework: Chakra UI

3. Manajemen Form: React Hook Form

4. Backend: Firebase (Firestore, Authentication)

5. Deployment: Vercel

### Panduan Setup

Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah berikut:

1. Clone Repositori:

```git clone [URL_REPOSITORI_ANDA]
cd anorgalink
```

2. Instal Dependensi:

```npm install

```

3. Konfigurasi Firebase:
   Anda perlu membuat file .env.local di direktori root dan menambahkan kredensial Firebase Anda.

```VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

4. Jalankan Aplikasi:
   npm run dev
   Aplikasi akan berjalan di localhost anda.

### Penjelasan Dukungan AI

Proses perencanaan dan arsitektur proyek ini dibantu oleh IBM Granite. IBM Granite digunakan untuk merancang struktur data JSON yang optimal untuk Firestore, memastikan desain database yang efisien dan mencegah masalah performa di masa depan. Dengan bertindak sebagai "arsitek sistem junior", AI membantu developer menghemat waktu riset dan menerapkan praktik terbaik sejak awal.
