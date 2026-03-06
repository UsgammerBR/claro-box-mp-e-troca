import React from 'react';
import { 
    Menu, Box, Speaker, Tv, Camera, Cpu, Layers, Plus, Minus, Undo, Search, X, 
    ChevronLeft, ChevronRight, Share, Calendar, Bell, Cloud, Copy, Trash, Download, 
    Image, Smartphone, Mail, Send, Package, Loader2
} from 'lucide-react';

export const CustomMenuIcon = ({ className, isChristmas }: any) => (
    <div className={`${className} flex items-center justify-center bg-slate-100 rounded-full border border-slate-200`}>
        <Menu className="w-6 h-6 text-slate-600" />
    </div>
);

export const LoadingBoxIcon = () => <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />;
export const IconPlus = Plus;
export const IconMinus = Minus;
export const IconUndo = Undo;
export const IconSearch = Search;
export const IconX = X;
export const IconChevronLeft = ChevronLeft;
export const IconChevronRight = ChevronRight;
export const IconExport = Share;
export const IconCalendar = Calendar;
export const IconBell = Bell;
export const IconCameraLens = Camera;
export const IconCloud = Cloud;
export const IconCopy = Copy;
export const IconTrash = Trash;
export const IconDownload = Download;
export const IconCamera = Smartphone;
export const IconGallery = Image;
export const IconBox = Package;
export const IconSpeaker = Speaker;
export const IconRemote = Tv;
export const IconChip = Cpu;
export const IconStack = Layers;
export const IconWhatsapp = Send;
export const IconTelegram = Send;
export const IconEmail = Mail;
