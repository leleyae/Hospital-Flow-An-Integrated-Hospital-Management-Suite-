import { create } from 'zustand'

const useUser = create((set) => ({

    cart: JSON.parse(localStorage.getItem('cart')) || [],
    setCart: (newCart) => {
        set(() => ({ cart: newCart }));
        localStorage.setItem('cart', JSON.stringify(newCart));
    },

    order: JSON.parse(localStorage.getItem('order')) || [],
    setOrder: (newOrder) => {
        set(() => ({ order: newOrder }));
        localStorage.setItem('order', JSON.stringify(newOrder));
    },
    user: JSON.parse(localStorage.getItem("user")) || null,
    setUser: (newUser) => {
        set(() => ({ user: newUser }));
        localStorage.setItem('user', JSON.stringify(newUser));
    },
    isEng: JSON.parse(localStorage.getItem("isEng")),
    setIsEng: (isEng) => set({ isEng }),
    products: localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : null,
    setProducts: (newProduct) => {
        set(() => ({ products: newProduct }));
        localStorage.setItem('products', JSON.stringify(newProduct));
    },
    waiterProducts: localStorage.getItem("waiterProducts") ? JSON.parse(localStorage.getItem("waiterProducts")) : null,
    setWaiterProducts: (newProduct) => {
        set(() => ({ waiterProducts: newProduct }));
        localStorage.setItem('waiterProducts', JSON.stringify(newProduct));
    },
}))

export default useUser
