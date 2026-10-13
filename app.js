/**
 * 일인일역 교실 협업 대시보드 (Classroom Role & Task Collaboration Hub)
 * Pure Vanilla JavaScript ES6+
 * Google Sheets 연동, 실시간 체크, Web Notification API, Web Audio Chime 지원
 */

// ==========================================
// 1. 기본 데이터셋 (초·중·고 표준 28인 일인일역)
// ==========================================
const DEFAULT_STUDENTS = [
  { id: 's1', number: 1, name: '강민우' },
  { id: 's2', number: 2, name: '고은지' },
  { id: 's3', number: 3, name: '김도현' },
  { id: 's4', number: 4, name: '김서연' },
  { id: 's5', number: 5, name: '김유진' },
  { id: 's6', number: 6, name: '김준서' },
  { id: 's7', number: 7, name: '김태민' },
  { id: 's8', number: 8, name: '김하은' },
  { id: 's9', number: 9, name: '박시우' },
  { id: 's10', number: 10, name: '박예원' },
  { id: 's11', number: 11, name: '박준혁' },
  { id: 's12', number: 12, name: '박지민' },
  { id: 's13', number: 13, name: '배성진' },
  { id: 's14', number: 14, name: '서다은' },
  { id: 's15', number: 15, name: '송민재' },
  { id: 's16', number: 16, name: '신우주' },
  { id: 's17', number: 17, name: '안소희' },
  { id: 's18', number: 18, name: '양현우' },
  { id: 's19', number: 19, name: '오서준' },
  { id: 's20', number: 20, name: '유채원' },
  { id: 's21', number: 21, name: '윤지후' },
  { id: 's22', number: 22, name: '이도윤' },
  { id: 's23', number: 23, name: '이서아' },
  { id: 's24', number: 24, name: '이준우' },
  { id: 's25', number: 25, name: '정다인' },
  { id: 's26', number: 26, name: '정예준' },
  { id: 's27', number: 27, name: '최수아' },
  { id: 's28', number: 28, name: '황민호' },
];

const DEFAULT_ROLES = [
  { id: 'r1', name: '일반 쓰레기통 비우기', icon: '🗑️', timeSlot: 'cleaning', timeSlotLabel: '종례 후', location: '교실 뒤', desc: '쓰레기통 비우기 및 새 비닐봉투 교체' },
  { id: 'r2', name: '재활용 분리수거 (페트·캔)', icon: '♻️', timeSlot: 'lunch', timeSlotLabel: '점심 후', location: '분리수거대', desc: '음료수병 라벨 제거 후 분리배출' },
  { id: 'r3', name: '재활용 분리수거 (종이·박스)', icon: '📦', timeSlot: 'cleaning', timeSlotLabel: '종례 후', location: '분리수거대', desc: '박스 납작하게 접고 이면지 정리' },
  { id: 'r4', name: '칠판 지우기 & 분필 정리', icon: '🧼', timeSlot: 'morning', timeSlotLabel: '매 시간/상시', location: '교탁 칠판', desc: '수업 후 칠판 물걸레/지우개 청소' },
  { id: 'r5', name: '창문 환기 & 커튼 관리', icon: '🪟', timeSlot: 'morning', timeSlotLabel: '아침/하교', location: '교실 창가', desc: '쉬는 시간 맞통풍 및 하교 시 잠금' },
  { id: 'r6', name: '학급 반려식물 물주기', icon: '🌿', timeSlot: 'morning', timeSlotLabel: '아침 조회', location: '창가 화분', desc: '흙 상태 확인 후 적정량 급수' },
  { id: 'r7', name: '교실 앞쪽 바닥 쓸기', icon: '🧹', timeSlot: 'cleaning', timeSlotLabel: '청소 시간', location: '교탁 및 1~3분단', desc: '빗자루로 바닥 먼지 모으기' },
  { id: 'r8', name: '교실 뒤쪽 바닥 쓸기', icon: '🧹', timeSlot: 'cleaning', timeSlotLabel: '청소 시간', location: '사물함 및 4~6분단', desc: '사물함 밑과 뒤쪽 꼼꼼히 쓸기' },
  { id: 'r9', name: '대걸레 물걸레질 & 밀대 세척', icon: '🪣', timeSlot: 'cleaning', timeSlotLabel: '청소 시간', location: '교실 전체', desc: '물걸레질 후 밀대 깨끗이 빨아 널기' },
  { id: 'r10', name: '복도 및 출입문 청소', icon: '🚪', timeSlot: 'cleaning', timeSlotLabel: '청소 시간', location: '복도/출입구', desc: '앞·뒤 출입문 주변 쓸고 닦기' },
  { id: 'r11', name: '급식 및 우유 도우미', icon: '🍱', timeSlot: 'lunch', timeSlotLabel: '점심시간', location: '배식대/복도', desc: '배식 질서 유지 및 우유 상자 정리' },
  { id: 'r12', name: '에너지 지킴이 (소등·냉난방)', icon: '💡', timeSlot: 'cleaning', timeSlotLabel: '하교 전', location: '스위치/리모컨', desc: '미사용 조명 끄기 및 에어컨 차단' },
  { id: 'r13', name: '학급 문고 & 게시판 정리', icon: '📚', timeSlot: 'morning', timeSlotLabel: '아침 조회', location: '학급 책장', desc: '도서 번호순 정렬 및 안내문 부착' },
  { id: 'r14', name: '전자교탁 & 빔프로젝터 관리', icon: '💻', timeSlot: 'cleaning', timeSlotLabel: '하교 전', location: '교탁 PC', desc: 'PC 전원 종료 및 케이블 단정히 정돈' },
  { id: 'r15', name: '책걸상 줄 맞추기', icon: '🪑', timeSlot: 'cleaning', timeSlotLabel: '종례 후', location: '학생 책상', desc: '분단별 줄과 의자 서랍 정렬' },
  { id: 'r16', name: '손소독제 & 방역물품 보충', icon: '🧴', timeSlot: 'morning', timeSlotLabel: '아침 조회', location: '앞문 방역대', desc: '소독제 잔량 확인 및 물티슈 비치' },
  { id: 'r17', name: '유인물 & 가정통신문 배부', icon: '📢', timeSlot: 'morning', timeSlotLabel: '조회/종례', location: '교탁 앞', desc: '인원수 맞춰 분단별 전달 보조' },
  { id: 'r18', name: '체육 교구 & 볼 바구니 관리', icon: '⚽', timeSlot: 'lunch', timeSlotLabel: '수업 후', location: '교구함', desc: '체육활동 후 용품 수량 확인 및 반납' },
  { id: 'r19', name: '소화기 & 비상대피로 점검', icon: '🧯', timeSlot: 'morning', timeSlotLabel: '아침 조회', location: '교실 비상구', desc: '복도 및 문 앞 장애물 치우기' },
  { id: 'r20', name: '학급 구급함 점검', icon: '🩹', timeSlot: 'morning', timeSlotLabel: '주 1회/상시', location: '교탁 옆', desc: '밴드, 연고, 체온계 정상 여부 확인' },
  { id: 'r21', name: '세면대 물기 닦기 & 비누 비치', icon: '🪞', timeSlot: 'lunch', timeSlotLabel: '점심 후', location: '교실 세면대', desc: '세면대 거울 물기 닦고 비누 보충' },
  { id: 'r22', name: '창틀 & 분필받침대 청소', icon: '🪶', timeSlot: 'cleaning', timeSlotLabel: '청소 시간', location: '창틀/칠판', desc: '창틀 먼지 및 분필 가루 솔질' },
  { id: 'r23', name: '수업 준비 및 시간 알리미', icon: '⏱️', timeSlot: 'morning', timeSlotLabel: '매 시간', location: '교실 중앙', desc: '종 치기 2분 전 수업 교재 준비 공지' },
  { id: 'r24', name: '분실물 보관함 관리', icon: '🎒', timeSlot: 'morning', timeSlotLabel: '아침 조회', location: '뒤편 보관함', desc: '임자 없는 필기도구 주인 찾아주기' },
  { id: 'r25', name: '음악 교구함 정돈', icon: '🎵', timeSlot: 'cleaning', timeSlotLabel: '수업 후', location: '음악장', desc: '리코더·실로폰 등 악기 제자리 정리' },
  { id: 'r26', name: '과학 실험도구 안전 정리', icon: '🔬', timeSlot: 'cleaning', timeSlotLabel: '수업 후', location: '과학함', desc: '스포이트, 비커 등 안전 확인' },
  { id: 'r27', name: '미술 재료함 정돈', icon: '🎨', timeSlot: 'cleaning', timeSlotLabel: '수업 후', location: '미술장', desc: '가위, 풀, 색연필 분실 여부 확인' },
  { id: 'r28', name: '학급 칭찬 우체통 관리', icon: '🌟', timeSlot: 'morning', timeSlotLabel: '상시/금요일', location: '칭찬함', desc: '친구에게 쓴 칭찬 쪽지 전달 도우미' },
];

