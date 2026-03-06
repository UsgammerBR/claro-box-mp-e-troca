import { AppData, EquipmentCategory, EquipmentItem } from './types';

export type DataAction = 
    | { type: 'SET_DATA', payload: AppData }
    | { type: 'ADD_ITEM', payload: { date: string, category: EquipmentCategory } }
    | { type: 'UPDATE_ITEM', payload: { date: string, category: EquipmentCategory, item: EquipmentItem } }
    | { type: 'DELETE_SINGLE_ITEM', payload: { date: string, category: EquipmentCategory, itemId: string } };

export const createEmptyDailyData = () => {
    const data: any = {};
    Object.values(EquipmentCategory).forEach(cat => {
        data[cat] = [];
    });
    return data;
};

export const dataReducer = (state: AppData, action: DataAction): AppData => {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;
        case 'ADD_ITEM': {
            const { date, category } = action.payload;
            const dayData = state[date] || createEmptyDailyData();
            const newItem: EquipmentItem = {
                id: Math.random().toString(36).substr(2, 9),
                serial: '',
                photos: [],
                status: 'active',
                timestamp: Date.now()
            };
            return {
                ...state,
                [date]: {
                    ...dayData,
                    [category]: [newItem, ...(dayData[category] || [])]
                }
            };
        }
        case 'UPDATE_ITEM': {
            const { date, category, item } = action.payload;
            const dayData = state[date] || createEmptyDailyData();
            return {
                ...state,
                [date]: {
                    ...dayData,
                    [category]: dayData[category].map((i: EquipmentItem) => i.id === item.id ? item : i)
                }
            };
        }
        case 'DELETE_SINGLE_ITEM': {
            const { date, category, itemId } = action.payload;
            const dayData = state[date] || createEmptyDailyData();
            return {
                ...state,
                [date]: {
                    ...dayData,
                    [category]: dayData[category].map((i: EquipmentItem) => 
                        i.id === itemId ? { ...i, status: 'deleted' as const } : i
                    )
                }
            };
        }
        default:
            return state;
    }
};
