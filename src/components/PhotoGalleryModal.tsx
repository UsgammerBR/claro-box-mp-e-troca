import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconDownload, IconTrash } from './icons';
import { EquipmentItem } from '../types';

interface PhotoGalleryModalProps {
    item: EquipmentItem;
    onClose: () => void;
}

export const PhotoGalleryModal = ({ item, onClose }: PhotoGalleryModalProps) => {
    return (
        <div className="fixed inset-0 z-[110] flex flex-col bg-slate-900 sm:max-w-[480px] sm:left-1/2 sm:-translate-x-1/2">
            <div className="p-6 flex justify-between items-center text-white">
                <div className="flex flex-col">
                    <span className="font-black uppercase tracking-widest text-[10px]">Galeria de Fotos</span>
                    <span className="text-[8px] text-slate-400 font-black tracking-widest">{item.serial || 'Sem Serial'}</span>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><IconX className="w-5 h-5"/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                {item.photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-800 group">
                        <img src={photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center"><IconDownload className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
