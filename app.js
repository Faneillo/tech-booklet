const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const orderedDays = [1, 2, 3, 4, 5, 6, 0];
const storeKey = "study-terminal-data-v1";
const dataVersion = 3;
const greetings = [
  "Good morning, Oliver.",
  "Good afternoon, Oliver.",
  "Good evening, Oliver.",
  "Welcome back, Oliver.",
  "Ready for today, Oliver?"
];

const defaultClasses = [
  { subject: "Physics", teacher: "Anna Nie", location: "Z201", day: 1, time: "08:00-08:40" },
  { subject: "Physics", teacher: "Anna Nie", location: "Z201", day: 1, time: "08:45-09:25" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 1, time: "11:55-12:35" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 1, time: "12:40-13:20" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 1, time: "15:05-15:45" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 1, time: "15:50-16:30" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 2, time: "08:00-08:40" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 2, time: "08:45-09:25" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 2, time: "09:35-10:15" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 2, time: "10:25-11:05" },
  { subject: "PE", teacher: "", location: "", day: 2, time: "11:10-11:50" },
  { subject: "Physics", teacher: "Anna Nie", location: "Z201", day: 2, time: "12:40-13:20" },
  { subject: "Physics", teacher: "Anna Nie", location: "Z201", day: 2, time: "13:30-14:10" },
  { subject: "Class meeting", teacher: "Yuri Li", location: "Z309", day: 2, time: "15:05-15:50" },
  { subject: "Physics", teacher: "Anna Nie", location: "Z201", day: 3, time: "14:15-14:55" },
  { subject: "Physics", teacher: "Anna Nie", location: "Z201", day: 3, time: "15:05-15:45" },
  { subject: "Media", teacher: "Ayyub", location: "Z301", day: 4, time: "08:00-08:40" },
  { subject: "Media", teacher: "Ayyub", location: "Z301", day: 4, time: "08:45-09:25" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 4, time: "13:30-14:10" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 4, time: "14:15-14:55" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 4, time: "15:05-15:45" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 4, time: "15:50-16:30" },
  { subject: "Business", teacher: "Maciej", location: "Z411", day: 5, time: "11:55-12:35" },
  { subject: "Physics", teacher: "Anna Nie", location: "Z411", day: 5, time: "12:40-13:20" },
  { subject: "Media", teacher: "Ayyub", location: "Z301", day: 5, time: "14:15-14:55" },
  { subject: "Media", teacher: "Ayyub", location: "Z301", day: 5, time: "15:05-15:45" },
  { subject: "Economics", teacher: "Liliya Jiang", location: "Z308", day: 5, time: "15:50-16:30" },
].map((item) => ({ ...item, id: crypto.randomUUID(), notes: item.teacher ? item.teacher : "" }));

const seedData = {
  version: dataVersion,
  classes: defaultClasses,
  exams: [
    { id: crypto.randomUUID(), subject: "Physics Mock", location: "Exam Hall A", date: nextDate(6), dueTime: "09:00", notes: "Mechanics and electricity" },
    { id: crypto.randomUUID(), subject: "Mathematics Test", location: "Room 204", date: nextDate(13), dueTime: "10:30", notes: "Functions, vectors" }
  ],
  tasks: [
    { id: crypto.randomUUID(), subject: "Chemistry worksheet", location: "Teams", date: nextDate(2), dueTime: "18:00", progress: 45, notes: "Complete questions 1-18" },
    { id: crypto.randomUUID(), subject: "English essay draft", location: "Google Docs", date: nextDate(4), dueTime: "21:00", progress: 20, notes: "Theme paragraph and quotes" },
    { id: crypto.randomUUID(), subject: "Maths revision set", location: "Notebook", date: nextDate(1), dueTime: "20:00", progress: 80, notes: "Check last three questions" }
  ]
};

let state = loadState();
let activeView = "dashboard";
let activeDay = getBeijingNow().day;
let taskFilter = "open";
let editing = null;
let clockTimer = null;

