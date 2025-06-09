import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

export type Item = {
  id: number;
  name: string;
  category: 'accessory' | 'background';
  description: string;
  price: number;
  item_image_url: string;
  applied_image_url: string;
  purchased: boolean;
  equipped: boolean;
};

const api = axios.create({
  baseURL: 'http://sentiment-server.duckdns.org/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

type ItemStore = {
  items: Item[];
  ownedItems: Item[];
  setItems: (category: 'accessory' | 'background') => Promise<void>;
  updateOwnedItems: () => void;
  buyItem: (id: number) => Promise<void>;
  equipItem: (id: number) => Promise<void>;
  unequipItem: (id: number) => Promise<void>;
};

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  ownedItems: [],

  setItems: async (category) => {
    try {
      const res = await api.get<Item[]>('/stores/items', { params: { category } });
      const allItems = res.data;

      set({
        items: allItems,
        ownedItems: allItems.filter((item) => item.purchased),
      });
    } catch (err) {
      console.error(err);
      alert('아이템 불러오기 실패');
    }
  },

  updateOwnedItems: () => {
    const { items } = get();
    set({ ownedItems: items.filter((item) => item.purchased) });
  },

  buyItem: async (id) => {
    try {
      const res = await api.post(`/stores/items/${id}/purchase`);
      console.log(res.data);

      set((state) => ({
        items: state.items.map((item) => (item.id === id ? { ...item, purchased: true } : item)),
      }));

      get().updateOwnedItems();
      await useAuthStore.getState().fetchUser(); // 유저 코인 정보 업데이트
    } catch (err) {
      console.error(err);
      alert('구매 요청 실패');
    }
  },

  equipItem: async (id) => {
    const { items, unequipItem } = get();
    const selected = items.find((item) => item.id === id);
    if (!selected) return;

    const currentlyEquipped = items.find(
      (item) => item.category === selected.category && item.equipped
    );

    if (currentlyEquipped && currentlyEquipped.id !== id) {
      await unequipItem(currentlyEquipped.id);
    }

    try {
      console.log('장착 API 호출 시작...');
      const res = await api.post(`/stores/items/${id}/equip`);
      console.log('장착 API 응답:', res.data); // 서버 응답 확인

      // success 필드 체크를 제거하고 일단 무조건 실행
      set({
        items: items.map((item) =>
          item.category === selected.category ? { ...item, equipped: item.id === id } : item
        ),
      });

      try {
        await useAuthStore.getState().fetchUser();
        console.log('fetchUser 호출 완료!');
      } catch (e) {
        console.error('fetchUser 호출 실패:', e);
      }
    } catch (err) {
      console.error('장착 API 에러:', err);
      alert('장착 요청 실패');
    }
  },

  unequipItem: async (id) => {
    const { items } = get();
    const selected = items.find((item) => item.id === id);
    if (!selected) return;

    try {
      console.log('해제 API 호출 시작...');
      const res = await api.post(`/stores/items/${id}/unequip`);
      console.log('해제 API 응답:', res.data); // 서버 응답 확인

      // success 필드 체크를 제거하고 일단 무조건 실행
      set({
        items: items.map((item) =>
          item.category === selected.category ? { ...item, equipped: false } : item
        ),
      });

      // fetchUser 호출을 무조건 실행
      console.log('fetchUser 호출 시작...');
      try {
        await useAuthStore.getState().fetchUser();
        console.log('fetchUser 호출 완료!');
      } catch (e) {
        console.error('fetchUser 호출 실패:', e);
      }
    } catch (err) {
      console.error('해제 API 에러:', err);
      alert('해제 요청 실패');
    }
  },
}));
