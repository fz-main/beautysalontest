import React, { useState } from 'react';
import { useBookingSlots } from '../hooks/useBookingSlots';
import { createBooking } from '../lib/localStorageDb';
import { addMinutes } from '../lib/bookingUtils';

interface Props {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}

export const BookingForm: React.FC<Props> = ({
  serviceId, serviceName, durationMinutes, onSuccess, onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { slots, isLoading } = useBookingSlots(selectedDate, durationMinutes);

  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [step, setStep] = useState<'datetime' | 'details'>('datetime');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const booking = await createBooking({
        service_id: serviceId,
        service_name: serviceName,
        duration_minutes: durationMinutes,
        booking_date: selectedDate,
        start_time: selectedTime,
        end_time: addMinutes(selectedTime, durationMinutes),
        status: 'pending',
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        notes: form.notes || undefined,
      });
      onSuccess?.(booking.id);
      setForm({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
    } catch (err: any) {
      setSubmitError(err.message || 'Chyba při ukládání');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToDetails = () => {
    if (!selectedDate || !selectedTime) return;
    setStep('details');
  };

  if (step === 'datetime') {
    return (
      <div className="space-y-6 text-white">
        <div>
          <label className="block text-sm font-medium mb-1 text-white/80">Datum</label>
          <input
            type="date"
            value={selectedDate || ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-3 text-white/80">Čas</label>
          {isLoading && <p className="text-gray-400 text-sm">Načítání...</p>}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((s) => (
              <button
                key={s.time}
                type="button"
                disabled={!s.available}
                onClick={() => setSelectedTime(s.time)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                  ${s.available
                    ? selectedTime === s.time
                      ? 'bg-[#e5d3b3] text-black shadow-md scale-105'
                      : 'bg-[#1a1a1a] border border-white/20 text-white hover:border-[#e5d3b3] hover:text-[#e5d3b3]'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed line-through'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {slots.length === 0 && !isLoading && (
            <p className="text-gray-400 text-sm text-center py-4">Žádné volné termíny</p>
          )}
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-white/20 bg-[#1a1a1a] inline-block" /> Volno</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#e5d3b3] inline-block" /> Vybrané</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-800 inline-block" /> Obsazeno</span>
        </div>
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10">Zrušit</button>
          )}
          <button
            type="button"
            disabled={!selectedDate || !selectedTime}
            onClick={goToDetails}
            className="flex-1 py-2 bg-[#e5d3b3] text-black rounded-lg disabled:opacity-50 font-medium hover:bg-white transition-colors"
          >
            Pokračovat →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="bg-[#1a1a1a] rounded-lg p-3 text-sm border border-white/10">
        <p className="font-medium text-white">{serviceName}</p>
        <p className="text-gray-400">{selectedDate} v {selectedTime} · {durationMinutes} min</p>
        <button type="button" onClick={() => setStep('datetime')} className="text-[#e5d3b3] text-xs mt-1 hover:underline">← Změnit čas</button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white/80">Vaše jméno *</label>
        <input name="customer_name" type="text" required placeholder="Jana Nováková" value={form.customer_name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white/80">Email *</label>
        <input name="customer_email" type="email" required placeholder="email@example.com" value={form.customer_email} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white/80">Telefon *</label>
        <input name="customer_phone" type="tel" required placeholder="+420 000 000 000" value={form.customer_phone} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-white/80">Poznámka</label>
        <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-white resize-none focus:ring-2 focus:ring-[#e5d3b3] focus:border-transparent" placeholder="Vaše přání nebo dotazy..." />
      </div>
      {submitError && <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-sm text-red-300">{submitError}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setStep('datetime')} className="flex-1 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10">← Zpět</button>
        <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-[#e5d3b3] text-black rounded-lg disabled:opacity-50 font-medium hover:bg-white transition-colors">
          {isSubmitting ? 'Odesílá...' : 'Rezervovat'}
        </button>
      </div>
    </form>
  );
};
