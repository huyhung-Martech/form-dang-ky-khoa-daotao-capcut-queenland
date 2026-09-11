/**
 * TikTok Academy 2026 - Registration & Team Analytics App
 * Client-side data management, real-time statistics & Excel export
 * Support for Google Sheets Webhook automatic sync
 */

// Storage key for clean live registration data
const STORAGE_KEY = 'queenland_tiktok_training_live_data';

/**
 * GOOGLE SHEETS WEBHOOK INTEGRATION
 * Dán URL Google Apps Script Webhook của bạn vào đây nếu muốn tự động đẩy data về Google Sheets.
 * (Để trống thì hệ thống vẫn lưu trữ an toàn trên máy và Dashboard Admin như bình thường).
 */
const GOOGLE_SHEETS_WEBHOOK_URL = ""; 

// Optional Sample Data (chỉ nạp khi người dùng bấm nút "Nạp Dữ Liệu Mẫu" trong Admin)
const SAMPLE_REGISTRATIONS = [
  { id: "QL-TK-001", fullName: "Trần Minh Hoàng", phoneNumber: "0983124567", team: "Khối Kinh Doanh 1", venue: "TechnoPark (15/09 - 22/09)", tiktokLink: "tiktok.com/@hoangbds", goal: "Tự tay dựng được video CapCut triệu view", timestamp: "2026-09-11 08:30" },
  { id: "QL-TK-002", fullName: "Lê Thu Hà", phoneNumber: "0912456789", team: "Khối Kinh Doanh 1", venue: "TechnoPark (15/09 - 22/09)", tiktokLink: "", goal: "Luyện giọng nói nội lực, hết run khi lên hình", timestamp: "2026-09-11 08:45" },
  { id: "QL-TK-003", fullName: "Nguyễn Văn Đức", phoneNumber: "0977889900", team: "Khối Kinh Doanh 2", venue: "35 Lê Văn Lương (23/09 - 30/09)", tiktokLink: "tiktok.com/@ducqueenland", goal: "Tự tay dựng được video CapCut triệu view", timestamp: "2026-09-11 09:00" },
  { id: "QL-TK-004", fullName: "Phạm Thúy Vy", phoneNumber: "0904112233", team: "Team Queen Land Ocean Park", venue: "TechnoPark (15/09 - 22/09)", tiktokLink: "", goal: "Làm chủ kỹ thuật quay điện thoại chuẩn chuyên nghiệp", timestamp: "2026-09-11 09:15" },
  { id: "QL-TK-005", fullName: "Hoàng Tuấn Anh", phoneNumber: "0934556677", team: "Team Queen Land Ocean Park", venue: "TechnoPark (15/09 - 22/09)", tiktokLink: "tiktok.com/@tuananhvinhomes", goal: "Thành thạo dùng AI viết kịch bản BĐS 60s", timestamp: "2026-09-11 09:30" }
];

// App State (Mặc định bắt đầu từ danh sách trống 0 học viên)
let registrations = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Xóa cache dữ liệu mẫu cũ nếu có
  localStorage.removeItem('queenland_tiktok_training_2026_registrations');
  
  loadData();
  setupEventListeners();
  renderApp();
});

// Load from LocalStorage (Khởi tạo mảng rỗng 0 học viên nếu chưa có ai đăng ký)
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      registrations = JSON.parse(saved);
    } catch (e) {
      registrations = [];
    }
  } else {
    registrations = [];
    saveData();
  }
}

// Save to LocalStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

// Setup Event Listeners
function setupEventListeners() {
  const form = document.getElementById('registrationForm');
  const btnRegisterAnother = document.getElementById('btnRegisterAnother');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  if (btnRegisterAnother) {
    btnRegisterAnother.addEventListener('click', () => {
      document.getElementById('successCard').style.display = 'none';
      form.style.display = 'block';
      form.reset();
    });
  }

  // Admin page controls (if on admin.html)
  const searchInput = document.getElementById('searchKeyword');
  if (searchInput) {
    searchInput.addEventListener('input', renderTable);
  }

  const filterVenue = document.getElementById('filterVenue');
  if (filterVenue) {
    filterVenue.addEventListener('change', renderTable);
  }

  const btnExport = document.getElementById('btnExportExcel');
  if (btnExport) {
    btnExport.addEventListener('click', exportToExcel);
  }

  const btnSample = document.getElementById('btnLoadSampleData');
  if (btnSample) {
    btnSample.addEventListener('click', () => {
      if (confirm('Bạn có muốn nạp lại dữ liệu mẫu 12 học viên đại diện cho các khối?')) {
        registrations = [...SAMPLE_REGISTRATIONS];
        saveData();
        renderApp();
        alert('Đã nạp dữ liệu mẫu thành công!');
      }
    });
  }

  const btnClear = document.getElementById('btnClearData');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ danh sách để bắt đầu nhận đăng ký thật?')) {
        registrations = [];
        saveData();
        renderApp();
        alert('Đã xóa sạch dữ liệu. Sẵn sàng nhận đăng ký mới!');
      }
    });
  }
}

