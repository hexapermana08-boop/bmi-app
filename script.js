// ========== THEME & AUTH ==========
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Apply theme from localStorage
function applyTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
}
applyTheme();

// Update user UI
function updateUserUI() {
  const userSection = document.getElementById('userSection');
  if (!userSection) return;
  
  if (currentUser) {
    userSection.innerHTML = `
      <div class="user-avatar" onclick="showUserMenu()">
        <span>${currentUser.nama.charAt(0).toUpperCase()}</span>
      </div>
      <button class="auth-btn auth-btn-logout" onclick="logout()">Keluar</button>
    `;
  } else {
    userSection.innerHTML = `
      <div class="auth-buttons">
        <button class="auth-btn auth-btn-login" onclick="window.location.href='login.html'">Masuk</button>
        <button class="auth-btn auth-btn-register" onclick="window.location.href='registrasi.html'">Daftar</button>
      </div>
    `;
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  updateUserUI();
  showToast('Anda telah keluar');
  setTimeout(() => window.location.reload(), 1000);
}

function showUserMenu() {
  showBottomSheet('Akun', `
    <p><strong>${currentUser?.nama}</strong></p>
    <p>${currentUser?.email}</p>
    <hr style="margin: 16px 0; opacity:0.2;">
    <button class="btn btn-outline" onclick="logout(); closeBottomSheet()">Keluar</button>
  `);
}

// Toast notification
function showToast(message, duration = 2000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// Bottom sheet modal
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
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBottomSheet();
    });
  }
  document.getElementById('sheetTitle').textContent = title;
  document.getElementById('sheetContent').innerHTML = content;
  modal.classList.add('active');
}

function closeBottomSheet() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.classList.remove('active');
}

// Daily quotes
const quotes = [
  "✨ Kesehatan adalah investasi terbaik dalam hidup",
  "💪 Tubuh yang sehat adalah rumah bagi jiwa yang kuat",
  "🥗 Makanan adalah obat, pilihlah dengan bijak",
  "🚶 10.000 langkah sehari, jaga kesehatanmu",
  "😴 Tidur cukup adalah kunci produktivitas"
];

function showDailyQuote() {
  const quoteEl = document.getElementById('dailyQuote');
  if (quoteEl) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteEl.innerHTML = `“${quotes[randomIndex]}”`;
  }
}

// ========== PARTICLES & EFFECTS ==========
function createParticles() {
  const particleDiv = document.createElement('div');
  particleDiv.className = 'particle-bg';
  particleDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden';
  document.body.appendChild(particleDiv);
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position:absolute;width:${Math.random()*6+2}px;height:${Math.random()*6+2}px;
      background:${Math.random() > 0.5 ? '#007AFF' : '#5E5CE6'};
      border-radius:50%;opacity:0.1;left:${Math.random()*100}%;
      animation:floatParticle ${Math.random()*15+10}s linear infinite;
      animation-delay:${Math.random()*10}s;
    `;
    particleDiv.appendChild(particle);
  }
}

// Add style for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes floatParticle {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.1; }
    90% { opacity: 0.05; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);
createParticles();

// Ripple effect
document.addEventListener('click', function(e) {
  const button = e.target.closest('.btn, button');
  if (button) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,0.5);
      transform:scale(0);animation:rippleAnim 0.5s linear;
      pointer-events:none;width:100px;height:100px;
      left:${e.clientX - rect.left - 50}px;top:${e.clientY - rect.top - 50}px;
    `;
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  }
});

const rippleKeyframes = document.createElement('style');
rippleKeyframes.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(rippleKeyframes);

// ========== BMI FUNCTIONS ==========
function getRekomendasi(kategori) {
  switch(kategori) {
    case "Kurus": return "🍗 Perbanyak protein (telur, ikan, ayam), konsumsi karbohidrat kompleks, olahraga ringan";
    case "Normal": return "✅ Pertahankan! Pola makan seimbang, olahraga 30 menit/hari, tidur cukup 7-8 jam";
    case "Gemuk": return "🏃 Kurangi gula & lemak, perbanyak sayur dan buah, jalan kaki 10.000 langkah/hari";
    case "Obesitas": return "⚕️ Konsultasi dokter gizi, kurangi porsi makan, perbanyak aktivitas fisik";
    default: return "Jaga kesehatan dengan pola hidup seimbang";
  }
}

