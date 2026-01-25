import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const useLanguage = create((set) => ({
    isEng: null,

    loadLanguage: async () => {
        try {
            const storedValue = await SecureStore.getItemAsync('isEng');
            if (storedValue !== null) {
                set({ isEng: JSON.parse(storedValue) });
            }
        } catch (e) {
            console.log('Error loading language:', e);
        }
    },

    setLanguage: async (value) => {
        try {
            await SecureStore.setItemAsync('isEng', JSON.stringify(value)); // save true/false
            set({ isEng: value });
        } catch (e) {
            console.log('Error saving language:', e);
        }
    },
}));
