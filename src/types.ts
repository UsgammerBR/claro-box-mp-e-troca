export enum EquipmentCategory {
    BOX = 'BOX',
    BOX_SOUND = 'BOX SOUND',
    CONTROLE = 'CONTROLE',
    CAMERA = 'CAMERA',
    CHIP = 'CHIP',
    OUTROS = 'OUTROS'
}

export interface EquipmentItem {
    id: string;
    serial: string;
    photos: string[];
    status: 'active' | 'deleted';
    timestamp: number;
}

export interface DailyData {
    [key: string]: EquipmentItem[];
}

export interface AppData {
    [date: string]: DailyData;
}

export interface UserProfile {
    name: string;
    email: string;
    cpf: string;
    profileImage: string;
}
