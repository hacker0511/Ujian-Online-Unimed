// 1. DATA SOAL UJIAN (Menggunakan karakter asli agar tampil benar di browser)
const questions = [
    { q: "HTML digunakan untuk...", a: "Membuat struktur halaman web", options: ["Mengatur logika program", "Mendesain database", "Membuat struktur halaman web", "Mengatur server", "Mengelola jaringan"] },
    { q: "Tag HTML untuk membuat paragraf adalah...", a: "<p>", options: ["<h1>", "<p>", "<div>", "<span>", "<br>"] },
    { q: "CSS digunakan untuk...", a: "Mengatur tampilan web", options: ["Membuat struktur web", "Menyimpan data", "Mengatur tampilan web", "Mengelola server", "Menjalankan logika"] },
    { q: "Properti CSS untuk mengubah warna teks adalah...", a: "color", options: ["background-color", "text-style", "color", "font-weight", "text-align"] },
    { q: "JavaScript digunakan untuk...", a: "Menambah interaksi pada web", options: ["Mengatur tampilan saja", "Membuat database", "Menambah interaksi pada web", "Mendesain UI", "Mengatur server saja"] },
    { q: "Tag untuk membuat link adalah...", a: "<a>", options: ["<link>", "<a>", "<href>", "<url>", "<nav>"] },
    { q: "Atribut untuk menentukan tujuan link adalah...", a: "href", options: ["src", "alt", "href", "link", "action"] },
    { q: "Tag untuk menampilkan gambar adalah...", a: "<img>", options: ["<image>", "<img>", "<pic>", "<src>", "<figure>"] },
    { q: "Atribut src digunakan untuk...", a: "Menentukan sumber file", options: ["Mengatur warna", "Menentukan sumber file", "Menentukan ukuran", "Mengatur teks", "Menyimpan data"] },
    { q: "Properti CSS untuk mengatur ukuran font adalah...", a: "font-size", options: ["font-style", "font-size", "text-size", "size", "font-weight"] },
    { q: "Fungsi alert() di JavaScript digunakan untuk...", a: "Menampilkan pesan popup", options: ["Menyimpan data", "Menampilkan pesan popup", "Menghapus data", "Mengatur warna", "Membuat form"] },
    { q: "Penulisan komentar di HTML adalah...", a: "<!-- komentar -->", options: ["// komentar", "/* komentar */", "<!-- komentar -->", "# komentar", "** komentar **"] },
    { q: "Penulisan komentar di JavaScript adalah...", a: "// komentar", options: ["<!-- -->", "// komentar", "** komentar **", "## komentar", "%% komentar"] },
    { q: "Tag untuk membuat form adalah...", a: "<form>", options: ["<input>", "<form>", "<label>", "<button>", "<submit>"] },
    { q: "Tag input untuk teks adalah...", a: '<input type="text">', options: ['<input type="text">', "<text>", "<textbox>", '<input type="string">', "<input text>"] },
    { q: "CSS dapat ditulis di dalam file dengan ekstensi...", a: ".css", options: [".html", ".js", ".css", ".php", ".txt"] },
    { q: "JavaScript biasanya ditulis dalam file berekstensi...", a: ".js", options: [".java", ".script", ".js", ".json", ".tsv"] },
    { q: "Tag <br> berfungsi untuk...", a: "Pindah baris", options: ["Membuat paragraf", "Membuat garis", "Pindah baris", "Membuat spasi", "Membuat tabel"] },
    { q: "Properti CSS untuk mengatur posisi teks adalah...", a: "text-align", options: ["text-style", "text-align", "align-text", "position-text", "font-align"] },
    { q: "Event onclick pada JavaScript terjadi saat...", a: "Tombol diklik", options: ["Halaman dimuat", "Mouse bergerak", "Tombol diklik", "Keyboard ditekan", "Halaman ditutup"] }
];

// 2. DATA LOGIN ADMIN
const adminData = { 
    "AULIA YOLANDA RITONGA": "5241151017", 
    "AZZAHRA KHAIRIAH": "5243351030", 
    "GRACE PATRESYAH TAMBUNAN": "5241151016", 
    "HAFIZAH": "5243351016" 
};

// 3. VARIABEL GLOBAL
let currentIdx = 0;
let userAnswers = {};
let timer;
let timeLeft = 20 * 60; 
let currentUser = "";
let userClass = "";
let isExamFinished = false;

