import { type ChangeEvent, type KeyboardEvent } from "react";
import Modal from "../../common/components/Modal";

interface EditTitleModalProps {
  title: string;
  titleInputError: string;
  setEditTitleMode: (value: boolean) => void;
  handleEditTitle: () => void;
  handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTitleEditKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const EditTitleModal = ({
  title,
  titleInputError,
  setEditTitleMode,
  handleEditTitle,
  handleTitleChange,
  handleTitleEditKeyDown,
}: EditTitleModalProps) => {
  return (
    <Modal
      description="Edit the name for your list."
      onClose={() => setEditTitleMode(false)}
      content={
        <form onSubmit={handleEditTitle}>
          <input
            className="lister-create-list-input"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleEditKeyDown}
          />
          <div className="lister-input-error">{titleInputError}</div>
          <div>
            <button className="lister-create-list-button" type="submit">
              Save
            </button>
          </div>
        </form>
      }
    />
  );
};

export default EditTitleModal;
