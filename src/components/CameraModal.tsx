import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconX, IconCamera, IconGallery } from './icons';

interface CameraModalProps {
    target: any;
    onClose: () => void;
    onCapture: (data: string, type: 'qr' | 'photo') => void;
}

export const CameraModal = ({ target, onClose, onCapture }: CameraModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setStream(s);
                if (videoRef.current) videoRef.current.srcObject = s;
            } catch (err) {
                console.error("Camera error", err);
                alert("Erro ao acessar câmera");
                onClose();
            }
        };
        startCamera();
        return () => stream?.getTracks().forEach(t => t.stop());
    }, []);

    const takePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);
        const data = canvas.toDataURL('image/jpeg', 0.7);
        onCapture(data, 'photo');
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col sm:max-w-[480px] sm:left-1/2 sm:-translate-x-1/2">
            <div className="p-6 flex justify-between items-center text-white">
                <span className="font-black uppercase tracking-widest text-xs">Câmera</span>
                <button onClick={onClose}><IconX className="w-6 h-6"/></button>
            </div>
            
            <div className="flex-1 relative overflow-hidden bg-slate-900">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-white/20 pointer-events-none m-12 rounded-3xl" />
            </div>

            <div className="p-12 flex justify-center items-center gap-12">
                <button onClick={takePhoto} className="w-20 h-20 rounded-full bg-white border-8 border-white/20 active:scale-90 transition-all" />
            </div>
        </div>
    );
};
