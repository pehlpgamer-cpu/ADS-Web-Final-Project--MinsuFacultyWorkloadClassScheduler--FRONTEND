/**
 * Schedule Grid Component
 * Renders schedules as a flat table matching export format:
 * Day | Time | Course / Subject | Instructor | Room
 */

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
 * Build and return the schedule table HTML
 */
export const scheduleGrid = (schedules = []) => {
  if (!schedules || schedules.length === 0) {
    return `<div class="p-4 text-center text-gray-500">No schedules found for this collection.</div>`;
  }

  // Sort by day order, then by time
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sorted = [...schedules].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day || 'Sunday') - dayOrder.indexOf(b.day || 'Sunday');
    if (dayDiff !== 0) return dayDiff;
    return (a.start_time || '').localeCompare(b.start_time || '');
  });

  let html = `
    <table class="w-full border-collapse bg-white border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 p-3 text-left font-bold">Day</th>
          <th class="border border-gray-300 p-3 text-left font-bold">Time</th>
          <th class="border border-gray-300 p-3 text-left font-bold">Course / Subject</th>
          <th class="border border-gray-300 p-3 text-left font-bold">Instructor</th>
          <th class="border border-gray-300 p-3 text-left font-bold">Room</th>
          <th class="border border-gray-300 p-3 text-left font-bold">Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  sorted.forEach((s) => {
    // Format course: "ITP 221 - Advanced Database Systems"
    let courseText = '';
    if (s.course_code && s.title) {
      courseText = `${s.course_code} - ${s.title}`;
    } else if (s.course_code) {
      courseText = s.course_code;
    } else if (s.title) {
      courseText = s.title;
    }

    const timeRange = `${formatTime12h(s.start_time)} - ${formatTime12h(s.end_time)}`;
    const instructor = s.instructor_name || '—';
    const room = s.classroom_name || '—';

    html += `
      <tr class="border-b border-gray-300 hover:bg-blue-50 transition">
        <td class="border border-gray-300 p-3 text-sm">${s.day || ''}</td>
        <td class="border border-gray-300 p-3 text-sm whitespace-nowrap">${timeRange}</td>
        <td class="border border-gray-300 p-3 text-sm">${courseText}</td>
        <td class="border border-gray-300 p-3 text-sm">${instructor}</td>
        <td class="border border-gray-300 p-3 text-sm">${room}</td>
        <td class="border border-gray-300 p-3 text-center">
          <button class="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition"
                  onclick="window.scheduleCardClick(this)"
                  data-schedule-id="${s.schedule_id}"
                  data-start-time="${s.start_time}"
                  data-end-time="${s.end_time}"
                  data-day="${s.day}"
                  data-instructor="${s.instructor_name || '—'}"
                  data-course-code="${s.course_code || ''}"
                  data-classroom="${s.classroom_name || '—'}"
                  data-title="${(s.title || '').replace(/"/g, '&quot;')}">
            Edit
          </button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
};
