import { create } from "zustand";
import type { ModalData } from "../components/Modal/Modal.types";

interface ModalStore {
  data: ModalData | null;
  openModal: (data: Required<Omit<ModalData, "opened">>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>()((set) => ({
  data: null,
  openModal: (data) => set(() => ({ data: { opened: true, ...data } })),
  closeModal: () => set(() => ({ data: { opened: false } })),
}));
