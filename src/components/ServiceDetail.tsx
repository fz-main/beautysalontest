import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../data/services';
import type { Lang, Translations } from '../lib/i18n';
import { useState } from 'react';
import { BookingModal } from './BookingModal';

interface ServiceDetailProps {
  activeService: Service;
  onBack: () => void;
  lang?: Lang;
  t: Translations;
}

export default function ServiceDetail({ activeService, onBack, lang: _lang, t }: ServiceDetailProps) {
  const srvT = t.services[activeService.id as keyof typeof t.services];
  const mastersT = (t.masters[activeService.id as keyof typeof t.masters] as unknown) as Array<{ name: string; role: string; exp: string; photo?: string }>;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 pointer-events-auto overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
    >
      <button
        onClick={onBack}
        className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm pointer-events-auto"
      >
        <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
        {t.back}
      </button>

      <div className="min-h-full px-4 md:px-16 pt-24 pb-16 flex flex-col gap-8 max-w-7xl mx-auto">

        {/* SERVICE CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel p-6 md:p-10 rounded-3xl">
            <h4 className="font-monument text-[10px] md:text-xs tracking-[0.25em] text-[#e5d3b3] mb-3 md:mb-4">
              {srvT?.subtitle}
            </h4>
            <h2 className="text-4xl md:text-7xl font-editorial mb-4 md:mb-6 leading-[0.9]">
              {srvT?.title}
            </h2>
            <p className="font-montreal text-sm md:text-base text-[#a3a3a3] leading-relaxed mb-6 md:mb-10">
              {srvT?.desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 border-t border-white/10 pt-5">
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.duration}</div>
                <div className="font-editorial text-lg md:text-2xl">{activeService.time}</div>
              </div>
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.investment}</div>
                <div className="font-editorial text-lg md:text-2xl text-[#e5d3b3]">{activeService.price}</div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto mt-2 md:mt-0 md:ml-auto px-6 py-3 bg-white text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-[#e5d3b3] transition-colors"
              >
                {t.reserve}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-3xl overflow-hidden relative shadow-2xl"
            style={{ aspectRatio: '9/16', maxHeight: '70vh' }}>
            {activeService.video ? (
              <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
                <source src={activeService.video} type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
                <span className="text-[#e5d3b3] font-monument text-sm tracking-widest">Video se brzy objeví</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* MASTER BLOCK */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">

          <div className="flex-1">
            <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] mb-4">{t.yourSpecialist}</div>
            <div className="flex flex-col gap-5">
              {Array.isArray(mastersT) && mastersT.map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="shrink-0">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name}
                        className="w-16 h-16 rounded-2xl object-cover object-top"
                        style={{ border: '1px solid rgba(229,211,179,0.2)' }} />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-editorial font-bold"
                        style={{ background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)', border: '1px solid rgba(229,211,179,0.2)', color: '#e5d3b3' }}>
                        {m.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-editorial text-lg md:text-xl">{m.name}</div>
                    <div className="font-montreal text-xs text-[#a3a3a3]">{m.role} · {m.exp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceId={activeService.id}
        serviceName={srvT?.title || activeService.title}
        durationMinutes={activeService.durationMinutes || 60}
      />

      <AnimatePresence />
    </motion.div>
  );
}
