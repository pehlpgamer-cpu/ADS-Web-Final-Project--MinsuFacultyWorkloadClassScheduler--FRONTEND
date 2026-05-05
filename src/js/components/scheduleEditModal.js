/**
 * Schedule Edit Modal Component
 * Modal form to edit start_time, end_time, and day
 */

const TIME_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  const min = parseInt(m);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(min).padStart(2, '0')} ${ampm}`;
};

export const scheduleEditModal = () => {
  const timeOptions = TIME_SLOTS.map(
    (t) => `<option value="${t}">${formatTime12h(t)}</option>`
  ).join('');

  const dayOptions = DAYS.map(
    (d) => `<option value="${d}">${d}</option>`
  ).join('');

  return `
    <div id="scheduleEditModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-lg font-bold mb-4">Edit Schedule</h2>
        
        <form id="scheduleEditForm" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Day:</label>
            <select id="editDay" class="border border-gray-400 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              ${dayOptions}
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Start Time:</label>
            <select id="editStartTime" class="border border-gray-400 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              ${timeOptions}
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">End Time:</label>
            <select id="editEndTime" class="border border-gray-400 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              ${timeOptions}
            </select>
          </div>

          <div class="flex gap-2 pt-4">
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition">
              Save
            </button>
            <button type="button" id="scheduleEditCancel" class="flex-1 px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded hover:bg-gray-600 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};

/**
 * Show modal and pre-fill with schedule data
 */
export const showScheduleEditModal = (schedule) => {
  const modal = document.getElementById('scheduleEditModal');
  if (!modal) return;

  document.getElementById('editDay').value = schedule.day || 'Monday';
  document.getElementById('editStartTime').value = schedule.start_time || '09:00';
  document.getElementById('editEndTime').value = schedule.end_time || '10:00';

  // Store schedule ID in modal for later retrieval
  modal.dataset.scheduleId = schedule.schedule_id;

  modal.classList.remove('hidden');
};

/**
 * Hide modal
 */
export const hideScheduleEditModal = () => {
  const modal = document.getElementById('scheduleEditModal');
  if (modal) modal.classList.add('hidden');
};

/**
 * Get form values
 */
export const getScheduleEditFormData = () => {
  const modal = document.getElementById('scheduleEditModal');
  return {
    schedule_id: modal.dataset.scheduleId,
    day: document.getElementById('editDay').value,
    start_time: document.getElementById('editStartTime').value,
    end_time: document.getElementById('editEndTime').value,
  };
};
