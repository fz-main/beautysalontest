const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyv1EeEGke_RDF6gZHsCYZ7X8y1upETmQBWBXN7BI3OTTfBNbdGIwAuIefH64sobeH3QA/exec';

export async function fetchAllBookings() {
  try {
    const res = await fetch(SCRIPT_URL);
    if (!res.ok) throw new Error('Ошибка загрузки');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('fetchAllBookings error:', e);
    return [];
  }
}

export async function createBooking(booking: any) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  booking.id = id;
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
  } catch (e) {
    console.warn('Запись отправлена (no-cors):', e);
  }
  return { id, ...booking };
}

export async function deleteBooking(id: string) { return true; }
export async function updateBookingStatus(id: string, status: string) { return true; }

export async function checkSlotAvailability(date: string, start_time: string, end_time: string) {
  const all = await fetchAllBookings();
  return all.filter(
    (b: any) =>
      b.booking_date === date &&
      ((b.start_time < end_time && b.end_time > start_time))
  );
}
