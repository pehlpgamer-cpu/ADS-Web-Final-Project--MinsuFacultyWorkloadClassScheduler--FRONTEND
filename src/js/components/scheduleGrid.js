/**
 * Schedule Grid Component - Flat Table Format
 * Renders schedules as a simple table matching the export format:
 * Day | Time | Course/Subject | Instructor | Room | Action
 */

const DAY_ORDER = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatTime12h = (time24) => {
  if (!time24) return '—';
  const [hours = '0', minutes = '0'] = String(time24).split(':');
  const h = Number(hours);
  const m = String(minutes).padStart(2, '0');
  const hour12 = h % 12 || 12;
  const period = h >= 12 ? 'PM' : 'AM';
  return `${hour12}:${m} ${period}`;
};

const formatTimeRange = (start, end) => {
  return `${formatTime12h(start)} - ${formatTime12h(end)}`;
};

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

const scheduleButton = (schedule, conflictCount = 0) => {
  const title = getCourseTitle(schedule);
  const instructor = getInstructor(schedule);
  const conflictLabel = conflictCount > 1 ? `<span class="schedule-conflict">+${conflictCount - 1}</span>` : '';

  return `
    <button
      type="button"
      class="schedule-block-button"
      onclick="window.scheduleCardClick(this)"
      data-schedule-id="${escapeHtml(schedule.schedule_id)}"
      data-start-time="${escapeHtml(schedule.start_time)}"
      data-end-time="${escapeHtml(schedule.end_time)}"
      data-day="${escapeHtml(schedule.day)}"
      data-instructor="${escapeHtml(instructor)}"
      data-course-code="${escapeHtml(schedule.course_code || '')}"
      data-classroom="${escapeHtml(getRoom(schedule))}"
      data-title="${escapeHtml(title)}"
      title="Edit ${escapeHtml(schedule.course_code || title)}"
    >
      <span class="schedule-course-code">${escapeHtml(schedule.course_code || '')}${conflictLabel}</span>
      ${title ? `<span class="schedule-course-title">${escapeHtml(title)}</span>` : ''}
      <span class="schedule-instructor">${escapeHtml(instructor)}</span>
    </button>
  `;
};

const buildScheduleMatrix = (schedules, days, slots) => {
  const byStart = new Map();
  const occupied = new Set();

  schedules.forEach((schedule) => {
    const day = schedule.day;
    const start = toMinutes(schedule.start_time);
    const end = toMinutes(schedule.end_time);
    if (!day || start === null || end === null || end <= start) return;

    const alignedStart = START_MINUTES + Math.floor((start - START_MINUTES) / SLOT_MINUTES) * SLOT_MINUTES;
    const key = `${day}:${alignedStart}`;
    const rowSpan = Math.max(1, Math.ceil((end - alignedStart) / SLOT_MINUTES));
    const item = { schedule, rowSpan };

    if (!byStart.has(key)) byStart.set(key, []);
    byStart.get(key).push(item);
  });

  let body = '';

  slots.forEach((slot) => {
    body += `
      <tr>
        <td class="schedule-time-cell">${formatTime(slot)} - ${formatTime(slot + SLOT_MINUTES)}</td>
    `;

    days.forEach((day) => {
      const occupiedKey = `${day}:${slot}`;
      const startItems = byStart.get(occupiedKey) || [];

      if (startItems.length > 0) {
        const rowSpan = Math.max(...startItems.map((item) => item.rowSpan));
        const first = startItems[0].schedule;
        const blockHtml = startItems
          .map((item) => scheduleButton(item.schedule, startItems.length))
          .join('');

        for (let offset = 1; offset < rowSpan; offset += 1) {
          occupied.add(`${day}:${slot + offset * SLOT_MINUTES}`);
        }

        body += `
          <td rowspan="${rowSpan}" class="schedule-subject-cell ${courseColorClass(first.course_code)}">
            ${blockHtml}
          </td>
          <td rowspan="${rowSpan}" class="schedule-room-cell">${escapeHtml(getRoom(first))}</td>
        `;
      } else if (!occupied.has(occupiedKey)) {
        body += `
          <td class="schedule-empty-cell"></td>
          <td class="schedule-room-empty-cell"></td>
        `;
      }
    });

    body += '</tr>';
  });

  return body;
};

