/**
 * SIPESAN-DESA - Sistem Informasi Surat Pesanan & BAST Barang Desa
 * Full Application Core Engine (Aesthetic Blue & White Theme + Support Pemesan TPK & Kasi/Kaur Pelaksana Kegiatan)
 */

// ==========================================
// 1. HELPER UTILITIES
// ==========================================

function terbilang(angka) {
  const bil = Math.floor(Math.abs(Number(angka))) || 0;
  if (bil === 0) return 'Nol Rupiah';

  const kata = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

  function convert(n) {
    if (n < 12) return ' ' + kata[n];
    if (n < 20) return convert(n - 10) + ' Belas';
    if (n < 100) return convert(Math.floor(n / 10)) + ' Puluh' + convert(n % 10);
    if (n < 200) return ' Seratus' + convert(n - 100);
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus' + convert(n % 100);
    if (n < 2000) return ' Seribu' + convert(n - 1000);
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu' + convert(n % 1000);
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta' + convert(n % 1000000);
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + ' Milyar' + convert(n % 1000000000);
    return convert(Math.floor(n / 1000000000000)) + ' Trilyun' + convert(n % 1000000000000);
  }

  const hasil = convert(bil).trim();
  return (hasil + ' Rupiah').replace(/\s+/g, ' ');
}

function formatRupiah(num) {
  const val = Number(num) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function formatTanggalIndo(dateString) {
  if (!dateString) return '-';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('id-ID', options);
}

function getNamaHariIndo(dateString) {
  if (!dateString) return 'Senin';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const date = new Date(dateString);
  return days[date.getDay()] || 'Senin';
}

const STORAGE_KEY = 'SIPESAN_DESA_DATA_V1';

const defaultData = {
  profilDesa: {
    kabupaten: 'PEMERINTAH KABUPATEN KUTAI TIMUR',
    kecamatan: 'KECAMATAN SANGKULIRANG',
    desa: 'DESA TANJUNG MANIS',
    alamat: 'Jl Poros RT.03 Dusun I, Desa Tanjung Manis, Kec. Sangkulirang, Kab. Kutai Timur 75684',
    telepon: '(081) 635123',
    email: 'pemdes.tanjungmanis@gmail.com',
    website: 'https://tanjungmanis.desa.id',
    kadesNama: 'ASMAIL',
    kadesNip: '19750412 200501 1 003',
    sekdesNama: 'BUDI SANTOSO, S.T.',
    sekdesNip: '19820815 201001 1 005',
    ppkdNama: 'Abdul Hanafi',
    ppkdNip: '-',
    ppkdJabatan: 'Kaur Keuangan / PPKD',
    tpkNama: 'Agus Salim',
    tpkJabatan: 'Ketua Tim Pengelola Kegiatan (TPK)',
    pelaksanaList: [
      { id: 'pk-1', nama: 'Agus Salim', jabatan: 'Ketua Tim Pengelola Kegiatan (TPK)', nip: '-' },
      { id: 'pk-2', nama: 'Hendra', jabatan: 'Kasi Kesejahteraan (Pelaksana Kegiatan)', nip: '-' },
      { id: 'pk-3', nama: 'Risnawati', jabatan: 'Kasi Pelayanan (Pelaksana Kegiatan)', nip: '-' },
      { id: 'pk-4', nama: 'Aco', jabatan: 'Kasi Pemerintahan (Pelaksana Kegiatan)', nip: '-' },
      { id: 'pk-5', nama: 'Rusli', jabatan: 'Kaur Umum dan Perencanaan (Pelaksana Kegiatan)', nip: '-' },
      { id: 'pk-6', nama: 'Abdul Hanafi', jabatan: 'Kaur Keuangan (Pelaksana Kegiatan)', nip: '-' }
    ]
  },
  suppliers: [
    {
      id: 'sup-1',
      namaToko: 'Kukuruyuk Pesanan',
      pemilik: 'Pemilik Toko Kukuruyuk',
      alamat: 'Jl. Poros RT 03 Desa Tanjung Manis, Kec. Sangkulirang',
      telepon: '0812-3456-7890',
      npwp: '81.234.567.8-521.000',
      bank: 'Bank BPD Kaltimtara / BRI Cab. Sangkulirang',
      rekening: '2-003-12345-6'
    },
    {
      id: 'sup-2',
      namaToko: 'CV. Technomedia Utama',
      pemilik: 'Rian Hidayat, S.Kom.',
      alamat: 'Jl. Poros Sangkulirang, Kab. Kutai Timur',
      telepon: '0813-9876-5432',
      npwp: '72.987.654.3-521.000',
      bank: 'BRI Cabang Sangkulirang',
      rekening: '0081-01-002345-50-1'
    }
  ],
  masterBarang: (typeof window !== 'undefined' && window.RAB_KATALOG_2026 && window.RAB_KATALOG_2026.length > 0)
    ? window.RAB_KATALOG_2026
    : [
        { id: 'mb-1', namaBarang: 'Kertas Hvs A4', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Rim', hargaSatuan: 130000, kategori: 'Alat Tulis Kantor (ATK) & Cetak' },
        { id: 'mb-2', namaBarang: 'Kertas Hvs F4', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Rim', hargaSatuan: 100000, kategori: 'Alat Tulis Kantor (ATK) & Cetak' },
        { id: 'mb-3', namaBarang: 'Pulpen', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Kotak', hargaSatuan: 60000, kategori: 'Alat Tulis Kantor (ATK) & Cetak' },
        { id: 'mb-4', namaBarang: 'Balok Ulin 5x10', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'M3', hargaSatuan: 7000000, kategori: 'Bahan Bangunan & Material Fisik' },
        { id: 'mb-5', namaBarang: 'Balok Ulin 5x10 (Gelegar Atas)', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Potong', hargaSatuan: 140000, kategori: 'Bahan Bangunan & Material Fisik' },
        { id: 'mb-6', namaBarang: 'Balok Ulin 10x10', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Potong', hargaSatuan: 320000, kategori: 'Bahan Bangunan & Material Fisik' },
        { id: 'mb-7', namaBarang: 'Papan Ulin', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Lembar', hargaSatuan: 125000, kategori: 'Bahan Bangunan & Material Fisik' },
        { id: 'mb-8', namaBarang: 'Semen', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Sak', hargaSatuan: 120000, kategori: 'Bahan Bangunan & Material Fisik' },
        { id: 'mb-9', namaBarang: 'Nasi Kotak', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Kotak', hargaSatuan: 35000, kategori: 'Konsumsi, Makanan & Minuman' },
        { id: 'mb-10', namaBarang: 'Tisu', spesifikasi: 'Standar RAB APBDes 2026', satuan: 'Pak', hargaSatuan: 20000, kategori: 'Kebersihan & Perlengkapan Rumah Tangga' }
      ],
  suratPesanan: [
    {
      id: 'sp-001',
      nomorSp: '027/005/SP/TPK-DS/2026',
      tanggalSp: '2026-08-01',
      waktuPenyerahan: '7 (Tujuh) Hari Kerja sejak Surat Pesanan diterbitkan',
      lokasiPenyerahan: 'Lokasi Kegiatan Dusun II RT 03 Desa Tanjung Manis',
      kegiatan: 'Pembangunan Rabat Beton Jalan Usaha Tani RT 03 Dusun II',
      sumberDana: 'Dana Desa (DD) TA 2026',
      kodeRekening: '2.01.02.5.2.2.01',
      supplierId: 'sup-1',
      pemesanCategory: 'TPK',
      pemesanNama: 'Agus Salim',
      pemesanJabatan: 'Ketua Tim Pengelola Kegiatan (TPK)',
      pemesanNip: '-',
      items: [
        { namaBarang: 'Semen PCC (50 kg)', spesifikasi: 'Standar SNI, Merk Holcim / Gresik', volume: 100, satuan: 'Sak', hargaSatuan: 72000, total: 7200000 },
        { namaBarang: 'Pasir Pasang / Pasir Beton', spesifikasi: 'Pasir Lokal Kualitas Super Bebas Lumpur', volume: 25, satuan: 'M3', hargaSatuan: 220000, total: 5500000 },
        { namaBarang: 'Batu Belah / Batu Kali', spesifikasi: 'Ukuran 15/20 cm untuk Pondasi & Talud', volume: 20, satuan: 'M3', hargaSatuan: 250000, total: 5000000 }
      ],
      subtotal: 17700000,
      pajakPpnRate: 11,
      pajakPpnVal: 0,
      pajakPphRate: 0,
      pajakPphVal: 0,
      grandTotal: 17700000,
      terbilang: 'Tujuh Belas Juta Tujuh Ratus Ribu Rupiah',
      status: 'Selesai'
    },
    {
      id: 'sp-002',
      nomorSp: '027/008/SP/PPKD-DS/2026',
      tanggalSp: '2026-08-05',
      waktuPenyerahan: '3 (Tiga) Hari Kerja',
      lokasiPenyerahan: 'Kantor Balai Desa Tanjung Manis',
      kegiatan: 'Pengadaan Sarana & Prasarana Digitalisasi Pelayanan Desa',
      sumberDana: 'Alokasi Dana Desa (ADD) TA 2026',
      kodeRekening: '1.01.03.5.2.3.01',
      supplierId: 'sup-2',
      pemesanCategory: 'Kaur Pembangunan / Ekbang',
      pemesanNama: 'SITI RAHMAWATI, S.E.',
      pemesanJabatan: 'Kaur Pembangunan / Ekbang (Pelaksana Kegiatan)',
      pemesanNip: '19900315 201402 2 003',
      items: [
        { namaBarang: 'Laptop Operasional Desa', spesifikasi: 'Intel Core i5, RAM 16GB, SSD 512GB, Win 11 Ori', volume: 1, satuan: 'Unit', hargaSatuan: 10500000, total: 10500000 },
        { namaBarang: 'Printer Ink Tank Multifungsi', spesifikasi: 'Print, Scan, Copy, Wi-Fi Ink Tank System', volume: 1, satuan: 'Unit', hargaSatuan: 3250000, total: 3250000 }
      ],
      subtotal: 13750000,
      pajakPpnRate: 0,
      pajakPpnVal: 0,
      pajakPphRate: 0,
      pajakPphVal: 0,
      grandTotal: 13750000,
      terbilang: 'Tiga Belas Juta Tujuh Ratus Lima Puluh Ribu Rupiah',
      status: 'Diproses'
    }
  ],
  bastList: [
    {
      id: 'bast-001',
      nomorBast: '027/005/BAST/TPK-DS/2026',
      nomorBapb: '027/005/BAPB/TPK-DS/2026',
      tanggalBast: '2026-08-07',
      spId: 'sp-001',
      ketuaTpk: 'Agus Salim',
      anggotaTpk: 'Tim Pengelola Kegiatan (TPK)',
      hasilPemeriksaan: 'Semua barang yang dipesan telah diperiksa secara seksama oleh Tim Pengelola Kegiatan (TPK) Desa Tanjung Manis dan dinyatakan LENGKAP, 100% BAIK, serta SESUAI SPESIFIKASI Surat Pesanan.',
      statusCatatan: 'Baik & Lengkap'
    }
  ],
  papanProyekList: [
    {
      id: 'pp-001',
      kegiatan: 'Pembangunan Rabat Beton Jalan Usaha Tani RT 03',
      lokasi: 'Dusun II RT 03 Desa Tanjung Manis',
      volume: 'P = 350 M x L = 2,5 M x T = 0,15 M',
      sumberDana: 'Dana Desa (DD) TA 2026',
      tahunAnggaran: '2026',
      anggaran: 17700000,
      waktuPelaksanaan: '14 (Empat Belas) Hari Kalender',
      sifatKegiatan: 'Swakelola (Padat Karya Tunai Desa)',
      pelaksana: 'Tim Pengelola Kegiatan (TPK)',
      tanggalDibuat: '2026-08-01'
    }
  ],
  adminSecurity: {
    adminPin: '123456'
  }
};

function ensureArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return Object.values(val);
  return [];
}

function sanitizeAppData(raw) {
  if (!raw || typeof raw !== 'object') {
    return JSON.parse(JSON.stringify(defaultData));
  }

  const profilDesa = raw.profilDesa || defaultData.profilDesa;
  const rawPelaksana = (profilDesa && profilDesa.pelaksanaList) ? profilDesa.pelaksanaList : defaultData.profilDesa.pelaksanaList;
  const pelaksanaList = ensureArray(rawPelaksana);

  const rawMb = ensureArray(raw.masterBarang);
  const fallbackCatalog = (typeof window !== 'undefined' && window.RAB_KATALOG_2026 && window.RAB_KATALOG_2026.length > 0)
    ? window.RAB_KATALOG_2026
    : defaultData.masterBarang;

  const adminSec = (raw && raw.adminSecurity && raw.adminSecurity.adminPin)
    ? { adminPin: String(raw.adminSecurity.adminPin).trim() }
    : { adminPin: (localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN) };

  return {
    adminSecurity: adminSec,
    profilDesa: {
      ...defaultData.profilDesa,
      ...profilDesa,
      pelaksanaList: pelaksanaList.length > 0 ? pelaksanaList : defaultData.profilDesa.pelaksanaList
    },
    suppliers: ensureArray(raw.suppliers).length > 0 ? ensureArray(raw.suppliers) : defaultData.suppliers,
    masterBarang: (rawMb.length >= 20) ? rawMb : fallbackCatalog,
    suratPesanan: ensureArray(raw.suratPesanan),
    bastList: ensureArray(raw.bastList),
    papanProyekList: ensureArray(raw.papanProyekList).length > 0 ? ensureArray(raw.papanProyekList) : (defaultData.papanProyekList || [])
  };
}

function loadAppData() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) {
    const fresh = JSON.parse(JSON.stringify(defaultData));
    saveAppData(fresh);
    return fresh;
  }
  try {
    let parsed = JSON.parse(local);
    parsed = sanitizeAppData(parsed);
    let needsSave = false;

    if (parsed.adminSecurity && parsed.adminSecurity.adminPin) {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, parsed.adminSecurity.adminPin);
    }

    if (!parsed.profilDesa) {
      parsed.profilDesa = JSON.parse(JSON.stringify(defaultData.profilDesa));
      needsSave = true;
    }

    if (!parsed.profilDesa.ppkdNama || parsed.profilDesa.ppkdNama.toUpperCase().includes('HANIFAH')) {
      parsed.profilDesa.ppkdNama = 'Abdul Hanafi';
      parsed.profilDesa.ppkdJabatan = 'Kaur Keuangan / PPKD';
      needsSave = true;
    }

    if (!parsed.profilDesa.pelaksanaList || parsed.profilDesa.pelaksanaList.length === 0) {
      parsed.profilDesa.pelaksanaList = JSON.parse(JSON.stringify(defaultData.profilDesa.pelaksanaList));
      needsSave = true;
    } else {
      const hasMockSiti = parsed.profilDesa.pelaksanaList.some(p => p.nama && p.nama.toUpperCase().includes('SITI RAHMAWATI'));
      const hasMockBambang = parsed.profilDesa.pelaksanaList.some(p => p.nama && p.nama.toUpperCase().includes('BAMBANG HERMANTO'));
      const hasRisnawati = parsed.profilDesa.pelaksanaList.some(p => p.nama && p.nama.toUpperCase().includes('RISNAWATI'));
      
      // Auto-migrate legacy mock names to official 2026 village officials
      if (hasMockSiti || hasMockBambang || !hasRisnawati || parsed.profilDesa.pelaksanaList.length < 5) {
        parsed.profilDesa.pelaksanaList = JSON.parse(JSON.stringify(defaultData.profilDesa.pelaksanaList));
        needsSave = true;
      } else {
        parsed.profilDesa.pelaksanaList.forEach(pk => {
          if (pk.nama && (pk.nama.toUpperCase().includes('WIDODO') || pk.nama.toUpperCase().includes('WIBOWO'))) {
            pk.nama = 'Agus Salim';
            pk.jabatan = 'Ketua Tim Pengelola Kegiatan (TPK)';
            needsSave = true;
          }
        });
      }
    }

    // Auto-migrate legacy template dummy email / alamat
    if (parsed.profilDesa.email && parsed.profilDesa.email.includes('sukamaju')) {
      parsed.profilDesa.email = 'pemdes.tanjungmanis@gmail.com';
      needsSave = true;
    }
    if (parsed.profilDesa.tpkNama && (parsed.profilDesa.tpkNama.toUpperCase().includes('WIDODO') || parsed.profilDesa.tpkNama.toUpperCase().includes('WIBOWO') || parsed.profilDesa.tpkNama === 'HENDRA')) {
      parsed.profilDesa.tpkNama = 'Agus Salim';
      parsed.profilDesa.tpkJabatan = 'Ketua Tim Pengelola Kegiatan (TPK)';
      needsSave = true;
    }

    // Auto-migrate legacy dummy suppliers
    if (parsed.suppliers) {
      parsed.suppliers.forEach(sup => {
        if (sup.pemilik && (sup.pemilik.includes('Widodo') || sup.pemilik.includes('Wibowo'))) {
          sup.pemilik = 'Pemilik Toko Kukuruyuk';
          needsSave = true;
        }
        if (sup.namaToko && (sup.namaToko.includes('Sumber Makmur') || sup.namaToko.includes('Sumber Jaya'))) {
          sup.namaToko = 'Kukuruyuk Pesanan';
          needsSave = true;
        }
        if (sup.alamat && sup.alamat.includes('Sukamaju')) {
          sup.alamat = 'Jl. Poros RT 03 Desa Tanjung Manis, Kec. Sangkulirang';
          needsSave = true;
        }
      });
    }

    // Auto-migrate legacy dummy SPB
    if (parsed.suratPesanan) {
      parsed.suratPesanan.forEach(sp => {
        if (sp.pemesanNama && (sp.pemesanNama.toUpperCase().includes('WIDODO') || sp.pemesanNama.toUpperCase().includes('WIBOWO'))) {
          sp.pemesanNama = 'Agus Salim';
          needsSave = true;
        }
        if (sp.lokasiPenyerahan && sp.lokasiPenyerahan.includes('Sukamaju')) {
          sp.lokasiPenyerahan = sp.lokasiPenyerahan.replace(/Sukamaju/g, 'Desa Tanjung Manis');
          needsSave = true;
        }
      });
    }

    // Auto-migrate legacy dummy BAST
    if (parsed.bastList) {
      parsed.bastList.forEach(bast => {
        if (bast.ketuaTpk && (bast.ketuaTpk.toUpperCase().includes('WIDODO') || bast.ketuaTpk.toUpperCase().includes('WIBOWO'))) {
          bast.ketuaTpk = 'Agus Salim';
          needsSave = true;
        }
      });
    }

    // Auto-populate 2026 RAB catalog if not yet loaded or still has old dummy data
    if (typeof window !== 'undefined' && window.RAB_KATALOG_2026 && window.RAB_KATALOG_2026.length > 0) {
      if (!parsed.masterBarang || parsed.masterBarang.length < 20) {
        parsed.masterBarang = window.RAB_KATALOG_2026;
        needsSave = true;
      }
    }

    if (needsSave) {
      saveAppData(parsed);
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse localStorage data', e);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function saveAppDataLocalOnly(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveAppData(data) {
  saveAppDataLocalOnly(data);
  syncDataToCloud(data);
}

// ==========================================
// 1.5. CLOUD DATABASE & REALTIME SYNC (FIREBASE)
// ==========================================

const FIREBASE_CONFIG_STORAGE_KEY = 'SIPESAN_FIREBASE_CONFIG_V1';

let cloudState = {
  isConfigured: false,
  isConnected: false,
  status: 'unconfigured', // 'unconfigured' | 'connecting' | 'synced' | 'syncing' | 'offline' | 'error'
  lastSync: null,
  errorMessage: null,
  showModal: false
};

let firebaseDbRef = null;
let isRemoteUpdate = false;
let cloudSyncTimeout = null;

function loadFirebaseConfig() {
  const localConfig = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch (e) {
      console.warn('Failed to parse local firebase config', e);
    }
  }
  if (typeof window !== 'undefined' && window.SIPESAN_FIREBASE_CONFIG && typeof window.SIPESAN_FIREBASE_CONFIG === 'object') {
    return window.SIPESAN_FIREBASE_CONFIG;
  }
  return null;
}

function saveFirebaseConfig(config) {
  if (config) {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  }
}

function initFirebaseCloud() {
  if (typeof firebase === 'undefined') {
    cloudState.isConfigured = false;
    cloudState.status = 'offline';
    return;
  }

  const config = loadFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    cloudState.isConfigured = false;
    cloudState.status = 'unconfigured';
    return;
  }

  try {
    cloudState.isConfigured = true;
    cloudState.status = 'connecting';
    renderAppHeaderCloudStatus();

    let app;
    if (!firebase.apps || !firebase.apps.length) {
      app = firebase.initializeApp(config);
    } else {
      app = firebase.app();
    }

    const database = firebase.database();
    firebaseDbRef = database.ref('sipesan_desa_data');

    // Monitor Firebase connection state
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', snap => {
      if (snap.val() === true) {
        cloudState.isConnected = true;
        if (cloudState.status === 'connecting' || cloudState.status === 'offline') {
          cloudState.status = 'synced';
        }
      } else {
        cloudState.isConnected = false;
        if (cloudState.isConfigured) {
          cloudState.status = 'offline';
        }
      }
      renderAppHeaderCloudStatus();
    });

    // Listen for remote data changes in real-time
    firebaseDbRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const remoteData = snapshot.val();
        if (remoteData && remoteData.profilDesa) {
          isRemoteUpdate = true;
          const cleanData = sanitizeAppData(remoteData);
          if (cleanData.adminSecurity && cleanData.adminSecurity.adminPin) {
            localStorage.setItem(ADMIN_PIN_STORAGE_KEY, cleanData.adminSecurity.adminPin);
          }
          appState.data = cleanData;
          saveAppDataLocalOnly(cleanData);
          cloudState.lastSync = new Date();
          cloudState.status = 'synced';
          cloudState.errorMessage = null;
          isRemoteUpdate = false;
          renderApp();
        }
      } else {
        // Cloud is currently empty, initialize with current local data
        uploadDataToCloud(true);
      }
    }, err => {
      console.error('Firebase read error:', err);
      cloudState.status = 'error';
      cloudState.errorMessage = err.message || 'Gagal membaca data dari cloud';
      renderAppHeaderCloudStatus();
    });

  } catch (err) {
    console.error('Firebase init error:', err);
    cloudState.isConfigured = true;
    cloudState.status = 'error';
    cloudState.errorMessage = err.message || 'Kesalahan inisialisasi Firebase';
    renderAppHeaderCloudStatus();
  }
}

function syncDataToCloud(data) {
  if (!cloudState.isConfigured || !firebaseDbRef || isRemoteUpdate) return;

  cloudState.status = 'syncing';
  renderAppHeaderCloudStatus();

  clearTimeout(cloudSyncTimeout);
  cloudSyncTimeout = setTimeout(() => {
    if (!firebaseDbRef) return;
    firebaseDbRef.set(data)
      .then(() => {
        cloudState.status = 'synced';
        cloudState.lastSync = new Date();
        cloudState.errorMessage = null;
        renderAppHeaderCloudStatus();
      })
      .catch(err => {
        console.error('Firebase save error:', err);
        cloudState.status = 'error';
        cloudState.errorMessage = err.message;
        renderAppHeaderCloudStatus();
      });
  }, 400);
}

function uploadDataToCloud(silent = false) {
  if (!firebaseDbRef) {
    if (!silent) alert('Firebase belum terhubung. Silakan atur konfigurasi terlebih dahulu.');
    return;
  }
  cloudState.status = 'syncing';
  renderAppHeaderCloudStatus();

  firebaseDbRef.set(appState.data)
    .then(() => {
      cloudState.status = 'synced';
      cloudState.lastSync = new Date();
      cloudState.errorMessage = null;
      renderApp();
      if (!silent) alert('✅ Data SIPESAN-DESA berhasil diunggah dan disimpan ke Cloud Firebase!');
    })
    .catch(err => {
      cloudState.status = 'error';
      cloudState.errorMessage = err.message;
      renderApp();
      if (!silent) alert('❌ Gagal mengunggah ke Cloud: ' + err.message);
    });
}

function downloadDataFromCloud() {
  if (!firebaseDbRef) {
    alert('Firebase belum terhubung.');
    return;
  }
  cloudState.status = 'syncing';
  renderAppHeaderCloudStatus();

  firebaseDbRef.once('value')
    .then(snap => {
      if (snap.exists()) {
        const remoteData = snap.val();
        if (remoteData && remoteData.profilDesa) {
          const cleanData = sanitizeAppData(remoteData);
          if (cleanData.adminSecurity && cleanData.adminSecurity.adminPin) {
            localStorage.setItem(ADMIN_PIN_STORAGE_KEY, cleanData.adminSecurity.adminPin);
          }
          appState.data = cleanData;
          saveAppDataLocalOnly(cleanData);
          cloudState.status = 'synced';
          cloudState.lastSync = new Date();
          renderApp();
          alert('✅ Data terbaru berhasil ditarik dari Cloud Firebase!');
        } else {
          alert('Data di cloud tidak valid atau kosong.');
        }
      } else {
        alert('Data di cloud masih kosong.');
      }
    })
    .catch(err => {
      alert('Gagal mengambil data dari cloud: ' + err.message);
    });
}

function openCloudModal() {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal(() => {
      cloudState.showModal = true;
      renderApp();
    }, 'Pengaturan Cloud Firebase');
    return;
  }
  cloudState.showModal = true;
  renderApp();
}

function closeCloudModal() {
  cloudState.showModal = false;
  renderApp();
}

