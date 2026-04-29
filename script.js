// 1. DATA SOAL UJIAN (20 SOAL)
const questions = [
    { q: "HTML digunakan untuk...", a: "Membuat struktur halaman web", options: ["Mengatur logika program", "Mendesain database", "Membuat struktur halaman web", "Mengatur server", "Mengelola jaringan"] },
    { q: "Tag HTML untuk membuat paragraf adalah...", a: "&lt;p&gt;", options: ["&lt;h1&gt;", "&lt;p&gt;", "&lt;div&gt;", "&lt;span&gt;", "&lt;br&gt;"] },
    { q: "CSS digunakan untuk...", a: "Mengatur tampilan web", options: ["Membuat struktur web", "Menyimpan data", "Mengatur tampilan web", "Mengelola server", "Menjalankan logika"] },
    { q: "Properti CSS untuk mengubah warna teks adalah...", a: "color", options: ["background-color", "text-style", "color", "font-weight", "text-align"] },
    { q: "JavaScript digunakan untuk...", a: "Menambah interaksi pada web", options: ["Mengatur tampilan saja", "Membuat database", "Menambah interaksi pada web", "Mendesain UI", "Mengatur server saja"] },
    { q: "Tag untuk membuat link adalah...", a: "&lt;a&gt;", options: ["&lt;link&gt;", "&lt;a&gt;", "&lt;href&gt;", "&lt;url&gt;", "&lt;nav&gt;"] },
    { q: "Atribut untuk menentukan tujuan link adalah...", a: "href", options: ["src", "alt", "href", "link", "action"] },
    { q: "Tag untuk menampilkan gambar adalah...", a: "&lt;img&gt;", options: ["&lt;image&gt;", "&lt;img&gt;", "&lt;pic&gt;", "&lt;src&gt;", "&lt;figure&gt;"] },
    { q: "Atribut src digunakan untuk...", a: "Menentukan sumber file", options: ["Mengatur warna", "Menentukan sumber file", "Menentukan ukuran", "Mengatur teks", "Menyimpan data"] },
    { q: "Properti CSS untuk mengatur ukuran font adalah...", a: "font-size", options: ["font-style", "font-size", "text-size", "size", "font-weight"] },
    { q: "Fungsi alert() di JavaScript digunakan untuk...", a: "Menampilkan pesan popup", options: ["Menyimpan data", "Menampilkan pesan popup", "Menghapus data", "Mengatur warna", "Membuat form"] },
    { q: "Penulisan komentar di HTML adalah...", a: "&lt;!-- komentar --&gt;", options: ["// komentar", "/* komentar */", "&lt;!-- komentar --&gt;", "# komentar", "** komentar **"] },
    { q: "Penulisan komentar di JavaScript adalah...", a: "// komentar", options: ["&lt;!-- --&gt;", "// komentar", "** komentar **", "## komentar", "%% komentar"] },
    { q: "Tag untuk membuat form adalah...", a: "&lt;form&gt;", options: ["&lt;input&gt;", "&lt;form&gt;", "&lt;label&gt;", "&lt;button&gt;", "&lt;submit&gt;"] },
    { q: "Tag input untuk teks adalah...", a: "&lt;input type=\"text\"&gt;", options: ["&lt;input type=\"text\"&gt;", "&lt;text&gt;", "&lt;textbox&gt;", "&lt;input type=\"string\"&gt;", "&lt;input text&gt;"] },
    { q: "CSS dapat ditulis di dalam file dengan ekstensi...", a: ".css", options: [".html", ".js", ".css", ".php", ".txt"] },
    { q: "JavaScript biasanya ditulis dalam file berekstensi...", a: ".js", options: [".java", ".script", ".js", ".json", ".tsv"] },
    { q: "Tag &lt;br&gt; berfungsi untuk...", a: "Pindah baris", options: ["Membuat paragraf", "Membuat garis", "Pindah baris", "Membuat spasi", "Membuat tabel"] },
    { q: "Properti CSS untuk mengatur posisi teks adalah...", a: "text-align", options: ["text-style", "text-align", "align-text", "position-text", "font-align"] },
    { q: "Event onclick pada JavaScript terjadi saat...", a: "Tombol diklik", options: ["Halaman dimuat", "Mouse bergerak", "Tombol diklik", "Keyboard ditekan", "Halaman ditutup"] }
];

// 2. DATA LOGIN ADMIN (GURU)
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
let timeLeft = 20 * 60; // 20 Menit
let currentUser = "";
let userClass = "";