// Form Submission Handler
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = document.getElementById('registrationForm');
  const fullName = document.getElementById('fullName').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const team = document.getElementById('teamInput').value.trim();
  const venue = document.getElementById('venueSelect').value;
  const tiktokLink = document.getElementById('tiktokLink').value.trim();
  const goal = document.getElementById('learningGoal').value;

  let isValid = true;

  // Validate Full Name
  const errFullName = document.getElementById('errFullName');
  if (!fullName) {
    document.getElementById('fullName').parentElement.classList.add('has-error');
    errFullName.style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('fullName').parentElement.classList.remove('has-error');
    errFullName.style.display = 'none';
  }

  // Validate Phone Number (10 digits VN format)
  const errPhoneNumber = document.getElementById('errPhoneNumber');
  const phoneClean = phoneNumber.replace(/\s+/g, '');
  const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phoneClean)) {
    document.getElementById('phoneNumber').parentElement.classList.add('has-error');
    errPhoneNumber.style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('phoneNumber').parentElement.classList.remove('has-error');
    errPhoneNumber.style.display = 'none';
  }

  // Validate Team Input (Tự do nhập)
  const errTeamInput = document.getElementById('errTeamInput');
  if (!team) {
    document.getElementById('teamInput').parentElement.classList.add('has-error');
    errTeamInput.style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('teamInput').parentElement.classList.remove('has-error');
    errTeamInput.style.display = 'none';
  }

  // Validate Venue
  const errVenueSelect = document.getElementById('errVenueSelect');
  if (!venue) {
    document.getElementById('venueSelect').parentElement.classList.add('has-error');
    errVenueSelect.style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('venueSelect').parentElement.classList.remove('has-error');
    errVenueSelect.style.display = 'none';
  }

  if (!isValid) {
    return;
  }

  // Generate ID
  const newIndex = registrations.length + 1;
  const regId = `QL-TK-${String(newIndex).padStart(3, '0')}`;
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newReg = {
    id: regId,
    fullName,
    phoneNumber: phoneClean,
    team,
    venue,
    tiktokLink,
    goal,
    timestamp: timeStr
  };

  // Add to local state and save
  registrations.unshift(newReg);
  saveData();

  // Async sync to Google Sheets if configured
  syncToGoogleSheets(newReg);

  // Show success modal/card
  form.style.display = 'none';
  const successCard = document.getElementById('successCard');
  document.getElementById('successName').textContent = fullName;
  document.getElementById('successId').textContent = regId;
  document.getElementById('successVenue').textContent = venue;
  document.getElementById('successTeam').textContent = team;
  successCard.style.display = 'block';

  // Smooth scroll to success card
  successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Re-render if on admin page
  renderApp();
}

// Sync to Google Sheets Webhook
function syncToGoogleSheets(data) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) return;

  try {
    fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(err => console.log('Google Sheets sync notice:', err));
  } catch (e) {
    console.log('Sync error:', e);
  }
}

// Master Render Function
function renderApp() {
  renderCounters();
  renderTeamProgress();
  renderTable();
}

// Render Top 4 Summary Counters (if present on page)
function renderCounters() {
  const totalEl = document.getElementById('valTotalRegistered');
  if (!totalEl) return;

  const total = registrations.length;
  totalEl.textContent = total;

  // Technopark count
  const tpCount = registrations.filter(r => r.venue && r.venue.includes('TechnoPark')).length;
  const valTp = document.getElementById('valTechnoparkCount');
  if (valTp) valTp.textContent = tpCount;
  
  const pctTp = document.getElementById('pctTechnopark');
  if (pctTp) {
    const tpPct = total > 0 ? Math.round((tpCount / total) * 100) : 0;
    pctTp.textContent = `${tpPct}% tổng số`;
  }

  // 35 Lê Văn Lương count
  const lvlCount = registrations.filter(r => r.venue && r.venue.includes('Lê Văn Lương')).length;
  const valLvl = document.getElementById('valLeVanLuongCount');
  if (valLvl) valLvl.textContent = lvlCount;
  
  const pctLvl = document.getElementById('pctLeVanLuong');
  if (pctLvl) {
    const lvlPct = total > 0 ? Math.round((lvlCount / total) * 100) : 0;
    pctLvl.textContent = `${lvlPct}% tổng số`;
  }

  // Top Team
  const teamCounts = getTeamStats();
  const valTopName = document.getElementById('valTopTeamName');
  const valTopCount = document.getElementById('valTopTeamCount');
  
  if (valTopName && valTopCount) {
    if (teamCounts.length > 0 && total > 0) {
      const top = teamCounts[0];
      valTopName.textContent = top.name;
      valTopCount.textContent = `${top.count} học viên (${top.pct}%)`;
    } else {
      valTopName.textContent = 'Chưa có';
      valTopCount.textContent = '0 học viên';
    }
  }
}

