/**
 * Schedule Grid Component
 * Renders a 7-day × 21-slot weekly schedule table
 */

const TIME_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Convert 24h time format (HH:MM) to 12h AM/PM
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
 * Find all schedules for a given day and start time
 */
const getSchedulesForSlot = (schedules, dayName, startTime) => {
  return schedules.filter(
    (s) => s.day?.toLowerCase() === dayName.toLowerCase() && s.start_time === startTime
  );
};

/**
 * Render a single schedule entry (small card)
 */
const renderScheduleCard = (schedule) => {
  const timeRange = `${formatTime12h(schedule.start_time)} - ${formatTime12h(schedule.end_time)}`;
  const cardId = `schedule-card-${schedule.schedule_id}`;
  return `
    <div id="${cardId}" class="text-xs p-1 mb-1 bg-blue-100 border border-blue-300 rounded cursor-pointer hover:bg-blue-200 transition"
         data-schedule-id="${schedule.schedule_id}"
         data-start-time="${schedule.start_time}"
         data-end-time="${schedule.end_time}"
         data-day="${schedule.day}"
         data-instructor="${schedule.instructor_name || 'TBA'}"
         data-course-code="${schedule.course_code || 'N/A'}"
         data-classroom="${schedule.classroom_name || 'N/A'}"
         data-title="${(schedule.title || '').replace(/"/g, '&quot;')}"
         onclick="window.scheduleCardClick(this)">
      <div class="font-semibold">${schedule.course_code || 'N/A'}</div>
      <div class="text-xs">${schedule.title || ''}</div>
      <div class="text-xs">${schedule.instructor_name || 'TBA'}</div>
      <div class="text-xs">${schedule.classroom_name || 'N/A'}</div>
      <div class="text-xs italic">${timeRange}</div>
    </div>
  `;
};

/**
 * Build and return the schedule grid HTML
 */
export const scheduleGrid = (schedules = []) => {
  if (!schedules || schedules.length === 0) {
    return `<div class="p-4 text-center text-gray-500">No schedules found for this collection.</div>`;
  }

  // Build table header (days)
  let html = `
    <div class="overflow-x-auto">
      <table class="border-collapse w-full min-w-max bg-white">
        <thead>
          <tr>
            <th class="border border-gray-300 bg-gray-200 p-2 w-20 text-xs font-bold">TIME</th>
  `;

  DAY_SHORT.forEach((day, idx) => {
    html += `<th class="border border-gray-300 bg-gray-200 p-2 min-w-32 text-xs font-bold">${day}</th>`;
  });

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  // Build table body (time slots)
  TIME_SLOTS.forEach((slotTime) => {
    const displayTime = formatTime12h(slotTime);
    // Calculate next slot for end time (all slots are 30 min)
    const [h, m] = slotTime.split(':');
    let nextMin = parseInt(m) + 30;
    let nextHour = parseInt(h);
    if (nextMin >= 60) {
      nextMin = 0;
      nextHour += 1;
    }
    const nextSlotTime = `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`;
    const displayEndTime = formatTime12h(nextSlotTime);
    const timeLabel = `${displayTime} - ${displayEndTime}`;

    html += `
      <tr>
        <th class="border border-gray-300 bg-gray-100 p-2 text-xs font-semibold whitespace-nowrap">${timeLabel}</th>
    `;

    // Add cells for each day
    DAYS.forEach((day) => {
      const daySchedules = getSchedulesForSlot(schedules, day, slotTime);
      let cellContent = '';

      if (daySchedules.length === 0) {
        cellContent = '<div class="p-1 h-20"></div>';
      } else {
        cellContent = daySchedules.map(renderScheduleCard).join('');
      }

      html += `
        <td class="border border-gray-300 p-1 align-top min-h-20">
          ${cellContent}
        </td>
      `;
    });

    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
};
