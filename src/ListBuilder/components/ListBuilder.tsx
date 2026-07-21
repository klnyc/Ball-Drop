// start mode modal
// enter title
// validation, must not be empty
// state for the title

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { GameMode } from "../../common/contants";
import Modal from "../../common/components/Modal";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { PlusIcon, CircleXIcon, SquarePenIcon } from "lucide-react";

// playing mode
// display title that can be edited, cannot be deleted
// state for list, array of strings
// input to add item
// add item button
// onclick push the input value to the array state
// edit mode
// delete item button
// handleDelete (text)
// onclick will search the array for exact text match, then splice the item out
// edit item button
// handleEdit (text)
// onclick will search the array for the exact text match, then splice the item

const ListBuilder = () => {
  const [gameState, setGameState] = useState<GameMode>("START");
  const [title, setTitle] = useState<string>("");
  const [titleInputError, setTitleInputError] = useState<string>("");
  const [newItem, setNewItem] = useState<string>("");
  const [newItemError, setNewItemError] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const [isEditMode, setEditMode] = useState<boolean>(true);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCreateList = () => {
    if (title.trim()) {
      setGameState("PLAYING");
    } else {
      setTitleInputError("List name cannot be empty!");
    }
  };

  const handleItemInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItem(event.target.value);
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setList([...list, newItem]);
      setNewItem("");
      setNewItemError("");
    } else {
      setNewItemError("Cannot be empty.");
    }
  };

  const handleTitleInputKeyDown = async (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreateList();
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
                onKeyDown={handleTitleInputKeyDown}
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
            {isEditMode && <SquarePenIcon />}
          </h1>
          {list.length > 0 && (
            <div className="list-builder-items">
              {list.map((listItem, index) => {
                return (
                  <li key={index}>
                    {listItem}
                    {isEditMode && <CircleXIcon />}
                  </li>
                );
              })}
            </div>
          )}
          <form className="list-builder-new-item-form" onSubmit={handleAddItem}>
            <div className="list-builder-new-item-input">
              <input
                value={newItem}
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
        </div>
      )}
    </div>
  );
};

export default ListBuilder;
