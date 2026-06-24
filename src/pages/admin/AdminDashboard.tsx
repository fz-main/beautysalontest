import React, { useEffect, useState } from 'react';
import { fetchAllBookings, updateBookingStatus, deleteBooking } from '../../lib/localStorageDb';
import type { Booking } from '../../types/booking';

const STATUS_COLORS: Record<Booking['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300',
};

export const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  const loadBookings = () => {
    setLoading(true);
    const data = fetchAllBookings();
    if (filterDate) {
      setBookings(data.filter(b => b.booking_date === filterDate));
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, [filterDate]);

  const handleStatusChange = (id: string, status: Booking['status']) => {
    updateBookingStatus(id, status);
    loadBookings();
  };

  const handleDelete = (id: string) => {
    if (confirm('Opravdu chcete smazat tuto rezervaci?')) {
      deleteBooking(id);
      loadBookings();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Administrace rezervací</h1>
          <div className="flex gap-4 items-center">
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
              className="bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-1 text-sm text-white" />
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">Odhlásit</button>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Načítání...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Žádné rezervace</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#0a0a0a] border-b border-white/10">
                <tr>
                  {['Datum', 'Čas', 'Služba', 'Klient', 'Telefon', 'Stav', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">{b.booking_date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{b.start_time}–{b.end_time}</td>
                    <td className="px-4 py-3">{b.service_name}</td>
                    <td className="px-4 py-3">
                      <div>{b.customer_name}</div>
                      <div className="text-gray-500 text-xs">{b.customer_email}</div>
                    </td>
                    <td className="px-4 py-3">{b.customer_phone}</td>
                    <td className="px-4 py-3">
                      <select value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as Booking['status'])}
                        className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${STATUS_COLORS[b.status]}`}>
                        <option value="pending">Čeká na potvrzení</option>
                        <option value="confirmed">Potvrzeno</option>
                        <option value="cancelled">Zrušeno</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300 text-xs">Smazat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
