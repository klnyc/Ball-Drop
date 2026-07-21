import { type ChangeEvent, type KeyboardEvent } from "react";
import Modal from "../../common/components/Modal";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";

interface CreateTitleModalProps {
  title: string;
  titleInputError: string;
  handleCreateList: () => void;
  handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTitleCreateKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const CreateTitleModal = ({
  title,
  titleInputError,
  handleCreateList,
  handleTitleChange,
  handleTitleCreateKeyDown,
}: CreateTitleModalProps) => {
  return (
    <Modal
      description="Create a name for your list."
      content={
        <form onSubmit={handleCreateList}>
          <input
            className="list-builder-create-list-input"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleCreateKeyDown}
          />
          <div className="list-builder-input-error">{titleInputError}</div>
          <div>
            <BackToPlayboxButton />
            <button className="list-builder-create-list-button" type="submit">
              Create List
            </button>
          </div>
        </form>
      }
    />
  );
};

export default CreateTitleModal;
