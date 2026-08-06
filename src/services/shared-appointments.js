import axios from 'axios';

const SHARED_APPOINTMENTS_STORAGE_KEY = 'sharedAppointments';
const SHARED_APPOINTMENTS_URL = 'http://localhost:3000/sharedAppointments';

export function buildSharedAppointment(appointment, sharedBy) {
    return {
        ...appointment,
        sharedBy,
        sharedAt: new Date().toISOString()
    };
}

export async function loadSharedAppointments() {
    if (typeof window !== 'undefined') {
        try {
            const storedValue = window.localStorage.getItem(SHARED_APPOINTMENTS_STORAGE_KEY);
            if (storedValue) {
                return JSON.parse(storedValue);
            }
        } catch (error) {
            console.error('Unable to load shared appointments from storage', error);
        }
    }

    try {
        const response = await axios.get(SHARED_APPOINTMENTS_URL);
        return response.data || [];
    } catch (error) {
        console.error('Unable to load shared appointments from server', error);
        return [];
    }
}

export async function shareAppointment(appointment, sharedBy) {
    const sharedAppointment = buildSharedAppointment(appointment, sharedBy);

    try {
        const response = await axios.post(SHARED_APPOINTMENTS_URL, sharedAppointment);
        persistSharedAppointments([...(await loadSharedAppointments()), response.data]);
        return response.data;
    } catch (error) {
        console.error('Unable to share appointment', error);
        return sharedAppointment;
    }
}

export function persistSharedAppointments(sharedAppointments) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(SHARED_APPOINTMENTS_STORAGE_KEY, JSON.stringify(sharedAppointments));
}
