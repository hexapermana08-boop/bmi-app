// ========== THEME ==========
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}
applyTheme();

function toggleTheme() {
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    showToast('Mode Terang');
  } else {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    showToast('Mode Gelap');
  }
}

// ========== TOAST ==========
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ========== REKOMENDASI BMI ==========
function getRekomendasi(kategori) {
  switch(kategori) {
    case 'Kurus': return '🍗 Perbanyak protein (telur, ikan, ayam), konsumsi karbohidrat kompleks, olahraga ringan';
    case 'Normal': return '✅ Pertahankan! Pola makan seimbang, olahraga 30 menit/hari, tidur cukup 7-8 jam';
    case 'Gemuk': return '🏃 Kurangi gula & lemak jenuh, perbanyak sayur dan buah, jalan kaki 10.000 langkah/hari';
    case 'Obesitas': return '⚕️ Konsultasi dengan dokter gizi, kurangi porsi makan, perbanyak aktivitas fisik';
    default: return 'Jaga kesehatan dengan pola hidup seimbang';
  }
}

let lastResult = {};

// ========== HITUNG BMI ==========
function hitungBMI() {
  const nama = document.getElementById('nama')?.value.trim();
  const tinggi = parseFloat(document.getElementById('tinggi')?.value);
  const berat = parseFloat(document.getElementById('berat')?.value);
  const umur = document.getElementById('umur')?.value;
  const gender = document.getElementById('gender')?.value;
  
  if (!nama) return showToast('❌ Masukkan nama!');
  if (!tinggi || tinggi < 50) return showToast('❌ Masukkan tinggi yang valid (50-250 cm)');
  if (!berat || berat < 10) return showToast('❌ Masukkan berat yang valid (10-300 kg)');
  if (!umur) return showToast('❌ Masukkan umur!');
  if (!gender) return showToast('❌ Pilih gender!');
  
  const bmiValue = berat / ((tinggi/100) ** 2);
  let kategori = '';
  let warna = '';
  
  if (bmiValue < 18.5) { kategori = 'Kurus'; warna = '#6366F1'; }
  else if (bmiValue < 25) { kategori = 'Normal'; warna = '#14B8A6'; }
  else if (bmiValue < 30) { kategori = 'Gemuk'; warna = '#F59E0B'; }
  else { kategori = 'Obesitas'; warna = '#EF4444'; }
  
  const rekomendasi = getRekomendasi(kategori);
  lastResult = { nama, bmi: bmiValue.toFixed(2), kategori, gender, umur, tinggi, berat, rekomendasi };
  
  const hasil = document.getElementById('hasil');
  if (hasil) {
    hasil.style.display = 'block';
    hasil.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 12px;">${kategori === 'Kurus' ? '💙' : kategori === 'Normal' ? '💚' : kategori === 'Gemuk' ? '🧡' : '❤️'}</div>
      <div><strong>${escapeHtml(nama)}</strong> (${gender}, ${umur} th)</div>
      <div style="margin: 10px 0;">📏 ${tinggi} cm | ⚖️ ${berat} kg</div>
      <div class="bmi-number">${bmiValue.toFixed(2)}</div>
      <div style="margin: 8px 0;"><span style="background:${warna}20; padding:6px 18px; border-radius:40px;">${kategori}</span></div>
      <div style="margin-top: 16px; padding: 12px; background: rgba(0,0,0,0.05); border-radius: 20px; text-align: left;">📝 ${rekomendasi}</div>
    `;
    hasil.classList.add('animate-pulse');
    setTimeout(() => hasil.classList.remove('animate-pulse'), 300);
  }
  
  document.getElementById('btnSimpan').disabled = false;
}

// ========== SIMPAN DATA ==========
function simpanKeRiwayat() {
  if (!lastResult.bmi) return showToast('⚠️ Hitung BMI dulu!');
  
  const data = JSON.parse(localStorage.getItem('bmi') || '[]');
  data.unshift({
    id: Date.now(),
    ...lastResult,
    tanggal: new Date().toLocaleDateString('id-ID'),
    jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  });
  localStorage.setItem('bmi', JSON.stringify(data));
  showToast('✅ Data tersimpan!');
  document.getElementById('btnSimpan').disabled = true;
  if (document.getElementById('listRiwayat')) tampilkanRiwayat();
}

// ========== TAMPILKAN RIWAYAT ==========
function tampilkanRiwayat() {
  const list = document.getElementById('listRiwayat');
  const empty = document.getElementById('emptyState');
  const jumlah = document.getElementById('jumlahData');
  const data = JSON.parse(localStorage.getItem('bmi') || '[]');
  
  if (jumlah) jumlah.innerText = `${data.length} data`;
  if (!list) return;
  
  if (data.length === 0) {
    if (empty) empty.style.display = 'block';
    list.innerHTML = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  
  list.innerHTML = data.map((item, idx) => {
    let warna = '';
    let emoji = '';
    if (item.kategori === 'Kurus') { warna = '#6366F1'; emoji = '💙'; }
    else if (item.kategori === 'Normal') { warna = '#14B8A6'; emoji = '💚'; }
    else if (item.kategori === 'Gemuk') { warna = '#F59E0B'; emoji = '🧡'; }
    else { warna = '#EF4444'; emoji = '❤️'; }
    
    return `
      <li class="riwayat-item">
        <div class="riwayat-header">
          <span class="riwayat-nama">${escapeHtml(item.nama)}</span>
          <span class="riwayat-tanggal">${item.tanggal} ${item.jam}</span>
        </div>
        <div>
          <span class="riwayat-bmi">${emoji} ${item.bmi}</span>
          <span class="riwayat-kategori" style="background:${warna}20; color:${warna}">${item.kategori}</span>
        </div>
        <div class="riwayat-detail">
          <span>👤 ${item.gender}</span>
          <span>🎂 ${item.umur} th</span>
          <span>📏 ${item.tinggi} cm</span>
          <span>⚖️ ${item.berat} kg</span>
        </div>
        <div style="font-size: 11px; opacity:0.7;">💡 ${item.rekomendasi?.substring(0, 80)}...</div>
        <button onclick="hapusRiwayat(${idx})">🗑️ Hapus</button>
      </li>
    `;
  }).join('');
}

function hapusRiwayat(index) {
  if (confirm('Hapus data ini?')) {
    const data = JSON.parse(localStorage.getItem('bmi') || '[]');
    data.splice(index, 1);
    localStorage.setItem('bmi', JSON.stringify(data));
    tampilkanRiwayat();
    showToast('Data dihapus');
  }
}

function hapusSemua() {
  if (confirm('⚠️ Hapus SEMUA riwayat? Data tidak dapat dikembalikan!')) {
    localStorage.removeItem('bmi');
    tampilkanRiwayat();
    showToast('Semua data dihapus');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

// Reset form ketika input berubah
function resetForm() {
  document.getElementById('btnSimpan').disabled = true;
  const hasil = document.getElementById('hasil');
  if (hasil) hasil.style.display = 'none';
  lastResult = {};
}

['nama', 'umur', 'gender', 'tinggi', 'berat'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', resetForm);
});

// Initialize
if (document.getElementById('listRiwayat')) tampilkanRiwayat();
