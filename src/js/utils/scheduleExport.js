/**
 * Schedule Export Utility
 * Exports schedule data to Excel matching the provided table format:
 * Sheet 1: Weekly Schedule (Day | Time | Course / Subject | Instructor | Room)
 * Sheet 2: Course List (Course Code | Course Description | Units | Instructor + Total row)
 */

import * as XLSX from 'xlsx';

const formatTime12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  const min = parseInt(m);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(min).padStart(2, '0')} ${ampm}`;
};

/**
 * Build the Weekly Schedule sheet data
 * Format: Day | Time | Course / Subject | Instructor | Room
 * Sorted by day order (Sun-Sat), then by time ascending
 */
const buildWeeklyScheduleData = (schedules) => {
  const header = ['Day', 'Time', 'Course / Subject', 'Instructor', 'Room'];
  
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sorted = [...schedules].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day || 'Sunday') - dayOrder.indexOf(b.day || 'Sunday');
    if (dayDiff !== 0) return dayDiff;
    return (a.start_time || '').localeCompare(b.start_time || '');
  });

  const rows = sorted.map((s) => {
    let courseText = '';
    if (s.course_code && s.title) {
      courseText = `${s.course_code} - ${s.title}`;
    } else if (s.course_code) {
      courseText = s.course_code;
    } else if (s.title) {
      courseText = s.title;
    }

    return [
      s.day || '',
      `${formatTime12h(s.start_time)} - ${formatTime12h(s.end_time)}`,
      courseText,
      s.instructor_name || '—',
      s.classroom_name || '—',
    ];
  });

  return [header, ...rows];
};

/**
 * Build the Course List sheet data
 * Format: Course Code | Course Description | Units | Instructor
 * Includes total row with sum of units
 */
const buildCourseListData = (schedules) => {
  const header = ['Course Code', 'Course Description', 'Units', 'Instructor'];

  const courseMap = {};
  schedules.forEach((s) => {
    if (s.course_code && !courseMap[s.course_code]) {
      courseMap[s.course_code] = {
        code: s.course_code,
        title: s.title || '',
        units: s.units || 3,
        instructor: s.instructor_name || '—',
      };
    }
  });

  const courses = Object.values(courseMap).sort((a, b) => a.code.localeCompare(b.code));
  const rows = courses.map((c) => [c.code, c.title, c.units, c.instructor]);

  const totalUnits = rows.reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
  rows.push(['', '', totalUnits, '']);

  return [header, ...rows];
};

const applyFormatting = (ws) => {
  if (!ws['!ref']) return;
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (ws[cellRef]) {
      ws[cellRef].s = {
        font: { bold: true, color: { rgb: '000000' } },
        fill: { fgColor: { rgb: 'D3D3D3' }, patternType: 'solid' },
        alignment: { horizontal: 'left', vertical: 'center' },
      };
    }
  }
};

export const exportSchedulesToExcel = (schedules, collectionTitle = 'Schedule') => {
  if (!schedules || schedules.length === 0) {
    alert('No schedules to export');
    return;
  }

  try {
    const weeklyData = buildWeeklyScheduleData(schedules);
    const courseData = buildCourseListData(schedules);

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.aoa_to_sheet(weeklyData);
    ws1['!cols'] = [
      { wch: 15 },
      { wch: 22 },
      { wch: 40 },
      { wch: 28 },
      { wch: 30 },
    ];
    applyFormatting(ws1);
    XLSX.utils.book_append_sheet(wb, ws1, 'Weekly Schedule');

    const ws2 = XLSX.utils.aoa_to_sheet(courseData);
    ws2['!cols'] = [
      { wch: 15 },
      { wch: 40 },
      { wch: 10 },
      { wch: 30 },
    ];
    applyFormatting(ws2);

    const lastRow = courseData.length - 1;
    for (let col = 0; col < 4; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: lastRow, c: col });
      if (ws2[cellRef]) {
        ws2[cellRef].s = { font: { bold: true } };
      }
    }

    XLSX.utils.book_append_sheet(wb, ws2, 'Course List');

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
