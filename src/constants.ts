import { EquipmentCategory } from './types';

export const CATEGORIES = [
    EquipmentCategory.BOX,
    EquipmentCategory.BOX_SOUND,
    EquipmentCategory.CONTROLE,
    EquipmentCategory.CAMERA,
    EquipmentCategory.CHIP,
    EquipmentCategory.OUTROS
];

export const HOLIDAYS_SP: Record<string, { name: string, color: string }> = {
    '01-01': { name: 'Ano Novo', color: 'bg-red-500' },
    '25-01': { name: 'Aniv. São Paulo', color: 'bg-blue-500' },
    '01-05': { name: 'Dia do Trabalho', color: 'bg-green-500' },
    '09-07': { name: 'Rev. Constitucionalista', color: 'bg-slate-800' },
    '07-09': { name: 'Independência', color: 'bg-yellow-600' },
    '12-10': { name: 'Nsa. Sra. Aparecida', color: 'bg-blue-600' },
    '02-11': { name: 'Finados', color: 'bg-slate-600' },
    '15-11': { name: 'Procl. República', color: 'bg-green-600' },
    '20-11': { name: 'Consciência Negra', color: 'bg-orange-600' },
    '25-12': { name: 'Natal', color: 'bg-red-600' }
};
