import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconX } from './icons';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    padding?: string;
}

export const Modal = ({ title, onClose, children, padding = 'p-6' }: ModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-90">
                        <IconX className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
                <div className={padding}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