const buildCourseSummary = (schedules) => {
  const courses = buildCourseList(schedules);
  const totalUnits = courses.reduce((sum, course) => sum + course.units, 0);

  const rows = courses
    .map(
      (course) => `
        <tr>
          <td>${escapeHtml(course.code)}</td>
          <td>${escapeHtml(course.title)}</td>
          <td class="text-center">${escapeHtml(course.units)}</td>
          <td>${escapeHtml(course.instructor)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <table class="schedule-course-table">
      <thead>
        <tr>
          <th>COURSE CODE</th>
          <th>COURSE DESCRIPTION</th>
          <th>UNITS</th>
          <th>INSTRUCTOR</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="schedule-total-row">
          <td></td>
          <td class="text-center">TOTAL</td>
          <td class="text-center">${escapeHtml(totalUnits)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  `;
};

export const scheduleGrid = (schedules = [], collectionTitle = 'Schedule') => {
  if (!schedules || schedules.length === 0) {
    return `<div class="p-4 text-center text-gray-500">No schedules found for this collection.</div>`;
  }

  const days = getDisplayDays(schedules);
  const slots = buildSlots();
  const matrixRows = buildScheduleMatrix(schedules, days, slots);

  return `
    <section class="schedule-sheet-wrap">
      <style>
        .schedule-sheet-wrap {
          min-width: 1180px;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }

        .schedule-sheet {
          background: #ffffff;
          padding: 28px 32px 26px;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.16);
        }

        .schedule-sheet-title {
          margin: 0 0 28px 4px;
          font-size: 26px;
          font-weight: 700;
          line-height: 1;
        }

        .schedule-grid-table,
        .schedule-course-table {
          border-collapse: collapse;
          table-layout: fixed;
          background: #ffffff;
        }

        .schedule-grid-table {
          width: 100%;
        }

        .schedule-grid-table th,
        .schedule-grid-table td,
        .schedule-course-table th,
        .schedule-course-table td {
          border: 2px solid #1f1f1f;
          padding: 0;
        }

        .schedule-grid-table th,
        .schedule-course-table th {
          height: 24px;
          background: #001d57;
          color: #d7dce8;
          font-size: 16px;
          font-weight: 700;
          text-align: center;
        }

        .schedule-grid-table .schedule-room-head {
          color: #9ca3af;
          width: 86px;
        }

        .schedule-time-head,
        .schedule-time-cell {
          width: 154px;
        }

        .schedule-time-cell {
          height: 26px;
          padding-left: 3px;
          background: #ffffff;
          color: #101827;
          font-size: 18px;
          line-height: 1;
          white-space: nowrap;
        }

        .schedule-subject-head {
          width: 134px;
        }

        .schedule-subject-cell,
        .schedule-room-cell,
        .schedule-empty-cell,
        .schedule-room-empty-cell {
          height: 26px;
          vertical-align: middle;
        }

        .schedule-empty-cell,
        .schedule-room-empty-cell,
        .schedule-room-cell {
          background: #ffffff;
        }

        .schedule-subject-cell {
          overflow: hidden;
        }

        .schedule-color-0 { background: #b5b700; }
        .schedule-color-1 { background: #b18a22; }
        .schedule-color-2 { background: #b4ad00; }
        .schedule-color-3 { background: #a87915; }
        .schedule-color-4 { background: #0a7c9b; }
        .schedule-color-5 { background: #577096; }
        .schedule-color-6 { background: #6d86a2; }
        .schedule-color-7 { background: #07883d; }
        .schedule-color-8 { background: #6f8ca6; }
        .schedule-color-9 { background: #7d8ca0; }

        .schedule-room-cell {
          padding: 2px 4px;
          font-size: 16px;
          line-height: 1.35;
          text-align: center;
          white-space: pre-line;
        }

        .schedule-block-button {
          display: grid;
          width: 100%;
          min-height: 100%;
          height: 100%;
          border: 0;
          background: transparent;
          color: #111827;
          cursor: pointer;
          padding: 4px 3px;
          text-align: center;
          align-content: space-between;
          gap: 3px;
          font: inherit;
        }

        .schedule-block-button:hover,
        .schedule-block-button:focus-visible {
          outline: 3px solid rgba(255, 255, 255, 0.72);
          outline-offset: -4px;
        }

        .schedule-course-code,
        .schedule-course-title,
        .schedule-instructor {
          display: block;
          overflow-wrap: anywhere;
        }

        .schedule-course-code {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.12;
        }

        .schedule-course-title {
          font-size: 15px;
          line-height: 1.15;
        }

        .schedule-instructor {
          align-self: end;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.1;
        }

        .schedule-conflict {
          display: inline-block;
          margin-left: 4px;
          padding: 0 4px;
          background: rgba(255, 255, 255, 0.55);
          border-radius: 999px;
          font-size: 12px;
        }

        .schedule-course-table {
          width: 80%;
          margin-top: 48px;
        }

        .schedule-course-table th {
          height: 24px;
        }

        .schedule-course-table td {
          height: 24px;
          padding: 1px 4px;
          background: #ffffff;
          font-size: 16px;
          line-height: 1.1;
        }

        .schedule-course-table th:nth-child(1) { width: 160px; }
        .schedule-course-table th:nth-child(2) { width: 55%; }
        .schedule-course-table th:nth-child(3) { width: 135px; }
        .schedule-course-table th:nth-child(4) { width: 220px; }

        .schedule-total-row td {
          height: 30px;
          font-weight: 700;
        }
      </style>

      <div class="schedule-sheet">
        <h1 class="schedule-sheet-title">${escapeHtml(collectionTitle)}</h1>
        <table class="schedule-grid-table" aria-label="Weekly schedule">
          <thead>
            <tr>
              <th class="schedule-time-head">TIME</th>
              ${days
                .map(
                  (day) => `
                    <th class="schedule-subject-head">${day.toUpperCase()}</th>
                    <th class="schedule-room-head">Room</th>
                  `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${matrixRows}
          </tbody>
        </table>
        ${buildCourseSummary(schedules)}
      </div>
    </section>
  `;
};
