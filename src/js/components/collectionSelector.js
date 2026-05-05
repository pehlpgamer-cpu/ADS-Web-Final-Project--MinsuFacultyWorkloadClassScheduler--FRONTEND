/**
 * Collection Selector Component
 * Dropdown + Export button for schedule collections
 */

export const collectionSelector = (collections = []) => {
  const optionsHtml = collections
    .map(
      (col) =>
        `<option value="${col.schedule_collection_id}">${col.title || `Collection ${col.schedule_collection_id}`}</option>`
    )
    .join('');

  return `
    <div class="flex items-center gap-4 p-4 bg-white border-b border-gray-300">
      <div class="flex items-center gap-2">
        <label for="scheduleCollectionDropdown" class="text-sm font-semibold">Schedule Collection:</label>
        <select id="scheduleCollectionDropdown" class="border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          ${optionsHtml}
        </select>
      </div>
      <button id="exportScheduleBtn" class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 transition">
        📥 Export to Excel
      </button>
    </div>
  `;
};
