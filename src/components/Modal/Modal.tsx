import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "../../hooks/useModalStore";
import { IconClose } from "../../icons/IconClose";

export const Modal = () => {
  const { data, closeModal } = useModalStore();

  const portalElement = document.getElementById("modal");

  const closeOnOverlay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== e.currentTarget) return;
    closeModal();
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  useEffect(() => {
    if (data?.opened) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.opened]);

  if (!(data?.opened && portalElement)) return null;

  return createPortal(
    <div
      onClick={closeOnOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-10 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-bg-default rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scaleIn border border-action">
        <header className="flex items-center justify-between p-6 border-b border-action">
          <h2 className="text-xl font-bold text-white">{data.title}</h2>
          <button
            onClick={() => closeModal()}
            className="p-2 text-white rounded-lg transition-colors duration-150 cursor-pointer "
            aria-label="Закрыть"
          >
            <IconClose />
          </button>
        </header>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {data.content}
        </div>
      </div>
    </div>,
    portalElement
  );
};
