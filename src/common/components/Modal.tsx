import { X } from "lucide-react";

interface ModalProps {
  text: string;
  onClose: () => void;
}

const Modal = ({ text, onClose }: ModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div>{text}</div>
        <button className="close-modal-button" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Modal;
