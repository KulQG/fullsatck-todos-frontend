import type { ReactNode } from "react";

export interface ModalData {
  title?: string;
  content?: ReactNode;
  opened: boolean;
}