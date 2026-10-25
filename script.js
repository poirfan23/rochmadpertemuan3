const form = document.getElementById('form-transaksi');
const keteranganInput = document.getElementById('keterangan');
const jumlahInput = document.getElementById('jumlah');
const tipeInput = document.getElementById('tipe');
const daftarTransaksi = document.getElementById('daftar-transaksi');
const totalSaldoEl = document.getElementById('total-saldo');
const totalPemasukanEl = document.getElementById('total-pemasukan');
const totalPengeluaranEl = document.getElementById('total-pengeluaran');

// Menyimpan data ke LocalStorage agar tidak hilang saat di-refresh
let transaksiList = JSON.parse(localStorage.getItem('transaksi')) || [];

// Fungsi untuk format mata uang Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

// Fungsi utama memperbarui tampilan
function updateAplikasi() {
    daftarTransaksi.innerHTML = '';
    
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transaksiList.forEach((item, index) => {
        const jumlah = Number(item.jumlah);
        if (item.tipe === 'pemasukan') {
            totalPemasukan += jumlah;
        } else {
            totalPengeluaran += jumlah;
        }

        // Tambahkan baris ke dalam tabel HTML
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.keterangan}</td>
            <td>${formatRupiah(jumlah)}</td>
            <td><span class="${item.tipe === 'pemasukan' ? 'badge-masuk' : 'badge-keluar'}">${item.tipe.toUpperCase()}</span></td>
            <td><button class="btn-hapus" onclick="hapusTransaksi(${index})">Hapus</button></td>
        `;
        daftarTransaksi.appendChild(tr);
    });

    const totalSaldo = totalPemasukan - totalPengeluaran;

    totalSaldoEl.innerText = formatRupiah(totalSaldo);
    totalPemasukanEl.innerText = formatRupiah(totalPemasukan);
    totalPengeluaranEl.innerText = formatRupiah(totalPengeluaran);

    localStorage.setItem('transaksi', JSON.stringify(transaksiList));
}

// Event saat tombol submit ditekan
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const keterangan = keteranganInput.value.trim();
    const jumlah = jumlahInput.value.trim();
    const tipe = tipeInput.value;

    if (keterangan === '' || jumlah === '') {
        alert('Mohon isi semua data dengan benar!');
        return;
    }

    const transaksiBaru = {
        keterangan,
        jumlah: Number(jumlah),
        tipe
    };

    transaksiList.push(transaksiBaru);
    updateAplikasi();

    // Reset input form
    keteranganInput.value = '';
    jumlahInput.value = '';
});

// Fungsi untuk menghapus item transaksi
function hapusTransaksi(index) {
    transaksiList.splice(index, 1);
    updateAplikasi();
}

// Jalankan saat pertama kali dimuat
updateAplikasi();