let lastResult = { bmi: null, nama: "", kategori: "", gender: "", umur: "", tinggi: null, berat: null };

function hitungBMI() {
  const nama = document.getElementById("nama")?.value.trim();
  const tinggiCm = parseFloat(document.getElementById("tinggi")?.value);
  const berat = parseFloat(document.getElementById("berat")?.value);
  const umur = document.getElementById("umur")?.value;
  const gender = document.getElementById("gender")?.value;
  
  if (!nama) return showToast("❌ Masukkan nama!");
  if (!tinggiCm || tinggiCm < 50) return showToast("❌ Tinggi valid 50-250 cm");
  if (!berat || berat < 10) return showToast("❌ Berat valid 10-300 kg");
  if (!umur || umur < 1) return showToast("❌ Umur valid");
  if (!gender) return showToast("❌ Pilih gender");
  
  const tinggiM = tinggiCm / 100;
  const bmiValue = berat / (tinggiM * tinggiM);
  let kategori = "", emoji = "", warna = "";
  if (bmiValue < 18.5) { kategori = "Kurus"; emoji = "💙"; warna = "#007AFF"; }
  else if (bmiValue < 25) { kategori = "Normal"; emoji = "💚"; warna = "#32D74B"; }
  else if (bmiValue < 30) { kategori = "Gemuk"; emoji = "🧡"; warna = "#FF9F0A"; }
  else { kategori = "Obesitas"; emoji = "❤️"; warna = "#FF3B30"; }
  
  const rekomendasi = getRekomendasi(kategori);
  lastResult = { nama, bmi: bmiValue.toFixed(2), kategori, gender, umur, tinggi: tinggiCm, berat, emoji, rekomendasi };
  
  const hasilDiv = document.getElementById("hasil");
  if (hasilDiv) {
    hasilDiv.style.display = "block";
    hasilDiv.innerHTML = `
      <div style="font-size: 2.5rem;">${emoji}</div>
      <div style="font-size: 1rem; margin-bottom: 8px;"><strong>${escapeHtml(nama)}</strong> (${gender}, ${umur} th)</div>
      <div>📏 ${tinggiCm} cm | ⚖️ ${berat} kg</div>
      <div>BMI: <span id="bmiValueDisplay" style="font-size: 34px; font-weight: bold; color: ${warna};">0</span></div>
      <div style="margin-top: 8px;">Kategori: <strong style="background:${warna}20; padding:4px 16px; border-radius:40px;">${kategori}</strong></div>
      <div class="rekomendasi-hasil"><strong>📝 Rekomendasi:</strong><br>${rekomendasi}</div>
    `;
    animateNumber(document.getElementById('bmiValueDisplay'), parseFloat(bmiValue.toFixed(2)));
    
    if (kategori === "Normal") {
      showConfetti();
      showToast("🎉 Selamat! BMI Anda normal!");
    }
  }
  
  const btnSimpan = document.getElementById("btnSimpan");
  if (btnSimpan) { btnSimpan.disabled = false; btnSimpan.style.opacity = "1"; }
}

function animateNumber(element, target) {
  let current = 0;
  const increment = target / 40;
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toFixed(2);
      clearInterval(interval);
    } else {
      element.textContent = current.toFixed(2);
    }
  }, 15);
}

function showConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position:fixed; left:${Math.random()*100}%; top:-20px;
      width:${Math.random()*8+4}px; height:${Math.random()*8+4}px;
      background:${['#007AFF','#5E5CE6','#FF9F0A','#32D74B'][Math.floor(Math.random()*4)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '0'}; pointer-events:none; z-index:1000;
      animation: confettiFall ${Math.random()*2+2}s linear forwards;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(confettiStyle);

function simpanKeRiwayat() {
  if (!lastResult.bmi) return showToast("⚠️ Hitung BMI dulu!");
  
  let data = JSON.parse(localStorage.getItem("bmi")) || [];
  data.unshift({
    id: Date.now(), nama: lastResult.nama, bmi: lastResult.bmi, kategori: lastResult.kategori,
    gender: lastResult.gender, umur: lastResult.umur, tinggi: lastResult.tinggi, berat: lastResult.berat,
    rekomendasi: lastResult.rekomendasi, tanggal: new Date().toLocaleDateString('id-ID'),
    jam: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  });
  localStorage.setItem("bmi", JSON.stringify(data));
  
  showToast("✅ Data tersimpan!");
  const btn = document.getElementById("btnSimpan");
  if (btn) { btn.disabled = true; btn.style.opacity = "0.5"; }
  if (document.getElementById("listRiwayat")) tampilkanRiwayat();
}

// Chart
let chartInstance = null;

function updateChart() {
  const chartContainer = document.getElementById('chartContainer');
  const data = JSON.parse(localStorage.getItem("bmi")) || [];
  if (!chartContainer || data.length < 2) {
    if (chartContainer) chartContainer.classList.remove('visible');
    return;
  }
  chartContainer.classList.add('visible');
  const ctx = document.getElementById('bmiChart')?.getContext('2d');
  if (!ctx) return;
  
  const labels = data.slice(0, 7).reverse().map(d => d.tanggal?.substring(0, 5) || '');
  const bmiValues = data.slice(0, 7).reverse().map(d => parseFloat(d.bmi));
  
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'BMI', data: bmiValues,
        borderColor: '#007AFF', backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 2, fill: true, tension: 0.3,
        pointBackgroundColor: '#5E5CE6', pointBorderColor: '#fff', pointRadius: 4
      }]
    },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
  });
}

