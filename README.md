# Absendulu

**Absendulu** adalah aplikasi **absensi karyawan berbasis geofence & PWA**.  
Didesain untuk perusahaan modern yang ingin sistem absensi **tanpa mesin fingerprint**, mudah digunakan.

---

## ✨ Fitur Utama
- 📍 **Absensi Geofence**  
  Validasi lokasi karyawan menggunakan GPS dengan radius yang bisa diatur.

- 📱 **PWA (Progressive Web App)**  
  Bisa diakses dari browser atau di-install ke home screen. Offline-first, otomatis sinkron saat online.

- 🕒 **Clock-In / Clock-Out**  
  Catat waktu masuk dan pulang secara real-time.

- 📑 **Approval Izin & Cuti**  
  Karyawan bisa mengajukan izin (cuti, sakit, WFH), atasan dapat menyetujui/menolak.

- 🏢 **Multi Company**  
  1 user bisa membuat perusahaan sendiri. Gratis hanya untuk 1 perusahaan & 1 lokasi.

- 📊 **Laporan Absensi**  
  Export data absensi karyawan untuk keperluan HR/Payroll.

---

## 🛠️ Teknologi
- **Frontend**: SvelteKit 5 + TailwindCSS  
- **Backend**: Node.js (Express / NestJS) atau Go (opsional)  
- **Database**: PostgreSQL
- **Auth**: JWT  
- **Storage**: S3 Compatible  
- **Deployment**: Docker + Kubernetes  

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/ardipc/absendulu.git
cd absendulu
