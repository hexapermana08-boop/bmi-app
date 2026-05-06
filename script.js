// ========== THEME TOGGLE ==========
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeBtn = document.getElementById('themeToggleBtn');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (themeBtn) themeBtn.innerHTML = '☀️';
  } else {
    document.body.classList.remove('dark');
    if (themeBtn) themeBtn.innerHTML = '🌙';
  }
}
applyTheme();

function toggleTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    if (themeBtn) themeBtn.innerHTML = '🌙';
    showToast('☀️ Mode Terang');
  } else {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    if (themeBtn) themeBtn.innerHTML = '☀️';
    showToast('🌙 Mode Gelap');
  }
}

// ========== PAGE TRANSITION ==========
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    document.body.classList.add('page-transition');
    setTimeout(() => { window.location.href = href; }, 200);
  });
});

// ========== BOTTOM SHEET MODAL ==========
function showBottomSheet(title, content) {
  let modal = document.querySelector('.modal-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="bottom-sheet">
        <span class="close-sheet" onclick="closeBottomSheet()">✕</span>
        <h3 id="sheetTitle"></h3>
        <div id="sheetContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeBottomSheet(); });
  }
  document.getElementById('sheetTitle').innerHTML = title;
  document.getElementById('sheetContent').innerHTML = content;
  modal.classList.add('active');
}

function closeBottomSheet() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.classList.remove('active');
}

// ========== SHOW ARTICLE MODAL ==========
function showArticleModal(title, content) {
  showBottomSheet(title, `<p style="line-height: 1.6; margin-top: 8px;">${content}</p><button class="btn btn-primary" style="margin-top: 24px; width: 100%;" onclick="closeBottomSheet()">Tutup</button>`);
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
    case 'Kurus': return '🍗 Perbanyak protein (telur, ikan, ayam), konsumsi karbohidrat kompleks, olahraga ringan untuk menambah massa otot.';
    case 'Normal': return '✅ Pertahankan! Jaga pola makan seimbang, rutin olahraga 30 menit/hari, tidur cukup 7-8 jam.';
    case 'Gemuk': return '🏃 Kurangi gula & lemak jenuh, perbanyak sayur dan buah, jalan kaki 10.000 langkah/hari.';
    case 'Obesitas': return '⚕️ Konsultasi dengan dokter gizi, kurangi porsi makan, perbanyak aktivitas fisik, hindari makanan olahan.';
    default: return 'Jaga kesehatan dengan pola hidup seimbang.';
  }
}

let lastResult = null;

// ========== HITUNG BMI ==========
function hitungBMI() {
  const nama = document.getElementById('nama')?.value.trim();
  const tinggi = parseFloat(document.getElementById('tinggi')?.value);
  const berat = parseFloat(document.getElementById('berat')?.value);
  const umur = document.getElementById('umur')?.value;
  const gender = document.getElementById('gender')?.value;
  
  if (!nama) return showToast('❌ Masukkan nama lengkap');
  if (!tinggi || tinggi < 50 || tinggi > 250) return showToast('❌ Masukkan tinggi (50-250 cm)');
  if (!berat || berat < 10 || berat > 300) return showToast('❌ Masukkan berat (10-300 kg)');
  if (!umur) return showToast('❌ Masukkan umur');
  if (!gender) return showToast('❌ Pilih gender');
  
  const bmiValue = berat / ((tinggi / 100) ** 2);
  let kategori = '', emoji = '', warna = '';
  
  if (bmiValue < 18.5) { kategori = 'Kurus'; emoji = '💙'; warna = '#6366F1'; }
  else if (bmiValue < 25) { kategori = 'Normal'; emoji = '💚'; warna = '#14B8A6'; }
  else if (bmiValue < 30) { kategori = 'Gemuk'; emoji = '🧡'; warna = '#F59E0B'; }
  else { kategori = 'Obesitas'; emoji = '❤️'; warna = '#EF4444'; }
  
  const rekomendasi = getRekomendasi(kategori);
  
  lastResult = { nama, bmi: bmiValue.toFixed(2), kategori, gender, umur, tinggi, berat, emoji, rekomendasi };
  
  const hasilDiv = document.getElementById('hasil');
  if (hasilDiv) {
    hasilDiv.style.display = 'block';
    hasilDiv.innerHTML = `
      <div class="result-emoji">${emoji}</div>
      <div style="font-size: 18px; font-weight: 500;">${escapeHtml(nama)}</div>
      <div style="margin: 8px 0; opacity: 0.7;">${gender} · ${umur} tahun</div>
      <div style="margin: 8px 0;">📏 ${tinggi} cm · ⚖️ ${berat} kg</div>
      <div class="result-bmi">${bmiValue.toFixed(2)}</div>
      <div class="result-kategori" style="background: ${warna}20; color: ${warna};">${kategori}</div>
      <div class="result-rekom">📝 ${rekomendasi}</div>
    `;
  }
  
  const btnSimpan = document.getElementById('btnSimpan');
  if (btnSimpan) {
    btnSimpan.disabled = false;
    btnSimpan.style.opacity = '1';
  }
}

