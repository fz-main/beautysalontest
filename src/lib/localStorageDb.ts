// АБСОЛЮТНО НОВЫЙ КЛЮЧ, КОТОРЫЙ НЕ ИСПОЛЬЗОВАЛСЯ РАНЬШЕ
const STORAGE_KEY = 'beautysalontest_final_separate';

export function fetchAllBookings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch { return []; }
}

export function createBooking(booking: any) {
  const bookings = fetchAllBookings();
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const newBooking = { id, ...booking, status: booking.status || 'pending', created_at: new Date().toISOString() };
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  console.log('🔑 НОВЫЙ КЛЮЧ:', STORAGE_KEY);
  return newBooking;
}

export function updateBookingStatus(id: string, status: string) {
  const bookings = fetchAllBookings();
  const booking = bookings.find((b: any) => b.id === id);
  if (booking) {
    booking.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }
}

export function deleteBooking(id: string) {
  const bookings = fetchAllBookings();
  const updated = bookings.filter((b: any) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function checkSlotAvailability(date: string, start_time: string, end_time: string) {
  const all = fetchAllBookings();
  return all.filter(
    (b: any) =>
      b.booking_date === date &&
      ((b.start_time < end_time && b.end_time > start_time))
  );
}
