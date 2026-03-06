import { AppData, EquipmentItem } from './types';

export const getFormattedDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export const isChristmasPeriod = () => {
    const now = new Date();
    return now.getMonth() === 11; // December
};

export const isItemActive = (item: EquipmentItem) => {
    return item.status === 'active';
};

export const generateMonthlyReport = (data: AppData, date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    let report = `Relatório de Equipamentos - ${month + 1}/${year}\n\n`;
    
    Object.entries(data).forEach(([dateStr, dayData]) => {
        const d = new Date(dateStr);
        if (d.getMonth() === month && d.getFullYear() === year) {
            report += `Data: ${dateStr}\n`;
            Object.entries(dayData).forEach(([cat, items]) => {
                const activeItems = items.filter(isItemActive);
                if (activeItems.length > 0) {
                    report += `  ${cat}: ${activeItems.length} itens\n`;
                }
            });
            report += '\n';
        }
    });
    
    return report;
};
