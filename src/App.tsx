import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

// Components
import { SideMenu } from './components/SideMenu';
import { CameraModal } from './components/CameraModal';
import { Modal } from './components/Modal';
import { EquipmentSection } from './components/EquipmentSection';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { 
    CustomMenuIcon, LoadingBoxIcon, IconPlus, IconMinus, IconUndo, IconSearch, IconX, IconChevronLeft, IconChevronRight,
    IconExport, IconCalendar, IconBell, IconCameraLens, IconCloud, IconCopy, IconTrash, IconDownload, IconCamera, IconGallery,
    IconBox, IconSpeaker, IconRemote, IconChip, IconStack, IconWhatsapp, IconTelegram, IconEmail
} from './components/icons';

// Types & Utils
import { EquipmentCategory, AppData, EquipmentItem, UserProfile } from './types';
import { CATEGORIES, HOLIDAYS_SP } from './constants';
import { dataReducer, createEmptyDailyData } from './reducer';
import { getFormattedDate, isChristmasPeriod, isItemActive, generateMonthlyReport } from './utils';

const getCategoryIcon = (category: EquipmentCategory) => {
    switch(category) {
        case EquipmentCategory.BOX: return IconBox;
        case EquipmentCategory.BOX_SOUND: return IconSpeaker;
        case EquipmentCategory.CONTROLE: return IconRemote;
        case EquipmentCategory.CAMERA: return IconCameraLens;
        case EquipmentCategory.CHIP: return IconChip;
        default: return IconStack;
    }
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('equipment_notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('equipment_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (type: string, details: string) => {
    const newNotif = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type,
        details
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    setHasNewNotifications(true);
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [appData, dispatch] = useReducer(dataReducer, {} as AppData);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
      const saved = localStorage.getItem('userProfile');
      const defaults = { name: 'Leo Luz', email: 'osgammetbr@gmail.com', cpf: '', profileImage: '' };
      try {
          return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
      } catch (e) {
          return defaults;
      }
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>(CATEGORIES[0]);
  const [cameraTarget, setCameraTarget] = useState<{ category: EquipmentCategory, item: EquipmentItem | 'profile' } | null>(null);
  const [galleryItem, setGalleryItem] = useState<EquipmentItem | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);
  const [history, setHistory] = useState<AppData[]>([]);
  const [showAllTimeTotals, setShowAllTimeTotals] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach(cat => initial[cat] = true);
    return initial;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  
  const isChristmas = isChristmasPeriod();
  const formattedDate = getFormattedDate(currentDate);
  
  const currentHoliday = useMemo(() => {
    const dayMonth = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    return HOLIDAYS_SP[dayMonth];
  }, [currentDate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const savedData = localStorage.getItem('equipmentData');
    if (savedData) dispatch({ type: 'SET_DATA', payload: JSON.parse(savedData) });
    
    const fetchServerData = async () => {
        try {
            const email = userProfile.email || 'default';
            const response = await fetch(`/api/data?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const serverData = await response.json();
                if (serverData && Object.keys(serverData).length > 0) {
                    dispatch({ type: 'SET_DATA', payload: serverData });
                }
            }
        } catch (err) { console.error("Fetch error", err); }
    };
    fetchServerData();
    return () => clearTimeout(timer);
  }, []);

  const syncWithServer = async () => {
      if (!navigator.onLine) return;
      setSyncStatus('syncing');
      try {
          const response = await fetch('/api/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userProfile.email || 'default', data: appData })
          });
          if (response.ok) {
              setSyncStatus('success');
              setLastSync(new Date());
          } else { setSyncStatus('error'); }
      } catch (err) { setSyncStatus('error'); }
  };

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('equipmentData', JSON.stringify(appData));
    const debounceTimer = setTimeout(syncWithServer, 2000);
    return () => clearTimeout(debounceTimer);
  }, [appData, isLoading]);

  const currentDayData = useMemo(() => appData[formattedDate] || createEmptyDailyData(), [appData, formattedDate]);

  const handleAddItem = () => {
    setHistory(prev => [...prev.slice(-19), JSON.parse(JSON.stringify(appData))]);
    dispatch({ type: 'ADD_ITEM', payload: { date: formattedDate, category: activeCategory } });
  };

  const handleCameraCapture = (data: string, type: 'qr' | 'photo') => {
    if (!cameraTarget) return;
    if (cameraTarget.item === 'profile') {
        setUserProfile(prev => ({ ...prev, profileImage: data }));
    } else {
        const item = cameraTarget.item as EquipmentItem;
        dispatch({ 
            type: 'UPDATE_ITEM', 
            payload: { 
                date: formattedDate, 
                category: cameraTarget.category, 
                item: type === 'qr' ? { ...item, serial: data } : { ...item, photos: [...item.photos, data] }
            } 
        });
    }
    setCameraTarget(null);
  };

  if (isLoading) return <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-[100] sm:max-w-[480px] sm:left-1/2 sm:-translate-x-1/2"><LoadingBoxIcon/><p className="mt-4 font-black uppercase tracking-widest text-[10px] text-slate-400 animate-pulse">Iniciando Controle...</p></div>;

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden bg-slate-50">
      <div className="flex-1 flex flex-col w-full max-w-[480px] mx-auto bg-white shadow-xl min-h-screen relative">
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onMenuClick={setActiveModal} userProfile={userProfile} isChristmas={isChristmas} />
        
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div onClick={() => setIsMenuOpen(true)} className="active:scale-95 transition-all cursor-pointer">
                    <CustomMenuIcon className="w-12 h-12" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Controle</h1>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[3px]">Equipamentos</span>
                </div>
            </div>
            <div className="flex gap-1 items-center">
                <button onClick={handleAddItem} className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white active:scale-95 shadow-sm"><IconPlus className="w-3.5 h-3.5"/></button>
                <button onClick={() => setDeleteMode(!deleteMode)} className={`w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 ${deleteMode ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}><IconMinus className="w-3.5 h-3.5"/></button>
                <button onClick={() => setActiveModal('search')} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 border border-slate-200 active:scale-95"><IconSearch className="w-3.5 h-3.5"/></button>
            </div>
        </div>

        <div className="flex flex-col items-center mb-6 gap-2">
            <button onClick={() => setActiveModal('calendar')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 active:scale-95 shadow-sm">
                <span className="font-black text-[12px] tracking-[2px] text-slate-700">{currentDate.toLocaleDateString('pt-BR')}</span>
            </button>
            {currentHoliday && <span className={`text-[7px] font-black uppercase tracking-[2px] ${currentHoliday.color.replace('bg-', 'text-')}`}>{currentHoliday.name}</span>}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.map(cat => {
                const Icon = getCategoryIcon(cat);
                const claroBoxImg = localStorage.getItem('claro_box_icon');
                return (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex flex-col items-center gap-1.5 min-w-[60px] p-2 rounded-[1.2rem] transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                        {cat === EquipmentCategory.BOX && claroBoxImg ? (
                            <img src={claroBoxImg} className="w-4 h-4 object-cover rounded-full" alt="Box" />
                        ) : (
                            <Icon className="w-4 h-4"/>
                        )}
                        <span className="text-[6px] font-black uppercase tracking-[1px]">{cat}</span>
                    </button>
                );
            })}
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 mt-6 pb-48">
          <EquipmentSection 
            category={activeCategory} 
            items={currentDayData[activeCategory]} 
            onUpdate={(item: any) => dispatch({ type: 'UPDATE_ITEM', payload: { date: formattedDate, category: activeCategory, item } })}
            onAddItem={handleAddItem}
            onDelete={(id: string) => dispatch({ type: 'DELETE_SINGLE_ITEM', payload: { date: formattedDate, category: activeCategory, itemId: id } })}
            onGallery={setGalleryItem}
            onCamera={(item: any) => setCameraTarget({ category: activeCategory, item })}
            deleteMode={deleteMode}
            selectedForDelete={selectedForDelete}
            onToggleSelect={(id: string) => setSelectedForDelete(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            isChristmas={isChristmas}
          />
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-40 bg-white/90 border-t border-slate-200 p-4 pb-10 shadow-xl backdrop-blur-3xl max-w-[480px]">
          <div className="flex items-center justify-between">
              <div className="flex gap-4 flex-1">
                  {CATEGORIES.map(cat => {
                      const Icon = getCategoryIcon(cat);
                      const claroBoxImg = localStorage.getItem('claro_box_icon');
                      return (
                        <div key={cat} className={`flex flex-col items-center ${activeCategory === cat ? 'text-blue-600' : 'text-slate-300'}`}>
                            {cat === EquipmentCategory.BOX && claroBoxImg ? (
                                <img src={claroBoxImg} className="w-4 h-4 mb-1 object-cover rounded-full" alt="Box" />
                            ) : (
                                <Icon className="w-4 h-4 mb-1"/>
                            )}
                            <span className="text-[10px] font-black">{(currentDayData[cat] || []).filter(isItemActive).length}</span>
                        </div>
                      );
                  })}
              </div>
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-center">
                    <span className="text-[7px] font-black text-blue-600 uppercase tracking-widest">Dia</span>
                    <span className="text-xl font-black text-blue-600">{Object.values(currentDayData).flat().filter(isItemActive).length}</span>
                </div>
              </div>
          </div>
      </footer>

      <AnimatePresence>
        {galleryItem && <PhotoGalleryModal item={galleryItem} onClose={() => setGalleryItem(null)} />}
        {cameraTarget && <CameraModal target={cameraTarget.item} onClose={() => setCameraTarget(null)} onCapture={handleCameraCapture} />}
        
        {activeModal === 'calendar' && (
            <Modal title="Calendário" onClose={() => setActiveModal(null)} padding="p-6">
                <div className="grid grid-cols-7 gap-1.5">
                    {(() => {
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const days = [];
                        for (let day = 1; day <= daysInMonth; day++) {
                            const d = new Date(year, month, day);
                            const holiday = HOLIDAYS_SP[`${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}`];
                            const isSelected = currentDate.getDate() === day;
                            days.push(
                                <button key={day} onClick={() => { setCurrentDate(d); setActiveModal(null); }} className={`h-11 w-11 rounded-full font-black text-[11px] transition-all flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white shadow-lg' : holiday ? `${holiday.color} text-white shadow-md` : 'bg-slate-50 text-slate-500'}`}>
                                    {day}
                                </button>
                            );
                        }
                        return days;
                    })()}
                </div>
            </Modal>
        )}

        {activeModal === 'export' && (
            <Modal title="Relatórios e Backup" onClose={() => setActiveModal(null)}>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-2xl text-green-600"><IconWhatsapp className="w-6 h-6"/><span>WhatsApp</span></button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-2xl text-blue-600"><IconTelegram className="w-6 h-6"/><span>Telegram</span></button>
                    <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-600"><IconEmail className="w-6 h-6"/><span>E-mail</span></button>
                </div>
                <button onClick={() => { const doc = new jsPDF(); doc.text(generateMonthlyReport(appData, currentDate), 10, 10); doc.save('relatorio.pdf'); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Gerar PDF Mensal</button>
            </Modal>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default AppContent;