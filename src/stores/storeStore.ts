import { create } from 'zustand';

export type Item = {
  id: number;
  name: string;
  category: 'accessory' | 'background';
  price: number;
  imageUrl: string;
  isOwned: boolean;
  isEquipped: boolean;
};

type ItemStore = {
  items: Item[]; // 스토어용 (전체)
  setItems: (items: Item[]) => void;

  ownedItems: Item[]; // 보관함용 (isOwned === true)
  updateOwnedItems: () => void;

  buyItem: (id: number) => void;
  equipItem: (id: number) => void; // 아이템 적용 - 다른 아이템 모두 해제
  unequipItem: (id: number) => void; // 아이템 해제 = 기본으로 되돌림
};

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [],

  setItems: (items) => {
    set({ items });
    // 동시에 ownedItems도 업데이트
    set({ ownedItems: items.filter((item) => item.isOwned) });
  },

  ownedItems: [],

  updateOwnedItems: () => {
    const { items } = get();
    set({ ownedItems: items.filter((item) => item.isOwned) });
  },

  buyItem: async (id: number) => {
    const res = await fetch(`/api/items/buy`, {
      // 주소 변경
      method: 'POST',
      body: JSON.stringify({ itemId: id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
      // 성공 시 클라이언트 상태 업데이트
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? { ...item, isOwned: true } : item)),
      }));
    } else {
      alert(data.message || '구매 실패');
    }
  },

  equipItem: async (id: number) => {
    const { items } = get();
    const selected = items.find((item) => item.id === id);
    if (!selected) return;

    // 서버에 장착 요청
    const res = await fetch(`/api/items/equip`, {
      // 주소 변경
      method: 'POST',
      body: JSON.stringify({
        id,
        equip: true,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
      set({
        items: items.map((item) =>
          item.category === selected.category
            ? {
                ...item,
                isEquipped: item.id === id ? true : false,
              }
            : item
        ),
      });
    }
  },

  unequipItem: async (id: number) => {
    const { items } = get();
    const selected = items.find((item) => item.id === id);
    if (!selected) return;

    // 서버에 해제 요청
    const res = await fetch(`/api/items/equip`, {
      // 주소 변경
      method: 'POST',
      body: JSON.stringify({
        id,
        equip: false,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
      set({
        items: items.map((item) => {
          if (item.category !== selected.category) {
            return item; // 카테고리가 다르면 변경 없음
          }

          if (item.category === 'accessory') {
            // 액세서리는 id가 1번이면 착용, 나머지는 해제
            return {
              ...item,
              isEquipped: item.id === 1, // 기본 캐릭터
            };
          }

          if (item.category === 'background') {
            // 배경은 모두 해제
            return {
              ...item,
              isEquipped: false,
            };
          }

          return item;
        }),
      });
    }
  },
}));