// ========== SIMPAN KE RIWAYAT ==========
function simpanKeRiwayat() {
  if (!lastResult) return showToast('⚠️ Hitung BMI terlebih dahulu');
  
  const data = JSON.parse(localStorage.getItem('bmi') || '[]');
  data.unshift({
    id: Date.now(),
    ...lastResult,
    tanggal: new Date().toLocaleDateString('id-ID'),
    jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  });
  localStorage.setItem('bmi', JSON.stringify(data));
  
  showToast('✅ Data berhasil disimpan');
  
  const btnSimpan = document.getElementById('btnSimpan');
  if (btnSimpan) {
    btnSimpan.disabled = true;
    btnSimpan.style.opacity = '0.5';
  }
  
  if (document.getElementById('listRiwayat')) {
    tampilkanRiwayat();
  }
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
    let warna = '', bgWarna = '';
    if (item.kategori === 'Kurus') { warna = '#6366F1'; bgWarna = '#6366F120'; }
    else if (item.kategori === 'Normal') { warna = '#14B8A6'; bgWarna = '#14B8A620'; }
    else if (item.kategori === 'Gemuk') { warna = '#F59E0B'; bgWarna = '#F59E0B20'; }
    else { warna = '#EF4444'; bgWarna = '#EF444420'; }
    
    const emoji = item.emoji || (item.kategori === 'Kurus' ? '💙' : item.kategori === 'Normal' ? '💚' : item.kategori === 'Gemuk' ? '🧡' : '❤️');
    
    return `
      <li class="riwayat-item">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
          <span class="riwayat-nama">${escapeHtml(item.nama)}</span>
          <span class="riwayat-tgl">📅 ${item.tanggal} ${item.jam}</span>
        </div>
        <div style="display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;">
          <span class="riwayat-bmi">${emoji} ${item.bmi}</span>
          <span class="riwayat-kat" style="background: ${bgWarna}; color: ${warna};">${item.kategori}</span>
        </div>
        <div class="riwayat-detail">
          <span>👤 ${item.gender}</span>
          <span>🎂 ${item.umur} th</span>
          <span>📏 ${item.tinggi} cm</span>
          <span>⚖️ ${item.berat} kg</span>
        </div>
        <div class="riwayat-rekom">💡 ${item.rekomendasi?.substring(0, 85)}${item.rekomendasi?.length > 85 ? '...' : ''}</div>
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
    showToast('🗑️ Data dihapus');
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

// ========== RESET FORM ==========
function resetForm() {
  const btnSimpan = document.getElementById('btnSimpan');
  if (btnSimpan) {
    btnSimpan.disabled = true;
    btnSimpan.style.opacity = '0.5';
  }
  const hasil = document.getElementById('hasil');
  if (hasil) hasil.style.display = 'none';
  lastResult = null;
}

['nama', 'umur', 'gender', 'tinggi', 'berat'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', resetForm);
});

// ========== INIT ==========
if (document.getElementById('listRiwayat')) {
  tampilkanRiwayat();
}

function updateThemeIcon() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }
}
updateThemeIcon();
