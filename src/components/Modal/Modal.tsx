import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "../../hooks/useModalStore";
import { IconClose } from "../../icons/IconClose";
import styles from "./Modal.module.css";

export const Modal = () => {
  const { data, closeModal } = useModalStore();

  const portalElement = document.getElementById("modal");

  const closeOnOverlay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== e.currentTarget) return;
    closeModal();
  };

  useEffect(() => {
    if (data?.opened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [data?.opened]);

  if (!(data?.opened && portalElement)) return null;

  return createPortal(
    <div onClick={closeOnOverlay} className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <header>
          <h2>{data.title}</h2>
          <button onClick={() => closeModal()}>
            <IconClose />
          </button>
        </header>

        {data.content}
      </div>
    </div>,
    portalElement
  );
};
