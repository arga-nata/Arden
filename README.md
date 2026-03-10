<div align="center">

<h1>🛡️ ARDEN</h1>
<h3>Automated Record & Data Engine</h3>

<p>
<i>Sistem Manajemen Kehadiran Berbasis QR Code untuk Efisiensi & Keamanan Data Universitas</i>
</p>

<br>

<p>
<img src="https://img.shields.io/badge/Node.js-v24.14.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS"/>
<img src="https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="NextJS"/>
<img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
<img src="https://img.shields.io/badge/pnpm-10.32.0-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"/>
</p>

</div>

<hr>

<h2>📖 Deskripsi Proyek</h2>

<p>
<b>ARDEN</b> dirancang untuk mengotomatisasi pencatatan data kehadiran mahasiswi
(khususnya perizinan ibadah / exemption) menggunakan teknologi <b>QR Code</b>.
Proyek ini mengedepankan keamanan data menggunakan enkripsi modern serta
antarmuka yang imersif untuk memberikan pengalaman pengguna yang maksimal.
</p>

<hr>

<h2>🚀 Fitur Utama</h2>

<table>
<tr>

<td width="50%" valign="top">

<b>⚡ Real-Time QR Scanner</b>

<p>
Pemindaian QR Code secara cepat menggunakan
<code>html5-qrcode</code> sehingga proses
pencatatan kehadiran dapat dilakukan secara instan.
</p>

</td>

<td width="50%" valign="top">

<b>📊 Interactive Dashboard</b>

<p>
Dashboard statistik yang dinamis menggunakan
<b>Recharts</b> untuk menampilkan data kehadiran
dalam bentuk grafik interaktif.
</p>

</td>

</tr>

<tr>

<td width="50%" valign="top">

<b>📑 Automated Reporting</b>

<p>
Mendukung ekspor laporan ke format
<b>Excel (.xlsx)</b> dengan implementasi
keamanan tambahan terhadap celah
<i>Prototype Pollution</i>.
</p>

</td>

<td width="50%" valign="top">

<b>🔒 Enterprise Security</b>

<p>
Proteksi data menggunakan
<b>Bcrypt</b> untuk hashing serta
<b>JOSE</b> untuk implementasi
autentikasi berbasis token modern.
</p>

</td>

</tr>
</table>

<hr>

<h2>🛠️ Tech Stack & Versi</h2>

<p>
Proyek ini menggunakan kombinasi teknologi modern tahun 2026:
</p>

<table>
<tr>
<th align="left">Modul</th>
<th align="left">Teknologi</th>
<th align="left">Versi</th>
</tr>

<tr>
<td><b>Framework</b></td>
<td>Next.js (App Router)</td>
<td><code>16.1.6</code></td>
</tr>

<tr>
<td><b>Library UI</b></td>
<td>React</td>
<td><code>19.2.4</code></td>
</tr>

<tr>
<td><b>Database</b></td>
<td>Supabase JS</td>
<td><code>2.99.0</code></td>
</tr>

<tr>
<td><b>Styling</b></td>
<td>Tailwind CSS</td>
<td><code>4.2.1</code></td>
</tr>

<tr>
<td><b>Components</b></td>
<td>Radix UI</td>
<td>Latest</td>
</tr>

<tr>
<td><b>Animation</b></td>
<td>Three.js &amp; @tsparticles</td>
<td>Latest</td>
</tr>

</table>

<hr>

<h2>📋 Persyaratan Sistem</h2>

<p>
Untuk menjaga konsistensi lingkungan pengembangan tim,
pastikan sistem Anda memenuhi persyaratan berikut:
</p>

<ul>

<li>
<b>Node.js</b> : Minimal <code>v22.x</code>  
(disarankan <code>v24.14.0 LTS</code>)
</li>

<li>
<b>Package Manager</b> : <b>pnpm v10.x</b> (Wajib)
</li>

<li>
<b>Operating System</b> : Windows 11 Home (Direkomendasikan)
</li>

</ul>

<hr>

<h2>⚙️ Panduan Instalasi (Untuk Tim)</h2>

<h3>1. Persiapan Awal</h3>

<pre>
<code>
git clone https://github.com/username/arden.git
cd arden
pnpm install
</code>
</pre>

<hr>

<h2>⚠️ Catatan Penting Pengembang</h2>

<h3>🔐 Keamanan Library XLSX</h3>

<p>
Kami menggunakan versi <code>0.20.3</code> yang diunduh langsung dari
CDN resmi <b>SheetJS</b>. Hal ini dilakukan untuk menutup celah
keamanan kritis yang ditemukan pada distribusi npm tertentu.
</p>

<p>
<b>Jangan mengubah konfigurasi ini di package.json
kembali ke registry npm publik.</b>
</p>

<br>

<h3>💻 Efisiensi RAM 4GB</h3>

<p>
Jika bekerja pada perangkat dengan RAM terbatas
(seperti <i>Axioo MyBook</i>), disarankan:
</p>

<ul>

<li>Menutup tab browser yang tidak diperlukan.</li>

<li>Menjalankan perintah berikut secara berkala:</li>

</ul>

<pre>
<code>
pnpm exec next clean
</code>
</pre>

<hr>

<h2>🤝 Standar Kontribusi</h2>

<ul>

<li>
Selalu jalankan <code>pnpm lint</code>
sebelum membuat Pull Request.
</li>

<li>
Gunakan <b>TypeScript</b> secara ketat dan
hindari penggunaan tipe <code>any</code>.
</li>

<li>
Pastikan file <code>pnpm-lock.yaml</code>
ikut terupdate saat menambah paket baru.
</li>

</ul>

<hr>

<div align="center">

<p>
© 2026 <b>ARDEN Project Team</b>  
<br>
Universitas TI
</p>

</div>