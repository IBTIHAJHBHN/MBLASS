// ==========================================
// 1. DATABASE & INITIALIZATION
// ==========================================

// Data Anggota dengan PIN masing-masing
const mData = [
    { name: "Ricky", bio: "31 juli 2006 - MAGELANG", role: "Editor", photo: "ricky.JPG", pw: "1231" },
    { name: "Faya", bio: "22 oktober 2006 - TIDAR", role: "Sekre", photo: "faya.JPEG", pw: "1232" },
    { name: "Ibti", bio: "04 desember 2006 - JAKARTA", role: "Web", photo: "ibti.JPG", pw: "1233" },
    { name: "Salsa", bio: "29 desember 2006 - PAKIS", role: "Wapres", photo: "salsa.JPG", pw: "1234" },
    { name: "Arsa", bio: "20 januari 2007 - Semarang", role: "Editor", photo: "arsa.JPG", pw: "1235"},
    { name: "Bari", bio: "07 februari 2007 - JAMBI", role: "Korlap", photo: "bari.JPG", pw: "1236"},
    { name: "Selsya", bio: "05 maret 2007 - TRENGGALEK", role: "Bendahara", photo: "selsya.JPG", pw: "1237"},
    { name: "Amer", bio: "24 mei 2007 - JOMBANG", role: "Jarkoman", photo: "amer.JPG", pw: "1238" },
    { name: "Rasya", bio: "06 juni 2007 - TANGERANG", role: "Pres", photo: "rasya.JPEG", pw: "1239" },
    { name: "Tata", bio: "24 agustus 2007 - BLITAR", role: "Penari", photo: "tata.JPG", pw: "1240" },
    { name: "Sely", bio: "13 november 2007 - TANGERANG", role: "Bungsu", photo: "sely.JPEG", pw: "1241" }
];

// Database Tabungan (LocalStorage)
let dbSave = JSON.parse(localStorage.getItem('m11_data_save')) || [];

// Gallery Images
const galleryImages = [
    'image-MSEBELAS/A.jpeg', 'image-MSEBELAS/B.jpeg', 'image-MSEBELAS/C.jpeg', 'image-MSEBELAS/D.jpeg',
    'image-MSEBELAS/E.jpeg', 'image-MSEBELAS/F.jpeg', 'image-MSEBELAS/G.jpeg', 'image-MSEBELAS/H.jpeg'
];

// List Hari Penting (Gunakan format Tahun, Bulan (0-11), Tanggal)
const listHariPenting = [
    { name: "Acara Mama Salsa", date: new Date(2026, 3, 26) },
    { name: "Libur Semester", date: new Date(2026, 5, 20) },
    { name: "Anniversary M11", date: new Date(2026, 9, 18) },
    { name: "Ultah Ibti", date: new Date(2026, 0, 10) }
];

// ==========================================
// 2. CORE FUNCTIONS (Sesuai List Kamu)
// ==========================================

// --- Smooth Cursor ---
const cOuter = document.querySelector('.cursor-outer');
const cInner = document.querySelector('.cursor-inner');
document.addEventListener('mousemove', (e) => {
    cOuter.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    cInner.style.left = e.clientX + 'px';
    cInner.style.top = e.clientY + 'px';
});

// --- Digital Clock ---
function updateDashboard() {
    const now = new Date();
    document.getElementById('digital-clock').innerText = now.toLocaleTimeString('id-ID', { hour12: false });
    document.getElementById('current-date').innerText = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}
setInterval(updateDashboard, 1000);

// --- Reveal on Scroll Logic (EFEK KELUAR SMOOTH) ---
const revealElements = document.querySelectorAll('.section, .bento-item, .calendar-card, .events-card, .neon-table-container');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// --- Memory Gallery Orbital ---
let gIdx = 0;
function updateGallery() {
    const container = document.getElementById('gallery-container');
    if(!container) return;
    container.innerHTML = '';
    galleryImages.forEach((src, i) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        const offset = i - gIdx;
        const absOffset = Math.abs(offset);
        card.style.transform = `translateX(${offset * 80}px) translateZ(${-absOffset * 150}px) rotateY(${offset * -25}deg)`;
        card.style.zIndex = 10 - absOffset;
        card.style.opacity = absOffset > 2 ? 0 : 1 - (absOffset * 0.4);
        card.innerHTML = `<img src="${src}" onerror="this.src='https://via.placeholder.com/350x450?text=Check+Path+Folder'">`;
        container.appendChild(card);
    });
}
document.getElementById('nextGallery').onclick = () => { if(gIdx < galleryImages.length - 1) { gIdx++; updateGallery(); } };
document.getElementById('prevGallery').onclick = () => { if(gIdx > 0) { gIdx--; updateGallery(); } };

