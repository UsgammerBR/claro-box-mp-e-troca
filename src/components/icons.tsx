import React, { useState, useEffect } from 'react';
import { 
    Menu, Box, Speaker, Tv, Camera, Cpu, Layers, Plus, Minus, Undo, Search, X, 
    ChevronLeft, ChevronRight, Share, Calendar, Bell, Cloud, Copy, Trash, Download, 
    Image, Smartphone, Mail, Send, Package, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CLARO_BOX_PROMPT = `Ultra realistic 3D product render of a black Claro Box streaming device placed on a natural wooden table. Matte black rectangular streaming box with rounded corners and premium finish.

Front layout:
left side physical power button with white power icon,
center red "Claro Box" logo,
right side small green LED indicator light.

Environment:
minimalist setup with clean wooden table and white wall background.

Lighting:
soft studio lighting, global illumination, ray tracing, realistic shadows, subtle reflections on the wood surface, cinematic lighting.

Composition:
device centered, front view with slight perspective angle like professional product photography.

Framing:
the entire scene is inside a rounded square iPhone style app icon shape, edge to edge crop, no external border, no white margin outside the icon.

Style:
ultra realistic, photorealistic materials, sharp focus, high detail, 3D render, product photography, cinematic lighting, 8k, shallow depth of field, professional product lens.`;

export const CustomMenuIcon = ({ className }: any) => {
    const [imageUrl, setImageUrl] = useState<string | null>(localStorage.getItem('claro_box_icon'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateIcon = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const aistudio = (window as any).aistudio;
            if (aistudio) {
                const hasKey = await aistudio.hasSelectedApiKey();
                if (!hasKey) {
                    await aistudio.openSelectKey();
                }
            }

            const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY || '' });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: CLARO_BOX_PROMPT }],
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1"
                    }
                },
            });

            if (response.candidates && response.candidates[0].content.parts) {
                let found = false;
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64EncodeString = part.inlineData.data;
                        const url = `data:image/png;base64,${base64EncodeString}`;
                        setImageUrl(url);
                        localStorage.setItem('claro_box_icon', url);
                        found = true;
                        break;
                    }
                }
                if (!found) setError("Nenhuma imagem gerada");
            }
        } catch (err: any) {
            console.error("Error generating icon:", err);
            const errorMessage = err?.message || "";
            setError(errorMessage);
            
            if (errorMessage.includes("PERMISSION_DENIED") || 
                errorMessage.includes("403") || 
                errorMessage.includes("Requested entity was not found")) {
                
                const aistudio = (window as any).aistudio;
                if (aistudio) {
                    console.log("Permission denied. Prompting for new API key...");
                    await aistudio.openSelectKey();
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!imageUrl) {
            generateIcon();
        }
    }, []);

    return (
        <div 
            className={`${className} flex items-center justify-center bg-slate-100 rounded-full border border-slate-200 overflow-hidden relative cursor-pointer group`}
            onClick={(e) => {
                if (e.shiftKey || error) {
                    generateIcon();
                }
            }}
            title={error ? `Erro: ${error}. Clique para tentar novamente.` : "Menu (Shift+Clique para gerar novo ícone)"}
        >
            {imageUrl ? (
                <img src={imageUrl} alt="Menu" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            ) : (
                <Menu className={`w-6 h-6 ${loading ? 'animate-pulse text-blue-400' : error ? 'text-red-400' : 'text-slate-600'}`} />
            )}
            {loading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
            )}
        </div>
    );
};

export const LoadingBoxIcon = () => {
    const imageUrl = localStorage.getItem('claro_box_icon');
    return (
        <div className="relative">
            {imageUrl ? (
                <img src={imageUrl} className="w-16 h-16 object-cover rounded-2xl shadow-lg animate-pulse" alt="Loading" />
            ) : (
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            )}
        </div>
    );
};
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
export const IconBox = (props: any) => {
    const imageUrl = localStorage.getItem('claro_box_icon');
    if (imageUrl) {
        return <img src={imageUrl} className={`${props.className || 'w-4 h-4'} object-cover rounded-sm`} alt="Box" />;
    }
    return <Package {...props} />;
};
export const IconSpeaker = Speaker;
export const IconRemote = Tv;
export const IconChip = Cpu;
export const IconStack = Layers;
export const IconWhatsapp = Send;
export const IconTelegram = Send;
export const IconEmail = Mail;
