// src/components/Overlay.tsx
'use client';

type OverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Overlay = ({ isOpen, onClose }: OverlayProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-hidden="true"
    ></div>
  );
};

export default Overlay;