const DEFAULT_SCHEDULES = [
  { id: 'sc1', time: '08:40', label: '아침 조회 전 점검', enabled: true },
  { id: 'sc2', time: '13:10', label: '점심시간 직후 점검', enabled: true },
  { id: 'sc3', time: '15:20', label: '종례 및 청소시간 점검', enabled: true },
];

// ==========================================
// 2. 앱 전역 상태 (Application State)
// ==========================================
class AppStore {
  constructor() {
    this.storageKey = 'class_tasks_365_v1';
    this.currentDate = this.getTodayString();
    this.students = [];
    this.roles = [];
    this.assignments = {}; // { 'YYYY-MM-DD': [ { studentId, roleId, completed, completedAt, notes } ] }
    this.googleSheetConfig = {
      csvUrl: '',
      webhookUrl: '',
      autoSync: false,
      lastSyncTime: null,
      syncedRows: 0,
    };
    this.notificationConfig = {
      systemAllowed: false,
      soundEnabled: true,
      vibrationEnabled: true,
      schedules: [...DEFAULT_SCHEDULES],
    };
    this.notificationLogs = [];
    this.currentTab = 'dashboard';
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.viewLayout = 'grid'; // 'grid' | 'table'

    this.loadFromStorage();
  }

  getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.students = parsed.students || DEFAULT_STUDENTS;
        this.roles = parsed.roles || DEFAULT_ROLES;
        this.assignments = parsed.assignments || {};
        this.googleSheetConfig = { ...this.googleSheetConfig, ...(parsed.googleSheetConfig || {}) };
        this.notificationConfig = { ...this.notificationConfig, ...(parsed.notificationConfig || {}) };
        this.notificationLogs = parsed.notificationLogs || [];
      } else {
        this.students = [...DEFAULT_STUDENTS];
        this.roles = [...DEFAULT_ROLES];
        this.initAssignmentsForDate(this.currentDate);
        this.seedPastDemoDays();
      }
    } catch (e) {
      console.warn('Storage load failed, using defaults:', e);
      this.students = [...DEFAULT_STUDENTS];
      this.roles = [...DEFAULT_ROLES];
    }

    if (!this.assignments[this.currentDate]) {
      this.initAssignmentsForDate(this.currentDate);
    }
  }

  saveToStorage() {
    try {
      const data = {
        students: this.students,
        roles: this.roles,
        assignments: this.assignments,
        googleSheetConfig: this.googleSheetConfig,
        notificationConfig: this.notificationConfig,
        notificationLogs: this.notificationLogs.slice(0, 50), // 최근 50건 유지
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Save to localStorage failed:', e);
    }
  }

  initAssignmentsForDate(dateStr, offset = 0) {
    if (this.assignments[dateStr]) return;

    // 1대1 매핑 (기본 순환)
    const list = [];
    const count = Math.min(this.students.length, this.roles.length);
    for (let i = 0; i < count; i++) {
      const studentIndex = (i + offset) % this.students.length;
      list.push({
        studentId: this.students[studentIndex].id,
        roleId: this.roles[i].id,
        completed: false,
        completedAt: null,
        notes: '',
      });
    }
    this.assignments[dateStr] = list;
    this.saveToStorage();
  }

  seedPastDemoDays() {
    // 캘린더 히스토리 통계를 위해 어제와 그저께 샘플 기록 생성
    const d = new Date();
    for (let i = 1; i <= 3; i++) {
      const past = new Date(d);
      past.setDate(past.getDate() - i);
      const pastStr = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`;
      const list = [];
      for (let j = 0; j < 28; j++) {
        // 어제는 25명 완료, 그저는 23명 완료
        const isDone = Math.random() > 0.15;
        list.push({
          studentId: this.students[j].id,
          roleId: this.roles[j].id,
          completed: isDone,
          completedAt: isDone ? '15:25:10' : null,
          notes: isDone ? '확인 완료' : '',
        });
      }
      this.assignments[pastStr] = list;
    }
    this.saveToStorage();
  }

  getAssignmentsForCurrentDate() {
    if (!this.assignments[this.currentDate]) {
      this.initAssignmentsForDate(this.currentDate);
    }
    return this.assignments[this.currentDate] || [];
  }

  toggleTaskCompletion(roleId) {
    const list = this.getAssignmentsForCurrentDate();
    const item = list.find((a) => a.roleId === roleId);
    if (!item) return null;

    item.completed = !item.completed;
    if (item.completed) {
      const now = new Date();
      item.completedAt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    } else {
      item.completedAt = null;
    }

    this.saveToStorage();
    return item;
  }

  markAll(completed) {
    const list = this.getAssignmentsForCurrentDate();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    list.forEach((item) => {
      item.completed = completed;
      item.completedAt = completed ? timeStr : null;
    });
    this.saveToStorage();
  }

  getStatsForDate(dateStr) {
    const list = this.assignments[dateStr] || [];
    const total = list.length;
    const completed = list.filter((i) => i.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, rate };
  }

  logNotification(title, message, studentName = null, type = 'info') {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    this.notificationLogs.unshift({
      id: 'log_' + Date.now() + Math.random(),
      timestamp: timeStr,
      title,
      message,
      studentName,
      type,
    });
    if (this.notificationLogs.length > 50) this.notificationLogs.pop();
    this.saveToStorage();
  }
}

// ==========================================
// 3. Web Audio Synth (무음/네트워크 없이 순수 신시사이저 사운드)
// ==========================================
class ClassroomAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccessChime() {
    if (!app.notificationConfig.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // 화음 멜로디 (도 - 미 - 솔)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.35);
    });
  }

  playAlertPing() {
    if (!app.notificationConfig.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.setValueAtTime(1174.66, t + 0.1); // D6

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  playBellChime() {
    if (!app.notificationConfig.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.12);
      gain.gain.setValueAtTime(0.3, t + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.65);
    });
  }
}

// ==========================================
// 4. 알림 매니저 (Web Notification & In-app Toasts)
// ==========================================
class NotificationManager {
  constructor(audio) {
    this.audio = audio;
    this.hasPermission = false;
    this.checkPermissionStatus();
  }

  checkPermissionStatus() {
    if ('Notification' in window) {
      this.hasPermission = Notification.permission === 'granted';
      app.notificationConfig.systemAllowed = this.hasPermission;
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      this.showToast('이 브라우저는 웹 푸시 알림(Web Notification)을 지원하지 않습니다. 인앱 알림으로 대체됩니다.', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      app.notificationConfig.systemAllowed = this.hasPermission;
      app.saveToStorage();

      if (this.hasPermission) {
        this.showToast('브라우저 푸시 알림 권한이 허용되었습니다!', 'success');
        this.sendPush('🔔 [일인일역 교실 알림]', '푸시 알림이 정상적으로 연동되었습니다.');
        return true;
      } else {
        this.showToast('알림 권한이 거부되었습니다. 브라우저 주소창 설정에서 알림을 허용해주세요.', 'warning');
        return false;
      }
    } catch (e) {
      console.error('Notification permission error:', e);
      return false;
    }
  }

  sendPush(title, body, studentName = null) {
    // 1. Web Notification 발송
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563eb"><circle cx="12" cy="12" r="10"/></svg>',
          tag: 'classroom-task-' + Date.now(),
        });
      } catch (err) {
        console.warn('Native notification failed, fallback to toast:', err);
      }
    }

    // 2. 모바일 진동
    if (app.notificationConfig.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([150, 80, 150]);
    }

    // 3. 사운드
    this.audio.playAlertPing();

    // 4. 화면 토스트
    this.showToast(`${title}: ${body}`, 'alert');

    // 5. 로그 기록
    app.logNotification(title, body, studentName, 'alert');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'alert' ? '🔔' : 'ℹ️'}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
}

// ==========================================
// 5. 구글 스프레드시트 연동 매니저
// ==========================================
class GoogleSheetsSync {
  // RFC 4180 호환 순수 JS CSV 파서 (따옴표, 쉼표, 줄바꿈 완전 지원)
  static parseCSV(text) {
    const p = ['', ''];
    const ret = [];
    let q = 0;
    let r = [];
    let c = '';

    for (let i = 0; i < text.length; i++) {
      const cc = text[i];
      const nc = text[i + 1];

      if (cc === '"') {
        if (q && nc === '"') {
          c += '"';
          i++;
        } else {
          q = !q;
        }
      } else if (cc === ',' && !q) {
        r.push(c.trim());
        c = '';
      } else if ((cc === '\r' || cc === '\n') && !q) {
        if (cc === '\r' && nc === '\n') i++;
        r.push(c.trim());
        if (r.some((cell) => cell.length > 0)) ret.push(r);
        r = [];
        c = '';
      } else {
        c += cc;
      }
    }
    if (c.length > 0 || r.length > 0) {
      r.push(c.trim());
      if (r.some((cell) => cell.length > 0)) ret.push(r);
    }
    return ret;
  }

  // Google Sheets "웹에 게시" CSV URL로부터 실시간 불러오기
  static async syncFromWebPublishUrl(url) {
    if (!url || !url.trim()) {
      throw new Error('구글 스프레드시트 CSV 웹 게시 URL을 입력해주세요.');
    }

    let targetUrl = url.trim();
    // 사용자가 일반 스프레드시트 편집 URL을 넣었을 경우, 자동으로 /export?format=csv로 변환 지원
    if (targetUrl.includes('docs.google.com/spreadsheets/d/') && !targetUrl.includes('pub?output=csv') && !targetUrl.includes('/export?format=csv')) {
      const match = targetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        targetUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
      }
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`스프레드시트를 불러오지 못했습니다 (${response.status}). 스프레드시트의 공유 권한이 '링크가 있는 모든 사용자' 또는 '웹에 게시' 상태인지 확인하세요.`);
    }

    const csvText = await response.text();
    const rows = this.parseCSV(csvText);

    if (rows.length < 2) {
      throw new Error('시트에 데이터 행이 부족합니다. 최소 1개 이상의 헤더와 데이터 행이 필요합니다.');
    }

    // 헤더 인덱스 자동 감지
    const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, ''));
    let numIdx = headers.findIndex((h) => h.includes('번호') || h.includes('no'));
    let nameIdx = headers.findIndex((h) => h.includes('이름') || h.includes('학생') || h.includes('name'));
    let roleIdx = headers.findIndex((h) => h.includes('역할') || h.includes('업무') || h.includes('role') || h.includes('일인일역'));
    let statusIdx = headers.findIndex((h) => h.includes('상태') || h.includes('수행') || h.includes('완료') || h.includes('status'));
    let timeIdx = headers.findIndex((h) => h.includes('시간') || h.includes('시각') || h.includes('time'));
    let noteIdx = headers.findIndex((h) => h.includes('비고') || h.includes('메모') || h.includes('note'));

    if (nameIdx === -1 && roleIdx === -1) {
      // 0열을 번호, 1열을 이름, 2열을 역할로 기본 매핑
      nameIdx = 1;
      roleIdx = 2;
    }

    const targetDate = app.currentDate;
    const currentList = app.getAssignmentsForCurrentDate();
    let updatedCount = 0;

    // 데이터 행 파싱 및 앱 데이터 매핑
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const studentName = nameIdx >= 0 && row[nameIdx] ? row[nameIdx].trim() : '';
      const roleName = roleIdx >= 0 && row[roleIdx] ? row[roleIdx].trim() : '';
      const isCompleted = statusIdx >= 0 && row[statusIdx] ? /완료|O|Y|TRUE|1|done/i.test(row[statusIdx].trim()) : false;
      const completedTime = timeIdx >= 0 && row[timeIdx] ? row[timeIdx].trim() : (isCompleted ? '15:20:00' : null);
      const notes = noteIdx >= 0 && row[noteIdx] ? row[noteIdx].trim() : '';

      // 학생 및 역할 매칭
      let student = app.students.find((s) => s.name === studentName);
      if (!student && studentName) {
        // 없는 학생이면 동적 등록
        student = { id: 's_' + Date.now() + i, number: app.students.length + 1, name: studentName };
        app.students.push(student);
      }

      let role = app.roles.find((r) => r.name.includes(roleName) || roleName.includes(r.name));
      if (!role && roleName) {
        role = { id: 'r_' + Date.now() + i, name: roleName, icon: '📋', timeSlot: 'cleaning', timeSlotLabel: '상시', location: '교실', desc: '스프레드시트 동기화 역할' };
        app.roles.push(role);
      }

      if (role) {
        let assignment = currentList.find((a) => a.roleId === role.id);
        if (!assignment) {
          assignment = {
            studentId: student ? student.id : (app.students[0]?.id || 's1'),
            roleId: role.id,
            completed: isCompleted,
            completedAt: isCompleted ? completedTime : null,
            notes,
          };
          currentList.push(assignment);
        } else {
          if (student) assignment.studentId = student.id;
          assignment.completed = isCompleted;
          assignment.completedAt = isCompleted ? (assignment.completedAt || completedTime) : null;
          if (notes) assignment.notes = notes;
        }
        updatedCount++;
      }
    }

    app.assignments[targetDate] = currentList;
    app.googleSheetConfig.lastSyncTime = new Date().toLocaleTimeString();
    app.googleSheetConfig.syncedRows = updatedCount;
    app.saveToStorage();

    return { updatedCount, totalRows: rows.length - 1, previewRows: rows.slice(0, 8) };
  }

  // 현재 수행 데이터를 구글 시트/엑셀 호환 CSV로 내보내기 (UTF-8 BOM 포함)
  static exportCurrentDateCSV() {
    const list = app.getAssignmentsForCurrentDate();
    let csv = '\uFEFF'; // Excel 한글 깨짐 방지 BOM
    csv += '날짜,번호,학생이름,일인일역명,수행시간대,담당구역,수행여부,완료시각,비고\n';

    list.forEach((item) => {
      const student = app.students.find((s) => s.id === item.studentId) || { number: '-', name: '미배정' };
      const role = app.roles.find((r) => r.id === item.roleId) || { name: '알 수 없음', timeSlotLabel: '-', location: '-' };
      const status = item.completed ? '완료' : '미완료';
      const time = item.completedAt || '';
      const notes = (item.notes || '').replace(/"/g, '""');

      csv += `"${app.currentDate}","${student.number}","${student.name}","${role.name}","${role.timeSlotLabel}","${role.location}","${status}","${time}","${notes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `일인일역_수행현황_${app.currentDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 구글 시트 복사용 샘플 텍스트 클립보드 복사
  static async copyTemplateToClipboard() {
    let tsv = '번호\t학생이름\t일인일역명\t시간대\t구역\t수행여부\t비고\n';
    const count = Math.min(app.students.length, app.roles.length);
    for (let i = 0; i < count; i++) {
      const s = app.students[i];
      const r = app.roles[i];
      tsv += `${s.number}\t${s.name}\t${r.name}\t${r.timeSlotLabel}\t${r.location}\t미완료\t\n`;
    }

    try {
      await navigator.clipboard.writeText(tsv);
      return true;
    } catch (e) {
      console.warn('Clipboard write failed:', e);
      return false;
    }
  }
}

// ==========================================
// 6. 뷰 렌더러 (UI Component Renderer)
// ==========================================
const app = new AppStore();
const audio = new ClassroomAudio();
const notifications = new NotificationManager(audio);

class AppUI {
  static init() {
    this.bindNavigation();
    this.bindDateControls();
    this.bindSearchAndFilters();
    this.bindQuickActions();
    this.bindGoogleSheetControls();
    this.bindNotificationControls();
    this.bindKioskControls();
    this.bindModalControls();

    // 초기 렌더링
    this.renderCurrentView();
    this.renderSyncStatus();
    this.startSchedulerLoop();
  }

  // 상단 내비게이션 바 제어
  static bindNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-view');
        this.switchTab(targetView);
      });
    });
  }

  static switchTab(tabId) {
    app.currentTab = tabId;
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === tabId);
    });
    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${tabId}`);
    });
    this.renderCurrentView();
  }

  // 날짜 선택 및 이전/다음 날짜
  static bindDateControls() {
    const dateInput = document.getElementById('currentDateInput');
    const prevBtn = document.getElementById('btnPrevDate');
    const nextBtn = document.getElementById('btnNextDate');
    const todayBtn = document.getElementById('btnToday');

    if (dateInput) {
      dateInput.value = app.currentDate;
      dateInput.addEventListener('change', (e) => {
        app.currentDate = e.target.value;
        app.initAssignmentsForDate(app.currentDate);
        this.renderCurrentView();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const d = new Date(app.currentDate);
        d.setDate(d.getDate() - 1);
        app.currentDate = d.toISOString().split('T')[0];
        if (dateInput) dateInput.value = app.currentDate;
        app.initAssignmentsForDate(app.currentDate);
        this.renderCurrentView();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const d = new Date(app.currentDate);
        d.setDate(d.getDate() + 1);
        app.currentDate = d.toISOString().split('T')[0];
        if (dateInput) dateInput.value = app.currentDate;
        app.initAssignmentsForDate(app.currentDate);
        this.renderCurrentView();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        app.currentDate = app.getTodayString();
        if (dateInput) dateInput.value = app.currentDate;
        app.initAssignmentsForDate(app.currentDate);
        this.renderCurrentView();
      });
    }
  }

  // 검색 및 필터 탭
  static bindSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        app.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTaskList();
      });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        app.activeFilter = btn.getAttribute('data-filter');
        this.renderTaskList();
      });
    });

    const gridViewBtn = document.getElementById('btnViewGrid');
    const tableViewBtn = document.getElementById('btnViewTable');
    if (gridViewBtn && tableViewBtn) {
      gridViewBtn.addEventListener('click', () => {
        app.viewLayout = 'grid';
        gridViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        document.getElementById('taskCardsGrid').style.display = 'grid';
        document.getElementById('taskTableView').style.display = 'none';
      });
      tableViewBtn.addEventListener('click', () => {
        app.viewLayout = 'table';
        tableViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        document.getElementById('taskCardsGrid').style.display = 'none';
        document.getElementById('taskTableView').style.display = 'block';
        this.renderTaskTable();
      });
    }
  }

  // 퀵 액션 (일괄 알림, 모두 완료, 초기화)
  static bindQuickActions() {
    const bulkNotifyBtn = document.getElementById('btnBulkNotify');
    if (bulkNotifyBtn) {
      bulkNotifyBtn.addEventListener('click', () => {
        const stats = app.getStatsForDate(app.currentDate);
        if (stats.pending === 0) {
          notifications.showToast('모든 일인일역이 이미 완료되었습니다! 👏', 'success');
          audio.playSuccessChime();
          return;
        }

        const pendingList = app.getAssignmentsForCurrentDate().filter((a) => !a.completed);
        const pendingNames = pendingList
          .slice(0, 4)
          .map((item) => {
            const student = app.students.find((s) => s.id === item.studentId);
            return student ? student.name : '';
          })
          .filter(Boolean)
          .join(', ');

        const moreCount = pendingList.length > 4 ? ` 외 ${pendingList.length - 4}명` : '';
        const msg = `아직 ${pendingList.length}개의 일인일역이 미수행 상태입니다 (${pendingNames}${moreCount}). 확인 후 체크해주세요!`;

        notifications.sendPush('📢 [미수행 일인일역 점검 알림]', msg);
      });
    }

    const markAllBtn = document.getElementById('btnMarkAllDone');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        if (confirm('오늘의 모든 일인일역을 완료 처리하시겠습니까?')) {
          app.markAll(true);
          audio.playSuccessChime();
          notifications.showToast('오늘의 모든 일인일역이 완료 처리되었습니다!', 'success');
          this.renderCurrentView();
        }
      });
    }

    const resetTodayBtn = document.getElementById('btnResetToday');
    if (resetTodayBtn) {
      resetTodayBtn.addEventListener('click', () => {
        if (confirm('오늘의 수행 체크 기록을 초기화하시겠습니까?')) {
          app.markAll(false);
          notifications.showToast('수행 체크 상태가 초기화되었습니다.', 'info');
          this.renderCurrentView();
        }
      });
    }

    const exportCsvBtn = document.getElementById('btnExportCsv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        GoogleSheetsSync.exportCurrentDateCSV();
        notifications.showToast('Google 스프레드시트 호환 CSV 파일이 다운로드되었습니다.', 'success');
      });
    }
  }

  // 구글 시트 연동 컨트롤
  static bindGoogleSheetControls() {
    const csvUrlInput = document.getElementById('sheetCsvUrlInput');
    const btnSyncNow = document.getElementById('btnSyncSheetNow');
    const btnCopyTemplate = document.getElementById('btnCopySheetTemplate');
    const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');
    const btnSaveSheetUrl = document.getElementById('btnSaveSheetUrl');

    if (csvUrlInput) {
      csvUrlInput.value = app.googleSheetConfig.csvUrl || '';
    }

    if (btnSaveSheetUrl) {
      btnSaveSheetUrl.addEventListener('click', () => {
        app.googleSheetConfig.csvUrl = csvUrlInput.value.trim();
        app.saveToStorage();
        notifications.showToast('구글 스프레드시트 URL이 저장되었습니다.', 'success');
        this.renderSyncStatus();
      });
    }

    if (btnSyncNow) {
      btnSyncNow.addEventListener('click', async () => {
        const url = csvUrlInput.value.trim() || app.googleSheetConfig.csvUrl;
        if (!url) {
          notifications.showToast('구글 스프레드시트 웹 게시 CSV 링크를 먼저 입력해주세요.', 'warning');
          return;
        }

        btnSyncNow.disabled = true;
        btnSyncNow.innerHTML = '🔄 동기화 중...';

        try {
          const res = await GoogleSheetsSync.syncFromWebPublishUrl(url);
          notifications.showToast(`구글 스프레드시트와 동기화 완료! (${res.updatedCount}개 항목 반영)`, 'success');
          audio.playSuccessChime();
          this.renderCurrentView();
          this.renderSyncStatus();
          this.renderSheetPreview(res.previewRows);
        } catch (err) {
          notifications.showToast(`동기화 실패: ${err.message}`, 'alert');
        } finally {
          btnSyncNow.disabled = false;
          btnSyncNow.innerHTML = '🔄 지금 동기화 실행';
        }
      });
    }

    if (btnCopyTemplate) {
      btnCopyTemplate.addEventListener('click', async () => {
        const ok = await GoogleSheetsSync.copyTemplateToClipboard();
        if (ok) {
          notifications.showToast('구글 시트에 바로 붙여넣을 수 있는 양식 텍스트가 복사되었습니다! (구글 시트 빈 셀에서 Ctrl+V)', 'success');
        } else {
          notifications.showToast('클립보드 복사에 실패했습니다.', 'warning');
        }
      });
    }

    if (btnDownloadTemplate) {
      btnDownloadTemplate.addEventListener('click', () => {
        GoogleSheetsSync.exportCurrentDateCSV();
      });
    }
  }

  // 푸시 알림 설정 컨트롤
  static bindNotificationControls() {
    const btnReqPermission = document.getElementById('btnRequestNotification');
    const toggleSound = document.getElementById('toggleSound');
    const toggleVibration = document.getElementById('toggleVibration');
    const btnTestAlert = document.getElementById('btnTestPushAlert');
    const btnAddSchedule = document.getElementById('btnAddSchedule');

    if (btnReqPermission) {
      btnReqPermission.addEventListener('click', async () => {
        await notifications.requestPermission();
        this.renderNotificationView();
      });
    }

    if (toggleSound) {
      toggleSound.checked = app.notificationConfig.soundEnabled;
      toggleSound.addEventListener('change', (e) => {
        app.notificationConfig.soundEnabled = e.target.checked;
        app.saveToStorage();
        if (e.target.checked) audio.playBellChime();
      });
    }

    if (toggleVibration) {
      toggleVibration.checked = app.notificationConfig.vibrationEnabled;
      toggleVibration.addEventListener('change', (e) => {
        app.notificationConfig.vibrationEnabled = e.target.checked;
        app.saveToStorage();
        if (e.target.checked && navigator.vibrate) navigator.vibrate(200);
      });
    }

    if (btnTestAlert) {
      btnTestAlert.addEventListener('click', () => {
        notifications.sendPush('🧪 [알림 테스트]', '일인일역 푸시 알림이 정상적으로 작동합니다.');
      });
    }

    if (btnAddSchedule) {
      btnAddSchedule.addEventListener('click', () => {
        const timeInput = document.getElementById('newScheduleTime');
        const labelInput = document.getElementById('newScheduleLabel');
        const time = timeInput.value;
        const label = labelInput.value.trim();

        if (!time || !label) {
          notifications.showToast('알림 시간과 라벨을 모두 입력해주세요.', 'warning');
          return;
        }

        app.notificationConfig.schedules.push({
          id: 'sc_' + Date.now(),
          time,
          label,
          enabled: true,
        });
        app.saveToStorage();
        labelInput.value = '';
        notifications.showToast(`'${label} (${time})' 자동 알림이 추가되었습니다.`, 'success');
        this.renderNotificationView();
      });
    }
  }

  // 교실 TV / 전광판 키오스크 모드
  static bindKioskControls() {
    const btnOpenKiosk = document.getElementById('btnOpenKiosk');
    const kioskOverlay = document.getElementById('kioskOverlay');
    const btnCloseKiosk = document.getElementById('btnCloseKiosk');

    if (btnOpenKiosk && kioskOverlay) {
      btnOpenKiosk.addEventListener('click', () => {
        kioskOverlay.style.display = 'flex';
        this.renderKioskView();
      });
    }

    if (btnCloseKiosk && kioskOverlay) {
      btnCloseKiosk.addEventListener('click', () => {
        kioskOverlay.style.display = 'none';
        this.renderCurrentView();
      });
    }

    // ESC 키로 닫기
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && kioskOverlay && kioskOverlay.style.display === 'flex') {
        kioskOverlay.style.display = 'none';
        this.renderCurrentView();
      }
    });
  }

  // 모달 제어
  static bindModalControls() {
    const modal = document.getElementById('roleEditModal');
    const closeBtn = document.getElementById('btnCloseModal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
  }

  // 메인 화면 렌더링
  static renderCurrentView() {
    this.renderHeaderMetrics();
    if (app.currentTab === 'dashboard') {
      this.renderTaskList();
      if (app.viewLayout === 'table') this.renderTaskTable();
    } else if (app.currentTab === 'schedule') {
      this.renderCalendarView();
    } else if (app.currentTab === 'sheets') {
      this.renderSheetsView();
    } else if (app.currentTab === 'notifications') {
      this.renderNotificationView();
    } else if (app.currentTab === 'manage') {
      this.renderManageView();
    }
  }

  // 상단 지표 카드
  static renderHeaderMetrics() {
    const stats = app.getStatsForDate(app.currentDate);

    const totalEl = document.getElementById('statTotal');
    const doneEl = document.getElementById('statCompleted');
    const pendingEl = document.getElementById('statPending');
    const rateEl = document.getElementById('statRate');
    const progressFill = document.getElementById('statProgressBarFill');

    if (totalEl) totalEl.textContent = stats.total;
    if (doneEl) doneEl.textContent = stats.completed;
    if (pendingEl) pendingEl.textContent = stats.pending;
    if (rateEl) rateEl.textContent = `${stats.rate}%`;
    if (progressFill) progressFill.style.width = `${stats.rate}%`;
  }

  // 카드 목록 렌더링
  static renderTaskList() {
    const container = document.getElementById('taskCardsGrid');
    if (!container) return;

    let list = app.getAssignmentsForCurrentDate();

    // 1. 필터 적용
    if (app.activeFilter === 'pending') {
      list = list.filter((item) => !item.completed);
    } else if (app.activeFilter === 'completed') {
      list = list.filter((item) => item.completed);
    } else if (['morning', 'lunch', 'cleaning'].includes(app.activeFilter)) {
      list = list.filter((item) => {
        const role = app.roles.find((r) => r.id === item.roleId);
        return role && role.timeSlot === app.activeFilter;
      });
    }

    // 2. 검색어 필터
    if (app.searchQuery) {
      list = list.filter((item) => {
        const student = app.students.find((s) => s.id === item.studentId);
        const role = app.roles.find((r) => r.id === item.roleId);
        const sMatch = student && (student.name.toLowerCase().includes(app.searchQuery) || String(student.number).includes(app.searchQuery));
        const rMatch = role && (role.name.toLowerCase().includes(app.searchQuery) || role.location.toLowerCase().includes(app.searchQuery));
        return sMatch || rMatch;
      });
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: white; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <p style="font-weight: 600; font-size: 1rem;">해당 조건의 일인일역이 없습니다.</p>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">검색어를 변경하거나 필터를 '전체 보기'로 전환해보세요.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list
      .map((item) => {
        const student = app.students.find((s) => s.id === item.studentId) || { number: '-', name: '미배정' };
        const role = app.roles.find((r) => r.id === item.roleId) || { name: '역할', icon: '📋', timeSlotLabel: '상시', location: '교실' };
        const isDone = item.completed;

        return `
        <div class="task-card ${isDone ? 'completed' : ''}" data-role-id="${role.id}">
          <div>
            <div class="task-card-header">
              <div class="task-role-info">
                <div class="role-icon-box">${role.icon || '📌'}</div>
                <div>
                  <div class="role-title">${role.name}</div>
                  <div class="role-location">
                    <span>📍 ${role.location}</span>
                    <span>·</span>
                    <span>${role.timeSlotLabel}</span>
                  </div>
                </div>
              </div>
              <span class="status-badge ${isDone ? 'done' : 'pending'}">
                ${isDone ? '✓ 수행완료' : '⏳ 미완료'}
              </span>
            </div>

            <div class="task-student-row">
              <div class="student-meta">
                <span class="student-number tabular-nums">${student.number}번</span>
                <span class="student-name">${student.name}</span>
              </div>
              <span class="task-time-slot">${isDone && item.completedAt ? `완료: ${item.completedAt}` : '권장: ' + role.timeSlotLabel}</span>
            </div>

            <div class="task-meta-info">
              <span>${role.desc || '맡은 역할을 성실히 수행합니다.'}</span>
              ${isDone ? `<span class="completed-time">🌟 확인됨</span>` : ''}
            </div>
          </div>

          <div class="task-card-footer">
            <button class="btn-toggle-check" onclick="AppUI.handleTaskCheck('${role.id}')">
              ${isDone ? '✓ 완료 해제' : '✨ 수행 완료 체크'}
            </button>
            ${
              !isDone
                ? `<button class="btn-ping-student" title="해당 학생에게 알림 발송" onclick="AppUI.handlePingStudent('${student.name}', '${role.name}')">
                    🔔 알림
                  </button>`
                : ''
            }
          </div>
        </div>
      `;
      })
      .join('');
  }

  // 테이블 뷰 렌더링
  static renderTaskTable() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return;

    const list = app.getAssignmentsForCurrentDate();
    tbody.innerHTML = list
      .map((item) => {
        const student = app.students.find((s) => s.id === item.studentId) || { number: '-', name: '미배정' };
        const role = app.roles.find((r) => r.id === item.roleId) || { name: '역할', icon: '📋', timeSlotLabel: '상시', location: '교실' };
        const isDone = item.completed;

        return `
        <tr class="${isDone ? 'completed' : ''}">
          <td class="tabular-nums font-semibold">${student.number}번</td>
          <td><strong>${student.name}</strong></td>
          <td>
            <span style="margin-right: 0.35rem;">${role.icon}</span>
            <strong>${role.name}</strong>
          </td>
          <td>${role.timeSlotLabel}</td>
          <td>📍 ${role.location}</td>
          <td>
            <span class="status-badge ${isDone ? 'done' : 'pending'}">
              ${isDone ? '✓ 완료' : '미완료'}
            </span>
          </td>
          <td class="tabular-nums">${item.completedAt || '-'}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="AppUI.handleTaskCheck('${role.id}')">
              ${isDone ? '취소' : '완료 체크'}
            </button>
          </td>
        </tr>
      `;
      })
      .join('');
  }

  // 클릭 이벤트 핸들러
  static handleTaskCheck(roleId) {
    const updated = app.toggleTaskCompletion(roleId);
    if (!updated) return;

    if (updated.completed) {
      audio.playSuccessChime();
      notifications.showToast('일인일역 수행이 완료되었습니다! 👏', 'success');
    }
    this.renderCurrentView();
  }

  static handlePingStudent(studentName, roleName) {
    notifications.sendPush(`🔔 [일인일역 알림] ${studentName} 학생`, `'${roleName}' 업무를 아직 마치지 않았습니다. 확인 후 완료해주세요!`, studentName);
  }

  // 구글 시트 뷰
  static renderSheetsView() {
    const container = document.getElementById('sheetPreviewTableBody');
    if (!container) return;

    const list = app.getAssignmentsForCurrentDate().slice(0, 10);
    container.innerHTML = list
      .map((item) => {
        const student = app.students.find((s) => s.id === item.studentId) || { number: '-', name: '-' };
        const role = app.roles.find((r) => r.id === item.roleId) || { name: '-', timeSlotLabel: '-' };
        return `
        <tr>
          <td>${app.currentDate}</td>
          <td>${student.number}</td>
          <td>${student.name}</td>
          <td>${role.name}</td>
          <td>${item.completed ? '완료' : '미완료'}</td>
          <td>${item.completedAt || ''}</td>
        </tr>
      `;
      })
      .join('');
  }

  static renderSheetPreview(rows) {
    const thead = document.getElementById('sheetSyncPreviewHead');
    const tbody = document.getElementById('sheetSyncPreviewBody');
    if (!rows || rows.length === 0 || !thead || !tbody) return;

    thead.innerHTML = `<tr>${rows[0].map((h) => `<th>${h}</th>`).join('')}</tr>`;
    tbody.innerHTML = rows
      .slice(1)
      .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`)
      .join('');
    document.getElementById('sheetSyncPreviewCard').style.display = 'block';
  }

  static renderSyncStatus() {
    const syncBadge = document.getElementById('syncStatusIndicator');
    if (!syncBadge) return;

    if (app.googleSheetConfig.lastSyncTime) {
      syncBadge.className = 'sync-status-indicator synced';
      syncBadge.innerHTML = `<span>🟢 구글 시트 동기화됨 (${app.googleSheetConfig.lastSyncTime})</span>`;
    } else {
      syncBadge.className = 'sync-status-indicator';
      syncBadge.innerHTML = `<span>⚪ 로컬 오프라인 모드</span>`;
    }
  }

  // 푸시 알림 뷰
  static renderNotificationView() {
    const permStatus = document.getElementById('notificationPermissionStatus');
    const btnReq = document.getElementById('btnRequestNotification');
    if (permStatus && btnReq) {
      if (notifications.hasPermission) {
        permStatus.innerHTML = `<span style="color: #16a34a; font-weight: 600;">✓ 브라우저 푸시 알림이 활성화되어 있습니다.</span>`;
        btnReq.style.display = 'none';
      } else {
        permStatus.innerHTML = `<span style="color: #d97706; font-weight: 600;">⚠️ 브라우저 푸시 알림 권한이 필요합니다.</span>`;
        btnReq.style.display = 'inline-flex';
      }
    }

    const scheduleListEl = document.getElementById('scheduleList');
    if (scheduleListEl) {
      scheduleListEl.innerHTML = app.notificationConfig.schedules
        .map((sc, idx) => `
        <div class="schedule-item">
          <div class="schedule-item-info">
            <span class="schedule-time">${sc.time}</span>
            <span class="schedule-label">${sc.label}</span>
          </div>
          <div>
            <button class="btn btn-outline btn-sm" onclick="AppUI.deleteSchedule(${idx})">삭제</button>
          </div>
        </div>
      `)
        .join('');
    }

    const logsContainer = document.getElementById('notificationLogsList');
    if (logsContainer) {
      if (app.notificationLogs.length === 0) {
        logsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">최근 발송된 알림 내역이 없습니다.</p>`;
      } else {
        logsContainer.innerHTML = app.notificationLogs
          .map((log) => `
          <div class="log-entry">
            <span class="log-time">${log.timestamp}</span>
            <div class="log-content">
              <strong>${log.title}</strong>
              <p style="color: var(--text-secondary); margin-top: 0.15rem;">${log.message}</p>
            </div>
          </div>
        `)
          .join('');
      }
    }
  }

  static deleteSchedule(idx) {
    app.notificationConfig.schedules.splice(idx, 1);
    app.saveToStorage();
    this.renderNotificationView();
  }

  // 캘린더 / 주간 배정표 뷰
  static renderCalendarView() {
    const matrix = document.getElementById('calendarDaysMatrix');
    if (!matrix) return;

    const curr = new Date(app.currentDate);
    const year = curr.getFullYear();
    const month = curr.getMonth(); // 0-based

    document.getElementById('calMonthTitle').textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    let cellsHtml = '';

    // 빈 칸 (이전 달)
    for (let i = 0; i < firstDay; i++) {
      cellsHtml += `<div class="cal-day-cell" style="opacity: 0.3; pointer-events: none;"></div>`;
    }

    // 이번 달 날짜들
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = dateStr === app.currentDate;
      const isToday = dateStr === app.getTodayString();
      const stats = app.getStatsForDate(dateStr);

      const pillClass = stats.total > 0 && stats.rate >= 80 ? 'high' : stats.total > 0 && stats.rate > 0 ? 'mid' : '';

      cellsHtml += `
        <div class="cal-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" onclick="AppUI.selectCalendarDate('${dateStr}')">
          <div class="cal-day-num">${day}${isToday ? ' (오늘)' : ''}</div>
          ${stats.total > 0 ? `<div class="cal-rate-pill ${pillClass}">${stats.rate}% (${stats.completed}/${stats.total})</div>` : '<div style="font-size: 0.65rem; color: #94a3b8;">-</div>'}
        </div>
      `;
    }

    matrix.innerHTML = cellsHtml;
  }

  static selectCalendarDate(dateStr) {
    app.currentDate = dateStr;
    const dateInput = document.getElementById('currentDateInput');
    if (dateInput) dateInput.value = dateStr;
    app.initAssignmentsForDate(dateStr);
    this.renderCalendarView();
    this.renderHeaderMetrics();
  }

  // 역할 및 학생 관리 뷰
  static renderManageView() {
    const studentListEl = document.getElementById('manageStudentList');
    const roleListEl = document.getElementById('manageRoleList');

    if (studentListEl) {
      studentListEl.innerHTML = app.students
        .map((s) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-page); border: 1px solid var(--border-light); border-radius: var(--radius-sm); margin-bottom: 0.35rem; font-size: 0.85rem;">
          <span><strong>${s.number}번</strong> ${s.name}</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">ID: ${s.id}</span>
        </div>
      `)
        .join('');
    }

    if (roleListEl) {
      roleListEl.innerHTML = app.roles
        .map((r) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-page); border: 1px solid var(--border-light); border-radius: var(--radius-sm); margin-bottom: 0.35rem; font-size: 0.85rem;">
          <span>${r.icon} <strong>${r.name}</strong> (${r.timeSlotLabel})</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">📍 ${r.location}</span>
        </div>
      `)
        .join('');
    }

    const btnRotate = document.getElementById('btnRotateRoles');
    if (btnRotate) {
      btnRotate.onclick = () => {
        if (confirm('모든 학생의 역할을 1칸씩 다음 번호로 자동 순환(로테이션)하시겠습니까?')) {
          const list = app.getAssignmentsForCurrentDate();
          if (list.length > 1) {
            const firstStudentId = list[0].studentId;
            for (let i = 0; i < list.length - 1; i++) {
              list[i].studentId = list[i + 1].studentId;
              list[i].completed = false;
              list[i].completedAt = null;
            }
            list[list.length - 1].studentId = firstStudentId;
            list[list.length - 1].completed = false;
            list[list.length - 1].completedAt = null;
            app.saveToStorage();
            notifications.showToast('일인일역이 다음 학생으로 순환 배정되었습니다!', 'success');
            this.renderCurrentView();
          }
        }
      };
    }
  }

  // 교실 TV 전광판 렌더링
  static renderKioskView() {
    const grid = document.getElementById('kioskCardsGrid');
    const clock = document.getElementById('kioskClockDisplay');

    if (clock) {
      const now = new Date();
      clock.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    if (!grid) return;
    const list = app.getAssignmentsForCurrentDate();
    grid.innerHTML = list
      .map((item) => {
        const student = app.students.find((s) => s.id === item.studentId) || { number: '-', name: '미배정' };
        const role = app.roles.find((r) => r.id === item.roleId) || { name: '역할', icon: '📌' };
        const isDone = item.completed;

        return `
        <div class="kiosk-card ${isDone ? 'completed' : ''}" onclick="AppUI.handleKioskCheck('${role.id}')">
          <div>
            <div class="kiosk-card-name">${student.number}번 ${student.name}</div>
            <div class="kiosk-card-role">${role.icon} ${role.name}</div>
          </div>
          <div class="kiosk-card-status">
            ${isDone ? '✓ 수행 완료 (' + (item.completedAt || '확인') + ')' : '👉 터치하여 완료 체크'}
          </div>
        </div>
      `;
      })
      .join('');
  }

  static handleKioskCheck(roleId) {
    const updated = app.toggleTaskCompletion(roleId);
    if (!updated) return;
    if (updated.completed) {
      audio.playSuccessChime();
    }
    this.renderKioskView();
  }

  // 실시간 스케줄러 루프 (자동 알림 체크 & 키오스크 시계 갱신)
  static startSchedulerLoop() {
    let lastCheckedMinute = '';

    setInterval(() => {
      const now = new Date();
      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // 키오스크 시계 갱신
      const clock = document.getElementById('kioskClockDisplay');
      if (clock && document.getElementById('kioskOverlay')?.style.display === 'flex') {
        clock.textContent = `${currentHM}:${String(now.getSeconds()).padStart(2, '0')}`;
      }

      // 1분에 1번 스케줄 체크
      if (currentHM !== lastCheckedMinute) {
        lastCheckedMinute = currentHM;

        // 알림 스케줄 매칭
        const matched = app.notificationConfig.schedules.find((s) => s.enabled && s.time === currentHM);
        if (matched) {
          const stats = app.getStatsForDate(app.currentDate);
          if (stats.pending > 0) {
            notifications.sendPush(`⏰ [${matched.label}]`, `현재 미완료된 일인일역이 ${stats.pending}개 있습니다. 지금 점검해주세요!`);
          }
        }
      }
    }, 1000);
  }
}

// 전역 노출 (HTML 인라인 이벤트 핸들러용)
window.AppUI = AppUI;
window.GoogleSheetsSync = GoogleSheetsSync;

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  AppUI.init();
});
