import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconCalendar, IconBell, IconCloud, IconExport, IconTrash } from './icons';
import { UserProfile } from '../types';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onMenuClick: (modal: string) => void;
    userProfile: UserProfile;
    isChristmas: boolean;
}

export const SideMenu = ({ isOpen, onClose, onMenuClick, userProfile, isChristmas }: SideMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white z-[60] shadow-2xl flex flex-col sm:left-[calc(50%-240px)]"
                    >
                        <div className="p-8 bg-slate-50 border-b border-slate-100">
                            <div className="flex items-center gap-4 mb-6">
                                {userProfile.profileImage ? (
                                    <img src={userProfile.profileImage} className="w-16 h-16 rounded-full flex-shrink-0 object-cover border-2 border-white shadow-md" referrerPolicy="no-referrer" />
                                ) : localStorage.getItem('claro_box_icon') ? (
                                    <img src={localStorage.getItem('claro_box_icon')!} className="w-16 h-16 rounded-full flex-shrink-0 object-cover border-2 border-white shadow-md" alt="Profile" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full flex-shrink-0 bg-blue-600 flex items-center justify-center text-white font-black text-2xl">
                                        {userProfile.name[0]}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h2 className="font-black text-slate-900 truncate">{userProfile.name}</h2>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">{userProfile.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 space-y-2">
                            <MenuButton icon={IconCalendar} label="Calendário" onClick={() => { onMenuClick('calendar'); onClose(); }} />
                            <MenuButton icon={IconBell} label="Notificações" onClick={() => { onMenuClick('notifications'); onClose(); }} />
                            <MenuButton icon={IconCloud} label="Sincronização" onClick={() => { onMenuClick('sync'); onClose(); }} />
                            <MenuButton icon={IconExport} label="Exportar" onClick={() => { onMenuClick('export'); onClose(); }} />
                        </div>

                        <div className="p-4 border-t border-slate-100">
                            <MenuButton icon={IconTrash} label="Limpar Cache" color="text-red-500" onClick={() => { localStorage.clear(); window.location.reload(); }} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const MenuButton = ({ icon: Icon, label, onClick, color = 'text-slate-600' }: any) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`font-bold text-sm ${color}`}>{label}</span>
    </button>
);