function saveFirebaseConfigFromInput() {
  const textarea = document.getElementById('firebase-config-input');
  if (!textarea) return;
  const raw = textarea.value.trim();
  if (!raw) {
    alert('Mohon masukkan kode konfigurasi Firebase terlebih dahulu.');
    return;
  }

  let config = null;

  try {
    config = JSON.parse(raw);
  } catch (e) {
    try {
      const apiKeyMatch = raw.match(/apiKey\s*:\s*["']([^"']+)["']/);
      const authDomainMatch = raw.match(/authDomain\s*:\s*["']([^"']+)["']/);
      const databaseURLMatch = raw.match(/databaseURL\s*:\s*["']([^"']+)["']/);
      const projectIdMatch = raw.match(/projectId\s*:\s*["']([^"']+)["']/);
      const storageBucketMatch = raw.match(/storageBucket\s*:\s*["']([^"']+)["']/);
      const messagingSenderIdMatch = raw.match(/messagingSenderId\s*:\s*["']([^"']+)["']/);
      const appIdMatch = raw.match(/appId\s*:\s*["']([^"']+)["']/);

      if (apiKeyMatch && projectIdMatch) {
        config = {
          apiKey: apiKeyMatch[1],
          authDomain: authDomainMatch ? authDomainMatch[1] : `${projectIdMatch[1]}.firebaseapp.com`,
          databaseURL: databaseURLMatch ? databaseURLMatch[1] : `https://${projectIdMatch[1]}-default-rtdb.asia-southeast1.firebasedatabase.app`,
          projectId: projectIdMatch[1],
          storageBucket: storageBucketMatch ? storageBucketMatch[1] : `${projectIdMatch[1]}.appspot.com`,
          messagingSenderId: messagingSenderIdMatch ? messagingSenderIdMatch[1] : '',
          appId: appIdMatch ? appIdMatch[1] : ''
        };
      }
    } catch (e2) {
      console.warn('Regex parse failed', e2);
    }
  }

  if (!config || !config.apiKey || !config.projectId) {
    alert('Format konfigurasi Firebase tidak valid. Pastikan memuat apiKey dan projectId dari Google Firebase Console.');
    return;
  }

  if (!config.databaseURL) {
    config.databaseURL = `https://${config.projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`;
  }

  saveFirebaseConfig(config);
  initFirebaseCloud();
  renderApp();
  alert('✅ Konfigurasi Firebase berhasil disimpan! Aplikasi sedang menghubungkan ke Google Cloud Database...');
}

function disconnectFirebase() {
  if (confirm('Apakah Anda yakin ingin memutuskan sambungan dari Firebase Cloud? Data di laptop tidak akan dihapus, namun tidak lagi tersinkron ke cloud.')) {
    saveFirebaseConfig(null);
    if (firebaseDbRef) {
      try { firebaseDbRef.off(); } catch (e) {}
      firebaseDbRef = null;
    }
    cloudState.isConfigured = false;
    cloudState.isConnected = false;
    cloudState.status = 'unconfigured';
    cloudState.errorMessage = null;
    renderApp();
    alert('Sambungan Firebase telah diputuskan.');
  }
}

function renderCloudStatusButton() {
  if (!cloudState.isConfigured) {
    return `
      <button onclick="openCloudModal()" title="Klik untuk mengaktifkan Database Online Cloud" class="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-800 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition duration-150">
        <i data-lucide="cloud-off" class="w-4 h-4 text-blue-600"></i>
        <span class="hidden sm:inline">Hubungkan Cloud</span>
        <span class="sm:hidden">Cloud</span>
      </button>
    `;
  }

  if (cloudState.status === 'syncing') {
    return `
      <button onclick="openCloudModal()" title="Sedang menyinkronkan data dengan Google Cloud..." class="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition duration-150">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        <span class="hidden sm:inline">Menyinkronkan...</span>
        <span class="sm:hidden">Sinkron</span>
      </button>
    `;
  }

  if (cloudState.status === 'synced') {
    return `
      <button onclick="openCloudModal()" title="Data tersimpan aman di Google Cloud (Real-time). Klik untuk info/pengaturan." class="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition duration-150">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <i data-lucide="cloud" class="w-3.5 h-3.5 text-emerald-600"></i>
        <span class="hidden sm:inline">Cloud Online</span>
        <span class="sm:hidden">Online</span>
      </button>
    `;
  }

  if (cloudState.status === 'offline') {
    return `
      <button onclick="openCloudModal()" title="Sedang offline. Data disimpan lokal sementara. Klik untuk cek." class="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition duration-150">
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        <i data-lucide="cloud-off" class="w-3.5 h-3.5 text-slate-500"></i>
        <span class="hidden sm:inline">Cloud Offline</span>
        <span class="sm:hidden">Offline</span>
      </button>
    `;
  }

  return `
    <button onclick="openCloudModal()" title="Koneksi cloud bermasalah: ${cloudState.errorMessage || ''}" class="px-3 py-1.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition duration-150">
      <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-red-600"></i>
      <span class="hidden sm:inline">Cloud Galat</span>
      <span class="sm:hidden">Galat</span>
    </button>
  `;
}