// Calculate team stats sorted descending (auto-normalized)
function getTeamStats() {
  const counts = {};
  registrations.forEach(r => {
    let t = (r.team || 'Khối khác').trim();
    counts[t] = (counts[t] || 0) + 1;
  });

  const total = registrations.length;
  const list = Object.keys(counts).map(name => ({
    name,
    count: counts[name],
    pct: total > 0 ? Math.round((counts[name] / total) * 100) : 0
  }));

  list.sort((a, b) => b.count - a.count);
  return list;
}

// Render Team Breakdown Progress Bars (if present on page)
function renderTeamProgress() {
  const container = document.getElementById('teamProgressList');
  if (!container) return;

  container.innerHTML = '';
  const teamStats = getTeamStats();

  if (teamStats.length === 0) {
    container.innerHTML = '<p style="color: var(--text-dim); font-size: 0.82rem; text-align: center; padding: 20px 0;">Chưa có dữ liệu đăng ký.</p>';
    return;
  }

  teamStats.forEach((t, idx) => {
    const rankClass = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : (idx === 2 ? 'rank-3' : ''));
    const badgeIcon = idx === 0 ? '👑 ' : (idx === 1 ? '🥈 ' : (idx === 2 ? '🥉 ' : ''));
    
    const div = document.createElement('div');
    div.className = 'team-prog-item';
    div.innerHTML = `
      <div class="prog-header">
        <span class="prog-name">${badgeIcon}${escapeHtml(t.name)}</span>
        <span class="prog-meta"><strong>${t.count}</strong> học viên (${t.pct}%)</span>
      </div>
      <div class="prog-bar-track">
        <div class="prog-bar-fill ${rankClass}" style="width: ${t.pct}%;"></div>
      </div>
    `;
    container.appendChild(div);
  });
}

// Render Detailed Registrations Table (if present on page)
function renderTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  const emptyState = document.getElementById('tableEmptyState');
  const countBadge = document.getElementById('tableRecordCount');

  const searchInput = document.getElementById('searchKeyword');
  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  
  const filterVenueEl = document.getElementById('filterVenue');
  const filterVenue = filterVenueEl ? filterVenueEl.value : 'ALL';

  // Filter
  const filtered = registrations.filter(r => {
    const matchKeyword = r.fullName.toLowerCase().includes(keyword) || 
                         r.phoneNumber.includes(keyword) || 
                         r.id.toLowerCase().includes(keyword) ||
                         r.team.toLowerCase().includes(keyword);
    const matchVenue = (filterVenue === 'ALL') || (r.venue === filterVenue);
    return matchKeyword && matchVenue;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} bản ghi`;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  tbody.innerHTML = '';

  filtered.forEach((r, idx) => {
    const isTP = r.venue && r.venue.includes('TechnoPark');
    const venueClass = isTP ? 'venue-tag tp' : 'venue-tag lvl';
    const venueShort = isTP ? 'TechnoPark' : '35 Lê Văn Lương';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${idx + 1}</strong></td>
      <td>
        <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(r.fullName)}</div>
        <small style="color: var(--text-dim);">${r.id}</small>
      </td>
      <td>
        <a href="tel:${r.phoneNumber}" style="color: var(--primary-cyan); text-decoration: none; font-weight: 700;">
          ${r.phoneNumber}
        </a>
      </td>
      <td><span style="font-weight: 700; color: var(--text-secondary);">${escapeHtml(r.team)}</span></td>
      <td><span class="${venueClass}">${venueShort}</span></td>
      <td style="max-width: 240px; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(r.goal)}">
        <small style="color: var(--text-secondary);">${escapeHtml(r.goal)}</small>
      </td>
      <td><small style="color: var(--text-dim);">${r.timestamp}</small></td>
    `;
    tbody.appendChild(tr);
  });
}

// Export Table Data to Excel (CSV with UTF-8 BOM for full Vietnamese support)
function exportToExcel() {
  if (registrations.length === 0) {
    alert('Danh sách đăng ký đang trống! Hãy nạp dữ liệu mẫu hoặc điền form để xuất file.');
    return;
  }

  const headers = ["STT", "Mã Ghi Danh", "Họ và Tên", "Số Điện Thoại", "Đội Nhóm / Khối Kinh Doanh", "Cơ Sở Học", "Link TikTok", "Mục Tiêu Khi Học", "Thời Gian Đăng Ký"];
  
  const rows = registrations.map((r, i) => [
    i + 1,
    `"${r.id}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `="${r.phoneNumber}"`, // Force Excel to treat phone as text
    `"${r.team.replace(/"/g, '""')}"`,
    `"${r.venue.replace(/"/g, '""')}"`,
    `"${(r.tiktokLink || '').replace(/"/g, '""')}"`,
    `"${(r.goal || '').replace(/"/g, '""')}"`,
    `"${r.timestamp}"`
  ]);

  let csvContent = "\uFEFF" + headers.join(",") + "\n";
  rows.forEach(rowArr => {
    csvContent += rowArr.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', `Danh_Sach_Hoc_Vien_TikTok_QueenLand_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Escape HTML utility
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