function tampilkanRiwayat() {
  const list = document.getElementById("listRiwayat");
  const empty = document.getElementById("emptyState");
  const jumlah = document.getElementById("jumlahData");
  let data = JSON.parse(localStorage.getItem("bmi")) || [];
  
  if (jumlah) jumlah.innerText = `${data.length} data`;
  if (!list) return;
  
  if (data.length === 0) {
    if(empty) empty.style.display = "block";
    list.innerHTML = "";
    return;
  }
  if(empty) empty.style.display = "none";
  list.innerHTML = "";
  
  data.forEach((item, idx) => {
    const warnaKategori = item.kategori === "Kurus" ? "#007AFF" : item.kategori === "Normal" ? "#32D74B" : item.kategori === "Gemuk" ? "#FF9F0A" : "#FF3B30";
    const emoji = item.kategori === "Kurus" ? "💙" : item.kategori === "Normal" ? "💚" : item.kategori === "Gemuk" ? "🧡" : "❤️";
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="riwayat-header">
        <span class="riwayat-nama">${escapeHtml(item.nama)}</span>
        <span class="riwayat-tanggal">${item.tanggal} ${item.jam}</span>
      </div>
      <div class="riwayat-stats">
        <span class="riwayat-bmi">${emoji} ${item.bmi}</span>
        <span class="riwayat-kategori" style="background:${warnaKategori}20; color:${warnaKategori}">${item.kategori}</span>
      </div>
      <div class="riwayat-detail">
        <span>👤 ${item.gender}</span><span>🎂 ${item.umur} th</span>
        <span>📏 ${item.tinggi} cm</span><span>⚖️ ${item.berat} kg</span>
      </div>
      <div class="riwayat-rekomendasi">💡 ${item.rekomendasi?.substring(0,80)}...</div>
      <button onclick="hapusSatu(${idx})">🗑️ Hapus</button>
    `;
    list.appendChild(li);
  });
  updateChart();
}

function hapusSatu(index) {
  if(confirm("Hapus data ini?")){
    let data = JSON.parse(localStorage.getItem("bmi"));
    data.splice(index,1);
    localStorage.setItem("bmi", JSON.stringify(data));
    tampilkanRiwayat();
  }
}

function hapusSemua() {
  if(confirm("Hapus semua riwayat?")){ 
    localStorage.removeItem("bmi"); 
    tampilkanRiwayat();
  }
}

function escapeHtml(str) { 
  if(!str) return ""; 
  return str.replace(/[&<>]/g, m => m==="&"?"&amp;":m==="<"?"&lt;":"&gt;");
}

// Reset simpan button
function resetSimpanButton() {
  const btn = document.getElementById("btnSimpan");
  if(btn){ btn.disabled=true; btn.style.opacity="0.5"; }
  const hasil = document.getElementById("hasil");
  if(hasil) hasil.style.display = "none";
  lastResult.bmi = null;
}
["nama","umur","gender","tinggi","berat"].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener("input", resetSimpanButton);
});

// Page transition
document.body.classList.add('page-transition');
setTimeout(() => document.body.classList.remove('page-transition'), 500);

// Initialize
if(document.getElementById("listRiwayat")) tampilkanRiwayat();
if(document.getElementById("chartContainer") && !document.getElementById('bmiChart')) {
  const chartDiv = document.createElement('canvas');
  chartDiv.id = 'bmiChart';
  document.getElementById('chartContainer')?.appendChild(chartDiv);
}

// Load Chart.js
if(typeof Chart === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  script.onload = () => updateChart();
  document.head.appendChild(script);
}

// Active nav highlight
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) item.classList.add('active');
    else item.classList.remove('active');
  });
}
setActiveNav();
showDailyQuote();
updateUserUI();

// Toggle theme
function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  if (isDark) {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// ========== AUTO DARK MODE (Nomor 5) ==========
let themeMode = localStorage.getItem('themeMode') || 'auto'; // 'light', 'dark', 'auto'

function applyThemeBasedOnMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (themeMode === 'auto') {
    if (prefersDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  } else if (themeMode === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Listen to system theme change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (themeMode === 'auto') applyThemeBasedOnMode();
});

// Call this after page load
applyThemeBasedOnMode();

// ========== SKELETON LOADER (Nomor 6) ==========
function showSkeletonLoader(containerId, type = 'card', count = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let skeletonHtml = '';
  for (let i = 0; i < count; i++) {
    if (type === 'card') {
      skeletonHtml += `<div class="skeleton skeleton-card"></div>`;
    } else if (type === 'list') {
      skeletonHtml += `
        <div class="glass-card skeleton" style="padding: 16px; margin-bottom: 12px;">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width: 70%;"></div>
        </div>
      `;
    }
  }
  
  const originalContent = container.innerHTML;
  container.innerHTML = skeletonHtml;
  
  return function hideSkeleton() {
    container.innerHTML = originalContent;
  };
}

// Auto hide skeleton after content loads
window.addEventListener('load', () => {
  document.querySelectorAll('.skeleton').forEach(el => {
    setTimeout(() => {
      if (el.classList.contains('skeleton')) {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
      }
    }, 800);
  });
});

// ========== LIQUID SWIPE (Nomor 6) ==========
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isSwiping = true;
  
  // Show swipe indicator
  const indicator = document.createElement('div');
  indicator.className = 'liquid-swipe-indicator';
  document.body.appendChild(indicator);
  setTimeout(() => indicator.style.opacity = '0.6', 10);
});

document.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  const deltaX = e.touches[0].clientX - touchStartX;
  const deltaY = e.touches[0].clientY - touchStartY;
  
  if (deltaX > 50 && Math.abs(deltaY) < 100) {
    // Swipe right detected - go back
    e.preventDefault();
    const indicator = document.querySelector('.liquid-swipe-indicator');
    if (indicator) indicator.style.opacity = '1';
    
    // Add animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('swipe-back-animation');
    }
    
    // Go back after animation
    setTimeout(() => {
      window.history.back();
    }, 200);
    
    isSwiping = false;
  }
});

document.addEventListener('touchend', () => {
  const indicator = document.querySelector('.liquid-swipe-indicator');
  if (indicator) indicator.remove();
  isSwiping = false;
  
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    setTimeout(() => mainContent.classList.remove('swipe-back-animation'), 300);
  }
});

// ========== BMR CALCULATOR (Nomor 3) ==========
let selectedActivity = 'sedentary';

function calculateBMR() {
  const gender = document.getElementById('bmrGender')?.value;
  const age = parseInt(document.getElementById('bmrAge')?.value);
  const weight = parseFloat(document.getElementById('bmrWeight')?.value);
  const height = parseFloat(document.getElementById('bmrHeight')?.value);
  
  if (!gender || !age || !weight || !height) {
    showToast('❌ Isi semua data terlebih dahulu!');
    return;
  }
  
  let bmr;
  if (gender === 'Laki-laki') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Activity multipliers
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  const dailyCalories = bmr * multipliers[selectedActivity];
  
  const resultDiv = document.getElementById('bmrResult');
  if (resultDiv) {
    resultDiv.innerHTML = `
      <div class="bmr-result">
        <div style="font-size: 14px; opacity: 0.7;">Kebutuhan Kalori Harian</div>
        <div class="bmr-number">${Math.round(dailyCalories)}</div>
        <div style="font-size: 12px; margin-top: 8px;">kalori / hari</div>
        <div style="margin-top: 16px; font-size: 13px;">
          BMR Anda: <strong>${Math.round(bmr)} kalori</strong><br>
          (Kalori minimal untuk bertahan hidup)
        </div>
      </div>
    `;
  }
}

function setActivity(activity, element) {
  selectedActivity = activity;
  document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  calculateBMR();
}

// ========== RESET DATA WITH PIN (Nomor 17) ==========
let pinInput = '';
let expectedPin = '1234'; // Default PIN, bisa diubah user

function openResetModal() {
  pinInput = '';
  const modalContent = `
    <div style="text-align: center;">
      <p style="margin-bottom: 16px;">Masukkan PIN untuk menghapus semua data</p>
      <div class="pin-dots" id="pinDots">
        <div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div>
      </div>
      <div class="pin-keyboard" id="pinKeyboard">
        <div class="pin-key" data-num="1">1</div><div class="pin-key" data-num="2">2</div><div class="pin-key" data-num="3">3</div>
        <div class="pin-key" data-num="4">4</div><div class="pin-key" data-num="5">5</div><div class="pin-key" data-num="6">6</div>
        <div class="pin-key" data-num="7">7</div><div class="pin-key" data-num="8">8</div><div class="pin-key" data-num="9">9</div>
        <div class="pin-key" data-num="clear">⌫</div><div class="pin-key" data-num="0">0</div><div class="pin-key" data-num="ok">✓</div>
      </div>
      <p style="margin-top: 16px; font-size: 12px; opacity: 0.6;">PIN default: 1234</p>
    </div>
  `;
  
  showBottomSheet('Verifikasi PIN', modalContent);
  
  setTimeout(() => {
    document.querySelectorAll('.pin-key').forEach(key => {
      key.addEventListener('click', (e) => {
        const num = key.dataset.num;
        if (num === 'clear') {
          pinInput = pinInput.slice(0, -1);
        } else if (num === 'ok') {
          if (pinInput === expectedPin) {
            closeBottomSheet();
            if (confirm('⚠️ PERINGATAN! Semua data riwayat BMI akan dihapus permanen. Lanjutkan?')) {
              localStorage.removeItem('bmi');
              localStorage.removeItem('users');
              localStorage.removeItem('currentUser');
              if (document.getElementById('listRiwayat')) tampilkanRiwayat();
              showToast('✅ Semua data berhasil dihapus!');
              setTimeout(() => window.location.reload(), 1500);
            }
          } else {
            showToast('❌ PIN salah!');
            pinInput = '';
          }
        } else {
          if (pinInput.length < 4) pinInput += num;
        }
        updatePinDots();
      });
    });
  }, 100);
}

function updatePinDots() {
  const dots = document.querySelectorAll('.pin-dot');
  dots.forEach((dot, i) => {
    if (i < pinInput.length) dot.classList.add('filled');
    else dot.classList.remove('filled');
  });
}

// ========== CHANGE PIN SETTINGS ==========
function openChangePinModal() {
  let oldPin = '';
  let newPin = '';
  let step = 'old';
  
  const modalContent = `
    <div style="text-align: center;">
      <p id="pinStepText">Masukkan PIN lama</p>
      <div class="pin-dots" id="changePinDots">
        <div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div><div class="pin-dot"></div>
      </div>
      <div class="pin-keyboard" id="changePinKeyboard">
        <div class="pin-key" data-num="1">1</div><div class="pin-key" data-num="2">2</div><div class="pin-key" data-num="3">3</div>
        <div class="pin-key" data-num="4">4</div><div class="pin-key" data-num="5">5</div><div class="pin-key" data-num="6">6</div>
        <div class="pin-key" data-num="7">7</div><div class="pin-key" data-num="8">8</div><div class="pin-key" data-num="9">9</div>
        <div class="pin-key" data-num="clear">⌫</div><div class="pin-key" data-num="0">0</div><div class="pin-key" data-num="ok">✓</div>
      </div>
    </div>
  `;
  
  showBottomSheet('Ubah PIN', modalContent);
  
  function updateChangePinDots(value) {
    const dots = document.querySelectorAll('#changePinDots .pin-dot');
    dots.forEach((dot, i) => {
      if (i < value.length) dot.classList.add('filled');
      else dot.classList.remove('filled');
    });
  }
  
  setTimeout(() => {
    document.querySelectorAll('#changePinKeyboard .pin-key').forEach(key => {
      key.addEventListener('click', (e) => {
        const num = key.dataset.num;
        if (num === 'clear') {
          if (step === 'old') oldPin = oldPin.slice(0, -1);
          else newPin = newPin.slice(0, -1);
          updateChangePinDots(step === 'old' ? oldPin : newPin);
        } else if (num === 'ok') {
          if (step === 'old') {
            if (oldPin === expectedPin) {
              step = 'new';
              oldPin = '';
              document.getElementById('pinStepText').textContent = 'Masukkan PIN baru';
              updateChangePinDots('');
            } else {
              showToast('❌ PIN lama salah!');
            }
          } else {
            if (newPin.length === 4) {
              expectedPin = newPin;
              localStorage.setItem('resetPin', expectedPin);
              showToast('✅ PIN berhasil diubah!');
              closeBottomSheet();
            } else {
              showToast('❌ PIN harus 4 digit!');
            }
          }
        } else {
          if (step === 'old' && oldPin.length < 4) oldPin += num;
          else if (step === 'new' && newPin.length < 4) newPin += num;
          updateChangePinDots(step === 'old' ? oldPin : newPin);
        }
      });
    });
  }, 100);
}

// Load saved PIN from localStorage
const savedPin = localStorage.getItem('resetPin');
if (savedPin) expectedPin = savedPin;

// ========== THEME SELECTOR UI ==========
function updateThemeSelectorUI() {
  const options = document.querySelectorAll('.theme-option');
  options.forEach(opt => {
    if (opt.dataset.theme === themeMode) opt.classList.add('active');
    else opt.classList.remove('active');
  });
}

function setThemeMode(mode) {
  themeMode = mode;
  localStorage.setItem('themeMode', mode);
  applyThemeBasedOnMode();
  updateThemeSelectorUI();
  showToast(`Mode tema: ${mode === 'auto' ? 'Otomatis' : mode === 'dark' ? 'Gelap' : 'Terang'}`);
}

// Update applyTheme function to use themeMode
const originalApplyTheme = applyTheme;
window.applyTheme = applyThemeBasedOnMode;

// ========== SKELETON LOADER FOR RIWAYAT ==========
if (document.getElementById('listRiwayat')) {
  const hideSkeleton = showSkeletonLoader('listRiwayat', 'list', 3);
  setTimeout(() => {
    if (typeof tampilkanRiwayat === 'function') tampilkanRiwayat();
    if (hideSkeleton) hideSkeleton();
  }, 500);
}
