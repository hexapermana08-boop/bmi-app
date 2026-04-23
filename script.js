// ==================== DARK MODE ====================
const toggleSidebarBtn = document.getElementById("toggleModeSidebar");

function applyTheme() {
  if (localStorage.getItem("mode") === "dark") {
    document.body.classList.add("dark");
    if (toggleSidebarBtn) toggleSidebarBtn.innerText = "☀️";
  } else {
    document.body.classList.remove("dark");
    if (toggleSidebarBtn) toggleSidebarBtn.innerText = "🌙";
  }
}
applyTheme();

if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      toggleSidebarBtn.innerText = "☀️";
      localStorage.setItem("mode", "dark");
    } else {
      toggleSidebarBtn.innerText = "🌙";
      localStorage.setItem("mode", "light");
    }
    toggleSidebarBtn.style.transform = "scale(1.1)";
    setTimeout(() => { toggleSidebarBtn.style.transform = ""; }, 150);
  });
}

// ==================== BACKGROUND PARTICLES ====================
function createParticles() {
  const particleDiv = document.createElement('div');
  particleDiv.className = 'particle-bg';
  document.body.appendChild(particleDiv);
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 8 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = Math.random() * 15 + 8 + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particleDiv.appendChild(particle);
  }
  
  const shapes = ['#3b82f6', '#f472b6', '#60a5fa', '#fbcfe8'];
  for (let i = 0; i < 6; i++) {
    const shape = document.createElement('div');
    shape.className = 'floating-shape';
    shape.style.width = Math.random() * 200 + 100 + 'px';
    shape.style.height = shape.style.width;
    shape.style.backgroundColor = shapes[Math.floor(Math.random() * shapes.length)];
    shape.style.left = Math.random() * 100 + '%';
    shape.style.top = Math.random() * 100 + '%';
    shape.style.opacity = '0.08';
    shape.style.animationDuration = Math.random() * 15 + 15 + 's';
    document.body.appendChild(shape);
  }
}
createParticles();

// ==================== SCROLL REVEAL ====================
function handleScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const revealTop = el.getBoundingClientRect().top;
    const revealPoint = 150;
    if (revealTop < windowHeight - revealPoint) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', handleScrollReveal);
document.querySelectorAll('.info-card, .bmi-categories li, .form-card, .penjelasan-bmi').forEach(el => {
  el.classList.add('reveal');
});
setTimeout(handleScrollReveal, 100);

// ==================== RIPPLE EFFECT ====================
function addRippleEffect(button) {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}
document.querySelectorAll('.btn-hitung, .btn-simpan, .btn-hapus-semua, #toggleModeSidebar').forEach(addRippleEffect);

// ==================== PARTICLE BURST ====================
function particleBurst(x, y) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle-burst';
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.background = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5 + 2;
    let posX = 0, posY = 0;
    let opacity = 1;
    
    function animateParticle() {
      posX += Math.cos(angle) * velocity;
      posY += Math.sin(angle) * velocity;
      opacity -= 0.02;
      particle.style.transform = `translate(${posX}px, ${posY}px)`;
      particle.style.opacity = opacity;
      if (opacity > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    }
    animateParticle();
  }
}

// ==================== CONFETTI ====================
function showConfetti() {
  const colors = ['#3b82f6', '#f472b6', '#60a5fa', '#ec4899', '#fbcfe8'];
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.opacity = '0.8';
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 3 + 2;
    const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
    let posX = 0, posY = 0;
    let opacity = 1;
    const startTime = performance.now();
    
    function animateConfetti(now) {
      const elapsed = (now - startTime) / 1000;
      if (elapsed < duration) {
        posX += Math.cos(angle) * 3;
        posY += 5 + Math.sin(angle) * 2;
        opacity = 1 - (elapsed / duration);
        confetti.style.transform = `translate(${posX}px, ${posY}px) rotate(${elapsed * 360}deg)`;
        confetti.style.opacity = opacity;
        requestAnimationFrame(animateConfetti);
      } else {
        confetti.remove();
      }
    }
    requestAnimationFrame(animateConfetti);
  }
}

// ==================== CELEBRATION GLOW ====================
function celebrationGlow(element) {
  element.classList.add('celebration-glow');
  setTimeout(() => element.classList.remove('celebration-glow'), 1000);
}

// ==================== COUNTING UP ====================
function animateNumber(element, target) {
  let current = 0;
  const increment = target / 50;
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toFixed(2);
      clearInterval(interval);
    } else {
      element.textContent = current.toFixed(2);
    }
  }, 16);
}