function renderAppHeaderCloudStatus() {
  const container = document.getElementById('header-cloud-btn-container');
  if (container) {
    container.innerHTML = renderCloudStatusButton();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}

function renderCloudModalHtml() {
  const isOnline = cloudState.isConnected;
  const isCfg = cloudState.isConfigured;
  const lastSyncStr = cloudState.lastSync 
    ? `${cloudState.lastSync.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, pukul ${cloudState.lastSync.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` 
    : 'Belum pernah';

  const currentCfg = loadFirebaseConfig();
  const cfgJsonStr = currentCfg ? JSON.stringify(currentCfg, null, 2) : '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-5 sm:p-6 text-white relative">
          <button onclick="closeCloudModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20">
              <i data-lucide="cloud" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg sm:text-xl font-black tracking-tight">Database Online Cloud (Firebase)</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${isCfg && isOnline ? 'bg-emerald-400 text-emerald-950' : (isCfg ? 'bg-amber-300 text-amber-950' : 'bg-white/20 text-white')}">
                  ${isCfg && isOnline ? 'Aktif & Online' : (isCfg ? 'Offline / Menghubungkan' : 'Belum Terhubung')}
                </span>
              </div>
              <p class="text-xs text-blue-100/90 mt-0.5">Semua data SPB, BAST & Plang Proyek otomatis tersimpan aman di server Google, bebas dari risiko memori browser terhapus.</p>
            </div>
          </div>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          
          <!-- Card 1: Live Status & Quick Sync -->
          <div class="p-4 rounded-2xl border ${isCfg && isOnline ? 'bg-emerald-50/70 border-emerald-200' : (isCfg ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200')} space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${isCfg && isOnline ? 'border-emerald-200/80' : 'border-slate-200'} pb-3">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Status Sinkronisasi Real-Time:</span>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="w-3 h-3 rounded-full ${isCfg && isOnline ? 'bg-emerald-500 animate-pulse' : (isCfg ? 'bg-amber-500' : 'bg-slate-400')}"></span>
                  <span class="font-black text-sm text-slate-900">
                    ${isCfg && isOnline ? 'Terhubung ke Google Cloud (Otomatis Sinkron)' : (isCfg ? 'Menunggu Koneksi Internet / Server' : 'Database Masih Tersimpan di Browser Lokal Saja')}
                  </span>
                </div>
              </div>
              <div class="text-left sm:text-right">
                <span class="text-[10px] text-slate-500 font-semibold block">Terakhir Disinkronkan:</span>
                <span class="font-bold text-slate-800">${lastSyncStr}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <button onclick="uploadDataToCloud(false)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 ${!isCfg ? 'opacity-50 cursor-not-allowed' : ''}">
                <i data-lucide="upload-cloud" class="w-4 h-4"></i> Unggah Data Laptop ke Cloud
              </button>
              <button onclick="downloadDataFromCloud()" class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold transition flex items-center gap-1.5 ${!isCfg ? 'opacity-50 cursor-not-allowed' : ''}">
                <i data-lucide="download-cloud" class="w-4 h-4"></i> Tarik Data Terbaru dari Cloud
              </button>
              ${isCfg ? `
                <button onclick="disconnectFirebase()" class="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl font-bold transition ml-auto">
                  Putuskan Sambungan
                </button>
              ` : ''}
            </div>
            ${cloudState.errorMessage ? `
              <div class="p-2.5 rounded-xl bg-red-100 border border-red-200 text-red-800 text-[11px] flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-red-600"></i>
                <span>${cloudState.errorMessage}</span>
              </div>
            ` : ''}
          </div>

          <!-- Card 2: Konfigurasi Firebase (Input Form) -->
          <div class="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <i data-lucide="settings" class="w-4 h-4 text-blue-600"></i> Konfigurasi Akun Firebase Desa
                </h4>
                <p class="text-[11px] text-slate-500">Tempelkan kode konfigurasi Firebase yang didapatkan dari Google Firebase Console.</p>
              </div>
              <a href="https://console.firebase.google.com" target="_blank" class="px-2.5 py-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold text-[11px] flex items-center gap-1">
                Buka Firebase <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Kode Konfigurasi (firebaseConfig atau JSON):</label>
              <textarea id="firebase-config-input" rows="5" placeholder='const firebaseConfig = {&#10;  apiKey: "AIzaSy...",&#10;  authDomain: "sipesan-tanjungmanis.firebaseapp.com",&#10;  databaseURL: "https://...",&#10;  projectId: "sipesan-tanjungmanis",&#10;  storageBucket: "...",&#10;  messagingSenderId: "...",&#10;  appId: "..."&#10;};' class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-[11px] text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none">${cfgJsonStr}</textarea>
            </div>

            <div class="flex items-center justify-between pt-1">
              <span class="text-[10px] text-slate-500 italic">💡 Cukup salin dan tempelkan langsung seluruh blok kode dari Firebase.</span>
              <button onclick="saveFirebaseConfigFromInput()" class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/25 transition flex items-center gap-1.5">
                <i data-lucide="check" class="w-4 h-4"></i> Simpan & Hubungkan ke Cloud
              </button>
            </div>
          </div>

          <!-- Card 3: Panduan 4 Langkah Sangat Mudah -->
          <div class="bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
            <h4 class="font-bold text-blue-950 text-sm flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4 text-blue-600"></i> Panduan Membuat Database Cloud Firebase (100% Gratis & Selamanya)
            </h4>
            <p class="text-[11px] text-slate-600">Anda hanya butuh 1 akun Google/Gmail desa (misal: <em>pemdes.tanjungmanis@gmail.com</em>). Proses ini hanya dilakukan <strong>1 kali saja</strong>:</p>

            <ol class="space-y-2.5 text-slate-700 text-[11px] pl-1">
              <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong>Buka Google Firebase Console</strong> di <a href="https://console.firebase.google.com" target="_blank" class="text-blue-600 underline font-bold">console.firebase.google.com</a> lalu login dengan akun Google desa.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  Klik tombol <strong>"Add Project" (Tambahkan Proyek)</strong>. Beri nama proyek: <code class="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">sipesan-tanjung-manis</code>, lalu klik Lanjut sampai proyek selesai dibuat.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  Di menu samping kiri, klik <strong>Build</strong> &rarr; pilih <strong>Realtime Database</strong> &rarr; klik <strong>"Create Database" (Buat Database)</strong>. Pilih lokasi <em>Singapore (asia-southeast1)</em> &rarr; pilih <strong>Start in test mode (Mode Uji)</strong> &rarr; klik <strong>Enable (Aktifkan)</strong>.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div>
                  Klik ikon <strong>Gerigi (Project settings)</strong> di kiri atas &rarr; scroll ke bawah ke bagian "Your apps", klik ikon Web <strong>&lt;/&gt;</strong> &rarr; beri nama aplikasi &rarr; klik Register app. Salin kode <strong>firebaseConfig</strong> yang muncul, lalu tempelkan ke kotak di atas!
                </div>
              </li>
            </ol>
          </div>

          <!-- Card 4: Cara Membuka Online Lewat HP & Laptop Siapapun -->
          <div class="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-amber-950 space-y-2">
            <h4 class="font-bold text-amber-950 text-sm flex items-center gap-2">
              <i data-lucide="globe" class="w-4 h-4 text-amber-600"></i> Cara Agar Aplikasi Ini Memiliki Link Web Sendiri (Bisa Dibuka di HP & Laptop)
            </h4>
            <p class="text-[11px] text-amber-900 leading-relaxed">
              Setelah terhubung ke Firebase, Anda juga bisa mengunggah folder aplikasi ini secara gratis ke <strong>Vercel (vercel.com)</strong> atau <strong>Firebase Hosting</strong>. 
              Dengan begitu, Anda akan mendapatkan alamat link seperti <code class="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-bold">https://sipesan-tanjungmanis.vercel.app</code> yang bisa langsung dibagikan via WhatsApp kepada teman-teman perangkat desa untuk dibuka kapan saja dan di mana saja tanpa perlu download atau kirim file ZIP lagi!
            </p>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span class="text-[11px] text-slate-500 font-medium">Data dienkripsi dan disimpan di infrastruktur Google Cloud.</span>
          <button onclick="closeCloudModal()" class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition">
            Tutup
          </button>
        </div>

      </div>
    </div>
  `;
}

// ==========================================
// 2. STATE MANAGEMENT & ROUTER
// ==========================================

// ==========================================
// 1.8. ADMINISTRATOR ACCESS CONTROL SYSTEM
// ==========================================

const ADMIN_PIN_STORAGE_KEY = 'SIPESAN_ADMIN_PIN_V1';
const ADMIN_SESSION_KEY = 'SIPESAN_ADMIN_LOGGED_IN_V1';
const DEFAULT_ADMIN_PIN = '123456';

function getStoredAdminPin() {
  const localPin = localStorage.getItem(ADMIN_PIN_STORAGE_KEY);
  if (localPin && localPin.trim()) {
    return localPin.trim();
  }
  if (appState && appState.data && appState.data.adminSecurity && appState.data.adminSecurity.adminPin) {
    const cloudPin = String(appState.data.adminSecurity.adminPin).trim();
    if (cloudPin) {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, cloudPin);
      return cloudPin;
    }
  }
  return DEFAULT_ADMIN_PIN;
}

function saveAdminPin(newPin) {
  const pin = String(newPin).trim();
  localStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin);
  if (!appState.data) appState.data = {};
  if (!appState.data.adminSecurity) appState.data.adminSecurity = {};
  appState.data.adminSecurity.adminPin = pin;
  saveAppData(appState.data);
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' || localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function loginAdmin(inputPin, rememberMe = false) {
  const currentPin = getStoredAdminPin();
  const clean = (inputPin || '').trim();

  // STRICT VALIDATION: ONLY the current active PIN is accepted!
  // If the admin has changed the PIN, the old 123456 is completely rejected.
  if (clean && clean === currentPin) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    if (rememberMe) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    }
    appState.showAdminLoginModal = false;
    const cb = appState.adminLoginCallback;
    appState.adminLoginCallback = null;
    appState.adminLoginReason = '';
    renderApp();
    if (typeof cb === 'function') {
      setTimeout(() => cb(), 100);
    }
    return true;
  }
  return false;
}

function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
  renderApp();
}

function openAdminLoginModal(onSuccessCallback = null, reason = '') {
  appState.showAdminLoginModal = true;
  appState.adminLoginCallback = onSuccessCallback;
  appState.adminLoginReason = reason;
  renderApp();
  setTimeout(() => {
    const el = document.getElementById('admin-pin-input');
    if (el) el.focus();
  }, 100);
}

function closeAdminLoginModal() {
  appState.showAdminLoginModal = false;
  appState.adminLoginCallback = null;
  appState.adminLoginReason = '';
  renderApp();
}

function openChangePinModal() {
  appState.showChangePinModal = true;
  renderApp();
}

function closeChangePinModal() {
  appState.showChangePinModal = false;
  renderApp();
}

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const pinInput = document.getElementById('admin-pin-input');
  const rememberEl = document.getElementById('admin-remember-me');
  const errEl = document.getElementById('admin-login-error');

  const ok = loginAdmin(pinInput.value, rememberEl ? rememberEl.checked : false);
  if (!ok) {
    if (errEl) {
      errEl.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
    pinInput.focus();
    pinInput.select();
  }
}

function submitChangeAdminPin(e) {
  e.preventDefault();
  const oldPin = document.getElementById('change-pin-old').value.trim();
  const newPin = document.getElementById('change-pin-new').value.trim();
  const confirmPin = document.getElementById('change-pin-confirm').value.trim();

  const currentPin = getStoredAdminPin();
  if (oldPin !== currentPin) {
    alert('PIN Lama tidak sesuai! Silakan periksa kembali.');
    return;
  }
  if (!newPin || newPin.length < 4) {
    alert('PIN Baru minimal 4 karakter / angka!');
    return;
  }
  if (newPin !== confirmPin) {
    alert('Konfirmasi PIN Baru tidak cocok!');
    return;
  }

  saveAdminPin(newPin);
  appState.showChangePinModal = false;
  renderApp();
  alert('PIN Administrator BERHASIL DIUBAH!\n\nMulai sekarang, HANYA PIN baru yang dapat digunakan. PIN lama 123456 sudah dinonaktifkan.');
}

function togglePinVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btnEl.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  } else {
    input.type = 'password';
    btnEl.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
  }
  if (window.lucide) lucide.createIcons();
}

const SAVED_PELAKSANA_KEY = 'SIPESAN_ACTIVE_PELAKSANA_V1';

function loadSavedPelaksanaId() {
  const saved = localStorage.getItem(SAVED_PELAKSANA_KEY);
  return (saved && saved !== 'all') ? saved : 'pk-1';
}

let appState = {
  currentView: 'dashboard',
  data: loadAppData(),
  editingSpId: null,
  editingBastId: null,
  editingPapanId: null,
  previewPapanId: null,
  printDocument: null,
  confirmModal: null,
  searchTerm: '',
  activePelaksanaId: loadSavedPelaksanaId(),
  showFridayReminder: false,
  filterTahunPapan: 'all',
  showRabPickerModal: false,
  rabSearchQuery: '',
  rabActiveCategory: 'all',
  masterBarangSearchQuery: '',
  masterBarangActiveCategory: 'all',
  showAdminLoginModal: false,
  adminLoginReason: '',
  adminLoginCallback: null,
  showChangePinModal: false,
};

function setFilterTahunPapan(tahun) {
  appState.filterTahunPapan = tahun;
  renderApp();
}

function switchActivePelaksana(id) {
  appState.activePelaksanaId = id;
  localStorage.setItem(SAVED_PELAKSANA_KEY, id);
  renderApp();
}

function showConfirmModal(title, message, onConfirm) {
  appState.confirmModal = { title, message, onConfirm };
  renderApp();
}

function closeConfirmModal() {
  appState.confirmModal = null;
  renderApp();
}

function executeConfirmModal() {
  if (appState.confirmModal && typeof appState.confirmModal.onConfirm === 'function') {
    const callback = appState.confirmModal.onConfirm;
    appState.confirmModal = null;
    callback();
  } else {
    appState.confirmModal = null;
    renderApp();
  }
}

function renderConfirmModalHtml() {
  const modal = appState.confirmModal;
  if (!modal) return '';
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <i data-lucide="alert-triangle" class="w-6 h-6"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900">${modal.title}</h3>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">${modal.message}</p>
        </div>
        <div class="flex justify-center gap-3 pt-2">
          <button onclick="closeConfirmModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
          <button onclick="executeConfirmModal()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition">Ya, Hapus</button>
        </div>
      </div>
    </div>
  `;
}

function closeFridayReminder() {
  setState({ showFridayReminder: false });
}

function triggerFridayExport() {
  closeFridayReminder();
  exportDataJson();
}

function renderFridayReminderModalHtml() {
  if (!appState.showFridayReminder) return '';
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div class="bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-8 text-center relative overflow-hidden">
          <!-- decorative circle -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
          
          <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto shadow-lg border border-white/20 mb-4">
            <i data-lucide="bell-ring" class="w-8 h-8"></i>
          </div>
          <h3 class="text-2xl font-black text-white tracking-tight">Hari Jumat! Waktunya Backup</h3>
        </div>
        <div class="p-6 text-center space-y-5">
          <p class="text-sm text-slate-600 font-medium leading-relaxed">
            Halo! Jangan lupa untuk mengekspor data Surat Pesanan Barang (SPB) dan BAST kamu minggu ini, lalu setorkan file JSON-nya ke Admin/Bendahara Desa ya!
          </p>
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3 text-left">
             <i data-lucide="info" class="w-5 h-5 text-blue-600 shrink-0"></i>
             <span class="text-xs text-blue-800 font-medium">Backup rutin sangat penting agar datamu tidak hilang jika browser ter-reset.</span>
          </div>
          <div class="flex flex-col gap-3 pt-2">
            <button onclick="triggerFridayExport()" class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <i data-lucide="download-cloud" class="w-4 h-4"></i> Ekspor Data JSON Sekarang
            </button>
            <button onclick="closeFridayReminder()" class="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition">
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAdminLoginModalHtml() {
  if (!appState.showAdminLoginModal) return '';

  const activePin = getStoredAdminPin();
  const isDefaultPin = (activePin === DEFAULT_ADMIN_PIN);

  return `
    <div id="modal-admin-login" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-300 text-amber-700 flex items-center justify-center shadow-xs">
              <i data-lucide="shield-alert" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-base text-slate-900">Akses Administrator</h3>
              <p class="text-xs text-slate-500">Khusus Pembuat Aplikasi (Abdul Hanafi)</p>
            </div>
          </div>
          <button onclick="closeAdminLoginModal()" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        ${appState.adminLoginReason ? `
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-950 font-medium">
            <i data-lucide="lock" class="w-4 h-4 text-amber-600 shrink-0"></i>
            <span>Fitur <strong>${appState.adminLoginReason}</strong> dikunci khusus Administrator.</span>
          </div>
        ` : ''}

        <form onsubmit="handleAdminLoginSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">Masukkan PIN Administrator:</label>
            <div class="relative">
              <input 
                type="password" 
                id="admin-pin-input" 
                placeholder="${isDefaultPin ? 'Masukkan PIN (Default: 123456)' : 'Masukkan PIN Administrator Anda'}" 
                class="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono tracking-widest text-center"
                required
                autocomplete="current-password"
              >
              <button 
                type="button" 
                onclick="togglePinVisibility('admin-pin-input', this)" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Lihat PIN"
              >
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
            <p id="admin-login-error" class="hidden text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i> PIN yang Anda masukkan salah!
            </p>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="admin-remember-me" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
            <label for="admin-remember-me" class="text-xs text-slate-600 cursor-pointer">Ingat status login di browser ini</label>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div class="font-bold flex items-center gap-1 text-slate-800">
              <i data-lucide="info" class="w-3.5 h-3.5 text-blue-600"></i> Informasi PIN:
            </div>
            ${isDefaultPin ? `
              <p>PIN default adalah <code class="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono font-bold text-blue-700">123456</code>. Setelah masuk, Anda dapat mengganti PIN ini kapan saja.</p>
            ` : `
              <p class="text-emerald-700 font-medium flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5 inline"></i> PIN kustom aktif. PIN default 123456 sudah dinonaktifkan permanen.</p>
            `}
          </div>

          <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button type="button" onclick="closeAdminLoginModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5">
              <i data-lucide="log-in" class="w-3.5 h-3.5"></i> Masuk Sebagai Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderChangePinModalHtml() {
  if (!appState.showChangePinModal) return '';

  return `
    <div id="modal-change-pin" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-300 text-blue-700 flex items-center justify-center">
              <i data-lucide="key" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-base text-slate-900">Ubah PIN Administrator</h3>
              <p class="text-xs text-slate-500">Ganti PIN keamanan akses Admin Anda</p>
            </div>
          </div>
          <button onclick="closeChangePinModal()" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <form onsubmit="submitChangeAdminPin(event)" class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">PIN Lama Saat Ini</label>
            <input type="password" id="change-pin-old" placeholder="Masukkan PIN lama yang sedang aktif" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono tracking-widest text-center" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">PIN Baru (Minimal 4 angka / huruf)</label>
            <input type="password" id="change-pin-new" placeholder="Masukkan PIN baru Anda" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono tracking-widest text-center" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi PIN Baru</label>
            <input type="password" id="change-pin-confirm" placeholder="Ulangi PIN baru" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none font-mono tracking-widest text-center" required>
          </div>

          <div class="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button type="button" onclick="closeChangePinModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Simpan PIN Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function setState(newState) {
  appState = { ...appState, ...newState };
  saveAppData(appState.data);
  renderApp();
}

// ==========================================
// 3. UI RENDER ENGINE
// ==========================================

function renderApp() {
  const container = document.getElementById('app');
  if (!container) return;

  try {
    container.innerHTML = `
    <!-- Top Header & Menu Navigation System -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 no-print shadow-md">
      <!-- Tier 1: Brand Logo, Mode Active Pelaksana, and Quick Action Buttons -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        
        <!-- App Logo & Village Badge -->
        <div class="flex items-center gap-3 cursor-pointer group" onclick="navigateTo('dashboard')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-black shadow-md shadow-blue-600/30 group-hover:scale-105 transition-all duration-300">
            <i data-lucide="scroll" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-lg tracking-tight gradient-text">SIPESAN</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold">
                <span class="pulse-dot">
                  <span class="pulse-dot-core"></span>
                </span>
                PEMDES
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <i data-lucide="map-pin" class="w-3 h-3 text-blue-500"></i> ${appState.data.profilDesa.desa || 'DESA TANJUNG MANIS'}
            </p>
          </div>
        </div>

        <!-- User / Pelaksana Switcher Hub & Admin Status -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2 bg-blue-50/90 border border-blue-200/80 rounded-xl px-3 py-1.5 shadow-xs">
            <div class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
            </div>
            <div class="text-left">
              <span class="block text-[8px] font-bold uppercase tracking-wider text-blue-700">Mode Pelaksana:</span>
              <select onchange="switchActivePelaksana(this.value)" class="bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer">
                <option value="all" ${appState.activePelaksanaId === 'all' ? 'selected' : ''}>🌐 Semua Pelaksana (Seluruh Desa)</option>
                ${(appState.data.profilDesa.pelaksanaList || defaultData.profilDesa.pelaksanaList).map(pk => `
                  <option value="${pk.id}" ${appState.activePelaksanaId === pk.id ? 'selected' : ''}>👤 ${pk.nama} (${pk.jabatan})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Admin Authentication Status Badge -->
          ${isAdminLoggedIn() ? `
            <div class="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-amber-100/90 border border-amber-300 text-amber-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <i data-lucide="shield-check" class="w-4 h-4 text-amber-600 shrink-0"></i>
              <span class="hidden sm:inline text-amber-800 text-[10px] uppercase tracking-wider">Admin:</span>
              <span class="font-extrabold text-amber-950">Abdul Hanafi</span>
              <button onclick="logoutAdmin()" class="ml-1.5 px-2 py-0.5 rounded-md bg-amber-200/80 hover:bg-red-100 hover:text-red-700 text-amber-900 text-[10px] font-bold transition" title="Kunci / Keluar Mode Administrator">
                Kunci
              </button>
            </div>
          ` : `
            <button onclick="openAdminLoginModal(null, 'Login Admin untuk membuka Cloud, Ekspor, Impor & Profil')" class="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 rounded-xl border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition shadow-xs" title="Login Khusus Pembuat Aplikasi (Kaur Keuangan)">
              <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Login Admin</span>
            </button>
          `}
        </div>

        <!-- Right Quick Action Tools -->
        <div class="flex items-center gap-2">
          <!-- Cloud Database Status Indicator Button -->
          <div id="header-cloud-btn-container">
            ${renderCloudStatusButton()}
          </div>

          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onclick="exportDataJson()" title="Ekspor Data Backup JSON" class="px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-white rounded-lg transition text-xs font-bold flex items-center gap-1">
              <i data-lucide="download" class="w-3.5 h-3.5 text-blue-600"></i> <span>Ekspor</span>
            </button>
            <button onclick="triggerImportJson()" title="Impor Data Backup JSON" class="px-2.5 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-white rounded-lg transition text-xs font-bold flex items-center gap-1">
              <i data-lucide="upload" class="w-3.5 h-3.5 text-indigo-600"></i> <span>Impor</span>
            </button>
            <input type="file" id="json-file-input" class="hidden" accept=".json" onchange="importDataJson(event)">
          </div>

          <button onclick="navigateTo('sp-form', { editingSpId: null })" class="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all duration-200 flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> SPB Baru
          </button>
        </div>
      </div>

      <!-- Tier 2: Dedicated 6 Main Menu Bar Grid (Clean, Full View, No Cursor Scroll Needed) -->
      <div class="bg-slate-100/90 py-2 border-t border-slate-200/60">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav class="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
            <!-- 1. Dashboard -->
            <button onclick="navigateTo('dashboard')" class="nav-tab-btn px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${appState.currentView === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.01]' : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80'}">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
              <span class="truncate">Dashboard</span>
            </button>

            <!-- 2. Surat Pesanan -->
            <button onclick="navigateTo('sp-list')" class="nav-tab-btn px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${appState.currentView.startsWith('sp-') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.01]' : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80'}">
              <i data-lucide="file-text" class="w-4 h-4"></i>
              <span class="truncate">Surat Pesanan</span>
            </button>

            <!-- 3. Serah Terima -->
            <button onclick="navigateTo('bast-list')" class="nav-tab-btn px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${appState.currentView.startsWith('bast-') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.01]' : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80'}">
              <i data-lucide="check-circle-2" class="w-4 h-4"></i>
              <span class="truncate">Serah Terima</span>
            </button>

            <!-- 4. Plang Proyek (BARU) -->
            <button onclick="navigateTo('papan-list')" class="nav-tab-btn px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${appState.currentView.startsWith('papan-') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.01]' : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80'}">
              <i data-lucide="signpost" class="w-4 h-4"></i>
              <span class="truncate">Plang Proyek</span>
            </button>

            <!-- 5. Rekanan Barang -->
            <button onclick="navigateTo('supplier')" class="nav-tab-btn px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${appState.currentView === 'supplier' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.01]' : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80'}">
              <i data-lucide="store" class="w-4 h-4"></i>
              <span class="truncate">Rekanan Barang</span>
            </button>

            <!-- 6. Profil Pemdes -->
            <button onclick="navigateTo('profil')" class="nav-tab-btn px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${appState.currentView === 'profil' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.01]' : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80'}">
              <i data-lucide="building-2" class="w-4 h-4"></i>
              <span class="truncate">Profil Pemdes</span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
      ${renderCurrentView()}
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 no-print">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-slate-700 font-bold">
          <div class="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-[10px]">SP</div>
          <span>SIPESAN-DESA</span>
          <span class="text-slate-400 font-normal">| Sistem Pesanan Barang Desa</span>
        </div>
        <p class="text-slate-500">Sesuai Permendagri No. 20/2018 & Standards Tata Naskah Pengadaan Desa</p>
      </div>
    </footer>

    <!-- Print Modal Overlay -->
    ${appState.printDocument ? renderPrintModal() : ''}

    <!-- Modals -->
    ${appState.confirmModal ? renderConfirmModalHtml() : ''}
    ${appState.showFridayReminder ? renderFridayReminderModalHtml() : ''}
    ${cloudState.showModal ? renderCloudModalHtml() : ''}
    ${appState.showRabPickerModal ? renderRabPickerModalHtml() : ''}
    ${appState.showAdminLoginModal ? renderAdminLoginModalHtml() : ''}
    ${appState.showChangePinModal ? renderChangePinModalHtml() : ''}
  `;

    lucide.createIcons();
  } catch (err) {
    console.error('Fatal render error:', err);
    container.innerHTML = `
      <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div class="bg-white border border-red-200 rounded-3xl p-8 max-w-md w-full text-center shadow-xl space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl font-bold">⚠️</div>
          <h2 class="text-xl font-bold text-slate-900">Tampilan Sedang Diperbarui</h2>
          <p class="text-xs text-slate-500">${err.message || 'Halaman mengalami kendala render.'}</p>
          <div class="pt-2 flex flex-col sm:flex-row justify-center gap-2">
            <button onclick="navigateTo('dashboard')" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md">
              Buka Dashboard
            </button>
            <button onclick="window.location.reload()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200">
              Muat Ulang
            </button>
          </div>
        </div>
      </div>
    `;
    try { lucide.createIcons(); } catch (e) {}
  }
}

function navigateTo(viewName, extraState = {}) {
  setState({ currentView: viewName, ...extraState });
}

function renderCurrentView() {
  switch (appState.currentView) {
    case 'dashboard': return renderDashboardView();
    case 'profil': return renderProfilView();
    case 'supplier': return renderSupplierView();
    case 'sp-list': return renderSpListView();
    case 'sp-form': return renderSpFormView();
    case 'bast-list': return renderBastListView();
    case 'bast-form': return renderBastFormView();
    case 'papan-list': return renderPapanListView();
    case 'papan-form': return renderPapanFormView();
    case 'papan-preview': return renderPapanPreviewView();
    default: return renderDashboardView();
  }
}

// ==========================================
// 4. VIEW COMPONENTS
// ==========================================

// --- VIEW: DASHBOARD ---
function renderDashboardView() {
  const data = appState.data || {};
  const suratPesanan = ensureArray(data.suratPesanan);
  const bastList = ensureArray(data.bastList);
  const suppliers = ensureArray(data.suppliers);
  const profilDesa = data.profilDesa || defaultData.profilDesa;
  const pelaksanaList = ensureArray(profilDesa.pelaksanaList);
  const activePk = appState.activePelaksanaId !== 'all' ? pelaksanaList.find(p => p && p.id === appState.activePelaksanaId) : null;

  const spFiltered = activePk 
    ? suratPesanan.filter(s => s && s.pemesanNama && s.pemesanNama === activePk.nama)
    : suratPesanan;

  const bastFiltered = activePk 
    ? bastList.filter(b => {
        if (!b) return false;
        const sp = suratPesanan.find(s => s && s.id === b.spId);
        if (!sp) return false;
        return (sp.pemesanNama && sp.pemesanNama === activePk.nama) || (b.ketuaTpk && b.ketuaTpk === activePk.nama);
      })
    : bastList;

  const totalSp = spFiltered.length;
  const totalBast = bastFiltered.length;
  const totalNilaiSp = spFiltered.reduce((acc, curr) => acc + (curr ? (curr.grandTotal || 0) : 0), 0);
  const totalSupplier = suppliers.length;

  return `
    <div class="space-y-8">
      <!-- Cloud Safety Banner (if not configured) -->
      ${!cloudState.isConfigured ? `
        <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-400/30">
          <div class="flex items-start sm:items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 text-white shadow-md">
              <i data-lucide="shield-alert" class="w-6 h-6 text-amber-300"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-black text-base tracking-tight">Amankan Berkas SPB & BAST ke Cloud (Anti-Hilang)</h4>
                <span class="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase">Penting</span>
              </div>
              <p class="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
                Saat ini data masih tersimpan di memori browser lokal laptop. Hubungkan aplikasi ini ke <strong>Google Firebase Cloud (100% Gratis)</strong> agar seluruh berkas pengadaan desa tersimpan aman permanen di server Google dan tidak pernah hilang meskipun browser dibersihkan atau ganti laptop!
              </p>
            </div>
          </div>
          <button onclick="openCloudModal()" class="px-5 py-3 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-xs rounded-2xl shadow-lg transition-all duration-200 shrink-0 flex items-center gap-2 hover:scale-[1.02]">
            <i data-lucide="cloud" class="w-4 h-4 text-blue-600"></i> Hubungkan Cloud Sekarang
          </button>
        </div>
      ` : ''}

      <!-- Welcome Hero Banner with Rich 3D Procurement Illustration -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border border-blue-700/40 p-6 sm:p-8 shadow-xl text-white">
        <!-- Ambient Decorative Glow Spheres -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left Text Content -->
          <div class="lg:col-span-7 space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur border border-white/20 shadow-xs">
              <i data-lucide="shield-check" class="w-4 h-4 text-sky-400"></i> Pengadaan oleh TPK maupun Kasi/Kaur Pelaksana Kegiatan
            </div>
            <h1 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Selamat Datang di <span class="bg-gradient-to-r from-sky-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">SIPESAN DESA</span>
            </h1>
            <p class="text-blue-100/90 text-sm sm:text-base leading-relaxed">
              Kelola Surat Pesanan Barang (SPB), Berita Acara Pemeriksaan Barang (BAPB), Berita Acara Serah Terima (BAST), dan Kwitansi Pengadaan Barang/Jasa Desa secara praktis, rapi, dan transparan.
            </p>

            <div class="pt-2 flex flex-wrap gap-3">
              <button onclick="navigateTo('sp-form', { editingSpId: null })" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-white to-blue-50 text-blue-900 hover:from-blue-50 hover:to-blue-100 font-extrabold text-sm shadow-xl shadow-blue-950/40 transition-all duration-200 flex items-center gap-2.5 hover:scale-[1.02]">
                <i data-lucide="plus-circle" class="w-5 h-5 text-blue-700"></i> Buat Surat Pesanan Barang Baru
              </button>
              <button onclick="navigateTo('bast-form', { editingBastId: null })" class="px-5 py-3 rounded-2xl bg-blue-800/60 hover:bg-blue-800/90 text-white font-bold text-sm border border-blue-400/30 backdrop-blur transition-all duration-200 flex items-center gap-2 hover:scale-[1.02]">
                <i data-lucide="file-check-2" class="w-5 h-5 text-emerald-400"></i> Buat BAST Baru
              </button>
            </div>
          </div>

          <!-- Right 3D Illustration Graphic -->
          <div class="lg:col-span-5 flex justify-center lg:justify-end">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-500 rounded-3xl blur-md opacity-50 group-hover:opacity-80 transition duration-500"></div>
              <div class="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                <img src="hero_illustration.jpg?v=6" alt="Alur Pemesanan dan Serah Terima Barang Desa" class="w-full h-auto max-h-64 sm:max-h-72 object-cover object-center transform group-hover:scale-105 transition-transform duration-500">
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 text-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white shadow-xs">
                    <i data-lucide="package-check" class="w-3.5 h-3.5 text-emerald-400"></i> Alur Pemesanan & Serah Terima Barang Desa
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Navigation Menu Cards Hub -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-blue-600"></i> Menu Utama & Layanan Pengadaan
            </h2>
            <p class="text-xs text-slate-500">Akses cepat pembuatan naskah dinas dan pengelolaan master data desa</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Card 1: SPB -->
          <div onclick="navigateTo('sp-list')" class="glass-card rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <i data-lucide="file-text" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm mt-3 group-hover:text-blue-600 transition-colors">Surat Pesanan (SPB)</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Buat & Cetak SPB Barang</p>
          </div>

          <!-- Card 2: BAST -->
          <div onclick="navigateTo('bast-list')" class="glass-card rounded-2xl p-4 border border-slate-200/90 hover:border-emerald-400 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <i data-lucide="check-circle-2" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm mt-3 group-hover:text-emerald-600 transition-colors">Serah Terima (BAST)</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">BAST, BAPB & Kwitansi</p>
          </div>

          <!-- Card 3: Rekanan -->
          <div onclick="navigateTo('supplier')" class="glass-card rounded-2xl p-4 border border-slate-200/90 hover:border-indigo-400 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <i data-lucide="store" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm mt-3 group-hover:text-indigo-600 transition-colors">Rekanan & Barang</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Master Toko & Katalog</p>
          </div>

          <!-- Card 4: Plang Proyek (BARU) -->
          <div onclick="navigateTo('papan-list')" class="glass-card rounded-2xl p-4 border border-slate-200/90 hover:border-amber-400 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <i data-lucide="signpost" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm mt-3 group-hover:text-amber-600 transition-colors">Plang Proyek 1x1 M</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Template Cetak Banner</p>
          </div>

          <!-- Card 5: Profil Pemdes -->
          <div onclick="navigateTo('profil')" class="glass-card rounded-2xl p-4 border border-slate-200/90 hover:border-sky-400 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
              <i data-lucide="building-2" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-sm mt-3 group-hover:text-sky-600 transition-colors">Profil Pemdes</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Data Kades & Pelaksana</p>
          </div>

          <!-- Card 6: Database Cloud & Backup -->
          <div onclick="openCloudModal()" class="glass-card rounded-2xl p-4 border border-slate-200/90 hover:border-blue-500 cursor-pointer group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <i data-lucide="cloud" class="w-6 h-6"></i>
            </div>
            <div class="flex items-center gap-1.5 mt-3">
              <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Database Cloud</h3>
              <span class="w-2 h-2 rounded-full ${cloudState.isConfigured && cloudState.isConnected ? 'bg-emerald-500 animate-pulse' : (cloudState.isConfigured ? 'bg-amber-500' : 'bg-slate-300')}"></span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">${cloudState.isConfigured && cloudState.isConnected ? 'Tersimpan di Google' : 'Online Anti-Hilang'}</p>
          </div>
        </div>
      </div>

      ${activePk ? `
        <div class="bg-blue-50 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-900 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              <i data-lucide="user-check" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-xs text-blue-700 font-bold uppercase tracking-wider block">Mode Khusus Laptop Pelaksana:</span>
              <span class="font-extrabold text-base">${activePk.nama} <span class="text-xs text-blue-700 font-semibold">(${activePk.jabatan})</span></span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-medium hidden md:inline">Menampilkan khusus data kegiatan ${activePk.nama}</span>
            <button onclick="switchActivePelaksana('all')" class="px-3.5 py-1.5 bg-white text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-300 transition shadow-xs">
              🌐 Tampilkan Semua Data Desa
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass-card rounded-2xl p-5 border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Surat Pesanan</span>
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <i data-lucide="file-text" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-extrabold text-slate-900">${totalSp} <span class="text-xs font-normal text-slate-500">Dokumen</span></h3>
            <p class="text-xs text-slate-500 mt-1">SP Barang & Jasa APBDes</p>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Berita Acara (BAST)</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <i data-lucide="check-circle-2" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-extrabold text-slate-900">${totalBast} <span class="text-xs font-normal text-slate-500">Serah Terima</span></h3>
            <p class="text-xs text-slate-500 mt-1">Lengkap dengan BAPB</p>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Nilai Pesanan</span>
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <i data-lucide="coins" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-xl font-extrabold text-blue-700">${formatRupiah(totalNilaiSp)}</h3>
            <p class="text-xs text-slate-500 mt-1">Akumulasi Seluruh Pesanan</p>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Rekanan / Supplier</span>
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <i data-lucide="store" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-extrabold text-slate-900">${totalSupplier} <span class="text-xs font-normal text-slate-500">Toko/CV</span></h3>
            <p class="text-xs text-slate-500 mt-1">Terdaftar di Master Data</p>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div class="p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Surat Pesanan Terbaru</h3>
            <p class="text-xs text-slate-500">Daftar transaksi pengadaan barang yang terbit</p>
          </div>
          <button onclick="navigateTo('sp-list')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Lihat Semua <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="px-5 py-3.5">No. SP & Tanggal</th>
                <th class="px-5 py-3.5">Kegiatan & Pemesan (Pihak I)</th>
                <th class="px-5 py-3.5">Penyedia / Toko</th>
                <th class="px-5 py-3.5 text-right">Nilai Total</th>
                <th class="px-5 py-3.5 text-center">Status BAST</th>
                <th class="px-5 py-3.5 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700 bg-white">
              ${spFiltered.length === 0 ? `
                <tr>
                  <td colspan="6" class="px-5 py-8 text-center text-slate-400">Belum ada dokumen Surat Pesanan yang dibuat.</td>
                </tr>
              ` : spFiltered.map(sp => {
                if (!sp) return '';
                const sup = suppliers.find(s => s && s.id === sp.supplierId) || {};
                const hasBast = bastList.some(b => b && b.spId === sp.id);
                return `
                  <tr class="hover:bg-blue-50/50 transition">
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900 font-mono text-xs">${sp.nomorSp}</div>
                      <div class="text-xs text-slate-500 mt-0.5">${formatTanggalIndo(sp.tanggalSp)}</div>
                    </td>
                    <td class="px-5 py-4 font-semibold text-slate-800">
                      <div>${sp.kegiatan}</div>
                      <div class="text-xs text-blue-700 font-bold mt-0.5">Pemesan: ${sp.pemesanNama || sp.pemesanJabatan || 'TPK'}</div>
                    </td>
                    <td class="px-5 py-4 text-slate-700">
                      <div class="font-semibold text-slate-900">${sup.namaToko || '-'}</div>
                      <div class="text-xs text-slate-500">${sup.pemilik || ''}</div>
                    </td>
                    <td class="px-5 py-4 text-right font-extrabold text-blue-700 font-mono">
                      ${formatRupiah(sp.grandTotal)}
                    </td>
                    <td class="px-5 py-4 text-center">
                      ${hasBast ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <i data-lucide="check" class="w-3 h-3"></i> Ada BAST
                        </span>
                      ` : `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <i data-lucide="clock" class="w-3 h-3"></i> Belum BAST
                        </span>
                      `}
                    </td>
                    <td class="px-5 py-4 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <button onclick="openPrintModal('sp', '${sp.id}')" class="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition border border-slate-200 bg-white" title="Cetak Surat Pesanan">
                          <i data-lucide="printer" class="w-4 h-4"></i>
                        </button>
                        ${!hasBast ? `
                          <button onclick="createBastFromSp('${sp.id}')" class="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition border border-blue-200 bg-blue-50" title="Buat BAST">
                            <i data-lucide="file-plus" class="w-4 h-4"></i>
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW: PROFIL PEMDES ---
function renderProfilView() {
  const p = appState.data.profilDesa;
  const pelaksanaList = p.pelaksanaList || defaultData.profilDesa.pelaksanaList;
  const isAdmin = isAdminLoggedIn();
  const disAttr = isAdmin ? '' : 'disabled';
  const inputCls = isAdmin
    ? 'bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 text-slate-900'
    : 'bg-slate-100 border border-slate-200 text-slate-600 cursor-not-allowed select-none';

  return `
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- Admin vs Pelaksana Security Status Banner -->
      ${isAdmin ? `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-extrabold text-blue-950">Mode Administrator Aktif</h4>
                <span class="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Abdul Hanafi</span>
              </div>
              <p class="text-xs text-blue-800">Anda memiliki hak penuh untuk mengubah Identitas Pemdes, Penandatangan, dan Daftar Pejabat Pelaksana.</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button type="button" onclick="openChangePinModal()" class="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs">
              <i data-lucide="key" class="w-3.5 h-3.5 text-blue-600"></i> Ganti PIN
            </button>
            <button type="button" onclick="logoutAdmin()" class="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition shadow-xs">
              Kunci Akses
            </button>
          </div>
        </div>
      ` : `
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
              <i data-lucide="lock" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-extrabold text-amber-950">Halaman Terkunci (Mode Hanya Lihat)</h4>
                <span class="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Mode Pelaksana</span>
              </div>
              <p class="text-xs text-amber-900 leading-relaxed">Profil Pemdes dan Daftar Pejabat dikunci demi keamanan agar tidak diubah sembarangan oleh pelaksana lain.</p>
            </div>
          </div>
          <button type="button" onclick="openAdminLoginModal(() => renderApp(), 'Edit Profil Pemdes')" class="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl transition shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 shrink-0">
            <i data-lucide="key" class="w-4 h-4"></i>
            <span>Buka Kunci Admin</span>
          </button>
        </div>
      `}

      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Profil & Pejabat Desa</h2>
          <p class="text-slate-500 text-sm">Pengaturan Kop Surat resmi dan Data Penandatangan (Kades, Sekdes, PPKD, TPK & Kasi/Kaur Pelaksana Kegiatan)</p>
        </div>
        ${isAdmin ? `
          <button onclick="saveProfilDesa(event)" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-blue-600/20">
            <i data-lucide="save" class="w-4 h-4"></i> Simpan Perubahan
          </button>
        ` : `
          <button onclick="openAdminLoginModal(() => renderApp(), 'Edit Profil Pemdes')" class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer">
            <i data-lucide="lock" class="w-4 h-4 text-slate-500"></i> Buka Kunci untuk Mengedit
          </button>
        `}
      </div>

      <form id="form-profil" onsubmit="saveProfilDesa(event)" class="space-y-6">
        <!-- Section Kop Surat -->
        <div class="glass-card rounded-2xl p-6 border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-3">
            <i data-lucide="building-2" class="w-5 h-5"></i> Identitas Pemerintahan (Header Kop Surat)
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Pemerintah Kabupaten / Kota</label>
              <input type="text" id="p-kabupaten" value="${p.kabupaten || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Kecamatan</label>
              <input type="text" id="p-kecamatan" value="${p.kecamatan || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Nama Desa</label>
              <input type="text" id="p-desa" value="${p.desa || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}" required>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Alamat Balai / Kantor Desa</label>
            <input type="text" id="p-alamat" value="${p.alamat || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}" required>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">No. Telepon / HP</label>
              <input type="text" id="p-telepon" value="${p.telepon || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Email Resmi Desa</label>
              <input type="email" id="p-email" value="${p.email || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Website Desa</label>
              <input type="text" id="p-website" value="${p.website || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}">
            </div>
          </div>
        </div>

        <!-- Section Pejabat Utama -->
        <div class="glass-card rounded-2xl p-6 border border-slate-200 space-y-4">
          <h3 class="text-base font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-3">
            <i data-lucide="user-check" class="w-5 h-5"></i> Pejabat Penandatangan Utama
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Nama Kepala Desa (Kades)</label>
              <input type="text" id="p-kadesNama" value="${p.kadesNama || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">NIP / NIPD Kepala Desa</label>
              <input type="text" id="p-kadesNip" value="${p.kadesNip || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Nama PPKD / Kaur Keuangan</label>
              <input type="text" id="p-ppkdNama" value="${p.ppkdNama || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">NIP / Jabatan PPKD</label>
              <input type="text" id="p-ppkdNip" value="${p.ppkdNip || ''}" ${disAttr} class="w-full rounded-xl px-3.5 py-2 text-sm focus:outline-none ${inputCls}">
            </div>
          </div>
        </div>

        <!-- Section Daftar Kasi / Kaur & TPK (Pelaksana Pemesan Barang) -->
        <div class="glass-card rounded-2xl p-6 border border-slate-200 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="text-base font-bold text-blue-700 flex items-center gap-2">
              <i data-lucide="users" class="w-5 h-5"></i> Daftar Tim TPK & Kasi/Kaur Pelaksana Kegiatan (Pemesan Barang)
            </h3>
            ${isAdmin ? `
              <button type="button" onclick="addPelaksanaProfilRow()" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1 shadow-xs">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah Pejabat Pemesan
              </button>
            ` : ''}
          </div>

          <p class="text-xs text-slate-500">Daftar ini akan otomatis muncul pada pilihan <strong>Pemesan Barang (Pihak Kesatu)</strong> saat pembuatan Surat Pesanan (SP).</p>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="px-3 py-2">Nama Pejabat</th>
                  <th class="px-3 py-2">Jabatan Kedinasan / TPK</th>
                  <th class="px-3 py-2 w-48">NIP / NIPD (Jika ada)</th>
                  <th class="px-3 py-2 w-12 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200" id="profil-pelaksana-body">
                ${pelaksanaList.map((pk, idx) => `
                  <tr>
                    <td class="px-3 py-2">
                      <input type="text" value="${pk.nama || ''}" ${disAttr} oninput="updatePelaksanaField(${idx}, 'nama', this.value)" onchange="updatePelaksanaField(${idx}, 'nama', this.value)" placeholder="Nama Pejabat" class="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold ${inputCls}">
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" value="${pk.jabatan || ''}" ${disAttr} oninput="updatePelaksanaField(${idx}, 'jabatan', this.value)" onchange="updatePelaksanaField(${idx}, 'jabatan', this.value)" placeholder="Contoh: Kasi Kesejahteraan" class="w-full rounded-lg px-2.5 py-1.5 text-xs ${inputCls}">
                    </td>
                    <td class="px-3 py-2">
                      <input type="text" value="${pk.nip || '-'}" ${disAttr} oninput="updatePelaksanaField(${idx}, 'nip', this.value)" onchange="updatePelaksanaField(${idx}, 'nip', this.value)" placeholder="NIP" class="w-full rounded-lg px-2.5 py-1.5 text-xs font-mono ${inputCls}">
                    </td>
                    <td class="px-3 py-2 text-center">
                      ${isAdmin ? `
                        <button type="button" onclick="removePelaksanaProfilRow(${idx})" class="p-1 text-slate-400 hover:text-red-600 rounded transition" title="Hapus Pejabat">
                          <i data-lucide="minus-circle" class="w-4 h-4"></i>
                        </button>
                      ` : `
                        <span class="text-slate-300" title="Terkunci"><i data-lucide="lock" class="w-3.5 h-3.5 mx-auto"></i></span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  `;
}

function updatePelaksanaField(idx, field, value) {
  if (!appState.data.profilDesa.pelaksanaList) {
    appState.data.profilDesa.pelaksanaList = JSON.parse(JSON.stringify(defaultData.profilDesa.pelaksanaList));
  }
  if (appState.data.profilDesa.pelaksanaList[idx]) {
    appState.data.profilDesa.pelaksanaList[idx][field] = value;
  }
}

function addPelaksanaProfilRow() {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal(() => addPelaksanaProfilRow(), 'Tambah Pejabat Pemesan');
    return;
  }
  if (!appState.data.profilDesa.pelaksanaList) {
    appState.data.profilDesa.pelaksanaList = JSON.parse(JSON.stringify(defaultData.profilDesa.pelaksanaList));
  }
  appState.data.profilDesa.pelaksanaList.push({ id: 'pk-' + Date.now(), nama: '', jabatan: 'Kasi / Kaur Pelaksana Kegiatan', nip: '-' });
  renderApp();
}

function removePelaksanaProfilRow(idx) {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal(() => removePelaksanaProfilRow(idx), 'Hapus Pejabat Pemesan');
    return;
  }
  if (!appState.data.profilDesa.pelaksanaList) return;
  appState.data.profilDesa.pelaksanaList.splice(idx, 1);
  renderApp();
}

function saveProfilDesa(e) {
  if (e) e.preventDefault();

  if (!isAdminLoggedIn()) {
    openAdminLoginModal(() => saveProfilDesa(e), 'Simpan Profil Pemdes');
    return;
  }

  // Read all pelaksana rows directly from the table inputs to guarantee nothing is missed
  const rows = document.querySelectorAll('#profil-pelaksana-body tr');
  const pelaksanaList = [];
  rows.forEach((row, idx) => {
    const inputs = row.querySelectorAll('input');
    if (inputs.length >= 3) {
      const nama = inputs[0].value.trim();
      const jabatan = inputs[1].value.trim();
      const nip = inputs[2].value.trim() || '-';
      const existingId = (appState.data.profilDesa.pelaksanaList && appState.data.profilDesa.pelaksanaList[idx])
        ? appState.data.profilDesa.pelaksanaList[idx].id
        : ('pk-' + (idx + 1));
      if (nama || jabatan) {
        pelaksanaList.push({ id: existingId, nama, jabatan, nip });
      }
    }
  });

  const finalPelaksanaList = pelaksanaList.length > 0
    ? pelaksanaList
    : (appState.data.profilDesa.pelaksanaList || defaultData.profilDesa.pelaksanaList);

  const newProfil = {
    ...appState.data.profilDesa,
    kabupaten: document.getElementById('p-kabupaten').value,
    kecamatan: document.getElementById('p-kecamatan').value,
    desa: document.getElementById('p-desa').value,
    alamat: document.getElementById('p-alamat').value,
    telepon: document.getElementById('p-telepon').value,
    email: document.getElementById('p-email').value,
    website: document.getElementById('p-website').value,
    kadesNama: document.getElementById('p-kadesNama').value,
    kadesNip: document.getElementById('p-kadesNip').value,
    ppkdNama: document.getElementById('p-ppkdNama').value,
    ppkdNip: document.getElementById('p-ppkdNip').value,
    pelaksanaList: finalPelaksanaList
  };

  setState({
    data: {
      ...appState.data,
      profilDesa: newProfil
    }
  });

  alert('Profil Desa & Daftar Pejabat Pemesan berhasil disimpan dan disinkronkan ke Cloud!');
}

// --- VIEW: MASTER SUPPLIER & BARANG ---
function renderSupplierView() {
  return `
    <div class="space-y-8">
      <!-- Section Supplier -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Master Data Rekanan / Supplier</h2>
            <p class="text-slate-500 text-xs">Daftar Toko, CV, atau Penyedia Barang/Jasa lokal desa</p>
          </div>
          <button onclick="toggleSupplierModal(true)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/20">
            <i data-lucide="plus" class="w-4 h-4"></i> Tambah Supplier Baru
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${appState.data.suppliers.map(sup => `
            <div class="glass-card rounded-2xl p-5 border border-slate-200 space-y-3 relative bg-white">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-base">${sup.namaToko}</h3>
                  <p class="text-xs text-slate-500">Pemilik: <span class="text-slate-800 font-semibold">${sup.pemilik}</span></p>
                </div>
                <button onclick="deleteSupplier('${sup.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition" title="Hapus Supplier">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>

              <div class="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div class="flex items-center gap-2"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-600"></i> ${sup.alamat}</div>
                <div class="flex items-center gap-2"><i data-lucide="phone" class="w-3.5 h-3.5 text-blue-600"></i> ${sup.telepon}</div>
                <div class="flex items-center gap-2"><i data-lucide="credit-card" class="w-3.5 h-3.5 text-blue-600"></i> NPWP: <span class="font-mono text-slate-900">${sup.npwp || '-'}</span></div>
                <div class="flex items-center gap-2"><i data-lucide="building" class="w-3.5 h-3.5 text-blue-600"></i> Rekening: <span class="font-mono text-slate-900">${sup.bank} - ${sup.rekening}</span></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section Master Katalog Barang -->
      <div class="space-y-4 pt-4 border-t border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-slate-900 tracking-tight">Katalog Acuan Barang & Material</h2>
              <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">${(appState.data.masterBarang || []).length} Barang</span>
            </div>
            <p class="text-slate-500 text-xs">Master data harga acuan bahan bangunan, ATK, konsumsi, dan peralatan desa (RAB Perubahan TA 2026)</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="reloadDefaultRabCatalog()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5" title="Muat ulang seluruh data 292 barang standar resmi Siskeudes RAB 2026">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Reset ke RAB 2026
            </button>
            <button onclick="toggleBarangModal(true)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm">
              <i data-lucide="plus" class="w-4 h-4"></i> Tambah Manual
            </button>
          </div>
        </div>

        <!-- Filter & Search for Master Barang -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <div class="relative flex-1 w-full">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              value="${appState.masterBarangSearchQuery || ''}" 
              oninput="onMasterBarangSearch(this.value)" 
              placeholder="Cari nama barang di katalog acuan..." 
              class="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            >
          </div>
          <select onchange="onMasterBarangCategoryChange(this.value)" class="w-full sm:w-auto bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:border-blue-600">
            <option value="all">Semua Kategori</option>
            ${getDistinctRabCategories().map(cat => `
              <option value="${cat}" ${appState.masterBarangActiveCategory === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
        </div>

        <div class="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div class="max-h-[500px] overflow-y-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th class="px-5 py-3.5">Nama Barang / Material</th>
                  <th class="px-5 py-3.5">Kategori</th>
                  <th class="px-5 py-3.5">Satuan</th>
                  <th class="px-5 py-3.5 text-right">Harga Acuan</th>
                  <th class="px-5 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-slate-700">
                ${renderMasterBarangTableRowsHtml()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Supplier -->
    <div id="modal-supplier" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 class="text-lg font-bold text-slate-900">Tambah Supplier / Rekanan Baru</h3>
          <button onclick="toggleSupplierModal(false)" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="saveNewSupplier(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Nama Toko / Perusahaan / CV</label>
            <input type="text" id="sup-namaToko" placeholder="Contoh: TB. Sumber Makmur" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Nama Pemilik / Penanggungjawab</label>
            <input type="text" id="sup-pemilik" placeholder="Contoh: H. Slamet" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Alamat Lengkap Toko</label>
            <input type="text" id="sup-alamat" placeholder="Jl. Raya Desa..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">No. Telepon / HP</label>
              <input type="text" id="sup-telepon" placeholder="0812..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">NPWP (Jika ada)</label>
              <input type="text" id="sup-npwp" placeholder="81.234..." class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Nama Bank</label>
              <input type="text" id="sup-bank" placeholder="Bank Jateng / BRI" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">No. Rekening</label>
              <input type="text" id="sup-rekening" placeholder="123456789" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
            </div>
          </div>
          <div class="pt-3 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onclick="toggleSupplierModal(false)" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-semibold">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md">Simpan Supplier</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Form Barang -->
    <div id="modal-barang" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 class="text-lg font-bold text-slate-900">Tambah Master Barang Baru</h3>
          <button onclick="toggleBarangModal(false)" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <form onsubmit="saveNewBarang(event)" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Nama Barang / Material</label>
            <input type="text" id="mb-namaBarang" placeholder="Contoh: Semen PCC (50kg)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Kategori Belanja</label>
            <select id="mb-kategori" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
              <option value="Bahan Bangunan & Material Fisik">Bahan Bangunan & Material Fisik</option>
              <option value="Alat Tulis Kantor (ATK) & Cetak">Alat Tulis Kantor (ATK) & Cetak</option>
              <option value="Kebersihan & Perlengkapan Rumah Tangga">Kebersihan & Perlengkapan Rumah Tangga</option>
              <option value="Konsumsi, Makanan & Minuman">Konsumsi, Makanan & Minuman</option>
              <option value="Peralatan, Mesin & Sewa Alat">Peralatan, Mesin & Sewa Alat</option>
              <option value="Peralatan & Barang Lainnya">Peralatan & Barang Lainnya</option>
              <option value="Pakaian, Seragam & Perlengkapan">Pakaian, Seragam & Perlengkapan</option>
              <option value="Alat Listrik & Elektronik">Alat Listrik & Elektronik</option>
              <option value="Bahan Bakar & Minyak (BBM)">Bahan Bakar & Minyak (BBM)</option>
              <option value="Pertanian & Peternakan">Pertanian & Peternakan</option>
              <option value="Kesehatan & Posyandu">Kesehatan & Posyandu</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Satuan</label>
              <input type="text" id="mb-satuan" placeholder="Sak / M3 / Unit / Rim" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Harga Acuan (Rp)</label>
              <input type="number" id="mb-hargaSatuan" placeholder="72000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
          </div>
          <div class="pt-3 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onclick="toggleBarangModal(false)" class="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-semibold">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md">Simpan Barang</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function toggleSupplierModal(show) {
  document.getElementById('modal-supplier').classList.toggle('hidden', !show);
}
function toggleBarangModal(show) {
  document.getElementById('modal-barang').classList.toggle('hidden', !show);
}

function saveNewSupplier(e) {
  e.preventDefault();
  const newSup = {
    id: 'sup-' + Date.now(),
    namaToko: document.getElementById('sup-namaToko').value,
    pemilik: document.getElementById('sup-pemilik').value,
    alamat: document.getElementById('sup-alamat').value,
    telepon: document.getElementById('sup-telepon').value,
    npwp: document.getElementById('sup-npwp').value,
    bank: document.getElementById('sup-bank').value,
    rekening: document.getElementById('sup-rekening').value
  };

  setState({
    data: {
      ...appState.data,
      suppliers: [...appState.data.suppliers, newSup]
    }
  });
  toggleSupplierModal(false);
}

function deleteSupplier(id) {
  const sup = appState.data.suppliers.find(s => s.id === id);
  const nama = sup ? sup.namaToko : 'Supplier ini';
  showConfirmModal('Hapus Rekanan / Supplier?', `Yakin ingin menghapus ${nama}? Data yang dihapus tidak dapat dikembalikan.`, () => {
    const updatedSuppliers = appState.data.suppliers.filter(s => s.id !== id);
    setState({
      data: {
        ...appState.data,
        suppliers: updatedSuppliers
      },
      confirmModal: null
    });
  });
}

function saveNewBarang(e) {
  e.preventDefault();
  const katEl = document.getElementById('mb-kategori');
  const newMb = {
    id: 'mb-' + Date.now(),
    namaBarang: document.getElementById('mb-namaBarang').value,
    spesifikasi: 'Diinput Manual',
    kategori: katEl ? katEl.value : 'Lainnya',
    satuan: document.getElementById('mb-satuan').value,
    hargaSatuan: Number(document.getElementById('mb-hargaSatuan').value) || 0
  };

  setState({
    data: {
      ...appState.data,
      masterBarang: [...appState.data.masterBarang, newMb]
    }
  });
  toggleBarangModal(false);
}

function onMasterBarangSearch(val) {
  appState.masterBarangSearchQuery = val;
  renderApp();
}

function onMasterBarangCategoryChange(val) {
  appState.masterBarangActiveCategory = val;
  renderApp();
}

function reloadDefaultRabCatalog() {
  if (typeof window !== 'undefined' && window.RAB_KATALOG_2026 && window.RAB_KATALOG_2026.length > 0) {
    showConfirmModal('Reset Katalog ke RAB 2026?', 'Ini akan mengembalikan seluruh 292 data barang acuan standar resmi Siskeudes Perubahan 2026.', () => {
      setState({
        data: {
          ...appState.data,
          masterBarang: window.RAB_KATALOG_2026
        },
        confirmModal: null
      });
    });
  }
}

function renderMasterBarangTableRowsHtml() {
  const master = ensureArray(appState.data.masterBarang);
  const q = (appState.masterBarangSearchQuery || '').toLowerCase().trim();
  const cat = appState.masterBarangActiveCategory || 'all';

  const filtered = master.filter(mb => {
    if (cat !== 'all' && mb.kategori !== cat) return false;
    if (!q) return true;
    const n = (mb.namaBarang || '').toLowerCase();
    const k = (mb.kategori || '').toLowerCase();
    const s = (mb.satuan || '').toLowerCase();
    return n.includes(q) || k.includes(q) || s.includes(q);
  });

  if (filtered.length === 0) {
    return `
      <tr>
        <td colspan="5" class="px-5 py-8 text-center text-slate-400 text-xs">
          Tidak ada barang yang sesuai dengan pencarian / filter kategori.
        </td>
      </tr>
    `;
  }

  return filtered.map(mb => `
    <tr class="hover:bg-blue-50/50">
      <td class="px-5 py-3 font-bold text-slate-900">${mb.namaBarang}</td>
      <td class="px-5 py-3 text-xs">
        <span class="px-2 py-0.5 rounded-full border text-[10px] font-bold ${getCategoryBadgeColor(mb.kategori)}">
          ${mb.kategori || 'Acuan'}
        </span>
      </td>
      <td class="px-5 py-3 text-xs font-mono font-bold text-blue-600">${mb.satuan}</td>
      <td class="px-5 py-3 text-right font-mono font-bold text-slate-900">${formatRupiah(mb.hargaSatuan)}</td>
      <td class="px-5 py-3 text-center">
        <button onclick="deleteMasterBarang('${mb.id}')" class="p-1 text-slate-400 hover:text-red-600 rounded transition" title="Hapus Barang">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function deleteMasterBarang(id) {
  const barang = appState.data.masterBarang.find(b => b.id === id);
  const nama = barang ? barang.namaBarang : 'Barang ini';
  showConfirmModal('Hapus Master Barang?', `Yakin ingin menghapus ${nama} dari katalog acuan?`, () => {
    const updatedBarang = appState.data.masterBarang.filter(b => b.id !== id);
    setState({
      data: {
        ...appState.data,
        masterBarang: updatedBarang
      },
      confirmModal: null
    });
  });
}

// --- VIEW: SURAT PESANAN (SP) LIST ---
function renderSpListView() {
  const data = appState.data || {};
  const suratPesanan = ensureArray(data.suratPesanan);
  const bastList = ensureArray(data.bastList);
  const suppliers = ensureArray(data.suppliers);
  const profilDesa = data.profilDesa || defaultData.profilDesa;
  const pelaksanaList = ensureArray(profilDesa.pelaksanaList);
  const activePk = appState.activePelaksanaId !== 'all' ? pelaksanaList.find(p => p && p.id === appState.activePelaksanaId) : null;

  const spListFiltered = activePk 
    ? suratPesanan.filter(s => s && s.pemesanNama && s.pemesanNama === activePk.nama)
    : suratPesanan;

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Daftar Surat Pesanan Barang (SPB)</h2>
          <p class="text-slate-500 text-sm">Dokumen resmi pemesanan barang/material kepada penyedia toko</p>
        </div>
        <button onclick="navigateTo('sp-form', { editingSpId: null })" class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Buat Surat Pesanan Barang Baru
        </button>
      </div>

      ${activePk ? `
        <div class="bg-blue-50 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-900 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <i data-lucide="filter" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-xs text-blue-700 font-bold uppercase tracking-wider block">Menampilkan Pesanan Pelaksana:</span>
              <span class="font-extrabold text-sm">${activePk.nama} (${activePk.jabatan})</span>
            </div>
          </div>
          <button onclick="switchActivePelaksana('all')" class="px-3.5 py-1.5 bg-white text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-300 transition shadow-xs self-start sm:self-auto">
            Tampilkan Seluruh Kegiatan Desa
          </button>
        </div>
      ` : ''}

      <div class="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="px-5 py-4">Nomor SP & Tanggal</th>
                <th class="px-5 py-4">Kegiatan & Pemesan (Pihak I)</th>
                <th class="px-5 py-4">Penyedia / Toko</th>
                <th class="px-5 py-4 text-right">Nilai Pesanan</th>
                <th class="px-5 py-4 text-center">Status</th>
                <th class="px-5 py-4 text-center">Cetak / Opsi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              ${spListFiltered.length === 0 ? `
                <tr><td colspan="6" class="px-5 py-8 text-center text-slate-400">Belum ada Surat Pesanan Barang yang terbuat untuk filter ini.</td></tr>
              ` : spListFiltered.map(sp => {
                if (!sp) return '';
                const sup = suppliers.find(s => s && s.id === sp.supplierId) || {};
                const hasBast = bastList.some(b => b && b.spId === sp.id);
                return `
                  <tr class="hover:bg-blue-50/50">
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900 font-mono text-xs">${sp.nomorSp}</div>
                      <div class="text-xs text-slate-500 mt-0.5">${formatTanggalIndo(sp.tanggalSp)}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="font-semibold text-slate-800">${sp.kegiatan}</div>
                      <div class="text-xs text-blue-700 font-bold mt-0.5">Pemesan: ${sp.pemesanNama || sp.pemesanJabatan || 'TPK'}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="font-semibold text-slate-900">${sup.namaToko || '-'}</div>
                      <div class="text-xs text-slate-500">${sup.pemilik || ''}</div>
                    </td>
                    <td class="px-5 py-4 text-right font-extrabold text-blue-700 font-mono">
                      ${formatRupiah(sp.grandTotal)}
                    </td>
                    <td class="px-5 py-4 text-center">
                      ${hasBast ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <i data-lucide="check-circle" class="w-3 h-3"></i> Sudah BAST
                        </span>
                      ` : `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <i data-lucide="clock" class="w-3 h-3"></i> Menunggu BAST
                        </span>
                      `}
                    </td>
                    <td class="px-5 py-4 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button onclick="openPrintModal('sp', '${sp.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-1">
                          <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak SP
                        </button>
                        <button onclick="navigateTo('sp-form', { editingSpId: '${sp.id}' })" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition" title="Edit">
                          <i data-lucide="edit" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteSp('${sp.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition" title="Hapus">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function deleteSp(id) {
  const suratPesanan = ensureArray(appState.data.suratPesanan);
  const bastList = ensureArray(appState.data.bastList);
  const sp = suratPesanan.find(s => s && s.id === id);
  const nomor = sp ? sp.nomorSp : 'Surat Pesanan ini';
  showConfirmModal('Hapus Surat Pesanan?', `Yakin ingin menghapus Surat Pesanan ${nomor}? Semua BAST terkait juga akan dihapus.`, () => {
    setState({
      data: {
        ...appState.data,
        suratPesanan: suratPesanan.filter(s => s && s.id !== id),
        bastList: bastList.filter(b => b && b.spId !== id)
      },
      confirmModal: null
    });
  });
}

// --- VIEW: SURAT PESANAN (SP) FORM ---
let tempFormItems = [];

function renderSpFormView() {
  const isEdit = !!appState.editingSpId;
  const suratPesanan = ensureArray(appState.data.suratPesanan);
  const sp = isEdit ? suratPesanan.find(s => s && s.id === appState.editingSpId) : null;
  const profilDesa = appState.data.profilDesa || defaultData.profilDesa;
  const pelaksanaList = ensureArray(profilDesa.pelaksanaList).length > 0 ? ensureArray(profilDesa.pelaksanaList) : defaultData.profilDesa.pelaksanaList;

  if (sp && tempFormItems.length === 0) {
    tempFormItems = JSON.parse(JSON.stringify(sp.items || []));
  } else if (!sp && tempFormItems.length === 0) {
    tempFormItems = [
      { namaBarang: 'Semen PCC (50 kg)', volume: 10, satuan: 'Sak', hargaSatuan: 72000, total: 720000 }
    ];
  }

  const defaultSelectedPkId = sp 
    ? (pelaksanaList.find(p => p && p.nama === sp.pemesanNama)?.id || 'custom')
    : (appState.activePelaksanaId !== 'all' ? appState.activePelaksanaId : (pelaksanaList[0] ? pelaksanaList[0].id : 'custom'));
  const currentPkObj = pelaksanaList.find(p => p && p.id === defaultSelectedPkId) || pelaksanaList[0] || {};

  const generateNomorDefault = `027/${String(suratPesanan.length + 1).padStart(3, '0')}/SP/TPK-DS/${new Date().getFullYear()}`;

  return `
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">${isEdit ? 'Edit Surat Pesanan Barang (SPB)' : 'Buat Surat Pesanan Barang (SPB) Baru'}</h2>
          <p class="text-slate-500 text-sm">Form standar naskah dinas Surat Pesanan Barang Pengadaan Desa</p>
        </div>
        <button onclick="navigateTo('sp-list')" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-sm transition flex items-center gap-1.5">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Daftar
        </button>
      </div>

      <form id="form-sp" onsubmit="saveSpForm(event)" class="space-y-6">
        <!-- Header Info Surat & Pemesan -->
        <div class="glass-card rounded-2xl p-6 border border-slate-200 space-y-4 bg-white">
          <h3 class="text-base font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-3">
            <i data-lucide="file-text" class="w-5 h-5"></i> Informasi Surat & Pihak Pemesan (Pihak Kesatu)
          </h3>

          <!-- Selection Pemesan / Pihak Kesatu (TPK vs Kasi/Kaur) -->
          <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-blue-900 uppercase">Pilih Pejabat Pemesan Barang (Pihak Kesatu):</label>
              <span class="text-[11px] text-blue-700 font-semibold">*Otomatis terpilih sesuai Mode Active Pelaksana</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="sm:col-span-2">
                <select id="sp-pemesanSelect" onchange="onPemesanSelectChange(this.value)" class="w-full bg-white border border-blue-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:border-blue-600 focus:outline-none">
                  ${pelaksanaList.map(p => `
                    <option value="${p.id}" ${defaultSelectedPkId === p.id ? 'selected' : ''}>${p.jabatan} - ${p.nama}</option>
                  `).join('')}
                  <option value="custom" ${defaultSelectedPkId === 'custom' ? 'selected' : ''}>+ Input Manual Pejabat Lain</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Nama Pemesan</label>
                <input type="text" id="sp-pemesanNama" value="${sp ? sp.pemesanNama : currentPkObj.nama || ''}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:border-blue-600" required>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Jabatan Pemesan</label>
                <input type="text" id="sp-pemesanJabatan" value="${sp ? sp.pemesanJabatan : currentPkObj.jabatan || ''}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600" required>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">NIP / NIPD Pemesan</label>
                <input type="text" id="sp-pemesanNip" value="${sp ? sp.pemesanNip : (pelaksanaList[0] ? pelaksanaList[0].nip : '-')}" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-600">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Nomor Surat Pesanan Barang (SPB)</label>
              <input type="text" id="sp-nomorSp" value="${sp ? sp.nomorSp : generateNomorDefault}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Tanggal Surat Pesanan Barang</label>
              <input type="date" id="sp-tanggalSp" value="${sp ? sp.tanggalSp : new Date().toISOString().split('T')[0]}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Pilih Rekanan / Supplier (Pihak II)</label>
              <select id="sp-supplierId" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
                <option value="">-- Pilih Rekanan Toko/CV --</option>
                ${appState.data.suppliers.map(s => `
                  <option value="${s.id}" ${sp && sp.supplierId === s.id ? 'selected' : ''}>${s.namaToko} (${s.pemilik})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-600 mb-1">Nama Kegiatan APBDes</label>
              <input type="text" id="sp-kegiatan" value="${sp ? sp.kegiatan : ''}" placeholder="Contoh: Pembangunan Rabat Beton Jalan Usaha Tani RT 02" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Sumber Dana APBDes</label>
              <select id="sp-sumberDana" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
                <option value="Dana Desa (DD) TA 2026" ${sp && sp.sumberDana.includes('DD') ? 'selected' : ''}>Dana Desa (DD)</option>
                <option value="Alokasi Dana Desa (ADD) TA 2026" ${sp && sp.sumberDana.includes('ADD') ? 'selected' : ''}>Alokasi Dana Desa (ADD)</option>
                <option value="Pendapatan Asli Desa (PADes) TA 2026" ${sp && sp.sumberDana.includes('PADes') ? 'selected' : ''}>PADes</option>
                <option value="Dana Bagi Hasil (DBH) TA 2026" ${sp && sp.sumberDana.includes('DBH') ? 'selected' : ''}>Dana Bagi Hasil (DBH)</option>
                <option value="Bantuan Keuangan Provinsi TA 2026" ${sp && sp.sumberDana.includes('Provinsi') ? 'selected' : ''}>Bantuan Keuangan Provinsi</option>
                <option value="Bantuan Keuangan Khusus RT (BANKEUSUS RT) TA 2026" ${sp && sp.sumberDana.includes('BANKEUSUS') ? 'selected' : ''}>BANKEUSUS RT</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Waktu Penyerahan Barang</label>
              <input type="text" id="sp-waktuPenyerahan" value="${sp ? sp.waktuPenyerahan : '7 (Tujuh) Hari Kerja sejak SP diterbitkan'}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Lokasi Penyerahan Barang</label>
              <input type="text" id="sp-lokasiPenyerahan" value="${sp ? sp.lokasiPenyerahan : 'Kantor Balai Desa Tanjung Manis / Lokasi Kegiatan'}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>
          </div>
        </div>

        <!-- Dynamic Items Table -->
        <div class="glass-card rounded-2xl p-6 border border-slate-200 space-y-4 bg-white">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 class="text-base font-bold text-blue-700 flex items-center gap-2">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i> Rincian Barang / Material yang Dipesan
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">Pilih barang acuan resmi dari RAB Perubahan 2026 atau ketik manual</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="openRabPickerModal()" class="px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/25 flex items-center gap-2 transform active:scale-95">
                <i data-lucide="sparkles" class="w-4 h-4 text-amber-300"></i>
                <span>🏷️ Pilih dari Katalog RAB 2026 (Tinggal Klik)</span>
                <span class="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">${(appState.data.masterBarang || []).length} Barang</span>
              </button>

              <select id="select-katalog-quick" onchange="addQuickItemFromKatalog(this)" class="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:bg-white focus:border-blue-600 max-w-[210px] truncate">
                <option value="">+ Menu Dropdown Cepat...</option>
                ${renderKatalogOptionsGrouped()}
              </select>

              <button type="button" onclick="addSpFormRow()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Baris Kosong
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th class="px-3 py-2 w-12 text-center">No</th>
                  <th class="px-3 py-2">Nama Barang / Material</th>
                  <th class="px-3 py-2 w-24">Volume (Qty)</th>
                  <th class="px-3 py-2 w-28">Satuan</th>
                  <th class="px-3 py-2 w-36 text-right">Harga Satuan (Rp)</th>
                  <th class="px-3 py-2 w-36 text-right">Total (Rp)</th>
                  <th class="px-3 py-2 w-12 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200" id="sp-items-body">
                ${renderSpFormItemsHtml()}
              </tbody>
            </table>
          </div>

          <!-- Totals & Calculations Block -->
          <div class="pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
            <div class="space-y-1 max-w-md">
              <div class="text-xs font-bold text-slate-600 uppercase tracking-wider">Kalimat Terbilang Rupiah:</div>
              <div id="sp-terbilang-text" class="text-sm font-bold text-blue-800 italic">
                ${terbilang(calcTempItemsSubtotal())}
              </div>
            </div>

            <div class="w-full md:w-auto text-right space-y-1 font-mono">
              <div class="text-xs font-bold text-slate-600 uppercase">Total Keseluruhan Pesanan:</div>
              <div id="sp-grandtotal-text" class="text-2xl font-extrabold text-blue-700">
                ${formatRupiah(calcTempItemsSubtotal())}
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-3">
          <button type="button" onclick="navigateTo('sp-list')" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl">
            Batal
          </button>
          <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i> Simpan Surat Pesanan Barang
          </button>
        </div>
      </form>
    </div>
  `;
}

function onPemesanSelectChange(val) {
  const pelaksanaList = appState.data.profilDesa.pelaksanaList || defaultData.profilDesa.pelaksanaList;
  if (val === 'custom') {
    document.getElementById('sp-pemesanNama').value = '';
    document.getElementById('sp-pemesanJabatan').value = 'Pelaksana Kegiatan';
    document.getElementById('sp-pemesanNip').value = '-';
  } else {
    const selected = pelaksanaList.find(p => p.id === val);
    if (selected) {
      document.getElementById('sp-pemesanNama').value = selected.nama;
      document.getElementById('sp-pemesanJabatan').value = selected.jabatan;
      document.getElementById('sp-pemesanNip').value = selected.nip || '-';
    }
  }
}

function renderSpFormItemsHtml() {
  return tempFormItems.map((item, idx) => {
    const tot = (Number(item.volume) || 0) * (Number(item.hargaSatuan) || 0);
    return `
      <tr>
        <td class="px-3 py-2 text-center text-slate-500 font-mono">${idx + 1}</td>
        <td class="px-3 py-2">
          <input type="text" value="${item.namaBarang || ''}" onchange="updateSpItemField(${idx}, 'namaBarang', this.value)" placeholder="Nama barang / material" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600">
        </td>
        <td class="px-3 py-2">
          <input type="number" step="any" value="${item.volume || 1}" oninput="updateSpItemField(${idx}, 'volume', this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono text-center focus:bg-white focus:border-blue-600">
        </td>
        <td class="px-3 py-2">
          <input type="text" value="${item.satuan || 'Pcs'}" onchange="updateSpItemField(${idx}, 'satuan', this.value)" placeholder="Sak/M3" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:bg-white focus:border-blue-600">
        </td>
        <td class="px-3 py-2">
          <input type="number" value="${item.hargaSatuan || 0}" oninput="updateSpItemField(${idx}, 'hargaSatuan', this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono text-right focus:bg-white focus:border-blue-600">
        </td>
        <td class="px-3 py-2 text-right font-mono font-bold text-blue-700">
          ${formatRupiah(tot)}
        </td>
        <td class="px-3 py-2 text-center">
          <button type="button" onclick="removeSpFormRow(${idx})" class="p-1 text-slate-400 hover:text-red-600 rounded">
            <i data-lucide="minus-circle" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function calcTempItemsSubtotal() {
  return tempFormItems.reduce((acc, curr) => acc + ((Number(curr.volume) || 0) * (Number(curr.hargaSatuan) || 0)), 0);
}

function updateSpItemField(idx, field, value) {
  if (!tempFormItems[idx]) return;
  tempFormItems[idx][field] = value;
  tempFormItems[idx].total = (Number(tempFormItems[idx].volume) || 0) * (Number(tempFormItems[idx].hargaSatuan) || 0);

  const sub = calcTempItemsSubtotal();
  const terbilangText = document.getElementById('sp-terbilang-text');
  const grandtotalText = document.getElementById('sp-grandtotal-text');
  if (terbilangText) terbilangText.innerText = terbilang(sub);
  if (grandtotalText) grandtotalText.innerText = formatRupiah(sub);
}

function addSpFormRow() {
  tempFormItems.push({ namaBarang: '', volume: 1, satuan: 'Pcs', hargaSatuan: 0, total: 0 });
  document.getElementById('sp-items-body').innerHTML = renderSpFormItemsHtml();
  lucide.createIcons();
}

function removeSpFormRow(idx) {
  tempFormItems.splice(idx, 1);
  document.getElementById('sp-items-body').innerHTML = renderSpFormItemsHtml();
  const terbilangText = document.getElementById('sp-terbilang-text');
  const grandtotalText = document.getElementById('sp-grandtotal-text');
  if (terbilangText) terbilangText.innerText = terbilang(calcTempItemsSubtotal());
  if (grandtotalText) grandtotalText.innerText = formatRupiah(calcTempItemsSubtotal());
  lucide.createIcons();
}

function addQuickItemFromKatalog(selectEl) {
  const itemId = selectEl.value;
  if (!itemId) return;
  const mb = (appState.data.masterBarang || []).find(b => b.id === itemId);
  if (mb) {
    if (tempFormItems.length === 1 && (!tempFormItems[0].namaBarang || tempFormItems[0].namaBarang.trim() === '')) {
      tempFormItems = [];
    }
    tempFormItems.push({
      namaBarang: mb.namaBarang,
      volume: 1,
      satuan: mb.satuan,
      hargaSatuan: mb.hargaSatuan,
      total: mb.hargaSatuan
    });
    document.getElementById('sp-items-body').innerHTML = renderSpFormItemsHtml();
    const terbilangText = document.getElementById('sp-terbilang-text');
    const grandtotalText = document.getElementById('sp-grandtotal-text');
    if (terbilangText) terbilangText.innerText = terbilang(calcTempItemsSubtotal());
    if (grandtotalText) grandtotalText.innerText = formatRupiah(calcTempItemsSubtotal());
    lucide.createIcons();
  }
  selectEl.value = '';
}

// ==========================================
// KATALOG RAB 2026 PICKER & MODAL SYSTEM
// ==========================================

function getDistinctRabCategories() {
  const master = ensureArray(appState.data.masterBarang);
  const catSet = new Set();
  master.forEach(m => {
    if (m.kategori) catSet.add(m.kategori);
  });
  const list = Array.from(catSet);
  if (list.length === 0) {
    return [
      'Alat Tulis Kantor (ATK) & Cetak',
      'Bahan Bangunan & Material Fisik',
      'Kebersihan & Perlengkapan Rumah Tangga',
      'Konsumsi, Makanan & Minuman',
      'Peralatan, Mesin & Sewa Alat',
      'Peralatan & Barang Lainnya',
      'Pakaian, Seragam & Perlengkapan',
      'Alat Listrik & Elektronik',
      'Bahan Bakar & Minyak (BBM)',
      'Pertanian & Peternakan',
      'Kesehatan & Posyandu'
    ];
  }
  return list.sort();
}

function getCategoryBadgeColor(kategori) {
  const cat = kategori || '';
  if (cat.includes('ATK') || cat.includes('Tulis')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (cat.includes('Bangunan') || cat.includes('Material')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (cat.includes('Kebersihan') || cat.includes('Rumah Tangga')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (cat.includes('Konsumsi') || cat.includes('Makanan')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (cat.includes('Peralatan') || cat.includes('Mesin')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (cat.includes('Pakaian') || cat.includes('Seragam')) return 'bg-pink-100 text-pink-800 border-pink-200';
  if (cat.includes('Listrik') || cat.includes('Elektronik')) return 'bg-yellow-100 text-yellow-900 border-yellow-200';
  if (cat.includes('BBM') || cat.includes('Bakar')) return 'bg-red-100 text-red-800 border-red-200';
  if (cat.includes('Pertanian') || cat.includes('Peternakan')) return 'bg-lime-100 text-lime-800 border-lime-200';
  if (cat.includes('Kesehatan') || cat.includes('Posyandu')) return 'bg-teal-100 text-teal-800 border-teal-200';
  return 'bg-slate-100 text-slate-800 border-slate-200';
}

function renderKatalogOptionsGrouped() {
  const master = ensureArray(appState.data.masterBarang);
  const groups = {};
  master.forEach(item => {
    const cat = item.kategori || 'Katalog Acuan';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });
  return Object.keys(groups).sort().map(cat => `
    <optgroup label="${cat} (${groups[cat].length})">
      ${groups[cat].map(it => `
        <option value="${it.id}">${it.namaBarang} - ${formatRupiah(it.hargaSatuan)} / ${it.satuan}</option>
      `).join('')}
    </optgroup>
  `).join('');
}

function openRabPickerModal() {
  appState.showRabPickerModal = true;
  appState.rabSearchQuery = '';
  appState.rabActiveCategory = 'all';
  renderApp();
  setTimeout(() => {
    const el = document.getElementById('rab-search-input');
    if (el) el.focus();
  }, 100);
}

function closeRabPickerModal() {
  appState.showRabPickerModal = false;
  renderApp();
}

function setRabModalCategory(cat) {
  appState.rabActiveCategory = cat;
  document.querySelectorAll('.rab-cat-pill').forEach(btn => {
    const isThis = btn.getAttribute('data-cat') === cat;
    if (isThis) {
      btn.className = 'rab-cat-pill px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm whitespace-nowrap transition cursor-pointer';
    } else {
      btn.className = 'rab-cat-pill px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition cursor-pointer';
    }
  });
  const grid = document.getElementById('rab-modal-grid');
  if (grid) {
    grid.innerHTML = renderRabModalItemsGridHtml();
    lucide.createIcons();
  }
}

function onRabModalSearch(query) {
  appState.rabSearchQuery = query || '';
  const grid = document.getElementById('rab-modal-grid');
  if (grid) {
    grid.innerHTML = renderRabModalItemsGridHtml();
    lucide.createIcons();
  }
}

function getFilteredRabItems() {
  const master = ensureArray(appState.data.masterBarang);
  const cat = appState.rabActiveCategory || 'all';
  const query = (appState.rabSearchQuery || '').trim().toLowerCase();

  return master.filter(item => {
    if (cat !== 'all' && item.kategori !== cat) return false;
    if (!query) return true;
    const n = (item.namaBarang || '').toLowerCase();
    const k = (item.kategori || '').toLowerCase();
    const s = (item.satuan || '').toLowerCase();
    const sp = (item.spesifikasi || '').toLowerCase();
    return n.includes(query) || k.includes(query) || s.includes(query) || sp.includes(query);
  });
}

function renderRabModalItemsGridHtml() {
  const items = getFilteredRabItems();
  if (items.length === 0) {
    return `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i data-lucide="search-x" class="w-12 h-12 mx-auto text-slate-300 mb-2"></i>
        <p class="font-bold text-sm text-slate-700">Barang tidak ditemukan</p>
        <p class="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lebih umum atau klik kategori lain.</p>
      </div>
    `;
  }

  return items.map(it => {
    const badgeColor = getCategoryBadgeColor(it.kategori);
    return `
      <div class="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-3.5 transition-all flex flex-col justify-between group">
        <div class="space-y-1.5">
          <div class="flex items-start justify-between gap-1.5">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} truncate max-w-[170px]" title="${it.kategori || ''}">
              ${it.kategori || 'Barang Acuan'}
            </span>
            <span class="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              /${it.satuan}
            </span>
          </div>
          <h4 class="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition leading-snug line-clamp-2" title="${it.namaBarang}">
            ${it.namaBarang}
          </h4>
        </div>

        <div class="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div class="text-[10px] text-slate-500 font-medium">Harga Satuan RAB</div>
            <div class="text-xs sm:text-sm font-extrabold text-emerald-700 font-mono">
              ${formatRupiah(it.hargaSatuan)}
            </div>
          </div>
          <button type="button" onclick="addRabItemToOrder('${it.id}', this)" class="rab-add-btn px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm shrink-0">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Pilih</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function addRabItemToOrder(itemId, btnEl) {
  const master = ensureArray(appState.data.masterBarang);
  const it = master.find(m => m.id === itemId);
  if (!it) return;

  if (tempFormItems.length === 1 && (!tempFormItems[0].namaBarang || tempFormItems[0].namaBarang.trim() === '')) {
    tempFormItems = [];
  }

  tempFormItems.push({
    namaBarang: it.namaBarang,
    volume: 1,
    satuan: it.satuan,
    hargaSatuan: it.hargaSatuan,
    total: it.hargaSatuan
  });

  const tbody = document.getElementById('sp-items-body');
  if (tbody) {
    tbody.innerHTML = renderSpFormItemsHtml();
  }
  const terbilangEl = document.getElementById('sp-terbilang-text');
  if (terbilangEl) {
    terbilangEl.textContent = terbilang(calcTempItemsSubtotal());
  }
  const totalEl = document.getElementById('sp-grandtotal-text');
  if (totalEl) {
    totalEl.textContent = formatRupiah(calcTempItemsSubtotal());
  }

  const countEl = document.getElementById('rab-modal-selected-count');
  if (countEl) {
    countEl.textContent = `${tempFormItems.length} Barang`;
  }
  const totalModalEl = document.getElementById('rab-modal-selected-total');
  if (totalModalEl) {
    totalModalEl.textContent = formatRupiah(calcTempItemsSubtotal());
  }

  if (btnEl) {
    const origHtml = btnEl.innerHTML;
    btnEl.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 inline"></i> Terpilih!';
    btnEl.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    btnEl.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btnEl.innerHTML = origHtml;
      btnEl.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
      btnEl.classList.add('bg-blue-600', 'hover:bg-blue-700');
      if (window.lucide) lucide.createIcons();
    }, 1200);
  }
}

function renderRabPickerModalHtml() {
  const master = ensureArray(appState.data.masterBarang);
  const categories = getDistinctRabCategories();
  const activeCat = appState.rabActiveCategory || 'all';

  return `
    <div id="modal-rab-picker" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
      <div class="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <i data-lucide="book-open" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-base sm:text-lg tracking-tight">Katalog RAB Perubahan TA 2026</h3>
                <span class="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Resmi APBDes</span>
              </div>
              <p class="text-xs text-blue-200">Tinggal klik barang di bawah untuk langsung memasukkannya ke Surat Pesanan Barang (SPB)</p>
            </div>
          </div>
          <button onclick="closeRabPickerModal()" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Search & Filter Controls -->
        <div class="p-4 border-b border-slate-200 bg-slate-50/80 space-y-3 shrink-0">
          <!-- Search input -->
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="rab-search-input" 
              value="${appState.rabSearchQuery || ''}" 
              oninput="onRabModalSearch(this.value)" 
              placeholder="Ketik nama barang / material (misal: HVS A4, Balok Ulin, Semen, Snack, Solar, Map, Spidol)..." 
              class="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
            >
            ${appState.rabSearchQuery ? `
              <button onclick="onRabModalSearch(''); document.getElementById('rab-search-input').value = '';" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            ` : ''}
          </div>

          <!-- Category filter pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button 
              type="button" 
              data-cat="all" 
              onclick="setRabModalCategory('all')" 
              class="rab-cat-pill px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeCat === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}"
            >
              Semua (${master.length})
            </button>
            ${categories.map(cat => {
              const count = master.filter(m => m.kategori === cat).length;
              const isActive = activeCat === cat;
              return `
                <button 
                  type="button" 
                  data-cat="${cat}" 
                  onclick="setRabModalCategory('${cat}')" 
                  class="rab-cat-pill px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap cursor-pointer ${isActive ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
                >
                  ${cat} (${count})
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Scrollable Items Grid -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-100/50">
          <div id="rab-modal-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5">
            ${renderRabModalItemsGridHtml()}
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-500 font-medium">Barang di SP:</span>
              <span id="rab-modal-selected-count" class="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                ${tempFormItems.length} Barang
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-500 font-medium">Total Nilai:</span>
              <span id="rab-modal-selected-total" class="font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ${formatRupiah(calcTempItemsSubtotal())}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button type="button" onclick="closeRabPickerModal()" class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Selesai Memilih</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function saveSpForm(e) {
  e.preventDefault();
  if (tempFormItems.length === 0) {
    alert('Harap masukkan minimal 1 barang dalam daftar Surat Pesanan!');
    return;
  }

  const subtotal = calcTempItemsSubtotal();

  const newSp = {
    id: appState.editingSpId || ('sp-' + Date.now()),
    nomorSp: document.getElementById('sp-nomorSp').value,
    tanggalSp: document.getElementById('sp-tanggalSp').value,
    supplierId: document.getElementById('sp-supplierId').value,
    pemesanNama: document.getElementById('sp-pemesanNama').value,
    pemesanJabatan: document.getElementById('sp-pemesanJabatan').value,
    pemesanNip: document.getElementById('sp-pemesanNip').value,
    kegiatan: document.getElementById('sp-kegiatan').value,
    sumberDana: document.getElementById('sp-sumberDana').value,
    waktuPenyerahan: document.getElementById('sp-waktuPenyerahan').value,
    lokasiPenyerahan: document.getElementById('sp-lokasiPenyerahan').value,
    items: JSON.parse(JSON.stringify(tempFormItems)),
    subtotal: subtotal,
    grandTotal: subtotal,
    terbilang: terbilang(subtotal),
    status: 'Diproses'
  };

  let updatedList = [...ensureArray(appState.data.suratPesanan)];
  if (appState.editingSpId) {
    updatedList = updatedList.map(s => s.id === appState.editingSpId ? newSp : s);
  } else {
    updatedList.unshift(newSp);
  }

  tempFormItems = [];
  setState({
    data: {
      ...appState.data,
      suratPesanan: updatedList
    },
    currentView: 'sp-list',
    editingSpId: null
  });

  alert('Surat Pesanan berhasil disimpan!');
}

// --- VIEW: BAST LIST ---
function renderBastListView() {
  const data = appState.data || {};
  const suratPesanan = ensureArray(data.suratPesanan);
  const bastList = ensureArray(data.bastList);
  const suppliers = ensureArray(data.suppliers);
  const profilDesa = data.profilDesa || defaultData.profilDesa;
  const pelaksanaList = ensureArray(profilDesa.pelaksanaList);
  const activePk = appState.activePelaksanaId !== 'all' ? pelaksanaList.find(p => p && p.id === appState.activePelaksanaId) : null;

  const bastListFiltered = activePk 
    ? bastList.filter(b => {
        if (!b) return false;
        const sp = suratPesanan.find(s => s && s.id === b.spId);
        if (!sp) return false;
        return (sp.pemesanNama && sp.pemesanNama === activePk.nama) || (b.ketuaTpk && b.ketuaTpk === activePk.nama);
      })
    : bastList;

  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Berita Acara Serah Terima (BAST) & BAPB</h2>
          <p class="text-slate-500 text-sm">Dokumen pemeriksaan dan serah terima resmi pengadaan barang desa</p>
        </div>
        <button onclick="navigateTo('bast-form', { editingBastId: null })" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Buat BAST Baru
        </button>
      </div>

      ${activePk ? `
        <div class="bg-blue-50 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-900 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <i data-lucide="filter" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-xs text-blue-700 font-bold uppercase tracking-wider block">Menampilkan BAST Pelaksana:</span>
              <span class="font-extrabold text-sm">${activePk.nama} (${activePk.jabatan})</span>
            </div>
          </div>
          <button onclick="switchActivePelaksana('all')" class="px-3.5 py-1.5 bg-white text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-300 transition shadow-xs self-start sm:self-auto">
            Tampilkan Seluruh BAST Desa
          </button>
        </div>
      ` : ''}

      <div class="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="px-5 py-4">Nomor BAST & BAPB</th>
                <th class="px-5 py-4">Ref. Surat Pesanan (SP)</th>
                <th class="px-5 py-4">Tanggal Serah Terima</th>
                <th class="px-5 py-4">Penerima Barang (Pihak II)</th>
                <th class="px-5 py-4 text-center">Cetak Dokumen Resmi</th>
                <th class="px-5 py-4 text-center">Hapus</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-700">
              ${bastListFiltered.length === 0 ? `
                <tr><td colspan="6" class="px-5 py-8 text-center text-slate-400">Belum ada dokumen BAST yang terbuat untuk filter ini.</td></tr>
              ` : bastListFiltered.map(bast => {
                if (!bast) return '';
                const sp = suratPesanan.find(s => s && s.id === bast.spId) || {};
                const sup = suppliers.find(s => s && s.id === sp.supplierId) || {};
                return `
                  <tr class="hover:bg-blue-50/50">
                    <td class="px-5 py-4">
                      <div class="font-bold text-slate-900 font-mono text-xs">${bast.nomorBast}</div>
                      <div class="text-xs text-slate-500 font-mono mt-0.5">BAPB: ${bast.nomorBapb || '-'}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="font-bold text-blue-700 font-mono text-xs">${sp.nomorSp || '-'}</div>
                      <div class="text-xs text-slate-500">${sp.kegiatan || '-'}</div>
                    </td>
                    <td class="px-5 py-4 text-slate-700">
                      <div class="font-semibold">${formatTanggalIndo(bast.tanggalBast)}</div>
                      <div class="text-xs text-slate-500">${getNamaHariIndo(bast.tanggalBast)}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="font-semibold text-slate-900">${bast.ketuaTpk || sp.pemesanNama || '-'}</div>
                      <div class="text-xs text-slate-500">${bast.statusCatatan || 'Pemeriksaan Sesuai'}</div>
                    </td>
                    <td class="px-5 py-4 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button onclick="openPrintModal('bast', '${bast.id}')" class="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-1">
                          <i data-lucide="printer" class="w-3.5 h-3.5 text-blue-600"></i> BAST
                        </button>
                        <button onclick="openPrintModal('bapb', '${bast.id}')" class="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-1">
                          <i data-lucide="clipboard-check" class="w-3.5 h-3.5 text-blue-600"></i> BAPB
                        </button>
                        <button onclick="openPrintModal('kwitansi', '${bast.id}')" class="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-sm transition flex items-center gap-1">
                          <i data-lucide="receipt" class="w-3.5 h-3.5 text-blue-600"></i> Kwitansi
                        </button>
                      </div>
                    </td>
                    <td class="px-5 py-4 text-center">
                      <button onclick="deleteBast('${bast.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function deleteBast(id) {
  const bastList = ensureArray(appState.data.bastList);
  const bast = bastList.find(b => b && b.id === id);
  const nomor = bast ? bast.nomorBast : 'BAST ini';
  showConfirmModal('Hapus Berita Acara (BAST)?', `Yakin ingin menghapus BAST ${nomor}? Data yang dihapus tidak dapat dikembalikan.`, () => {
    setState({
      data: {
        ...appState.data,
        bastList: bastList.filter(b => b && b.id !== id)
      },
      confirmModal: null
    });
  });
}

function createBastFromSp(spId) {
  navigateTo('bast-form', { selectedSpIdForBast: spId });
}

// --- VIEW: BAST FORM ---
function renderBastFormView() {
  const selectedSpId = appState.selectedSpIdForBast || '';
  const data = appState.data || {};
  const suratPesanan = ensureArray(data.suratPesanan);
  const bastList = ensureArray(data.bastList);
  const profilDesa = data.profilDesa || defaultData.profilDesa;
  const pelaksanaList = ensureArray(profilDesa.pelaksanaList).length > 0 ? ensureArray(profilDesa.pelaksanaList) : defaultData.profilDesa.pelaksanaList;
  const activePk = appState.activePelaksanaId !== 'all' ? pelaksanaList.find(p => p && p.id === appState.activePelaksanaId) : null;
  const spOptions = activePk 
    ? suratPesanan.filter(s => s && s.pemesanNama && s.pemesanNama === activePk.nama)
    : suratPesanan;

  const defaultNomorBast = `027/${String(bastList.length + 1).padStart(3, '0')}/BAST/TPK-DS/${new Date().getFullYear()}`;
  const defaultNomorBapb = `027/${String(bastList.length + 1).padStart(3, '0')}/BAPB/TPK-DS/${new Date().getFullYear()}`;

  const defaultPemesanNama = profilDesa.tpkNama || '';

  return `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Buat Berita Acara Serah Terima (BAST)</h2>
          <p class="text-slate-500 text-sm">Penarikan data dari Surat Pesanan yang telah diterbitkan</p>
        </div>
        <button onclick="navigateTo('bast-list')" class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-sm transition">
          Kembali
        </button>
      </div>

      <form onsubmit="saveBastForm(event)" class="glass-card rounded-2xl p-6 border border-slate-200 space-y-5 bg-white">
        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">Pilih Surat Pesanan Acuan (SP)</label>
          <select id="bast-spId" onchange="onBastSpSelect(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            <option value="">-- Pilih Surat Pesanan --</option>
            ${spOptions.map(s => `
              <option value="${s.id}" ${s.id === selectedSpId ? 'selected' : ''}>${s.nomorSp} - ${s.kegiatan} (${formatRupiah(s.grandTotal)})</option>
            `).join('')}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Nomor BAST</label>
            <input type="text" id="bast-nomorBast" value="${defaultNomorBast}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:border-blue-600" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Nomor BAPB (Pemeriksaan)</label>
            <input type="text" id="bast-nomorBapb" value="${defaultNomorBapb}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:border-blue-600" required>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Tanggal Serah Terima</label>
            <input type="date" id="bast-tanggalBast" value="${new Date().toISOString().split('T')[0]}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Nama Penerima (Ketua TPK / Kasi Kaur)</label>
            <input type="text" id="bast-ketuaTpk" value="${defaultPemesanNama}" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600" required>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">Anggota Tim Pemeriksa / Pendamping</label>
          <input type="text" id="bast-anggotaTpk" placeholder="Nama anggota TPK / pendamping (dipisahkan koma)" value="Siti Aminah, M. Taufik" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 mb-1">Hasil & Catatan Pemeriksaan Barang</label>
          <textarea id="bast-hasilPemeriksaan" rows="3" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-600">Semua barang yang dipesan telah diperiksa secara seksama oleh Tim Pengelola Kegiatan (TPK) / Pelaksana Kegiatan dan dinyatakan LENGKAP, 100% BAIK, serta SESUAI SPESIFIKASI Surat Pesanan.</textarea>
        </div>

        <div class="pt-4 flex justify-end gap-3 border-t border-slate-200">
          <button type="button" onclick="navigateTo('bast-list')" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl">
            Batal
          </button>
          <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i> Simpan BAST
          </button>
        </div>
      </form>
    </div>
  `;
}

function onBastSpSelect(spId) {
  appState.selectedSpIdForBast = spId;
  const sp = appState.data.suratPesanan.find(s => s.id === spId);
  if (sp && sp.pemesanNama) {
    const inputKetua = document.getElementById('bast-ketuaTpk');
    if (inputKetua) inputKetua.value = sp.pemesanNama;
  }
}

function saveBastForm(e) {
  e.preventDefault();
  const spId = document.getElementById('bast-spId').value;
  if (!spId) {
    alert('Pilih Surat Pesanan terlebih dahulu!');
    return;
  }

  const newBast = {
    id: 'bast-' + Date.now(),
    spId: spId,
    nomorBast: document.getElementById('bast-nomorBast').value,
    nomorBapb: document.getElementById('bast-nomorBapb').value,
    tanggalBast: document.getElementById('bast-tanggalBast').value,
    ketuaTpk: document.getElementById('bast-ketuaTpk').value,
    anggotaTpk: document.getElementById('bast-anggotaTpk').value,
    hasilPemeriksaan: document.getElementById('bast-hasilPemeriksaan').value,
    statusCatatan: 'Baik & Lengkap'
  };

  const suratPesanan = ensureArray(appState.data.suratPesanan);
  const bastList = ensureArray(appState.data.bastList);
  const updatedSpList = suratPesanan.map(s => s && s.id === spId ? { ...s, status: 'Selesai' } : s);

  setState({
    data: {
      ...appState.data,
      suratPesanan: updatedSpList,
      bastList: [newBast, ...bastList]
    },
    currentView: 'bast-list',
    selectedSpIdForBast: null
  });

  alert('Berita Acara Serah Terima (BAST) berhasil dibuat!');
}

// ==========================================
// 4.6. VIEW: PAPAN INFORMASI PROYEK 1x1 METER
// ==========================================

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = (text || '-').toString().split(' ');
  let line = '';
  let currentY = y;
  let linesRendered = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      linesRendered++;
      if (linesRendered >= maxLines - 1 && n < words.length - 1) {
        const remaining = words.slice(n).join(' ');
        ctx.fillText(remaining.substring(0, 32) + '...', x, currentY);
        return;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

function downloadPapanProyekPng(papanIdOrObj) {
  let papan = null;
  if (typeof papanIdOrObj === 'string') {
    papan = (appState.data.papanProyekList || []).find(p => p.id === papanIdOrObj);
  } else if (papanIdOrObj && typeof papanIdOrObj === 'object') {
    papan = papanIdOrObj;
  }
  if (!papan) {
    alert('Data papan proyek tidak ditemukan.');
    return;
  }

  const p = appState.data.profilDesa;
  const canvas = document.createElement('canvas');
  canvas.width = 2000;
  canvas.height = 2000;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 2000, 2000);

  // Outer Border (Navy)
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 18;
  ctx.strokeRect(30, 30, 1940, 1940);

  // Inner Accent Line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(46, 46, 1908, 1908);

  function drawRemainingContent() {
    // Kop Text (Centered between Logo Pemda on left and Logo Kemendesa on right)
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    
    const kabText = (p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR').startsWith('PEMERINTAH') ? (p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR') : 'PEMERINTAH ' + p.kabupaten;
    ctx.font = 'bold 36px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(kabText.toUpperCase(), 1000, 105);

    ctx.font = 'bold 42px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText((p.kecamatan || 'KECAMATAN SANGKULIRANG').toUpperCase(), 1000, 155);

    ctx.fillStyle = '#1e40af';
    ctx.font = '900 56px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText((p.desa || 'DESA TANJUNG MANIS').toUpperCase(), 1000, 220);

    ctx.fillStyle = '#475569';
    ctx.font = 'normal 24px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('Alamat: ' + (p.alamat || 'Jl Poros RT.03 Dusun I. Tanjung Manis Sangkulirang Kutai Timur'), 1000, 265);

    // Double Separator Line
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(80, 292);
    ctx.lineTo(1920, 292);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 300);
    ctx.lineTo(1920, 300);
    ctx.stroke();

    // Title Box (Yellow Banner)
    ctx.fillStyle = '#fde047'; // Bright Yellow
    ctx.fillRect(80, 325, 1840, 135);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 6;
    ctx.strokeRect(80, 325, 1840, 135);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 46px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAPAN INFORMASI KEGIATAN PEMBANGUNAN DESA', 1000, 380);

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 34px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`TAHUN ANGGARAN ${papan.tahunAnggaran || '2026'}`, 1000, 430);

    // Table Data Grid (9 Rows - Fills remaining space clearly without signatures)
    const startY = 485;
    const rowHeight = 158;
    const tableX = 80;
    const tableWidth = 1840;
    const col1Width = 560;
    const col2Width = tableWidth - col1Width;

    const rows = [
      { label: '1. BIDANG / KEGIATAN', val: papan.kegiatan || '-' },
      { label: '2. LOKASI KEGIATAN', val: papan.lokasi || '-' },
      { label: '3. VOLUME / UKURAN', val: papan.volume || '-' },
      { label: '4. BIAYA / ANGGARAN', val: `${formatRupiah(papan.anggaran)} (Termasuk Pajak)` },
      { label: '5. SUMBER DANA', val: papan.sumberDana || '-' },
      { label: '6. TAHUN ANGGARAN', val: papan.tahunAnggaran || '2026' },
      { label: '7. WAKTU PELAKSANAAN', val: papan.waktuPelaksanaan || '90 (Sembilan Puluh) Hari Kalender' },
      { label: '8. SIFAT KEGIATAN', val: papan.sifatKegiatan || 'Swakelola (Padat Karya Tunai Desa / PKTD)' },
      { label: '9. PELAKSANA KEGIATAN', val: papan.pelaksana || 'Tim Pengelola Kegiatan (TPK)' }
    ];

    rows.forEach((r, idx) => {
      const curY = startY + (idx * rowHeight);

      // Zebra background
      ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
      ctx.fillRect(tableX, curY, tableWidth, rowHeight);

      // Outer cell border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(tableX, curY, tableWidth, rowHeight);

      // Vertical column divider
      ctx.beginPath();
      ctx.moveTo(tableX + col1Width, curY);
      ctx.lineTo(tableX + col1Width, curY + rowHeight);
      ctx.stroke();

      // Label (Left Column)
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 38px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(r.label, tableX + 35, curY + 95);

      // Colon ':'
      ctx.fillText(':', tableX + col1Width - 35, curY + 95);

      // Value (Right Column)
      ctx.fillStyle = (idx === 3) ? '#1e40af' : '#0f172a';
      ctx.font = (idx === 3 || idx === 0) ? '900 42px "Plus Jakarta Sans", Arial, sans-serif' : 'bold 40px "Plus Jakarta Sans", Arial, sans-serif';

      const isMultiLine = ctx.measureText(r.val).width > (col2Width - 70);
      const textY = isMultiLine ? (curY + 68) : (curY + 95);
      wrapCanvasText(ctx, r.val, tableX + col1Width + 35, textY, col2Width - 70, 52, 3);
    });

    // Export to PNG File (High-Resolution 2000x2000 px, Zero CORS Taint)
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = dataUrl;
      const safeTitle = (papan.kegiatan || 'Papan_Proyek').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
      const fileName = `Papan_Plang_Proyek_1x1m_${safeTitle}_TA${papan.tahunAnggaran || '2026'}.png`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try { document.body.removeChild(a); } catch (e) {}
      }, 200);

      setTimeout(() => {
        alert(`File gambar plang proyek "${fileName}" berhasil diunduh dan tersimpan ke komputer Anda! Silakan kirim file ini ke percetakan.`);
      }, 300);
    } catch (err) {
      console.warn('Canvas toDataURL fallback to toBlob:', err);
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('Gagal membuat file gambar spanduk.');
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const safeTitle = (papan.kegiatan || 'Papan_Proyek').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
          a.download = `Papan_Plang_Proyek_1x1m_${safeTitle}.png`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            try { document.body.removeChild(a); } catch (e) {}
            URL.revokeObjectURL(url);
          }, 200);
        }, 'image/png', 1.0);
      } catch (eBlob) {
        alert('Gagal mendownload gambar: ' + eBlob.message);
      }
    }
  }

  // Load Logo Pemda & Logo Kemendesa (Enlarged and Clean, Using Offline Base64 to Prevent Canvas Taint)
  const logoPemda = new Image();
  logoPemda.src = (typeof LOGO_PEMKAB_B64 !== 'undefined' && LOGO_PEMKAB_B64) ? LOGO_PEMKAB_B64 : (p.logoUrl || 'logo-kutai-timur.png');

  const logoKemen = new Image();
  logoKemen.src = (typeof LOGO_KEMENDESA_B64 !== 'undefined' && LOGO_KEMENDESA_B64) ? LOGO_KEMENDESA_B64 : 'logo-kemendesa.png';

  let isDrawn = false;

  function tryDrawAll() {
    if (isDrawn) return;
    isDrawn = true;
    try {
      if (logoPemda.complete && logoPemda.naturalWidth > 0) {
        ctx.drawImage(logoPemda, 75, 50, 230, 230);
      }
    } catch (e) {}

    try {
      if (logoKemen.complete && logoKemen.naturalWidth > 0) {
        ctx.drawImage(logoKemen, 1695, 50, 230, 230);
      }
    } catch (e) {}

    drawRemainingContent();
  }

  let loadedCount = 0;
  const onImgDone = () => {
    loadedCount++;
    if (loadedCount >= 2) {
      tryDrawAll();
    }
  };

  logoPemda.onload = onImgDone;
  logoPemda.onerror = onImgDone;
  logoKemen.onload = onImgDone;
  logoKemen.onerror = onImgDone;

  // Immediate check if Base64 already complete
  if (logoPemda.complete && logoKemen.complete) {
    tryDrawAll();
  } else {
    setTimeout(() => {
      tryDrawAll();
    }, 200);
  }
}

// 4.6.1. LIST VIEW PAPAN PROYEK
function renderPapanListView() {
  const list = appState.data.papanProyekList || [];
  const p = appState.data.profilDesa;

  // Plang Proyek is village-wide public transparency information; filter by selected year
  const currentTahun = appState.filterTahunPapan || 'all';
  const tahunOptions = ['all', '2026', '2027', '2028', '2029', '2030', '2031'];

  let filteredList = list;
  if (currentTahun !== 'all') {
    filteredList = filteredList.filter(item => String(item.tahunAnggaran || '2026') === currentTahun);
  }

  const totalAnggaran = filteredList.reduce((acc, curr) => acc + (Number(curr.anggaran) || 0), 0);

  return `
    <div class="space-y-6">
      <!-- Header Banner & Quick Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
              <i data-lucide="signpost" class="w-3.5 h-3.5 text-amber-600"></i> Standar Cetak Spanduk 1 Meter x 1 Meter (1:1)
            </span>
            ${currentTahun !== 'all' ? `
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                Tahun Anggaran ${currentTahun}
              </span>
            ` : ''}
          </div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Papan Informasi Proyek Pembangunan</h1>
          <p class="text-xs text-slate-500 font-medium">Buat plang proyek fisik siap cetak, langsung export gambar HD ke toko percetakan tanpa ribet.</p>
        </div>

        <button onclick="navigateTo('papan-form', { editingPapanId: null })" class="px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]">
          <i data-lucide="plus-circle" class="w-4 h-4"></i> Buat Plang Proyek Baru
        </button>
      </div>

      <!-- Filter Tahun Anggaran Tabs / Pills -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center gap-2 shrink-0">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <i data-lucide="calendar" class="w-4 h-4"></i>
          </div>
          <div>
            <span class="text-xs font-extrabold text-slate-800">Filter Tahun Anggaran:</span>
            <p class="text-[11px] text-slate-500">Pilih tahun agar data proyek terpisah rapi</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          ${tahunOptions.map(th => {
            const isAll = th === 'all';
            const isActive = currentTahun === th;
            const count = isAll ? list.length : list.filter(item => String(item.tahunAnggaran || '2026') === th).length;
            return `
              <button onclick="setFilterTahunPapan('${th}')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40 scale-[1.02]' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }">
                <span>${isAll ? 'Semua Tahun' : 'Tahun ' + th}</span>
                <span class="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}">${count}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 uppercase">Total Plang Proyek ${currentTahun === 'all' ? '(Semua Tahun)' : `(TA ${currentTahun})`}</span>
            <div class="text-2xl font-black text-slate-900 mt-1">${filteredList.length} Kegiatan Fisik</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <i data-lucide="layout-grid" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-500 uppercase">Total Nilai Anggaran ${currentTahun === 'all' ? '(Semua Tahun)' : `(TA ${currentTahun})`}</span>
            <div class="text-2xl font-black text-blue-700 font-mono mt-1">${formatRupiah(totalAnggaran)}</div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <i data-lucide="coins" class="w-6 h-6"></i>
          </div>
        </div>
      </div>

      <!-- Plang Proyek Cards Grid -->
      ${filteredList.length === 0 ? `
        <div class="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <i data-lucide="signpost" class="w-8 h-8"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">
              ${list.length > 0 && currentTahun !== 'all' ? `Belum Ada Plang Proyek untuk Tahun Anggaran ${currentTahun}` : 'Belum Ada Plang Proyek yang Dibuat'}
            </h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              ${list.length > 0 && currentTahun !== 'all' 
                ? `Tersedia ${list.length} plang proyek di tahun anggaran lainnya. Klik tombol di bawah untuk menampilkan semua data.` 
                : 'Mulai buat template papan plang proyek pembangunan 1x1 meter sekarang. Data proyek tersimpan rapi di aplikasi dan dapat diunduh/dicetak kapan saja!'}
            </p>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            ${list.length > 0 && currentTahun !== 'all' ? `
              <button onclick="setFilterTahunPapan('all')" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2">
                <i data-lucide="eye" class="w-4 h-4"></i> Tampilkan Semua Tahun (${list.length} Proyek)
              </button>
            ` : ''}
            <button onclick="navigateTo('papan-form', { editingPapanId: null })" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> Buat Plang Proyek Baru
            </button>
          </div>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filteredList.map(item => `
            <div class="glass-card bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <!-- Top Preview Strip -->
              <div class="bg-slate-900 p-4 text-white relative">
                <div class="flex items-center justify-between text-[10px] text-amber-400 font-extrabold uppercase tracking-wider mb-1">
                  <span>Papan Proyek 1x1 M</span>
                  <span class="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">TA ${item.tahunAnggaran || '2026'}</span>
                </div>
                <h3 class="font-extrabold text-white text-sm line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                  ${item.kegiatan}
                </h3>
              </div>

              <!-- Content Meta Details -->
              <div class="p-5 space-y-3 flex-1 text-xs">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-slate-500 font-semibold">Sumber Dana:</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    ${item.sumberDana || 'Dana Desa (DD)'}
                  </span>
                </div>

                <div class="flex items-start justify-between gap-2 border-t border-slate-100 pt-2">
                  <span class="text-slate-500 font-semibold">Lokasi:</span>
                  <span class="text-slate-800 font-bold text-right line-clamp-1">${item.lokasi || '-'}</span>
                </div>

                <div class="flex items-start justify-between gap-2 border-t border-slate-100 pt-2">
                  <span class="text-slate-500 font-semibold">Volume / Ukuran:</span>
                  <span class="text-slate-800 font-bold text-right line-clamp-1">${item.volume || '-'}</span>
                </div>

                <div class="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                  <span class="text-slate-500 font-semibold">Besar Anggaran:</span>
                  <span class="text-blue-700 font-black font-mono text-sm">${formatRupiah(item.anggaran)}</span>
                </div>

                <div class="flex items-start justify-between gap-2 border-t border-slate-100 pt-2">
                  <span class="text-slate-500 font-semibold">Pelaksana:</span>
                  <span class="text-slate-800 font-bold text-right line-clamp-1">${item.pelaksana || '-'}</span>
                </div>
              </div>

              <!-- Card Action Tools -->
              <div class="p-4 bg-slate-50/90 border-t border-slate-100 flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                  <button onclick="navigateTo('papan-preview', { previewPapanId: '${item.id}' })" class="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center justify-center gap-1.5">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i> Buka Spanduk
                  </button>
                  <button onclick="downloadPapanProyekPng('${item.id}')" title="Download Gambar PNG HD untuk Cetak di Percetakan" class="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i> Gambar PNG
                  </button>
                </div>

                <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                  <button onclick="openPrintModal('papan', '${item.id}')" class="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1 hover:bg-slate-200/60 rounded-lg transition">
                    <i data-lucide="printer" class="w-3.5 h-3.5 text-slate-500"></i> Cetak / PDF
                  </button>
                  <div class="flex items-center gap-1">
                    <button onclick="navigateTo('papan-form', { editingPapanId: '${item.id}' })" class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition" title="Edit Data">
                      <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <button onclick="confirmDeletePapan('${item.id}')" class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition" title="Hapus">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// 4.6.2. FORM VIEW BUAT / EDIT PAPAN PROYEK (DENGAN LIVE PREVIEW 1x1 M)
function renderPapanFormView() {
  const p = appState.data.profilDesa;
  const isEditing = Boolean(appState.editingPapanId);
  const existing = isEditing ? (appState.data.papanProyekList || []).find(x => x.id === appState.editingPapanId) : null;

  const defaultKegiatan = existing ? existing.kegiatan : '';
  const defaultLokasi = existing ? existing.lokasi : `Dusun II RT 03 ${p.desa}`;
  const defaultVolume = existing ? existing.volume : 'P = 350 M x L = 2,5 M x T = 0,15 M';
  const defaultSumberDana = existing ? existing.sumberDana : 'Dana Desa (DD) TA 2026';
  const defaultTahun = existing ? existing.tahunAnggaran : '2026';
  const defaultAnggaran = existing ? existing.anggaran : 17700000;
  const defaultWaktu = existing ? existing.waktuPelaksanaan : '90 (Sembilan Puluh) Hari Kalender';
  const defaultSifat = existing ? existing.sifatKegiatan : 'Swakelola (Padat Karya Tunai Desa / PKTD)';
  const defaultPelaksana = existing ? existing.pelaksana : (p.tpkNama ? `${p.tpkNama} (Pelaksana Kegiatan)` : 'Tim Pengelola Kegiatan (TPK)');

  const pelaksanaList = p.pelaksanaList || defaultData.profilDesa.pelaksanaList;

  return `
    <div class="space-y-6">
      <!-- Breadcrumb Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button onclick="navigateTo('papan-list')" class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${isEditing ? 'Edit Data Plang Proyek Pembangunan' : 'Buat Template Papan Plang Proyek (1x1 M)'}
            </h1>
            <p class="text-xs text-slate-500">Ukuran proporsi 1 meter x 1 meter siap kirim file cetak banner ke toko percetakan</p>
          </div>
        </div>

        <button type="button" onclick="navigateTo('papan-list')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
          Batal
        </button>
      </div>

      <!-- Quick Fill Bar from SPB -->
      <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 shrink-0">
            <i data-lucide="zap" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-blue-900">Tarik Data Otomatis dari Surat Pesanan Barang (SPB)</h4>
            <p class="text-xs text-blue-700">Pilih SPB yang sudah ada untuk mengisi formulir secara instan tanpa ketik ulang</p>
          </div>
        </div>
        <div class="w-full sm:w-80">
          <select onchange="fillPapanFormFromSp(this.value)" class="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
            <option value="">-- Pilih Surat Pesanan Acuan --</option>
            ${(appState.data.suratPesanan || []).map(sp => `
              <option value="${sp.id}">${sp.nomorSp} - ${sp.kegiatan.substring(0, 30)}...</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Main Layout: Form (Left) + Real-time Square Banner Preview (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <!-- Left: Input Form Controls -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <i data-lucide="clipboard-edit" class="w-4 h-4 text-blue-600"></i> Informasi Rincian Pembangunan
            </h3>
            <p class="text-xs text-slate-500">Ketik data proyek di bawah ini, tampilan spanduk di sebelah kanan otomatis berubah langsung.</p>
          </div>

          <form onsubmit="savePapanProyek(event)" class="space-y-4">
            <!-- 1. Nama Kegiatan -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">1. Nama Kegiatan APBDes <span class="text-red-500">*</span></label>
              <input type="text" id="papan-kegiatan" value="${defaultKegiatan}" oninput="updatePapanLivePreview()" placeholder="Contoh: Pembangunan Rabat Beton Jalan Usaha Tani RT 03" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>

            <!-- 2. Lokasi Kegiatan -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">2. Lokasi Kegiatan <span class="text-red-500">*</span></label>
              <input type="text" id="papan-lokasi" value="${defaultLokasi}" oninput="updatePapanLivePreview()" placeholder="Contoh: Dusun II RT 03 Desa Tanjung Manis" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>

            <!-- 3. Volume / Ukuran Fisik -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">3. Volume / Ukuran Fisik Pekerjaan <span class="text-red-500">*</span></label>
              <input type="text" id="papan-volume" value="${defaultVolume}" oninput="updatePapanLivePreview()" placeholder="Contoh: P = 350 M x L = 2,5 M x T = 0,15 M" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>

            <!-- 4. Sumber Dana & 5. Tahun Anggaran -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">4. Sumber Dana APBDes <span class="text-red-500">*</span></label>
                <select id="papan-sumberDana" onchange="updatePapanLivePreview()" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer">
                  <option value="Dana Desa (DD) TA 2026" ${defaultSumberDana.includes('DD') ? 'selected' : ''}>Dana Desa (DD)</option>
                  <option value="Alokasi Dana Desa (ADD) TA 2026" ${defaultSumberDana.includes('ADD') ? 'selected' : ''}>Alokasi Dana Desa (ADD)</option>
                  <option value="Dana Bagi Hasil (DBH) TA 2026" ${defaultSumberDana.includes('DBH') ? 'selected' : ''}>Dana Bagi Hasil (DBH)</option>
                  <option value="Bantuan Keuangan Provinsi TA 2026" ${defaultSumberDana.includes('Provinsi') ? 'selected' : ''}>Bantuan Keuangan Provinsi</option>
                  <option value="Bantuan Keuangan Khusus RT (BANKEUSUS RT) TA 2026" ${defaultSumberDana.includes('BANKEUSUS') ? 'selected' : ''}>BANKEUSUS RT</option>
                  <option value="Pendapatan Asli Desa (PADes) TA 2026" ${defaultSumberDana.includes('PADes') ? 'selected' : ''}>Pendapatan Asli Desa (PADes)</option>
                  <option value="Lain-Lain Pendapatan Desa yang Sah TA 2026" ${defaultSumberDana.includes('Lain') ? 'selected' : ''}>Lain-Lain Pendapatan Sah</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">5. Tahun Anggaran <span class="text-red-500">*</span></label>
                <select id="papan-tahunAnggaran" onchange="updatePapanLivePreview()" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer">
                  <option value="2026" ${String(defaultTahun) === '2026' ? 'selected' : ''}>Tahun 2026</option>
                  <option value="2027" ${String(defaultTahun) === '2027' ? 'selected' : ''}>Tahun 2027</option>
                  <option value="2028" ${String(defaultTahun) === '2028' ? 'selected' : ''}>Tahun 2028</option>
                  <option value="2029" ${String(defaultTahun) === '2029' ? 'selected' : ''}>Tahun 2029</option>
                  <option value="2030" ${String(defaultTahun) === '2030' ? 'selected' : ''}>Tahun 2030</option>
                  <option value="2031" ${String(defaultTahun) === '2031' ? 'selected' : ''}>Tahun 2031</option>
                </select>
              </div>
            </div>

            <!-- 6. Besar Anggaran (Biaya) -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-slate-700">6. Besar Anggaran / Biaya (Rp) <span class="text-red-500">*</span></label>
                <span id="papan-anggaran-preview" class="text-xs font-black text-blue-700 font-mono">${formatRupiah(defaultAnggaran)}</span>
              </div>
              <input type="number" id="papan-anggaran" value="${defaultAnggaran}" oninput="updatePapanLivePreview()" placeholder="Contoh: 17700000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono font-bold focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>

            <!-- 7 & 8. Waktu Pelaksanaan & Sifat Kegiatan -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">7. Waktu Pelaksanaan</label>
                <input type="text" id="papan-waktuPelaksanaan" value="${defaultWaktu}" oninput="updatePapanLivePreview()" placeholder="Contoh: 90 Hari Kalender" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">8. Sifat Kegiatan</label>
                <input type="text" id="papan-sifatKegiatan" value="${defaultSifat}" oninput="updatePapanLivePreview()" placeholder="Swakelola / PKTD" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none">
              </div>
            </div>

            <!-- 9. Pelaksana Kegiatan -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-slate-700">9. Pelaksana Kegiatan <span class="text-red-500">*</span></label>
                <select onchange="onPelaksanaQuickPapanSelect(this.value)" class="text-[11px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 rounded-lg px-2 py-0.5 cursor-pointer">
                  <option value="">Pilih Pejabat Pelaksana...</option>
                  <option value="Tim Pengelola Kegiatan (TPK)">Tim Pengelola Kegiatan (TPK)</option>
                  ${pelaksanaList.map(pk => `
                    <option value="${pk.nama} (${pk.jabatan})">${pk.nama} - ${pk.jabatan}</option>
                  `).join('')}
                </select>
              </div>
              <input type="text" id="papan-pelaksana" value="${defaultPelaksana}" oninput="updatePapanLivePreview()" placeholder="Contoh: Tim Pengelola Kegiatan (TPK) / Hendra" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none" required>
            </div>

            <!-- Buttons Action -->
            <div class="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button type="submit" class="w-full sm:w-auto flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4"></i> Simpan Data Plang Proyek
              </button>
              <button type="button" onclick="downloadCurrentFormPapanPng()" class="w-full sm:w-auto py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2">
                <i data-lucide="download" class="w-4 h-4"></i> Download File PNG (1x1 M)
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Live Banner Square Preview 1:1 -->
        <div class="space-y-4 lg:sticky lg:top-24">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <i data-lucide="eye" class="w-4 h-4 text-emerald-600"></i> Pratinjau Spanduk 1 Meter x 1 Meter (1:1)
            </span>
            <span class="text-[11px] text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              Ukuran Asli Cetak: 100 cm x 100 cm
            </span>
          </div>

          <!-- Square Aspect Banner Container -->
          <div class="p-1 sm:p-2 bg-slate-800 rounded-3xl shadow-2xl border-4 border-slate-700/60">
            <div id="live-papan-preview" class="aspect-square w-full bg-white border-4 border-slate-900 rounded-lg p-3 sm:p-5 flex flex-col justify-between text-slate-900 select-none relative overflow-hidden font-sans">
              <!-- Top Kop with Prominent Logos -->
              <div class="relative pb-1.5 border-b-2 border-black text-center">
                <div class="flex items-center justify-between">
                  <div class="w-14 sm:w-20 flex-shrink-0 flex items-center justify-center">
                    <img src="${(typeof LOGO_PEMKAB_B64 !== 'undefined' && LOGO_PEMKAB_B64) ? LOGO_PEMKAB_B64 : (p.logoUrl || 'logo-kutai-timur.png')}" class="w-12 sm:w-16 h-auto max-h-20 object-contain" alt="Logo Pemda">
                  </div>
                  <div class="flex-1 leading-tight px-1 sm:px-2">
                    <h5 class="font-bold text-[8px] sm:text-[11px] uppercase tracking-wider text-slate-900">${p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR'}</h5>
                    <h4 class="font-extrabold text-[9px] sm:text-[13px] uppercase tracking-wider text-slate-900">${p.kecamatan || 'KECAMATAN SANGKULIRANG'}</h4>
                    <h3 class="font-black text-[12px] sm:text-[17px] uppercase tracking-wider text-blue-900">${p.desa || 'DESA TANJUNG MANIS'}</h3>
                    <p class="text-[6.5px] sm:text-[9px] text-slate-600 font-medium truncate">Alamat: ${p.alamat || 'Jl Poros RT.03 Dusun I'}</p>
                  </div>
                  <div class="w-14 sm:w-20 flex-shrink-0 flex items-center justify-center">
                    <img src="${(typeof LOGO_KEMENDESA_B64 !== 'undefined' && LOGO_KEMENDESA_B64) ? LOGO_KEMENDESA_B64 : 'logo-kemendesa.png'}" class="w-12 sm:w-16 h-auto max-h-20 object-contain" alt="Logo Kemendesa">
                  </div>
                </div>
                <div class="border-b border-black mt-1"></div>
              </div>

              <!-- Title Banner (Yellow Gold) -->
              <div class="bg-amber-300 border-2 border-amber-600 p-1.5 sm:p-2 text-center rounded my-1 shadow-xs">
                <h2 class="font-black text-[10px] sm:text-[14px] uppercase tracking-tight text-slate-900 leading-tight">
                  PAPAN INFORMASI KEGIATAN PEMBANGUNAN DESA
                </h2>
                <div class="text-[8.5px] sm:text-[11.5px] font-extrabold text-amber-950 mt-0.5">
                  TAHUN ANGGARAN <span id="prev-tahunAnggaran">${defaultTahun}</span>
                </div>
              </div>

              <!-- Table Information Grid (9 Items - Fills Remaining Space Boldly) -->
              <div class="border-2 border-black text-[8.5px] sm:text-[12px] flex-1 flex flex-col justify-between my-1">
                <div class="flex-1 flex border-b border-black bg-slate-50 py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">1. BIDANG / KEGIATAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-kegiatan" class="font-black text-slate-900 uppercase flex-1 leading-snug truncate">${defaultKegiatan || 'Pembangunan Rabat Beton Jalan Usaha Tani RT 03'}</div>
                </div>

                <div class="flex-1 flex border-b border-black py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">2. LOKASI KEGIATAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-lokasi" class="font-bold text-slate-800 flex-1 truncate">${defaultLokasi}</div>
                </div>

                <div class="flex-1 flex border-b border-black bg-slate-50 py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">3. VOLUME / UKURAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-volume" class="font-bold text-slate-800 flex-1 truncate">${defaultVolume}</div>
                </div>

                <div class="flex-1 flex border-b border-black py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">4. BIAYA / ANGGARAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-anggaran" class="font-black text-blue-900 font-mono text-[9.5px] sm:text-[13px] flex-1">${formatRupiah(defaultAnggaran)} (Termasuk Pajak)</div>
                </div>

                <div class="flex-1 flex border-b border-black bg-slate-50 py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">5. SUMBER DANA</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-sumberDana" class="font-black text-slate-900 flex-1 truncate">${defaultSumberDana}</div>
                </div>

                <div class="flex-1 flex border-b border-black py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">6. TAHUN ANGGARAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-tahunAnggaran-row" class="font-bold text-slate-800 flex-1">${defaultTahun}</div>
                </div>

                <div class="flex-1 flex border-b border-black bg-slate-50 py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">7. WAKTU PELAKSANAAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-waktuPelaksanaan" class="font-bold text-slate-800 flex-1 truncate">${defaultWaktu}</div>
                </div>

                <div class="flex-1 flex border-b border-black py-1 sm:py-1.5 px-2 items-center">
                  <div class="w-28 sm:w-40 font-bold shrink-0">8. SIFAT KEGIATAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-sifatKegiatan" class="font-bold text-slate-800 flex-1 truncate">${defaultSifat}</div>
                </div>

                <div class="flex-1 flex py-1 sm:py-1.5 px-2 items-center bg-slate-50">
                  <div class="w-28 sm:w-40 font-bold shrink-0">9. PELAKSANA KEGIATAN</div>
                  <div class="w-2 font-bold">:</div>
                  <div id="prev-pelaksana" class="font-black text-slate-900 flex-1 truncate">${defaultPelaksana}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Helper Tips -->
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <i data-lucide="lightbulb" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
            <div>
              <span class="font-bold">Tips Cetak di Percetakan:</span>
              <p class="text-amber-800 mt-0.5 leading-relaxed">
                Klik tombol <strong>"Download File PNG"</strong>. File gambar yang diunduh sudah siap cetak dengan rasio kotak 1:1. Anda tinggal menyerahkan filenya ke percetakan spanduk (banner outdoor flexi) tanpa perlu didesain ulang!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function updatePapanLivePreview() {
  const kegiatan = document.getElementById('papan-kegiatan')?.value || 'Pembangunan Rabat Beton Jalan Usaha Tani RT 03';
  const lokasi = document.getElementById('papan-lokasi')?.value || '-';
  const volume = document.getElementById('papan-volume')?.value || '-';
  const sumberDana = document.getElementById('papan-sumberDana')?.value || 'Dana Desa (DD)';
  const tahun = document.getElementById('papan-tahunAnggaran')?.value || '2026';
  const anggaranVal = Number(document.getElementById('papan-anggaran')?.value) || 0;
  const waktu = document.getElementById('papan-waktuPelaksanaan')?.value || '-';
  const sifat = document.getElementById('papan-sifatKegiatan')?.value || 'Swakelola';
  const pelaksana = document.getElementById('papan-pelaksana')?.value || 'Tim Pengelola Kegiatan (TPK)';

  // Update Preview Elements
  const elKeg = document.getElementById('prev-kegiatan');
  if (elKeg) elKeg.innerText = kegiatan;

  const elLok = document.getElementById('prev-lokasi');
  if (elLok) elLok.innerText = lokasi;

  const elVol = document.getElementById('prev-volume');
  if (elVol) elVol.innerText = volume;

  const elSum = document.getElementById('prev-sumberDana');
  if (elSum) elSum.innerText = sumberDana;

  const elTh1 = document.getElementById('prev-tahunAnggaran');
  if (elTh1) elTh1.innerText = tahun;

  const elTh2 = document.getElementById('prev-tahunAnggaran-row');
  if (elTh2) elTh2.innerText = tahun;

  const elAng = document.getElementById('prev-anggaran');
  if (elAng) elAng.innerText = `${formatRupiah(anggaranVal)} (Termasuk Pajak)`;

  const elAngPrev = document.getElementById('papan-anggaran-preview');
  if (elAngPrev) elAngPrev.innerText = formatRupiah(anggaranVal);

  const elWak = document.getElementById('prev-waktuPelaksanaan');
  if (elWak) elWak.innerText = waktu;

  const elSif = document.getElementById('prev-sifatKegiatan');
  if (elSif) elSif.innerText = sifat;

  const elPel = document.getElementById('prev-pelaksana');
  if (elPel) elPel.innerText = pelaksana;

  const elPelSign = document.getElementById('prev-pelaksana-sign');
  if (elPelSign) elPelSign.innerText = pelaksana;
}

function onPelaksanaQuickPapanSelect(val) {
  if (!val) return;
  const input = document.getElementById('papan-pelaksana');
  if (input) {
    input.value = val;
    updatePapanLivePreview();
  }
}

function fillPapanFormFromSp(spId) {
  if (!spId) return;
  const sp = (appState.data.suratPesanan || []).find(s => s.id === spId);
  if (!sp) return;

  const elKegiatan = document.getElementById('papan-kegiatan');
  const elLokasi = document.getElementById('papan-lokasi');
  const elSumberDana = document.getElementById('papan-sumberDana');
  const elAnggaran = document.getElementById('papan-anggaran');
  const elPelaksana = document.getElementById('papan-pelaksana');

  if (elKegiatan && sp.kegiatan) elKegiatan.value = sp.kegiatan;
  if (elLokasi && sp.lokasiPenyerahan) elLokasi.value = sp.lokasiPenyerahan;
  if (elAnggaran && sp.grandTotal) elAnggaran.value = sp.grandTotal;
  if (elPelaksana && sp.pemesanNama) elPelaksana.value = `${sp.pemesanNama} (${sp.pemesanJabatan || 'Pelaksana Kegiatan'})`;

  if (elSumberDana && sp.sumberDana) {
    for (let opt of elSumberDana.options) {
      if (sp.sumberDana.includes(opt.value) || opt.value.includes(sp.sumberDana)) {
        elSumberDana.value = opt.value;
        break;
      }
    }
  }

  updatePapanLivePreview();
}

function downloadCurrentFormPapanPng() {
  const currentObj = {
    kegiatan: document.getElementById('papan-kegiatan')?.value || 'Kegiatan Pembangunan',
    lokasi: document.getElementById('papan-lokasi')?.value || '-',
    volume: document.getElementById('papan-volume')?.value || '-',
    sumberDana: document.getElementById('papan-sumberDana')?.value || 'Dana Desa (DD)',
    tahunAnggaran: document.getElementById('papan-tahunAnggaran')?.value || '2026',
    anggaran: Number(document.getElementById('papan-anggaran')?.value) || 0,
    waktuPelaksanaan: document.getElementById('papan-waktuPelaksanaan')?.value || '90 Hari Kalender',
    sifatKegiatan: document.getElementById('papan-sifatKegiatan')?.value || 'Swakelola',
    pelaksana: document.getElementById('papan-pelaksana')?.value || 'Tim Pengelola Kegiatan (TPK)'
  };
  downloadPapanProyekPng(currentObj);
}

function savePapanProyek(e) {
  if (e) e.preventDefault();

  const elKegiatan = document.getElementById('papan-kegiatan');
  const kegiatan = (elKegiatan?.value || '').trim();
  const lokasi = (document.getElementById('papan-lokasi')?.value || '').trim() || '-';
  const volume = (document.getElementById('papan-volume')?.value || '').trim() || '-';
  const sumberDana = document.getElementById('papan-sumberDana')?.value || 'Dana Desa (DD)';
  const tahunAnggaran = (document.getElementById('papan-tahunAnggaran')?.value || '').trim() || '2026';
  
  const rawAnggaran = document.getElementById('papan-anggaran')?.value || '0';
  const cleanedAnggaran = String(rawAnggaran).replace(/[^0-9]/g, '');
  const anggaran = Number(cleanedAnggaran) || 0;

  const waktuPelaksanaan = (document.getElementById('papan-waktuPelaksanaan')?.value || '').trim() || '90 (Sembilan Puluh) Hari Kalender';
  const sifatKegiatan = (document.getElementById('papan-sifatKegiatan')?.value || '').trim() || 'Swakelola (Padat Karya Tunai Desa / PKTD)';
  const pelaksana = (document.getElementById('papan-pelaksana')?.value || '').trim() || 'Tim Pengelola Kegiatan (TPK)';

  if (!kegiatan) {
    alert('Mohon isi Nama Kegiatan proyek terlebih dahulu.');
    if (elKegiatan) elKegiatan.focus();
    return;
  }

  const existingList = appState.data.papanProyekList || [];
  const editingId = appState.editingPapanId;

  if (editingId) {
    const updatedList = existingList.map(p => {
      if (p.id === editingId) {
        return {
          ...p,
          kegiatan,
          lokasi,
          volume,
          sumberDana,
          tahunAnggaran,
          anggaran,
          waktuPelaksanaan,
          sifatKegiatan,
          pelaksana,
          tanggalDiperbarui: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });

    setState({
      data: {
        ...appState.data,
        papanProyekList: updatedList
      },
      currentView: 'papan-list',
      filterTahunPapan: 'all',
      editingPapanId: null
    });
    alert('Data Plang Proyek Pembangunan berhasil diperbarui dan tersimpan!');
  } else {
    const newPapan = {
      id: 'pp-' + Date.now(),
      kegiatan,
      lokasi,
      volume,
      sumberDana,
      tahunAnggaran,
      anggaran,
      waktuPelaksanaan,
      sifatKegiatan,
      pelaksana,
      tanggalDibuat: new Date().toISOString().split('T')[0]
    };

    setState({
      data: {
        ...appState.data,
        papanProyekList: [newPapan, ...existingList]
      },
      currentView: 'papan-list',
      filterTahunPapan: 'all',
      editingPapanId: null
    });
    alert('Data Plang Proyek Pembangunan berhasil disimpan!');
  }
}

function confirmDeletePapan(id) {
  showConfirmModal(
    'Hapus Plang Proyek?',
    'Apakah Anda yakin ingin menghapus data papan proyek ini? Tindakan ini tidak dapat dibatalkan.',
    () => {
      const updated = (appState.data.papanProyekList || []).filter(p => p.id !== id);
      setState({
        data: {
          ...appState.data,
          papanProyekList: updated
        }
      });
      alert('Plang proyek berhasil dihapus.');
    }
  );
}

// 4.6.3. FULL PREVIEW VIEW PAPAN PROYEK 1x1 METER
function renderPapanPreviewView() {
  const papanId = appState.previewPapanId;
  const papan = (appState.data.papanProyekList || []).find(p => p.id === papanId);
  if (!papan) {
    return `
      <div class="text-center py-12 space-y-4">
        <p class="text-slate-500 font-bold">Data papan proyek tidak ditemukan.</p>
        <button onclick="navigateTo('papan-list')" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Kembali ke Daftar</button>
      </div>
    `;
  }

  const p = appState.data.profilDesa;

  return `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Toolbar Navigation -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center gap-3">
          <button onclick="navigateTo('papan-list')" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 class="text-lg font-black text-slate-900 tracking-tight">Pratinjau Spanduk Plang Proyek</h2>
            <p class="text-xs text-slate-500">Ukuran Asli Cetak Banner: 1 Meter x 1 Meter (100 cm x 100 cm)</p>
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-2">
          <button onclick="downloadPapanProyekPng('${papan.id}')" class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition">
            <i data-lucide="download" class="w-4 h-4"></i> Download File PNG (Siap Cetak)
          </button>
          <button onclick="openPrintModal('papan', '${papan.id}')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition">
            <i data-lucide="printer" class="w-4 h-4"></i> Cetak / PDF
          </button>
          <button onclick="navigateTo('papan-form', { editingPapanId: '${papan.id}' })" class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1">
            <i data-lucide="edit-3" class="w-4 h-4"></i> Edit
          </button>
        </div>
      </div>

      <!-- Printing Instructions Card -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
        <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
          <i data-lucide="info" class="w-5 h-5"></i>
        </div>
        <div class="text-xs text-amber-900 leading-relaxed">
          <span class="font-extrabold text-sm text-amber-950 block mb-0.5">Cara Kirim ke Toko Percetakan Spanduk:</span>
          Klik tombol hijau <strong>"Download File PNG (Siap Cetak)"</strong> di atas. Simpan file gambarnya ke Flashdisk atau kirimkan via WhatsApp ke pihak percetakan. Spanduk ini sudah berukuran presisi kotak bujur sangkar 1:1 dan beresolusi sangat tajam (2000 x 2000 px), sehingga pihak toko tinggal mencetak dengan ukuran 1 meter x 1 meter tanpa perlu mendesain lagi.
        </div>
      </div>

      <!-- Big Square Preview Display -->
      <div class="flex justify-center">
        <div class="w-full max-w-[680px] bg-slate-800 p-3 sm:p-5 rounded-3xl shadow-2xl border-4 border-slate-700">
          <div class="aspect-square w-full bg-white border-4 border-slate-900 rounded-lg p-5 sm:p-8 flex flex-col justify-between text-slate-900 select-none relative font-sans">
            <!-- Kop Section with Prominent Logos -->
            <div class="relative pb-2 border-b-2 border-black text-center">
              <div class="flex items-center justify-between">
                <div class="w-16 sm:w-20 flex-shrink-0 flex items-center justify-center">
                  <img src="${(typeof LOGO_PEMKAB_B64 !== 'undefined' && LOGO_PEMKAB_B64) ? LOGO_PEMKAB_B64 : (p.logoUrl || 'logo-kutai-timur.png')}" class="w-16 sm:w-20 h-auto max-h-20 object-contain" alt="Logo Pemda">
                </div>
                <div class="flex-1 leading-tight px-2 sm:px-4">
                  <h5 class="font-bold text-[11px] sm:text-[14px] uppercase tracking-wider text-slate-900">${p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR'}</h5>
                  <h4 class="font-extrabold text-[13px] sm:text-[17px] uppercase tracking-wider text-slate-900">${p.kecamatan || 'KECAMATAN SANGKULIRANG'}</h4>
                  <h3 class="font-black text-[16px] sm:text-[24px] uppercase tracking-wider text-blue-900">${p.desa || 'DESA TANJUNG MANIS'}</h3>
                  <p class="text-[9px] sm:text-[12px] text-slate-600 font-medium">Alamat: ${p.alamat || 'Jl Poros RT.03 Dusun I. Tanjung Manis Sangkulirang Kutai Timur'}</p>
                </div>
                <div class="w-16 sm:w-20 flex-shrink-0 flex items-center justify-center">
                  <img src="${(typeof LOGO_KEMENDESA_B64 !== 'undefined' && LOGO_KEMENDESA_B64) ? LOGO_KEMENDESA_B64 : 'logo-kemendesa.png'}" class="w-16 sm:w-20 h-auto max-h-20 object-contain" alt="Logo Kemendesa">
                </div>
              </div>
              <div class="border-b border-black mt-1"></div>
            </div>

            <!-- Title Box -->
            <div class="bg-amber-300 border-2 border-amber-600 p-2 sm:p-3 text-center rounded my-1.5 shadow-xs">
              <h2 class="font-black text-[13px] sm:text-[19px] uppercase tracking-tight text-slate-900 leading-tight">
                PAPAN INFORMASI KEGIATAN PEMBANGUNAN DESA
              </h2>
              <div class="text-[10px] sm:text-[14px] font-black text-amber-950 mt-0.5">
                TAHUN ANGGARAN ${papan.tahunAnggaran || '2026'}
              </div>
            </div>

            <!-- Data Grid (9 Rows - Fills Area Prominently) -->
            <div class="border-2 border-black text-[10px] sm:text-[13.5px] flex-1 flex flex-col justify-between my-1">
              <div class="flex-1 flex border-b border-black bg-slate-50 py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">1. BIDANG / KEGIATAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-black text-slate-900 uppercase flex-1 leading-snug line-clamp-2">${papan.kegiatan}</div>
              </div>

              <div class="flex-1 flex border-b border-black py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">2. LOKASI KEGIATAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-bold text-slate-800 flex-1">${papan.lokasi}</div>
              </div>

              <div class="flex-1 flex border-b border-black bg-slate-50 py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">3. VOLUME / UKURAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-bold text-slate-800 flex-1">${papan.volume}</div>
              </div>

              <div class="flex-1 flex border-b border-black py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">4. BIAYA / ANGGARAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-black text-blue-900 font-mono text-[11px] sm:text-[15px] flex-1">${formatRupiah(papan.anggaran)} (Termasuk Pajak)</div>
              </div>

              <div class="flex-1 flex border-b border-black bg-slate-50 py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">5. SUMBER DANA</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-black text-slate-900 flex-1">${papan.sumberDana}</div>
              </div>

              <div class="flex-1 flex border-b border-black py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">6. TAHUN ANGGARAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-bold text-slate-800 flex-1">${papan.tahunAnggaran || '2026'}</div>
              </div>

              <div class="flex-1 flex border-b border-black bg-slate-50 py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">7. WAKTU PELAKSANAAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-bold text-slate-800 flex-1">${papan.waktuPelaksanaan}</div>
              </div>

              <div class="flex-1 flex border-b border-black py-1.5 sm:py-2.5 px-3 items-center">
                <div class="w-36 sm:w-52 font-bold shrink-0">8. SIFAT KEGIATAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-bold text-slate-800 flex-1">${papan.sifatKegiatan}</div>
              </div>

              <div class="flex-1 flex py-1.5 sm:py-2.5 px-3 items-center bg-slate-50">
                <div class="w-36 sm:w-52 font-bold shrink-0">9. PELAKSANA KEGIATAN</div>
                <div class="w-3 font-bold">:</div>
                <div class="font-black text-slate-900 flex-1">${papan.pelaksana}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 4.6.4. PRINT TEMPLATE PAPAN PROYEK 1x1 METER
function renderPapanPrintTemplate(papanId) {
  const papan = (appState.data.papanProyekList || []).find(p => p.id === papanId);
  if (!papan) return '<div class="text-red-500 font-bold p-4">Data Papan Proyek tidak ditemukan.</div>';
  const p = appState.data.profilDesa;

  return `
    <div class="papan-print-container bg-white border-[4px] border-black p-6 flex flex-col justify-between text-black font-sans leading-tight">
      <!-- Kop -->
      <div class="relative pb-2 border-b-2 border-black text-center">
        <div class="flex items-center justify-between">
          <div class="w-20 flex-shrink-0 flex items-center justify-center">
            <img src="${(typeof LOGO_PEMKAB_B64 !== 'undefined' && LOGO_PEMKAB_B64) ? LOGO_PEMKAB_B64 : (p.logoUrl || 'logo-kutai-timur.png')}" class="w-18 h-auto max-h-20 object-contain" alt="Logo Pemda">
          </div>
          <div class="flex-1 leading-tight px-2">
            <h5 class="font-bold text-[11pt] uppercase tracking-wider text-black">${p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR'}</h5>
            <h4 class="font-extrabold text-[13pt] uppercase tracking-wider text-black">${p.kecamatan || 'KECAMATAN SANGKULIRANG'}</h4>
            <h3 class="font-black text-[18pt] uppercase tracking-wider text-black">${p.desa || 'DESA TANJUNG MANIS'}</h3>
            <p class="text-[9.5pt] text-gray-700 font-medium">Alamat: ${p.alamat || 'Jl Poros RT.03 Dusun I'}</p>
          </div>
          <div class="w-20 flex-shrink-0 flex items-center justify-center">
            <img src="${(typeof LOGO_KEMENDESA_B64 !== 'undefined' && LOGO_KEMENDESA_B64) ? LOGO_KEMENDESA_B64 : 'logo-kemendesa.png'}" class="w-18 h-auto max-h-20 object-contain" alt="Logo Kemendesa">
          </div>
        </div>
        <div class="border-b border-black mt-1"></div>
      </div>

      <!-- Title Banner -->
      <div class="border-2 border-black bg-yellow-200 p-2.5 text-center rounded my-2">
        <h2 class="font-black text-[15pt] uppercase tracking-tight text-black leading-tight">
          PAPAN INFORMASI KEGIATAN PEMBANGUNAN DESA
        </h2>
        <div class="text-[12pt] font-black text-black mt-0.5">
          TAHUN ANGGARAN ${papan.tahunAnggaran || '2026'}
        </div>
      </div>

      <!-- Table 9 Items -->
      <table class="w-full border-collapse border-2 border-black text-[11pt] my-2 flex-1">
        <tr class="border-b border-black bg-gray-50">
          <td class="w-52 p-2 font-bold border-r border-black">1. BIDANG / KEGIATAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-black uppercase text-[11.5pt]">${papan.kegiatan}</td>
        </tr>
        <tr class="border-b border-black">
          <td class="w-52 p-2 font-bold border-r border-black">2. LOKASI KEGIATAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-bold">${papan.lokasi}</td>
        </tr>
        <tr class="border-b border-black bg-gray-50">
          <td class="w-52 p-2 font-bold border-r border-black">3. VOLUME / UKURAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-bold">${papan.volume}</td>
        </tr>
        <tr class="border-b border-black">
          <td class="w-52 p-2 font-bold border-r border-black">4. BIAYA / ANGGARAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-black font-mono text-[12pt]">${formatRupiah(papan.anggaran)} (Termasuk Pajak)</td>
        </tr>
        <tr class="border-b border-black bg-gray-50">
          <td class="w-52 p-2 font-bold border-r border-black">5. SUMBER DANA</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-black">${papan.sumberDana}</td>
        </tr>
        <tr class="border-b border-black">
          <td class="w-52 p-2 font-bold border-r border-black">6. TAHUN ANGGARAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-bold">${papan.tahunAnggaran || '2026'}</td>
        </tr>
        <tr class="border-b border-black bg-gray-50">
          <td class="w-52 p-2 font-bold border-r border-black">7. WAKTU PELAKSANAAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-bold">${papan.waktuPelaksanaan}</td>
        </tr>
        <tr class="border-b border-black">
          <td class="w-52 p-2 font-bold border-r border-black">8. SIFAT KEGIATAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-bold">${papan.sifatKegiatan}</td>
        </tr>
        <tr class="bg-gray-50">
          <td class="w-52 p-2 font-bold border-r border-black">9. PELAKSANA KEGIATAN</td>
          <td class="w-3 p-2 font-bold text-center">:</td>
          <td class="p-2 font-black">${papan.pelaksana}</td>
        </tr>
      </table>
    </div>
  `;
}

// ==========================================
// 5. OFFICIAL NASKAH DINAS PRINT ENGINE
// ==========================================

function openPrintModal(type, id) {
  setState({ printDocument: { type, id } });
}

function closePrintModal() {
  setState({ printDocument: null });
}

function renderPrintModal() {
  const doc = appState.printDocument;
  if (!doc) return '';

  let htmlContent = '';
  if (doc.type === 'sp') {
    htmlContent = renderSpPrintTemplate(doc.id);
  } else if (doc.type === 'bast') {
    htmlContent = renderBastPrintTemplate(doc.id);
  } else if (doc.type === 'bapb') {
    htmlContent = renderBapbPrintTemplate(doc.id);
  } else if (doc.type === 'kwitansi') {
    htmlContent = renderKwitansiPrintTemplate(doc.id);
  } else if (doc.type === 'papan') {
    htmlContent = renderPapanPrintTemplate(doc.id);
  }

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-2 sm:p-6 overflow-y-auto no-print-backdrop">
      <div class="bg-white border border-slate-300 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        <!-- Modal Toolbar -->
        <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div class="flex items-center gap-2">
            <i data-lucide="printer" class="w-5 h-5 text-blue-400"></i>
            <h3 class="font-bold text-white text-base">Pratinjau Dokumen Cetak Resmi Kedinasan</h3>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="window.print()" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5">
              <i data-lucide="printer" class="w-4 h-4"></i> Cetak / Simpan PDF
            </button>
            <button onclick="closePrintModal()" class="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Document Sheet Render Body -->
        <div class="flex-1 overflow-y-auto p-6 bg-slate-200/80 flex justify-center">
          <div class="print-area-wrapper bg-white text-black p-8 sm:p-12 w-full max-w-[210mm] shadow-xl rounded-sm font-serif text-[11pt] leading-snug">
            ${htmlContent}
          </div>
        </div>
      </div>
    </div>
  `;
}

/// TEMPLATE 1: SURAT PESANAN (SP)
function renderSpPrintTemplate(spId) {
  const sp = appState.data.suratPesanan.find(s => s.id === spId);
  if (!sp) return '<div class="text-red-500">Dokumen SP tidak ditemukan.</div>';
  const p = appState.data.profilDesa;
  const sup = appState.data.suppliers.find(s => s.id === sp.supplierId) || {};

  const pemesanNama = sp.pemesanNama || p.tpkNama;
  const pemesanJabatan = sp.pemesanJabatan || p.tpkJabatan;
  const pemesanNip = sp.pemesanNip || '-';

  return `
    <div class="print-page space-y-1">
      ${renderKopSuratHtml(p)}

      <div class="text-center my-1">
        <h2 class="font-bold text-sm uppercase tracking-wide underline underline-offset-2">SURAT PESANAN BARANG (SPB)</h2>
        <p class="font-mono text-[9pt]">Nomor: ${sp.nomorSp}</p>
      </div>

      <p class="text-justify text-[9pt]">
        Yang bertanda tangan di bawah ini:
      </p>

      <table class="w-full text-[9pt] ml-3 border-collapse">
        <tr>
          <td class="w-32 py-0.5 align-top font-semibold">Nama</td>
          <td class="w-4 py-0.5 align-top">:</td>
          <td class="py-0.5 align-top font-bold">${pemesanNama}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">Jabatan</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${pemesanJabatan} ${p.desa}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">Alamat Kantor</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${p.alamat}</td>
        </tr>
      </table>

      <p class="text-justify text-[9pt] mt-0.5">
        Dengan ini memberikan pesanan pengadaan barang/material kepada:
      </p>

      <table class="w-full text-[9pt] ml-3 border-collapse">
        <tr>
          <td class="w-32 py-0.5 align-top font-semibold">Nama Toko/Penyedia</td>
          <td class="w-4 py-0.5 align-top">:</td>
          <td class="py-0.5 align-top font-bold">${sup.namaToko || '-'}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">Nama Pemilik</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${sup.pemilik || '-'}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">Alamat Toko</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${sup.alamat || '-'}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">No. Telp / NPWP</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${sup.telepon || '-'} / NPWP: ${sup.npwp || '-'}</td>
        </tr>
      </table>

      <p class="text-[9pt] mt-1">
        Untuk melaksanakan Pekerjaan/Kegiatan: <strong class="uppercase">${sp.kegiatan}</strong> yang dibiayai dari sumber dana <strong>${sp.sumberDana}</strong>, dengan rincian barang sebagai berikut:
      </p>

      <table class="print-table w-full my-1 border border-black text-[8.5pt]">
        <thead>
          <tr class="bg-gray-100 font-bold text-center">
            <th class="border border-black p-0.5 w-8">No</th>
            <th class="border border-black p-0.5">Nama Barang / Material</th>
            <th class="border border-black p-0.5 w-12">Vol</th>
            <th class="border border-black p-0.5 w-14">Satuan</th>
            <th class="border border-black p-0.5 w-24 text-right">Harga Satuan (Rp)</th>
            <th class="border border-black p-0.5 w-28 text-right">Total (Rp)</th>
          </tr>
        </thead>
        <tbody>
          ${sp.items.map((item, i) => `
            <tr>
              <td class="border border-black p-0.5 text-center">${i + 1}</td>
              <td class="border border-black p-0.5 font-bold">${item.namaBarang}</td>
              <td class="border border-black p-0.5 text-center">${item.volume}</td>
              <td class="border border-black p-0.5 text-center">${item.satuan}</td>
              <td class="border border-black p-0.5 text-right font-mono">${formatRupiah(item.hargaSatuan)}</td>
              <td class="border border-black p-0.5 text-right font-mono font-bold">${formatRupiah(item.total)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="font-bold bg-gray-50">
            <td colspan="5" class="border border-black p-0.5 text-right">Jumlah Total Pesanan:</td>
            <td class="border border-black p-0.5 text-right font-mono text-[9pt]">${formatRupiah(sp.grandTotal)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="text-[8.5pt] p-1 border border-black bg-gray-50 italic font-semibold">
        Terbilang: ${sp.terbilang}
      </div>

      <div class="text-[8.5pt] space-y-0.5 mt-1">
        <p class="font-bold underline">Syarat dan Ketentuan Penyerahan:</p>
        <ol class="list-decimal ml-5 space-y-0.5">
          <li>Penyerahan barang selambat-lambatnya dilaksanakan dalam waktu <strong>${sp.waktuPenyerahan}</strong>.</li>
          <li>Tempat/Lokasi Penyerahan barang di: <strong>${sp.lokasiPenyerahan}</strong>.</li>
          <li>Pemeriksaan kuantitas dan kualitas barang dilakukan oleh ${pemesanJabatan} ${p.desa}.</li>
        </ol>
      </div>

      <!-- Official Village Format: Baris Atas 2 Kolom, Baris Bawah Kepala Desa Terpusat -->
      <div class="mt-2 text-[9pt] signature-block print-avoid-break">
        <div class="text-right mb-1 text-[8.5pt]">
          ${p.desa.replace('DESA ', '')}, ${formatTanggalIndo(sp.tanggalSp)}
        </div>
        
        <div class="grid grid-cols-2 text-center gap-4">
          <div>
            <p class="font-semibold text-[8.5pt]">Menerima Pesanan:</p>
            <p class="font-bold text-[9pt]">${sup.namaToko}</p>
            <div class="h-16"></div>
            <p class="font-bold underline uppercase text-[9pt]">${sup.pemilik}</p>
            <p class="text-[8pt] text-gray-600">Penyedia / Toko</p>
          </div>

          <div>
            <p class="font-semibold text-[8.5pt]">Yang Memberikan Pesanan:</p>
            <p class="font-bold text-[9pt]">${pemesanJabatan}</p>
            <div class="h-16"></div>
            <p class="font-bold underline uppercase text-[9pt]">${pemesanNama}</p>
            <p class="text-[8pt] text-gray-600">${pemesanNip !== '-' ? 'NIP: ' + pemesanNip : pemesanJabatan}</p>
          </div>
        </div>

        <div class="text-center mt-2">
          <p class="font-semibold text-[8.5pt]">Mengetahui / Menyetujui:</p>
          <p class="font-bold text-[9pt]">Kepala Desa ${p.desa}</p>
          <div class="h-16"></div>
          <p class="font-bold underline uppercase text-[9pt]">${p.kadesNama}</p>
          <p class="text-[8pt] text-gray-600">NIPD: ${p.kadesNip || '-'}</p>
        </div>
      </div>
    </div>
  `;
}

// TEMPLATE 2: BERITA ACARA SERAH TERIMA (BAST)
function renderBastPrintTemplate(bastId) {
  const bastList = ensureArray(appState.data.bastList);
  const suratPesanan = ensureArray(appState.data.suratPesanan);
  const suppliers = ensureArray(appState.data.suppliers);
  const bast = bastList.find(b => b && b.id === bastId);
  if (!bast) return '<div class="text-red-500">BAST tidak ditemukan.</div>';
  const sp = suratPesanan.find(s => s && s.id === bast.spId) || {};
  const p = appState.data.profilDesa || defaultData.profilDesa;
  const sup = suppliers.find(s => s && s.id === sp.supplierId) || {};

  const pemesanNama = sp.pemesanNama || bast.ketuaTpk || p.tpkNama;
  const pemesanJabatan = sp.pemesanJabatan || 'Ketua TPK';

  return `
    <div class="print-page space-y-1">
      ${renderKopSuratHtml(p)}

      <div class="text-center my-1">
        <h2 class="font-bold text-sm uppercase tracking-wide underline underline-offset-2">BERITA ACARA SERAH TERIMA BARANG (BAST)</h2>
        <p class="font-mono text-[9pt]">Nomor: ${bast.nomorBast}</p>
      </div>

      <p class="text-justify text-[9pt]">
        Pada hari ini <strong>${getNamaHariIndo(bast.tanggalBast)}</strong> tanggal <strong>${formatTanggalIndo(bast.tanggalBast)}</strong>, kami yang bertanda tangan di bawah ini:
      </p>

      <table class="w-full text-[9pt] ml-3 border-collapse">
        <tr>
          <td class="w-32 py-0.5 align-top font-semibold">1. Nama</td>
          <td class="w-4 py-0.5 align-top">:</td>
          <td class="py-0.5 align-top font-bold">${sup.pemilik}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">   Jabatan</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">Pimpinan / Pemilik ${sup.namaToko}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">   Alamat</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${sup.alamat}</td>
        </tr>
        <tr>
          <td colspan="3" class="py-0.5 italic text-gray-700">Selanjutnya disebut <strong>PIHAK PERTAMA (Penyedia)</strong>.</td>
        </tr>
        <tr><td colspan="3" class="py-0.5"></td></tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">2. Nama</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top font-bold">${bast.ketuaTpk || pemesanNama}</td>
        </tr>
        <tr>
          <td class="py-0.5 align-top font-semibold">   Jabatan</td>
          <td class="py-0.5 align-top">:</td>
          <td class="py-0.5 align-top">${pemesanJabatan} ${p.desa}</td>
        </tr>
        <tr>
          <td colspan="3" class="py-0.5 italic text-gray-700">Selanjutnya disebut <strong>PIHAK KEDUA (Penerima)</strong>.</td>
        </tr>
      </table>

      <p class="text-justify text-[9pt] mt-1">
        Berdasarkan Surat Pesanan Barang (SPB) Nomor: <strong>${sp.nomorSp}</strong> tanggal <strong>${formatTanggalIndo(sp.tanggalSp)}</strong> untuk Pekerjaan <strong>${sp.kegiatan}</strong>, kedua belah pihak menyatakan sebagai berikut:
      </p>

      <ol class="list-decimal ml-6 text-[9pt] space-y-0.5 text-justify">
        <li><strong>PIHAK PERTAMA</strong> menyerahkan barang/material hasil pesanan kepada <strong>PIHAK KEDUA</strong>, dan <strong>PIHAK KEDUA</strong> menerima barang tersebut dalam keadaan lengkap, 100% baik, dan sesuai spesifikasi teknis.</li>
        <li>Rincian barang/material yang diserahterimakan bernilai total <strong>${formatRupiah(sp.grandTotal)}</strong> (<em>${sp.terbilang}</em>).</li>
        <li>Sejak ditandatanganinya Berita Acara ini, maka hak kepemilikan barang/material tersebut sepenuhnya beralih kepada Pemerintahan ${p.desa}.</li>
      </ol>

      <div class="mt-2 text-[9pt] signature-block print-avoid-break">
        <div class="text-right mb-1 text-[8.5pt]">
          ${p.desa.replace('DESA ', '')}, ${formatTanggalIndo(bast.tanggalBast)}
        </div>
        
        <div class="grid grid-cols-2 text-center gap-4">
          <div>
            <p class="font-semibold text-[8.5pt]">PIHAK PERTAMA (Yang Menyerahkan):</p>
            <p class="font-bold text-[9pt]">${sup.namaToko}</p>
            <div class="h-16"></div>
            <p class="font-bold underline uppercase text-[9pt]">${sup.pemilik}</p>
            <p class="text-[8pt] text-gray-600">Penyedia / Toko</p>
          </div>

          <div>
            <p class="font-semibold text-[8.5pt]">PIHAK KEDUA (Yang Menerima):</p>
            <p class="font-bold text-[9pt]">${pemesanJabatan}</p>
            <div class="h-16"></div>
            <p class="font-bold underline uppercase text-[9pt]">${bast.ketuaTpk || pemesanNama}</p>
            <p class="text-[8pt] text-gray-600">${pemesanJabatan}</p>
          </div>
        </div>

        <div class="text-center mt-2">
          <p class="font-semibold text-[8.5pt]">Menyetujui / Mengesahkan:</p>
          <p class="font-bold text-[9pt]">Kepala Desa ${p.desa}</p>
          <div class="h-16"></div>
          <p class="font-bold underline uppercase text-[9pt]">${p.kadesNama}</p>
          <p class="text-[8pt] text-gray-600">NIPD: ${p.kadesNip || '-'}</p>
        </div>
      </div>
    </div>
  `;
}

// TEMPLATE 3: BERITA ACARA PEMERIKSAAN BARANG (BAPB)
function renderBapbPrintTemplate(bastId) {
  const bastList = ensureArray(appState.data.bastList);
  const suratPesanan = ensureArray(appState.data.suratPesanan);
  const suppliers = ensureArray(appState.data.suppliers);
  const bast = bastList.find(b => b && b.id === bastId);
  if (!bast) return '<div class="text-red-500">BAPB tidak ditemukan.</div>';
  const sp = suratPesanan.find(s => s && s.id === bast.spId) || {};
  const p = appState.data.profilDesa || defaultData.profilDesa;
  const sup = suppliers.find(s => s && s.id === sp.supplierId) || {};

  const pemesanNama = sp.pemesanNama || bast.ketuaTpk || p.tpkNama;
  const pemesanJabatan = sp.pemesanJabatan || 'Tim Pengelola / Pelaksana Kegiatan';

  return `
    <div class="print-page space-y-1">
      ${renderKopSuratHtml(p)}

      <div class="text-center my-1">
        <h2 class="font-bold text-sm uppercase tracking-wide underline underline-offset-2">BERITA ACARA PEMERIKSAAN BARANG (BAPB)</h2>
        <p class="font-mono text-[9pt]">Nomor: ${bast.nomorBapb}</p>
      </div>

      <p class="text-justify text-[9pt]">
        Pada hari ini <strong>${getNamaHariIndo(bast.tanggalBast)}</strong> tanggal <strong>${formatTanggalIndo(bast.tanggalBast)}</strong>, Tim Pemeriksa / ${pemesanJabatan} ${p.desa} telah melakukan pemeriksaan fisik terhadap barang/material hasil pengadaan dari Penyedia:
      </p>

      <table class="w-full text-[9pt] ml-3 border-collapse">
        <tr><td class="w-32 py-0.5 font-semibold">Penyedia / Toko</td><td class="w-4 py-0.5">:</td><td class="py-0.5 font-bold">${sup.namaToko}</td></tr>
        <tr><td class="py-0.5 font-semibold">Dasar Surat Pesanan Barang</td><td class="py-0.5">:</td><td class="py-0.5 font-mono">${sp.nomorSp} tanggal ${formatTanggalIndo(sp.tanggalSp)}</td></tr>
        <tr><td class="py-0.5 font-semibold">Nama Kegiatan</td><td class="py-0.5">:</td><td class="py-0.5 uppercase">${sp.kegiatan}</td></tr>
        <tr><td class="py-0.5 font-semibold">Pemesan Barang</td><td class="py-0.5">:</td><td class="py-0.5 font-bold">${pemesanNama} (${pemesanJabatan})</td></tr>
      </table>

      <p class="text-[9pt] font-bold mt-1">Hasil Pemeriksaan Kuantitas & Kualitas Barang:</p>

      <table class="print-table w-full text-[8.5pt] my-1 border border-black">
        <thead>
          <tr class="bg-gray-100 font-bold text-center">
            <th class="border border-black p-0.5 w-8">No</th>
            <th class="border border-black p-0.5">Nama Barang / Material</th>
            <th class="border border-black p-0.5 w-20">Jumlah Pesanan</th>
            <th class="border border-black p-0.5 w-20">Hasil Fisik</th>
            <th class="border border-black p-0.5 w-20">Kondisi</th>
            <th class="border border-black p-0.5">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${sp.items.map((item, i) => `
            <tr>
              <td class="border border-black p-0.5 text-center">${i + 1}</td>
              <td class="border border-black p-0.5 font-bold">${item.namaBarang}</td>
              <td class="border border-black p-0.5 text-center">${item.volume} ${item.satuan}</td>
              <td class="border border-black p-0.5 text-center font-bold text-emerald-800">${item.volume} ${item.satuan}</td>
              <td class="border border-black p-0.5 text-center font-semibold">100% Baik</td>
              <td class="border border-black p-0.5 text-[8pt]">Sesuai Spesifikasi SP</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="text-[8.5pt] p-1 border border-black bg-gray-50 space-y-0.5">
        <p class="font-bold">Kesimpulan Pemeriksaan:</p>
        <p class="italic text-justify">${bast.hasilPemeriksaan}</p>
      </div>

      <div class="mt-2 text-[9pt] signature-block print-avoid-break">
        <div class="text-right mb-1 text-[8.5pt]">
          ${p.desa.replace('DESA ', '')}, ${formatTanggalIndo(bast.tanggalBast)}
        </div>
        
        <p class="font-bold text-center mb-1 text-[8.5pt]">TIM PEMERIKSA / ${pemesanJabatan.toUpperCase()} ${p.desa}</p>

        <div class="grid grid-cols-2 text-center gap-4">
          <div>
            <p class="font-semibold text-[8.5pt]">Anggota Tim / Pendamping:</p>
            <div class="h-16"></div>
            <p class="font-bold underline text-[9pt]">${bast.anggotaTpk || 'Siti Aminah'}</p>
          </div>

          <div>
            <p class="font-semibold text-[8.5pt]">Pejabat Pemesan / Ketua TPK:</p>
            <div class="h-16"></div>
            <p class="font-bold underline uppercase text-[9pt]">${bast.ketuaTpk || pemesanNama}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// TEMPLATE 4: KWITANSI PEMBAYARAN DESA
function renderKwitansiPrintTemplate(bastId) {
  const bastList = ensureArray(appState.data.bastList);
  const suratPesanan = ensureArray(appState.data.suratPesanan);
  const suppliers = ensureArray(appState.data.suppliers);
  const bast = bastList.find(b => b && b.id === bastId);
  if (!bast) return '<div class="text-red-500">Kwitansi tidak ditemukan.</div>';
  const sp = suratPesanan.find(s => s && s.id === bast.spId) || {};
  const p = appState.data.profilDesa || defaultData.profilDesa;
  const sup = suppliers.find(s => s && s.id === sp.supplierId) || {};

  return `
    <div class="print-page space-y-1.5">
      ${renderKopSuratHtml(p)}

      <div class="text-center my-1">
        <h2 class="font-bold text-base uppercase tracking-wider underline underline-offset-2">KWITANSI / BUKTI PEMBAYARAN</h2>
        <p class="font-mono text-[9pt]">Nomor Bukti: 027/${sp.id.replace('sp-', '')}/KW/PPKD-DS/2026</p>
      </div>

      <div class="border-2 border-black p-2 space-y-1 text-[9pt]">
        <table class="w-full border-collapse">
          <tr>
            <td class="w-36 py-0.5 font-semibold">Telah Terima Dari</td>
            <td class="w-4 py-0.5">:</td>
            <td class="py-0.5 font-bold">BENDAHARA / KAUR KEUANGAN ${p.desa}</td>
          </tr>
          <tr>
            <td class="py-0.5 font-semibold">Uang Sejumlah</td>
            <td class="py-0.5">:</td>
            <td class="py-0.5 font-bold italic bg-gray-100 p-1 border border-black">${sp.terbilang}</td>
          </tr>
          <tr>
            <td class="py-0.5 font-semibold">Untuk Pembayaran</td>
            <td class="py-0.5">:</td>
            <td class="py-0.5 text-justify">
              Pembayaran Lunas Pengadaan Barang/Material untuk Pekerjaan: <strong>${sp.kegiatan}</strong> sesuai Surat Pesanan (SP) No: <strong>${sp.nomorSp}</strong> dan BAST No: <strong>${bast.nomorBast}</strong>.
            </td>
          </tr>
          <tr>
            <td class="py-0.5 font-semibold">Sumber Dana APBDes</td>
            <td class="py-0.5">:</td>
            <td class="py-0.5 font-mono">${sp.sumberDana}</td>
          </tr>
        </table>

        <div class="mt-1 pt-1 border-t border-black flex justify-between items-center">
          <div class="text-[9pt]">
            <span class="font-bold">Terhitung:</span>
            <div class="text-base font-black font-mono mt-0.5 border-2 border-black px-3 py-0.5 bg-gray-100 inline-block">
              ${formatRupiah(sp.grandTotal)}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 text-[9pt] grid grid-cols-3 text-center gap-2 signature-block print-avoid-break">
        <div>
          <p class="font-semibold text-[8.5pt]">Setuju Dibayar:</p>
          <p class="font-bold text-[9pt]">Kepala Desa ${p.desa}</p>
          <div class="h-16"></div>
          <p class="font-bold underline uppercase text-[9pt]">${p.kadesNama}</p>
        </div>

        <div>
          <p class="font-semibold text-[8.5pt]">Telah Dibayar Lunas:</p>
          <p class="font-bold text-[9pt]">Kaur Keuangan / PPKD</p>
          <div class="h-16"></div>
          <p class="font-bold underline uppercase text-[9pt]">${p.ppkdNama}</p>
        </div>

        <div>
          <p class="font-semibold text-[8.5pt]">Penerima Uang:</p>
          <p class="font-bold text-[9pt]">${sup.namaToko}</p>
          <div class="h-16"></div>
          <p class="font-bold underline uppercase text-[9pt]">${sup.pemilik}</p>
        </div>
      </div>
    </div>
  `;
}

function renderKopSuratHtml(p) {
  const logoUrl = p.logoUrl || 'logo-kutai-timur.png';
  const kabText = (p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR').startsWith('PEMERINTAH') ? (p.kabupaten || 'PEMERINTAH KABUPATEN KUTAI TIMUR') : 'PEMERINTAH ' + p.kabupaten;
  return `
    <div class="relative pb-1 mb-2 border-b-[3px] border-black">
      <div class="flex items-center justify-between">
        <div class="w-20 flex-shrink-0 flex items-center justify-center">
          <img src="${logoUrl}" class="w-16 h-auto max-h-20 object-contain" alt="Logo Pemda" onerror="this.style.display='none'">
        </div>
        <div class="flex-1 text-center font-serif leading-tight">
          <h4 class="font-bold text-[12pt] uppercase tracking-wider">${kabText}</h4>
          <h3 class="font-bold text-[14pt] uppercase tracking-wider mt-0.5">${p.kecamatan || 'KECAMATAN SANGKULIRANG'}</h3>
          <h1 class="font-extrabold text-[18pt] uppercase tracking-wider mt-0.5">${p.desa || 'DESA TANJUNG MANIS'}</h1>
          <p class="text-[9pt] font-sans font-normal mt-1">
            Alamat ${p.alamat || 'Jl Poros RT.03 Dusun I. Tanjung Manis Sangkulirang Kutai Timur 75684'}
          </p>
        </div>
        <div class="w-20 flex-shrink-0"></div>
      </div>
      <div class="border-b border-black mt-[2px]"></div>
    </div>
  `;
}

// ==========================================
// 6. BACKUP & EXPORT JSON
// ==========================================

function exportDataJson() {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal(() => exportDataJson(), 'Ekspor Data Backup JSON');
    return;
  }
  const jsonStr = JSON.stringify(appState.data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-sipesan-desa-${appState.data.profilDesa.desa.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerImportJson() {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal(() => triggerImportJson(), 'Impor Data Backup JSON');
    return;
  }
  document.getElementById('json-file-input').click();
}

function importDataJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (imported.profilDesa && imported.suratPesanan) {
        const isConfirmMerge = confirm(
          'Ditemukan file data SIPESAN-DESA!\n\n' +
          '• Klik [OK] untuk MENGGABUNGKAN data baru dari laptop ini ke data yang sudah ada (Cocok untuk rekap gabungan seluruh Kasi/Kaur).\n' +
          '• Klik [Batal] untuk MENGGANTI TOTAL seluruh data laptop ini dengan file yang diimpor.'
        );

        if (isConfirmMerge) {
          // Merge Data Logic
          const current = appState.data;
          
          const existingSpIds = new Set(current.suratPesanan.map(s => s.id));
          const newSp = (imported.suratPesanan || []).filter(s => !existingSpIds.has(s.id));
          const mergedSp = [...current.suratPesanan, ...newSp];

          const existingBastIds = new Set(current.bastList.map(b => b.id));
          const newBast = (imported.bastList || []).filter(b => !existingBastIds.has(b.id));
          const mergedBast = [...current.bastList, ...newBast];

          const mergedSuppMap = new Map();
          current.suppliers.forEach(s => mergedSuppMap.set(s.id, s));
          (imported.suppliers || []).forEach(s => mergedSuppMap.set(s.id, s));
          const mergedSupp = Array.from(mergedSuppMap.values());

          const currentPelaksana = current.profilDesa.pelaksanaList || [];
          const importedPelaksana = imported.profilDesa.pelaksanaList || [];
          const mergedPelMap = new Map();
          currentPelaksana.forEach(p => mergedPelMap.set(p.id, p));
          importedPelaksana.forEach(p => mergedPelMap.set(p.id, p));
          const mergedPel = Array.from(mergedPelMap.values());

          const existingPapanIds = new Set((current.papanProyekList || []).map(p => p.id));
          const newPapan = (imported.papanProyekList || []).filter(p => !existingPapanIds.has(p.id));
          const mergedPapan = [...(current.papanProyekList || []), ...newPapan];

          const mergedData = {
            ...current,
            suratPesanan: mergedSp,
            bastList: mergedBast,
            suppliers: mergedSupp,
            papanProyekList: mergedPapan,
            profilDesa: {
              ...current.profilDesa,
              ...imported.profilDesa, // Prioritize imported village profile
              pelaksanaList: mergedPel
            }
          };

          setState({ data: mergedData });
          alert(`Berhasil menggabungkan data! (+${newSp.length} SPB baru, +${newBast.length} BAST baru, +${newPapan.length} Plang Proyek baru)`);
        } else {
          // Replace All Data Logic
          const sanitized = sanitizeAppData(imported);
          if (sanitized.adminSecurity && sanitized.adminSecurity.adminPin) {
            localStorage.setItem(ADMIN_PIN_STORAGE_KEY, sanitized.adminSecurity.adminPin);
          }
          setState({ data: sanitized });
          alert('Seluruh data SIPESAN-DESA berhasil diganti dengan file impor!');
        }
      } else {
        alert('Format file JSON tidak valid.');
      }
    } catch (err) {
      alert('Gagal membaca file JSON.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function checkFridayReminder() {
  const today = new Date();
  if (today.getDay() === 5) { // 5 is Friday
    const dateString = today.toDateString();
    const lastReminder = localStorage.getItem('SIPESAN_LAST_FRIDAY_REMINDER');
    if (lastReminder !== dateString) {
      localStorage.setItem('SIPESAN_LAST_FRIDAY_REMINDER', dateString);
      appState.showFridayReminder = true;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkFridayReminder();
  initFirebaseCloud();
  renderApp();
});
