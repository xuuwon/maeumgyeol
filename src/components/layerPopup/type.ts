export type LayerPopupProps = {
  confirmType?: boolean;
  mainText: string;
  subText?: string;
  onClose?: () => void;
  onConfirm: () => void;
};