// ==================== REKOMENDASI ====================
function getRekomendasi(kategori) {
  switch(kategori) {
    case "Kurus": return "🍗 Perbanyak protein (telur, ikan, ayam), konsumsi karbohidrat kompleks, olahraga ringan untuk menambah massa otot.";
    case "Normal": return "✅ Pertahankan! Jaga pola makan seimbang, rutin olahraga 30 menit/hari, tidur cukup 7-8 jam.";
    case "Gemuk": return "🏃 Kurangi gula & lemak jenuh, perbanyak sayur dan buah, jalan kaki 10.000 langkah/hari.";
    case "Obesitas": return "⚕️ Konsultasi dengan dokter gizi, kurangi porsi makan, perbanyak aktivitas fisik, hindari makanan olahan.";
    default: return "Jaga kesehatan dengan pola hidup seimbang.";
  }
}

let lastResult = { bmi: null, nama: "", kategori: "", gender: "", umur: "", tinggi: null, berat: null, rekomendasi: "" };

// ==================== HITUNG BMI ====================
function hitungBMI() {
  const nama = document.getElementById("nama")?.value.trim();
  const tinggiCm = parseFloat(document.getElementById("tinggi")?.value);
  const berat = parseFloat(document.getElementById("berat")?.value);
  const umur = document.getElementById("umur")?.value;
  const gender = document.getElementById("gender")?.value;
  
  if (!nama) return alert("❌ Masukkan nama!");
  if (!tinggiCm || tinggiCm < 50) return alert("❌ Tinggi valid 50-250 cm");
  if (!berat || berat < 10) return alert("❌ Berat valid 10-300 kg");
  if (!umur || umur < 1) return alert("❌ Umur valid");
  if (!gender) return alert("❌ Pilih gender");
  
  const tinggiM = tinggiCm / 100;
  const bmiValue = berat / (tinggiM * tinggiM);
  let kategori = "", emoji = "", warna = "";
  if (bmiValue < 18.5) { kategori = "Kurus"; emoji = "💙"; warna = "#3b82f6"; }
  else if (bmiValue < 25) { kategori = "Normal"; emoji = "💚"; warna = "#10b981"; }
  else if (bmiValue < 30) { kategori = "Gemuk"; emoji = "🧡"; warna = "#f59e0b"; }
  else { kategori = "Obesitas"; emoji = "❤️"; warna = "#ef4444"; }
  
  const rekomendasi = getRekomendasi(kategori);
  lastResult = { nama, bmi: bmiValue.toFixed(2), kategori, gender, umur, tinggi: tinggiCm, berat, emoji, rekomendasi };
  
  const hasilDiv = document.getElementById("hasil");
  if (hasilDiv) {
    hasilDiv.style.display = "block";
    hasilDiv.innerHTML = `
      <div style="font-size: 2.5rem;">${emoji}</div>
      <div style="font-size: 1.1rem; margin-bottom: 8px;"><strong>${escapeHtml(nama)}</strong> (${gender}, ${umur} th)</div>
      <div>📏 ${tinggiCm} cm | ⚖️ ${berat} kg</div>
      <div>BMI: <span id="bmiValueDisplay" style="font-size: 32px; font-weight: bold; color: ${warna};">0</span></div>
      <div style="margin-top: 8px;">Kategori: <strong style="background:${warna}20; padding:4px 16px; border-radius:40px;">${kategori}</strong></div>
      <div class="rekomendasi-hasil"><strong>📝 Rekomendasi:</strong><br>${rekomendasi}</div>
    `;
    const bmiSpan = document.getElementById('bmiValueDisplay');
    animateNumber(bmiSpan, parseFloat(bmiValue.toFixed(2)));
    
    if (kategori === "Normal") {
      celebrationGlow(hasilDiv);
      showConfetti();
    }
  }
  
  const btnSimpan = document.getElementById("btnSimpan");
  if (btnSimpan) { btnSimpan.disabled = false; btnSimpan.style.opacity = "1"; }
}