// 4. FUNGSI UTAMA
function startExam() {
    currentUser = document.getElementById('username').value.trim().toUpperCase();
    userClass = document.getElementById('user-class').value.trim();
    
    if (!currentUser || !userClass) {
        return alert("Silakan lengkapi Nama Lengkap dan Kelas!");
    }
    
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('exam-section').classList.remove('hidden');
    document.getElementById('display-name').innerText = `Peserta: ${currentUser} (${userClass})`;
    
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const q = questions[currentIdx];
    const container = document.getElementById('question-container');
    
    // Gunakan fungsi helper untuk encode karakter HTML agar tag muncul sebagai teks, bukan elemen
    const escapeHTML = (str) => str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

    container.innerHTML = `
        <div class="question-box">
            <span class="question-number">SOAL ${currentIdx + 1} DARI ${questions.length}</span>
            <p class="main-question">${escapeHTML(q.q)}</p>
            <div class="option-list">
                ${q.options.map((opt, index) => `
                    <label class="option-item">
                        <input type="radio" name="answer" value="${escapeHTML(opt)}" 
                        ${userAnswers[currentIdx] === opt ? 'checked' : ''} 
                        onchange="saveAnswer('${escapeHTML(opt)}')">
                        <span>${escapeHTML(opt)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        <div class="navigation-buttons">
            <button class="btn-nav" onclick="changeQuestion(-1)" ${currentIdx === 0 ? 'disabled' : ''}>
                 Kembali
            </button>
            ${currentIdx === questions.length - 1 
                ? `<button class="btn-primary" onclick="submitExam()">Kirim Jawaban</button>` 
                : `<button class="btn-nav" onclick="changeQuestion(1)">Lanjut</button>`}
        </div>`;
}

function saveAnswer(val) {
    userAnswers[currentIdx] = val;
}

function changeQuestion(step) {
    currentIdx += step;
    renderQuestion();
}

// 5. SISTEM TIMER & KEAMANAN
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            forceSubmitExam("Waktu Habis");
        } else {
            timeLeft--;
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            document.getElementById('timer').innerHTML = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }, 1000);
}

// Anti-Curang yang diperbaiki
document.addEventListener("visibilitychange", () => {
    const examActive = !document.getElementById('exam-section').classList.contains('hidden');
    if (document.visibilityState === 'hidden' && examActive && !isExamFinished) {
        forceSubmitExam("Pelanggaran: Meninggalkan Halaman");
    }
});

function submitExam() {
    if (confirm("Apakah Anda yakin ingin mengirim semua jawaban?")) {
        processResults("Selesai");
    }
}

function forceSubmitExam(reason) {
    if (isExamFinished) return;
    clearInterval(timer);
    alert(`Sistem: ${reason}. Jawaban Anda dikirim otomatis.`);
    processResults(reason);
}

// 6. PENGOLAHAN NILAI
function processResults(status) {
    isExamFinished = true;
    clearInterval(timer);
    let correctCount = 0;
    
    questions.forEach((q, i) => {
        if (userAnswers[i] === q.a) correctCount++;
    });

    const finalScore = (correctCount / questions.length) * 100;
    
    document.getElementById('exam-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('score-summary').innerHTML = `
        <h1 style="font-size: 48px;">${finalScore.toFixed(0)}</h1>
        <p>Nama: <strong>${currentUser}</strong></p>
        <p>Kelas: <strong>${userClass}</strong></p>
        <p>Status: <strong>${status}</strong></p>
        <p>Benar: ${correctCount} | Salah: ${questions.length - correctCount}</p>
    `;
    
    // Simpan ke LocalStorage
    let history = JSON.parse(localStorage.getItem('cbt_unimed_results')) || [];
    history.push({ 
        name: currentUser, 
        class: userClass, 
        score: finalScore.toFixed(0), 
        status: status, 
        date: new Date().toLocaleString('id-ID') 
    });
    localStorage.setItem('cbt_unimed_results', JSON.stringify(history));
}

// 7. FITUR ADMIN
function checkAdmin() {
    const name = document.getElementById('admin-name').value.trim().toUpperCase();
    const pass = document.getElementById('admin-pass').value.trim();

    if (adminData[name] === pass) {
        document.getElementById('admin-login-area').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        document.getElementById('logged-admin').innerText = name;
        loadLeaderboard();
    } else {
        alert("Akses Ditolak! Nama Guru atau NIM tidak sesuai.");
    }
}

function loadLeaderboard() {
    const history = JSON.parse(localStorage.getItem('cbt_unimed_results')) || [];
    const tbody = document.getElementById('leaderboard-body');
    
    history.sort((a, b) => b.score - a.score);

    tbody.innerHTML = history.length > 0 
        ? history.map((d, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${d.name}</td>
                <td>${d.class}</td>
                <td><strong>${d.score}</strong></td>
                <td>${d.status}</td>
            </tr>`).join('')
        : '<tr><td colspan="5" style="text-align:center;">Belum ada data.</td></tr>';
}

function clearAllData() {
    if (confirm("Hapus semua data nilai secara permanen?") && confirm("Apakah data sudah diunduh?")) {
        localStorage.removeItem('cbt_unimed_results');
        loadLeaderboard();
    }
}

function downloadData() {
    const history = JSON.parse(localStorage.getItem('cbt_unimed_results')) || [];
    if (history.length === 0) return alert("Data kosong!");

    let csv = "No,Nama,Kelas,Skor,Status,Waktu\n";
    history.forEach((d, i) => {
        csv += `${i + 1},${d.name},${d.class},${d.score},${d.status},${d.date}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Hasil_Ujian_${userClass}.csv`);
    link.click();
}

function resetApp() {
    location.reload();
}
