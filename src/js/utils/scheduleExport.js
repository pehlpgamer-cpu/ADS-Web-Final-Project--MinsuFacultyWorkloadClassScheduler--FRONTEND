/**
 * Schedule Export Utility
 * Converts schedule data to Excel file with two sheets:
 * 1. Weekly Schedule (flat table)
 * 2. Course List
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
 */
const buildWeeklyScheduleData = (schedules) => {
  const header = ['Day', 'Time', 'Course', 'Instructor', 'Room'];
  const rows = schedules.map((s) => [
    s.day || '',
    `${formatTime12h(s.start_time)} - ${formatTime12h(s.end_time)}`,
    s.course_code || '',
    s.instructor_name || 'TBA',
    s.classroom_name || '—',
  ]);

  return [header, ...rows];
};

/**
 * Build the Course List sheet data (unique courses only)
 */
const buildCourseListData = (schedules) => {
  const header = ['Course Code', 'Course Description', 'Units', 'Instructor'];

  // Extract unique courses
  const courseMap = {};
  schedules.forEach((s) => {
    if (s.course_code) {
      courseMap[s.course_code] = {
        code: s.course_code,
        title: s.title || '',
        units: s.units || 3, // Default to 3 if not provided
        instructor: s.instructor_name || 'TBA',
      };
    }
  });

  const rows = Object.values(courseMap).map((c) => [
    c.code,
    c.title,
    c.units,
    c.instructor,
  ]);

  return [header, ...rows];
};

/**
 * Export schedules to Excel file
 */
export const exportSchedulesToExcel = (schedules, collectionTitle = 'Schedule') => {
  if (!schedules || schedules.length === 0) {
    alert('No schedules to export');
    return;
  }

  try {
    // Build sheet data
    const weeklyData = buildWeeklyScheduleData(schedules);
    const courseData = buildCourseListData(schedules);

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add Weekly Schedule sheet
    const ws1 = XLSX.utils.aoa_to_sheet(weeklyData);
    ws1['!cols'] = [
      { wch: 12 }, // Day
      { wch: 20 }, // Time
      { wch: 20 }, // Course
      { wch: 25 }, // Instructor
      { wch: 20 }, // Room
    ];
    XLSX.utils.book_append_sheet(wb, ws1, 'Weekly Schedule');

    // Add Course List sheet
    const ws2 = XLSX.utils.aoa_to_sheet(courseData);
    ws2['!cols'] = [
      { wch: 15 }, // Course Code
      { wch: 40 }, // Description
      { wch: 8 }, // Units
      { wch: 25 }, // Instructor
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'Course List');

    // Generate filename with timestamp
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const sanitizedTitle = collectionTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `schedule_${sanitizedTitle}_${dateStr}.xlsx`;

    // Write and download
    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.error('Export error:', err);
    alert('Failed to export schedule: ' + err.message);
  }
};