// ==================== SIMPAN KE RIWAYAT ====================
function simpanKeRiwayat() {
  if (!lastResult.bmi) return alert("⚠️ Hitung BMI dulu!");
  
  let data = JSON.parse(localStorage.getItem("bmi")) || [];
  data.unshift({
    id: Date.now(), nama: lastResult.nama, bmi: lastResult.bmi, kategori: lastResult.kategori,
    gender: lastResult.gender, umur: lastResult.umur, tinggi: lastResult.tinggi, berat: lastResult.berat,
    rekomendasi: lastResult.rekomendasi, tanggal: new Date().toLocaleDateString('id-ID'),
    jam: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  });
  localStorage.setItem("bmi", JSON.stringify(data));
  
  const btn = document.getElementById("btnSimpan");
  const rect = btn.getBoundingClientRect();
  particleBurst(rect.left + rect.width/2, rect.top + rect.height/2);
  
  alert("✅ Data tersimpan!");
  if (btn) { btn.disabled = true; btn.style.opacity = "0.5"; }
  if (document.getElementById("listRiwayat")) {
    tampilkanRiwayat();
    updateChart();
  }
}

// ==================== CHART ====================
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
        label: 'BMI',
        data: bmiValues,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#f472b6',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10 } } }
      },
      scales: {
        y: { min: 10, max: 40, title: { display: true, text: 'BMI' } },
        x: { title: { display: true, text: 'Tanggal' } }
      }
    }
  });
}

// ==================== TAMPILKAN RIWAYAT ====================
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
    updateChart();
    return;
  }
  if(empty) empty.style.display = "none";
  list.innerHTML = "";
  
  data.forEach((item, idx) => {
    let warnaKategori = "";
    let bgKategori = "";
    if (item.kategori === "Kurus") { warnaKategori = "#3b82f6"; bgKategori = "#3b82f620"; }
    else if (item.kategori === "Normal") { warnaKategori = "#10b981"; bgKategori = "#10b98120"; }
    else if (item.kategori === "Gemuk") { warnaKategori = "#f59e0b"; bgKategori = "#f59e0b20"; }
    else { warnaKategori = "#ef4444"; bgKategori = "#ef444420"; }
    
    const emoji = item.kategori === "Kurus" ? "💙" : item.kategori === "Normal" ? "💚" : item.kategori === "Gemuk" ? "🧡" : "❤️";
    
    const li = document.createElement("li");
    li.style.animationDelay = `${idx * 0.05}s`;
    li.innerHTML = `
      <div class="riwayat-info">
        <div class="riwayat-header">
          <span class="riwayat-nama">${escapeHtml(item.nama)}</span>
          <span class="riwayat-tanggal">📅 ${item.tanggal || '-'} ${item.jam || ''}</span>
        </div>
        <div class="riwayat-stats">
          <span class="riwayat-bmi">${emoji} ${item.bmi}</span>
          <span class="riwayat-kategori" style="background: ${bgKategori}; color: ${warnaKategori};">${item.kategori}</span>
        </div>
        <div class="riwayat-detail">
          <span>👤 ${item.gender || '-'}</span>
          <span>🎂 ${item.umur || '-'} tahun</span>
          <span>📏 ${item.tinggi || '-'} cm</span>
          <span>⚖️ ${item.berat || '-'} kg</span>
        </div>
        <div class="riwayat-rekomendasi">
          💡 ${item.rekomendasi ? item.rekomendasi.substring(0, 100) + (item.rekomendasi.length > 100 ? '...' : '') : "Tersedia rekomendasi di detail"}
        </div>
      </div>
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
  return str.replace(/[&<>]/g, function(m){ return m==="&"?"&amp;":m==="<"?"&lt;":"&gt;";});
}

// Reset tombol simpan
function resetSimpanButton(){
  const btn = document.getElementById("btnSimpan");
  if(btn){ btn.disabled=true; btn.style.opacity="0.5"; }
  const hasil = document.getElementById("hasil");
  if(hasil) hasil.style.display = "none";
  lastResult.bmi = null;
}

["nama","umur","gender","tinggi","berat"].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener("input", resetSimpanButton);
});

// Page transition
document.body.classList.add('page-transition');
setTimeout(() => document.body.classList.remove('page-transition'), 500);

// Inisialisasi
if(document.getElementById("listRiwayat")) {
  tampilkanRiwayat();
}

// Tambahkan chart container
if(document.getElementById('listRiwayat') && !document.getElementById('chartContainer')) {
  const historyDiv = document.querySelector('.history-actions');
  const chartDiv = document.createElement('div');
  chartDiv.id = 'chartContainer';
  chartDiv.className = 'chart-container';
  chartDiv.innerHTML = '<canvas id="bmiChart"></canvas>';
  historyDiv?.insertAdjacentElement('afterend', chartDiv);
}

// Load Chart.js
if(typeof Chart === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  script.onload = () => updateChart();
  document.head.appendChild(script);
} else {
  updateChart();
}