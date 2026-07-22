import {
  useState,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

interface DropdownMenuItem {
  name: string;
}

interface DropdownProps {
  items: DropdownMenuItem[];
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
}

const Dropdown = ({ items, selectedItem, setSelectedItem }: DropdownProps) => {
  if (!items.length) return <></>;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuItemClick = (item: DropdownMenuItem) => {
    setSelectedItem(item.name);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedItem}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <button key={index} onClick={() => handleMenuItemClick(item)}>
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