// --- Member System ---
const mContainer = document.getElementById('member-container');
if(mContainer){
    mData.forEach((m, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'member-card-wrapper';
        const photoPath = `image-MSEBELAS/${m.photo}`; 
        wrap.innerHTML = `
            <div class="card-content">
                <img src="${photoPath}" alt="${m.name}" onerror="this.src='https://via.placeholder.com/180?text=${m.name}'">
                <span class="role-tag">${m.role}</span>
                <h3>${m.name}</h3>
                <p>${m.bio}</p>
            </div>
        `;
        mContainer.appendChild(wrap);
    });
}

const memberObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('reveal'), (i % 3) * 100);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.member-card-wrapper').forEach(el => memberObs.observe(el));

// --- Calendar Init ---
function initCalendar() {
    const grid = document.getElementById('cal-grid');
    const display = document.getElementById('month-display');
    const now = new Date();
    if(!grid || !display) return;
    
    display.innerText = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
    grid.innerHTML = '';
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= lastDay; i++) {
        const d = document.createElement('div');
        d.className = `cal-day ${i === now.getDate() ? 'today' : ''}`;
        
        // Cek apakah ada event di listHariPenting untuk tanggal ini
        const adaEvent = listHariPenting.find(e => 
            e.date.getDate() === i && e.date.getMonth() === now.getMonth()
        );
        if(adaEvent) d.classList.add('event-mark');

        d.innerText = i;
        grid.appendChild(d);
    }
}

// ==========================================
// 3. SAVINGS SYSTEM & SECURITY
// ==========================================

function inputTabunganIndividu() {
    const namaInput = document.getElementById('input-nama').value.trim();
    const pwInput = document.getElementById('input-password').value.trim();
    const nominal = parseInt(document.getElementById('input-nominal').value);
    
    const user = mData.find(m => m.name.toLowerCase() === namaInput.toLowerCase());

    if (!user) return alert("Nama tidak terdaftar!");

    // Security Check: Password
    if (user.pw !== pwInput) {
        showDinoScreen();
        return;
    }

    if (isNaN(nominal)) return alert("Isi nominal tabungan!");

    const saldoSblm = dbSave.filter(it => it.nama.toLowerCase() === namaInput.toLowerCase())
                           .reduce((sum, it) => sum + it.nominal, 0);
    
    dbSave.push({
        nama: namaInput,
        tanggal: new Date().toLocaleDateString('id-ID'),
        nominal: nominal,
        total: saldoSblm + nominal
    });
    
    localStorage.setItem('m11_data_save', JSON.stringify(dbSave));
    renderSavings();   
    
    document.getElementById('input-nominal').value = '';
    document.getElementById('input-password').value = '';
    alert("Tabungan Berhasil Diinput!");
}

function showDinoScreen() {
    const overlay = document.getElementById('dino-overlay');
    if(overlay){
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.getElementById('input-password').value = '';
        }, 10000); // 10 Detik
    }
}

function renderSavings() {
    const body = document.getElementById('savings-body');
    if(!body) return;
    body.innerHTML = dbSave.slice().reverse().map(it => `
        <tr>
            <td style="color:var(--accent); font-weight:bold">${it.nama.toUpperCase()}</td>
            <td>${it.tanggal}</td>
            <td>Rp ${it.nominal.toLocaleString()}</td>
            <td style="color:var(--neon-green)">Rp ${it.total.toLocaleString()}</td>
        </tr>
    `).join('');
}

function resetTabungan() {
    if(confirm("Hapus semua riwayat tabungan?")) {
        dbSave = [];
        localStorage.removeItem('m11_data_save');
        renderSavings();
    }
}

// ==========================================
// 4. COUNTDOWN SYSTEM
// ==========================================

function runCountdown() {
    const now = new Date().getTime();
    // Cari event terdekat dari listHariPenting
    const upcoming = listHariPenting
        .filter(e => e.date.getTime() > now)
        .sort((a,b) => a.date.getTime() - b.date.getTime())[0];

    const timerEl = document.getElementById("countdown-timer");
    const nameEl = document.getElementById("next-event-name");

    if (upcoming && timerEl && nameEl) {
        const dist = upcoming.date.getTime() - now;
        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        
        timerEl.innerText = `${d}d ${h}h ${m}m ${s}s`;
        nameEl.innerText = upcoming.name;
    }
}

// ==========================================
// 5. BOOTSTRAP INIT
// ==========================================
window.onload = () => {
    updateGallery();
    initCalendar();
    renderSavings();
    setInterval(runCountdown, 1000);
    runCountdown();
};