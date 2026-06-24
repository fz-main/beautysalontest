// Определяем ключ по полному пути (включая имя репозитория)
function getStorageKey() {
  const path = window.location.pathname;
  if (path.includes('/beautysalontest')) {
    return 'beautysalontest_bookings';
  } else {
    // Для любого другого сайта (включая старый) используем отдельный ключ
    return 'default_bookings';
  }
}

export function fetchAllBookings() {
  try {
    const key = getStorageKey();
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data);
  } catch { return []; }
}

export function createBooking(booking: any) {
  const key = getStorageKey();
  const bookings = fetchAllBookings();
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const newBooking = { id, ...booking, status: booking.status || 'pending', created_at: new Date().toISOString() };
  bookings.push(newBooking);
  localStorage.setItem(key, JSON.stringify(bookings));
  console.log('🔑 СОХРАНЕНО В КЛЮЧ:', key);
  return newBooking;
}

export function updateBookingStatus(id: string, status: string) {
  const key = getStorageKey();
  const bookings = fetchAllBookings();
  const booking = bookings.find((b: any) => b.id === id);
  if (booking) {
    booking.status = status;
    localStorage.setItem(key, JSON.stringify(bookings));
  }
}

export function deleteBooking(id: string) {
  const key = getStorageKey();
  const bookings = fetchAllBookings();
  const updated = bookings.filter((b: any) => b.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
}

export function checkSlotAvailability(date: string, start_time: string, end_time: string) {
  const all = fetchAllBookings();
  return all.filter(
    (b: any) =>
      b.booking_date === date &&
      ((b.start_time < end_time && b.end_time > start_time))
  );
}