const els = {
  greetingLabel: document.querySelector("#greetingLabel"),
  todayLabel: document.querySelector("#todayLabel"),
  beijingDate: document.querySelector("#beijingDate"),
  beijingTime: document.querySelector("#beijingTime"),
  statusLabel: document.querySelector("#statusLabel"),
  currentCourse: document.querySelector("#currentCourse"),
  currentCourseMeta: document.querySelector("#currentCourseMeta"),
  countdownLabel: document.querySelector("#countdownLabel"),
  previousCourse: document.querySelector("#previousCourse"),
  previousCourseMeta: document.querySelector("#previousCourseMeta"),
  nextCourse: document.querySelector("#nextCourse"),
  nextCourseMeta: document.querySelector("#nextCourseMeta"),
  viewTitle: document.querySelector("#viewTitle"),
  navItems: [...document.querySelectorAll(".nav-item")],
  views: {
    dashboard: document.querySelector("#dashboardView"),
    timetable: document.querySelector("#timetableView"),
    exams: document.querySelector("#examsView"),
    tasks: document.querySelector("#tasksView")
  },
  metrics: {
    classes: document.querySelector("#metricClasses"),
    exams: document.querySelector("#metricExams"),
    tasks: document.querySelector("#metricTasks")
  },
  todaySchedule: document.querySelector("#todaySchedule"),
  upcomingExams: document.querySelector("#upcomingExams"),
  taskPreview: document.querySelector("#taskPreview"),
  progressRing: document.querySelector("#progressRing"),
  dayTabs: document.querySelector("#dayTabs"),
  timetableGrid: document.querySelector("#timetableGrid"),
  examList: document.querySelector("#examList"),
  taskList: document.querySelector("#taskList"),
  taskFilters: document.querySelector("#taskFilters"),
  examSearch: document.querySelector("#examSearch"),
  modal: document.querySelector("#entryModal"),
  form: document.querySelector("#entryForm"),
  modalTitle: document.querySelector("#modalTitle"),
  entryType: document.querySelector("#entryType"),
  deleteEntry: document.querySelector("#deleteEntry"),
  fileInput: document.querySelector("#fileInput")
};

const formFields = {
  subject: document.querySelector("#subject"),
  location: document.querySelector("#location"),
  day: document.querySelector("#day"),
  time: document.querySelector("#time"),
  date: document.querySelector("#date"),
  dueTime: document.querySelector("#dueTime"),
  progress: document.querySelector("#progress"),
  notes: document.querySelector("#notes")
};

function nextDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function loadState() {
  const raw = localStorage.getItem(storeKey);
  if (!raw) return seedData;
  try {
    const parsed = JSON.parse(raw);
    if (Number(parsed.version || 1) < dataVersion) {
      const migrated = { ...parsed, version: dataVersion, classes: defaultClasses };
      localStorage.setItem(storeKey, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  } catch {
    return seedData;
  }
}

function saveState() {
  state.version = dataVersion;
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function getBeijingNow() {
  const date = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short"
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || "";
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const hour = Number(part("hour"));
  const minute = Number(part("minute"));
  const second = Number(part("second"));
  return {
    date,
    year: part("year"),
    month: part("month"),
    dateNumber: part("day"),
    day: weekdayMap[part("weekday")],
    hour,
    minute,
    second,
    minuteOfDay: hour * 60 + minute + second / 60
  };
}

function timeRangeMinutes(time) {
  const [start, end] = String(time || "").replace("–", "-").split("-");
  return { start: timeToMinutes(start), end: timeToMinutes(end) };
}

function timeToMinutes(value) {
  const [hour = 0, minute = 0] = String(value || "0:0").split(":").map(Number);
  return hour * 60 + minute;
}

function formatDuration(minutesFloat) {
  const totalSeconds = Math.max(0, Math.ceil(minutesFloat * 60));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}小时 ${String(minutes).padStart(2, "0")}分`;
  return `${String(minutes).padStart(2, "0")}分 ${String(seconds).padStart(2, "0")}秒`;
}

function courseName(item) {
  if (!item) return "暂无";
  return item.teacher ? `${item.subject} (${item.teacher})` : item.subject;
}

function courseMeta(item) {
  if (!item) return "--";
  return `${item.time || "未设置时间"}${item.location ? ` · ${item.location}` : ""}`;
}

function getTodayClasses(now = getBeijingNow()) {
  return state.classes
    .filter((item) => Number(item.day) === now.day)
    .map((item) => ({ ...item, ...timeRangeMinutes(item.time) }))
    .sort((a, b) => a.start - b.start);
}

function renderClockAndCourseStatus() {
  const now = getBeijingNow();
  const todayClasses = getTodayClasses(now);
  const current = todayClasses.find((item) => now.minuteOfDay >= item.start && now.minuteOfDay < item.end);
  const previous = [...todayClasses].reverse().find((item) => item.end <= now.minuteOfDay);
  const next = todayClasses.find((item) => item.start > now.minuteOfDay);
  const dateLabel = `${now.year}年${Number(now.month)}月${Number(now.dateNumber)}日`;

  els.beijingDate.textContent = dateLabel;
  els.beijingTime.textContent = `${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}:${String(now.second).padStart(2, "0")}`;
  els.todayLabel.textContent = `${days[now.day]} · 北京时间`;

  if (current) {
    els.statusLabel.textContent = "正在上课";
    els.currentCourse.textContent = courseName(current);
    els.currentCourseMeta.textContent = courseMeta(current);
    els.countdownLabel.textContent = `距离下课 ${formatDuration(current.end - now.minuteOfDay)}`;
  } else {
    els.statusLabel.textContent = next ? "课间 / 等待上课" : "今日课程结束";
    els.currentCourse.textContent = next ? "下一节即将开始" : "今天辛苦了";
    els.currentCourseMeta.textContent = next ? courseMeta(next) : "没有更多课程";
    els.countdownLabel.textContent = next ? `距离上课 ${formatDuration(next.start - now.minuteOfDay)}` : "已完成今日课表";
  }

  els.previousCourse.textContent = courseName(previous);
  els.previousCourseMeta.textContent = courseMeta(previous);
  els.nextCourse.textContent = courseName(next);
  els.nextCourseMeta.textContent = courseMeta(next);
}

function formatDate(dateString) {
  if (!dateString) return "未设置日期";
  const date = new Date(`${dateString}T00:00:00`);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${days[date.getDay()]}`;
}

function daysUntil(dateString) {
  const now = new Date();
  const target = new Date(`${dateString}T00:00:00`);
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}

function deadlineText(item) {
  const gap = daysUntil(item.date);
  const prefix = gap === 0 ? "今天" : gap === 1 ? "明天" : gap > 1 ? `${gap} 天后` : `已过 ${Math.abs(gap)} 天`;
  return `${prefix} · ${formatDate(item.date)}${item.dueTime ? ` ${item.dueTime}` : ""}`;
}

function empty(text) {
  const div = document.createElement("div");
  div.className = "empty";
  div.textContent = text;
  return div;
}

function itemCard(item, type) {
  const button = document.createElement("button");
  button.className = "item";
  button.type = "button";
  button.addEventListener("click", () => openModal(type, item));

  const content = document.createElement("div");
  const title = document.createElement("h4");
  title.textContent = item.subject;
  const meta = document.createElement("p");
  if (type === "class") {
    meta.textContent = `${days[item.day]} ${item.time || ""}${item.location ? ` · ${item.location}` : ""}`;
  } else if (type === "exam") {
    meta.textContent = `${deadlineText(item)} · ${item.location || "未设置地点"}`;
  } else {
    meta.textContent = `${deadlineText(item)} · 进度 ${item.progress || 0}%`;
  }
  const notes = document.createElement("p");
  notes.textContent = item.notes || "无备注";
  content.append(title, meta, notes);

  const tag = document.createElement("span");
  tag.className = `tag ${type === "exam" ? "exam" : type === "task" ? "task" : ""}`;
  tag.textContent = type === "class" ? "课程" : type === "exam" ? "考试" : "作业";

  button.append(content, tag);
  return button;
}

function classBlock(item) {
  const block = document.createElement("button");
  block.className = "class-block";
  block.type = "button";
  block.addEventListener("click", () => openModal("class", item));

  const title = document.createElement("h4");
  title.textContent = item.subject;
  const meta = document.createElement("p");
  meta.textContent = `${item.time || "未设置时间"}${item.location ? ` · ${item.location}` : ""}${item.teacher ? ` · ${item.teacher}` : ""}`;
  block.append(title, meta);
  return block;
}

function renderDashboard() {
  const todayClasses = getTodayClasses();
  const upcomingExams = state.exams.filter((item) => daysUntil(item.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  const openTasks = state.tasks.filter((item) => Number(item.progress || 0) < 100).sort((a, b) => a.date.localeCompare(b.date));

  els.metrics.classes.textContent = todayClasses.length;
  els.metrics.exams.textContent = upcomingExams.filter((item) => daysUntil(item.date) <= 14).length;
  els.metrics.tasks.textContent = openTasks.length;

  fill(els.todaySchedule, todayClasses.slice(0, 4).map((item) => itemCard(item, "class")), "今天没有课程");
  fill(els.upcomingExams, upcomingExams.slice(0, 4).map((item) => itemCard(item, "exam")), "暂时没有近期考试");
  fill(els.taskPreview, openTasks.slice(0, 4).map((item) => itemCard(item, "task")), "作业都完成了");

  const average = state.tasks.length ? Math.round(state.tasks.reduce((sum, item) => sum + Number(item.progress || 0), 0) / state.tasks.length) : 0;
  els.progressRing.textContent = `${average}%`;
  els.progressRing.style.setProperty("--pct", `${average}%`);
}

function fill(parent, nodes, emptyText) {
  parent.replaceChildren(...(nodes.length ? nodes : [empty(emptyText)]));
}

function renderDayTabs() {
  const buttons = orderedDays.map((day) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = days[day];
    button.className = Number(activeDay) === day ? "is-active" : "";
    button.addEventListener("click", () => {
      activeDay = day;
      render();
    });
    return button;
  });
  els.dayTabs.replaceChildren(...buttons);
}

function renderTimetable() {
  renderDayTabs();
  const daysToShow = window.matchMedia("(max-width: 880px)").matches ? [Number(activeDay)] : orderedDays;
  const columns = daysToShow.map((day) => {
    const col = document.createElement("section");
    col.className = "day-column";
    const title = document.createElement("h3");
    title.textContent = days[day];
    col.append(title);
    const classes = state.classes.filter((item) => Number(item.day) === day).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    col.append(...(classes.length ? classes.map(classBlock) : [empty("无课程")]));
    return col;
  });
  els.timetableGrid.replaceChildren(...columns);
}

function renderExams() {
  const query = els.examSearch.value.trim().toLowerCase();
  const exams = state.exams
    .filter((item) => `${item.subject} ${item.location} ${item.notes}`.toLowerCase().includes(query))
    .sort((a, b) => a.date.localeCompare(b.date));
  fill(els.examList, exams.map((item) => itemCard(item, "exam")), "没有匹配的考试安排");
}

function renderTasks() {
  let tasks = [...state.tasks].sort((a, b) => a.date.localeCompare(b.date));
  if (taskFilter === "open") tasks = tasks.filter((item) => Number(item.progress || 0) < 100);
  if (taskFilter === "done") tasks = tasks.filter((item) => Number(item.progress || 0) >= 100);
  fill(els.taskList, tasks.map((item) => itemCard(item, "task")), "没有符合条件的作业");
}

function setView(view) {
  activeView = view;
  const titles = { dashboard: "总览", timetable: "课表", exams: "考试安排", tasks: "作业进度" };
  els.viewTitle.textContent = titles[view];
  els.navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  Object.entries(els.views).forEach(([key, el]) => el.classList.toggle("is-visible", key === view));
  render();
}

function render() {
  renderClockAndCourseStatus();
  renderDashboard();
  if (activeView === "timetable") renderTimetable();
  if (activeView === "exams") renderExams();
  if (activeView === "tasks") renderTasks();
}

function openModal(type = "task", item = null) {
  editing = item ? { type, id: item.id } : null;
  els.modalTitle.textContent = item ? "编辑记录" : "新增记录";
  els.entryType.value = type;
  els.entryType.disabled = Boolean(item);
  els.deleteEntry.hidden = !item;

  formFields.subject.value = item?.subject || "";
  formFields.location.value = item?.location || "";
  formFields.day.value = item?.day ?? activeDay;
  formFields.time.value = item?.time || "";
  formFields.date.value = item?.date || nextDate(1);
  formFields.dueTime.value = item?.dueTime || "";
  formFields.progress.value = item?.progress || 0;
  formFields.notes.value = item?.notes || "";
  updateFormMode();
  els.modal.showModal();
}

function updateFormMode() {
  const type = els.entryType.value;
  document.querySelectorAll(".class-only").forEach((el) => (el.style.display = type === "class" ? "grid" : "none"));
  document.querySelectorAll(".dated-only").forEach((el) => (el.style.display = type === "class" ? "none" : "grid"));
  document.querySelectorAll(".task-only").forEach((el) => (el.style.display = type === "task" ? "grid" : "none"));
}

function formPayload() {
  const type = els.entryType.value;
  const base = {
    id: editing?.id || crypto.randomUUID(),
    subject: formFields.subject.value.trim(),
    location: formFields.location.value.trim(),
    notes: formFields.notes.value.trim()
  };
  if (type === "class") {
    return { ...base, teacher: formFields.notes.value.trim(), day: Number(formFields.day.value), time: formFields.time.value.trim() };
  }
  if (type === "exam") {
    return { ...base, date: formFields.date.value, dueTime: formFields.dueTime.value };
  }
  return { ...base, date: formFields.date.value, dueTime: formFields.dueTime.value, progress: Number(formFields.progress.value) };
}

function collectionFor(type) {
  return type === "class" ? "classes" : type === "exam" ? "exams" : "tasks";
}

function saveEntry() {
  const type = editing?.type || els.entryType.value;
  const key = collectionFor(type);
  const payload = formPayload();
  if (editing) {
    state[key] = state[key].map((item) => (item.id === editing.id ? payload : item));
  } else {
    state[key].push(payload);
  }
  saveState();
  render();
}

function deleteEntry() {
  if (!editing) return;
  const key = collectionFor(editing.type);
  state[key] = state[key].filter((item) => item.id !== editing.id);
  saveState();
  els.modal.close();
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `study-terminal-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.classes) || !Array.isArray(imported.exams) || !Array.isArray(imported.tasks)) throw new Error("Invalid data");
      state = imported;
      saveState();
      render();
    } catch {
      alert("导入失败：请选择从学习终端导出的 JSON 文件。");
    }
  });
  reader.readAsText(file);
}

els.navItems.forEach((item) => item.addEventListener("click", () => setView(item.dataset.view)));
document.querySelectorAll("[data-view-shortcut]").forEach((item) => item.addEventListener("click", () => setView(item.dataset.viewShortcut)));
document.querySelectorAll("[data-add]").forEach((item) => item.addEventListener("click", () => openModal(item.dataset.add)));
document.querySelector("#quickAdd").addEventListener("click", () => openModal(activeView === "dashboard" ? "task" : activeView === "timetable" ? "class" : activeView === "exams" ? "exam" : "task"));
els.entryType.addEventListener("change", updateFormMode);
els.form.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  saveEntry();
  els.modal.close();
});
els.deleteEntry.addEventListener("click", deleteEntry);
els.examSearch.addEventListener("input", renderExams);
els.taskFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-filter]");
  if (!button) return;
  taskFilter = button.dataset.taskFilter;
  [...els.taskFilters.children].forEach((child) => child.classList.toggle("is-active", child === button));
  renderTasks();
});
document.querySelector("#exportData").addEventListener("click", exportData);
document.querySelector("#importData").addEventListener("click", () => els.fileInput.click());
els.fileInput.addEventListener("change", () => {
  const [file] = els.fileInput.files;
  if (file) importData(file);
  els.fileInput.value = "";
});
window.addEventListener("resize", () => {
  if (activeView === "timetable") renderTimetable();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

els.greetingLabel.textContent = greetings[Math.floor(Math.random() * greetings.length)];
clockTimer = window.setInterval(renderClockAndCourseStatus, 1000);
render();
