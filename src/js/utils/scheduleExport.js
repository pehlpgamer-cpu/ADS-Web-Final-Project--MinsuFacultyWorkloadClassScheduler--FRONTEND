/**
 * Schedule Export Utility
 * Exports schedule data to Excel using the same spreadsheet-style grid shown
 * in scheduler.html.
 */

import * as XLSX from 'xlsx';

const BASE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'];
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const START_MINUTES = 7 * 60 + 30;
const END_MINUTES = 18 * 60;
const SLOT_MINUTES = 30;
const FALLBACK_VALUE = '-';
const GRID_START_ROW = 3;

const toMinutes = (time) => {
  if (!time) return null;
  const [hours = '0', minutes = '0'] = String(time).split(':');
  return Number(hours) * 60 + Number(minutes);
};

const formatTime = (minutes) => {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, '0')}`;
};

const buildSlots = () => {
  const slots = [];
  for (let minute = START_MINUTES; minute < END_MINUTES; minute += SLOT_MINUTES) {
    slots.push(minute);
  }
  return slots;
};

const getDisplayDays = (schedules) => {
  const daysWithSchedules = new Set(schedules.map((s) => s.day).filter(Boolean));
  const extras = ALL_DAYS.filter((day) => !BASE_DAYS.includes(day) && daysWithSchedules.has(day));
  return [...BASE_DAYS.slice(0, 5), ...extras, 'Sunday'];
};

const getCourseTitle = (schedule) => schedule.title || schedule.course_description || '';

const getInstructor = (schedule) => schedule.instructor_name || schedule.instructor || FALLBACK_VALUE;

const getRoom = (schedule) => schedule.classroom_name || schedule.room || FALLBACK_VALUE;

const getUnits = (schedule) => Number(schedule.units || schedule.course_units || 3);

const buildCourseList = (schedules) => {
  const map = new Map();

  schedules.forEach((schedule) => {
    const code = schedule.course_code || schedule.code;
    if (!code || map.has(code)) return;

    map.set(code, {
      code,
      title: getCourseTitle(schedule),
      units: getUnits(schedule),
      instructor: getInstructor(schedule),
    });
  });

  return [...map.values()].sort((a, b) => a.code.localeCompare(b.code));
};

const courseCellText = (schedule) => {
  const parts = [
    schedule.course_code || '',
    getCourseTitle(schedule),
    getInstructor(schedule),
  ].filter(Boolean);

  return parts.join('\n');
};

const applyCellStyle = (ws, ref, style) => {
  if (!ws[ref]) ws[ref] = { t: 's', v: '' };
  ws[ref].s = style;
};

const headerStyle = {
  font: { bold: true, color: { rgb: 'D7DCE8' } },
  fill: { fgColor: { rgb: '001D57' }, patternType: 'solid' },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: {
    top: { style: 'thin', color: { rgb: '1F1F1F' } },
    bottom: { style: 'thin', color: { rgb: '1F1F1F' } },
    left: { style: 'thin', color: { rgb: '1F1F1F' } },
    right: { style: 'thin', color: { rgb: '1F1F1F' } },
  },
};

const bodyStyle = {
  fill: { fgColor: { rgb: '9F9F9F' }, patternType: 'solid' },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: headerStyle.border,
};

const timeStyle = {
  ...bodyStyle,
  fill: { fgColor: { rgb: '8E97A1' }, patternType: 'solid' },
  alignment: { horizontal: 'left', vertical: 'center' },
};

const blockStyle = {
  ...bodyStyle,
  fill: { fgColor: { rgb: 'B4AD00' }, patternType: 'solid' },
  font: { bold: true },
};

const titleStyle = {
  font: { bold: true, sz: 18 },
  fill: { fgColor: { rgb: 'A4A4A4' }, patternType: 'solid' },
  alignment: { horizontal: 'left', vertical: 'center' },
};

const buildSpreadsheetData = (schedules, collectionTitle) => {
  const days = getDisplayDays(schedules);
  const slots = buildSlots();
  const columnCount = 1 + days.length * 2;
  const rows = [];
  const merges = [];

  rows.push(Array(columnCount).fill(''));
  rows[0][0] = collectionTitle;
  rows.push(Array(columnCount).fill(''));

  const header = ['TIME'];
  days.forEach((day) => {
    header.push(day.toUpperCase(), 'Room');
  });
  rows.push(header);

  slots.forEach((slot) => {
    const row = Array(columnCount).fill('');
    row[0] = `${formatTime(slot)} - ${formatTime(slot + SLOT_MINUTES)}`;
    rows.push(row);
  });

  schedules.forEach((schedule) => {
    const start = toMinutes(schedule.start_time);
    const end = toMinutes(schedule.end_time);
    const dayIndex = days.indexOf(schedule.day);

    if (start === null || end === null || end <= start || dayIndex === -1) return;

    const alignedStart = START_MINUTES + Math.floor((start - START_MINUTES) / SLOT_MINUTES) * SLOT_MINUTES;
    const slotIndex = Math.floor((alignedStart - START_MINUTES) / SLOT_MINUTES);
    if (slotIndex < 0 || slotIndex >= slots.length) return;

    const rowIndex = GRID_START_ROW + slotIndex;
    const rowSpan = Math.max(1, Math.ceil((end - alignedStart) / SLOT_MINUTES));
    const endRow = Math.min(rowIndex + rowSpan - 1, GRID_START_ROW + slots.length - 1);
    const subjectCol = 1 + dayIndex * 2;
    const roomCol = subjectCol + 1;

    rows[rowIndex][subjectCol] = courseCellText(schedule);
    rows[rowIndex][roomCol] = getRoom(schedule);

    if (endRow > rowIndex) {
      merges.push({ s: { r: rowIndex, c: subjectCol }, e: { r: endRow, c: subjectCol } });
      merges.push({ s: { r: rowIndex, c: roomCol }, e: { r: endRow, c: roomCol } });
    }
  });

  const courseStartRow = GRID_START_ROW + slots.length + 3;
  while (rows.length < courseStartRow) rows.push(Array(columnCount).fill(''));

  rows.push(['COURSE CODE', 'COURSE DESCRIPTION', 'UNITS', 'INSTRUCTOR']);
  const courses = buildCourseList(schedules);
  courses.forEach((course) => {
    rows.push([course.code, course.title, course.units, course.instructor]);
  });

  const totalUnits = courses.reduce((sum, course) => sum + course.units, 0);
  rows.push(['', 'TOTAL', totalUnits, '']);

  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: columnCount - 1 } });

  return { rows, days, slots, merges, courseStartRow, columnCount };
};

const applyFormatting = (ws, meta) => {
  const { rows, slots, courseStartRow, columnCount } = meta;

  for (let row = 0; row < rows.length; row += 1) {
    for (let col = 0; col < columnCount; col += 1) {
      const ref = XLSX.utils.encode_cell({ r: row, c: col });
      if (row === 0) {
        applyCellStyle(ws, ref, titleStyle);
      } else if (row === 2 || row === courseStartRow) {
        applyCellStyle(ws, ref, headerStyle);
      } else if (row >= GRID_START_ROW && row < GRID_START_ROW + slots.length && col === 0) {
        applyCellStyle(ws, ref, timeStyle);
      } else {
        applyCellStyle(ws, ref, bodyStyle);
      }
    }
  }

  const gridEndRow = GRID_START_ROW + slots.length - 1;
  for (let row = GRID_START_ROW; row <= gridEndRow; row += 1) {
    for (let col = 1; col < columnCount; col += 2) {
      const ref = XLSX.utils.encode_cell({ r: row, c: col });
      if (ws[ref]?.v) applyCellStyle(ws, ref, blockStyle);
    }
  }

  const totalRow = rows.length - 1;
  for (let col = 0; col < 4; col += 1) {
    const ref = XLSX.utils.encode_cell({ r: totalRow, c: col });
    applyCellStyle(ws, ref, { ...bodyStyle, font: { bold: true } });
  }
};

export const exportSchedulesToExcel = (schedules, collectionTitle = 'Schedule') => {
  if (!schedules || schedules.length === 0) {
    alert('No schedules to export');
    return;
  }

  try {
    const meta = buildSpreadsheetData(schedules, collectionTitle);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(meta.rows);

    ws['!merges'] = meta.merges;
    ws['!cols'] = [
      { wch: 16 },
      ...meta.days.flatMap(() => [{ wch: 19 }, { wch: 14 }]),
    ];
    ws['!rows'] = meta.rows.map((_, index) => ({
      hpt: index >= GRID_START_ROW && index < GRID_START_ROW + meta.slots.length ? 21 : 24,
    }));

    applyFormatting(ws, meta);
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const sanitizedTitle = collectionTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `schedule_${sanitizedTitle}_${dateStr}.xlsx`;

    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.error('Export error:', err);
    alert('Failed to export schedule: ' + err.message);
  }
};
