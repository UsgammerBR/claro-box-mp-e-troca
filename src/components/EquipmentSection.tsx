import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconTrash, IconCamera, IconGallery, IconPlus } from './icons';
import { EquipmentCategory, EquipmentItem } from '../types';
import { isItemActive } from '../utils';

interface EquipmentSectionProps {
    category: EquipmentCategory;
    items: EquipmentItem[];
    onUpdate: (item: EquipmentItem) => void;
    onAddItem: () => void;
    onDelete: (id: string) => void;
    onGallery: (item: EquipmentItem) => void;
    onCamera: (item: EquipmentItem) => void;
    deleteMode: boolean;
    selectedForDelete: string[];
    onToggleSelect: (id: string) => void;
    isChristmas: boolean;
}

export const EquipmentSection = ({ 
    category, items = [], onUpdate, onAddItem, onDelete, onGallery, onCamera, 
    deleteMode, selectedForDelete, onToggleSelect, isChristmas 
}: EquipmentSectionProps) => {
    const activeItems = items.filter(isItemActive);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="font-black text-[10px] uppercase tracking-[3px] text-slate-400">{category}</h2>
                <span className="text-[10px] font-black text-blue-600">{activeItems.length} itens</span>
            </div>

            <AnimatePresence mode="popLayout">
                {activeItems.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 ${deleteMode && selectedForDelete.includes(item.id) ? 'border-red-500 bg-red-50' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 text-xs overflow-hidden">
                            {category === EquipmentCategory.BOX && localStorage.getItem('claro_box_icon') ? (
                                <img src={localStorage.getItem('claro_box_icon')!} className="w-full h-full object-cover" alt="Box" />
                            ) : (
                                index + 1
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <input 
                                value={item.serial}
                                onChange={(e) => onUpdate({ ...item, serial: e.target.value })}
                                placeholder="Serial / QR Code"
                                className="w-full font-black text-sm text-slate-900 placeholder:text-slate-200 focus:outline-none truncate"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => onCamera(item)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90">
                                <IconCamera className="w-4 h-4" />
                            </button>
                            {item.photos.length > 0 && (
                                <button onClick={() => onGallery(item)} className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 active:scale-90 relative">
                                    <IconGallery className="w-4 h-4" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] rounded-full flex items-center justify-center font-black">{item.photos.length}</span>
                                </button>
                            )}
                            {deleteMode && (
                                <button onClick={() => onDelete(item.id)} className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 active:scale-90">
                                    <IconTrash className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {activeItems.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-300 gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center">
                        <IconPlus className="w-6 h-6" />
                    </div>
                    <p className="font-black text-[10px] uppercase tracking-widest">Nenhum item adicionado</p>
                    <button onClick={onAddItem} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95">Adicionar Primeiro</button>
                </div>
            )}
        </div>
    );
};