// 4. FUNGSI UTAMA UJIAN
function startExam() {
    currentUser = document.getElementById('username').value.trim();
    userClass = document.getElementById('user-class').value.trim();
    
    if (!currentUser || !userClass) {
        return alert("Silakan lengkapi Nama Lengkap dan Kelas terlebih dahulu!");
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
    
    container.innerHTML = `
        <div class="question-box">
            <span class="question-number">SOAL ${currentIdx + 1} DARI ${questions.length}</span>
            <p class="main-question">${q.q}</p>
            <div class="option-list">
                ${q.options.map(opt => `
                    <label class="option-item">
                        <input type="radio" name="answer" value="${opt}" 
                        ${userAnswers[currentIdx] === opt ? 'checked' : ''} 
                        onchange="saveAnswer('${opt}')">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
        <div class="navigation-buttons">
            <button class="btn-nav" onclick="changeQuestion(-1)" ${currentIdx === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i> Kembali
            </button>
            
            ${currentIdx === questions.length - 1 
                ? `<button class="btn-primary btn-submit-exam" onclick="submitExam()">Kirim Jawaban <i class="fa-solid fa-paper-plane"></i></button>` 
                : `<button class="btn-nav" onclick="changeQuestion(1)">Lanjut <i class="fa-solid fa-chevron-right"></i></button>`}
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
            document.getElementById('timer').innerHTML = `<i class="fa-regular fa-clock"></i> ${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }, 1000);
}

// Anti-Curang: Deteksi jika siswa pindah tab browser
document.addEventListener("visibilitychange", () => {
    const examActive = !document.getElementById('exam-section').classList.contains('hidden');
    if (document.visibilityState === 'hidden' && examActive) {
        forceSubmitExam("Deteksi Keluar Halaman");
    }
});

function submitExam() {
    if (confirm("Apakah Anda yakin ingin mengirim semua jawaban sekarang?")) {
        processResults("Selesai Normal");
    }
}

function forceSubmitExam(reason) {
    clearInterval(timer);
    alert(`Ujian dihentikan dan dikirim otomatis: ${reason}`);
    processResults(reason);
}

// 6. PENGOLAHAN NILAI
function processResults(status) {
    clearInterval(timer);
    let correctCount = 0;
    
    questions.forEach((q, i) => {
        if (userAnswers[i] === q.a) correctCount++;
    });

    const finalScore = (correctCount / questions.length) * 100;
    
    // Tampilkan hasil ke siswa
    document.getElementById('exam-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('score-summary').innerHTML = `
        <h1 style="font-size: 64px; color: #2c5282;">${finalScore}</h1>
        <p>Nama: <strong>${currentUser}</strong></p>
        <p>Kelas: <strong>${userClass}</strong></p>
        <p>Status: <span style="color: ${status === 'Selesai Normal' ? 'green' : 'red'}">${status}</span></p>
        <p style="margin-top:10px;">Benar: ${correctCount} | Salah: ${questions.length - correctCount}</p>
    `;
    
    // Simpan ke LocalStorage untuk rekap Guru
    let history = JSON.parse(localStorage.getItem('cbt_unimed_results')) || [];
    history.push({ 
        name: currentUser, 
        class: userClass, 
        score: finalScore, 
        status: status, 
        date: new Date().toLocaleString() 
    });
    localStorage.setItem('cbt_unimed_results', JSON.stringify(history));
}

// 7. FITUR ADMIN (GURU)
function checkAdmin() {
    const name = document.getElementById('admin-name').value;
    const pass = document.getElementById('admin-pass').value;

    if (adminData[name] === pass) {
        document.getElementById('admin-login-area').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        document.getElementById('logged-admin').innerText = name;
        loadLeaderboard();
    } else {
        alert("Akses Ditolak! Nama Guru atau NIM salah.");
    }
}

function loadLeaderboard() {
    const history = JSON.parse(localStorage.getItem('cbt_unimed_results')) || [];
    const tbody = document.getElementById('leaderboard-body');
    
    // Urutkan nilai tertinggi di atas
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
        : '<tr><td colspan="5" style="text-align:center;">Belum ada data nilai.</td></tr>';
}

function clearAllData() {
    const firstConfirm = confirm("PERINGATAN: Semua data nilai akan dihapus secara permanen!");
    if (firstConfirm) {
        const secondConfirm = confirm("Apakah Anda sudah mengunduh file CSV? Data yang dihapus tidak bisa dikembalikan.");
        if (secondConfirm) {
            localStorage.removeItem('cbt_unimed_results');
            loadLeaderboard();
            alert("Sistem: Semua data telah dibersihkan.");
        }
    }
}

function downloadData() {
    const history = JSON.parse(localStorage.getItem('cbt_unimed_results')) || [];
    if (history.length === 0) return alert("Tidak ada data untuk diunduh!");

    let csvContent = "No,Nama,Kelas,Skor,Status,Waktu\n";
    history.forEach((d, i) => {
        csvContent += `${i + 1},${d.name},${d.class},${d.score},${d.status},${d.date}\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_CBT_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetApp() {
    if (confirm("Kembali ke halaman login utama?")) {
        location.reload();
    }
}