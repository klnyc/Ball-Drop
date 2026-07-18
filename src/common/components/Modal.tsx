import { X } from "lucide-react";
import { JSX } from "react";

interface ModalProps {
  onClose?: () => void;
  title?: string;
  description?: string;
  content?: JSX.Element;
  classNames?: string;
}

const Modal = ({
  onClose,
  content,
  title,
  description,
  classNames = "",
}: ModalProps) => {
  return (
    <div className="modal-overlay">
      <div className={`modal ${classNames}`}>
        {onClose && (
          <button className="close-modal-button" onClick={onClose}>
            <X size={16} />
          </button>
        )}

        <h1 className="modal-title">{title}</h1>
        <p className="modal-description">{description}</p>
        {content}
      </div>
    </div>
  );
};

export default Modal;
