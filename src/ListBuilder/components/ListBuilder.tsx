import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { GameMode } from "../../common/contants";
import Modal from "../../common/components/Modal";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { PlusIcon, CircleXIcon, SquarePenIcon } from "lucide-react";

interface ListItem {
  id: number;
  item: string;
}

const ListBuilder = () => {
  const [gameState, setGameState] = useState<GameMode>("START");
  const [title, setTitle] = useState<string>("");
  const [titleInputError, setTitleInputError] = useState<string>("");
  const [newItem, setNewItem] = useState<ListItem | undefined>();
  const [newItemError, setNewItemError] = useState<string>("");
  const [list, setList] = useState<ListItem[]>([]);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [isEditTitleMode, setEditTitleMode] = useState<boolean>(false);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCreateList = () => {
    if (title.trim()) {
      setGameState("PLAYING");
      setTitleInputError("");
    } else {
      setTitleInputError("List name cannot be empty!");
    }
  };

  const handleEditTitle = () => {
    if (title.trim()) {
      setEditTitleMode(false);
      setTitleInputError("");
    } else {
      setTitleInputError("List name cannot be empty!");
    }
  };

  const handleItemInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItem({ id: Date.now(), item: event.target.value });
  };

  const handleAddItem = () => {
    if (newItem && newItem.item.trim()) {
      setList([...list, newItem]);
      setNewItem({ id: Date.now(), item: "" });
      setNewItemError("");
    } else {
      setNewItemError("Cannot be empty.");
    }
  };

  const handleTitleCreateKeyDown = async (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreateList();
    }
  };

  const handleTitleEditKeyDown = async (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEditTitle();
    }
  };

  const handleOnKeyDownAddItem = async (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddItem();
    }
  };

  const handleDeleteItem = (id: number) => {
    const newItems = list.filter((item) => item.id !== id);
    setList([...newItems]);
  };

  return (
    <div className="list-builder-container">
      {gameState === "START" && (
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
                <button
                  className="list-builder-create-list-button"
                  type="submit"
                >
                  Create List
                </button>
              </div>
            </form>
          }
        />
      )}

      {gameState === "PLAYING" && (
        <div>
          <h1>
            {title}
            {isEditMode && (
              <button
                className="list-builder-edit-title-button"
                onClick={() => setEditTitleMode(true)}
              >
                <SquarePenIcon />
              </button>
            )}
          </h1>
          {list.length > 0 && (
            <div className="list-builder-items">
              {list.map((listItem) => {
                return (
                  <li key={listItem.id}>
                    {listItem.item}
                    {isEditMode && (
                      <button
                        className="list-builder-delete-button"
                        onClick={() => handleDeleteItem(listItem.id)}
                      >
                        <CircleXIcon />
                      </button>
                    )}
                  </li>
                );
              })}
            </div>
          )}
          <form className="list-builder-new-item-form" onSubmit={handleAddItem}>
            <div className="list-builder-new-item-input">
              <input
                value={newItem?.item}
                onChange={handleItemInput}
                onKeyDown={handleOnKeyDownAddItem}
              />
              <button type="submit">
                <PlusIcon />
              </button>
            </div>
            <div className="list-builder-input-error">{newItemError}</div>
          </form>
          <div className="list-builder-footer">
            <BackToPlayboxButton />
            <button
              className="list-builder-edit-button"
              onClick={() => setEditMode(!isEditMode)}
            >
              Edit
            </button>
          </div>

          {isEditTitleMode && (
            <Modal
              description="Edit the name for your list."
              onClose={() => setEditTitleMode(false)}
              content={
                <form onSubmit={handleEditTitle}>
                  <input
                    className="list-builder-create-list-input"
                    value={title}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleEditKeyDown}
                  />
                  <div className="list-builder-input-error">
                    {titleInputError}
                  </div>
                  <div>
                    <button
                      className="list-builder-create-list-button"
                      type="submit"
                    >
                      Edit
                    </button>
                  </div>
                </form>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ListBuilder;
