import { baseUrl } from '../configs.js';
import { safeGetLocalStorage } from '../utils/localStorage.js';

const sessionToken = () => safeGetLocalStorage('session_token');

/**
 * Fetch all schedule collections (for dropdown selector)
 */
export const getScheduleCollections = async () => {
  const res = await fetch(baseUrl.backend + '/v1/schedule-collections.php', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-session-token': sessionToken() ?? '',
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch collections');
  return data.data || [];
};

/**
 * Fetch single schedule collection (with full metadata)
 */
export const getScheduleCollection = async (id) => {
  const res = await fetch(baseUrl.backend + `/v1/schedule-collections.php?path=v1/schedule-collections/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-session-token': sessionToken() ?? '',
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch collection');
  return data.data;
};

/**
 * Fetch all schedules for a collection (with course/instructor/classroom joins)
 */
export const getSchedules = async (collectionId, params = {}) => {
  const queryParams = new URLSearchParams({
    schedule_collection_id: collectionId,
    limit: 100,
    ...params,
  });
  
  const res = await fetch(baseUrl.backend + `/v1/schedules.php?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-session-token': sessionToken() ?? '',
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch schedules');
  return data.data || [];
};

/**
 * Update a single schedule (time/day only)
 */
export const updateSchedule = async (scheduleId, updates) => {
  const res = await fetch(baseUrl.backend + `/v1/schedules.php?path=api/v1/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-session-token': sessionToken() ?? '',
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update schedule');
  return data.data;
};

/**
 * Fetch all courses (for export course list sheet)
 */
export const getCourses = async () => {
  const res = await fetch(baseUrl.backend + '/v1/courses.php?limit=100', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-session-token': sessionToken() ?? '',
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch courses');
  return data.data || [];
};
