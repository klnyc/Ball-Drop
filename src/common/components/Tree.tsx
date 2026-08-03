import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export interface TreeNode {
  name: string;
  type: "category" | "item";
  children?: TreeNode[];
}

interface TreeProps {
  node: TreeNode;
}

const Tree = ({ node }: TreeProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isCategory = node.type === "category";

  const sortChildren = () => {
    if (!node.children || !node.children.length) return [];
    return [
      ...node.children.filter((node) => node.type === "category"),
      ...node.children.filter((node) => node.type === "item"),
    ];
  };

  const children = useMemo(() => {
    return sortChildren();
  }, [node.children]);

  return (
    <>
      <div
        className={`${isCategory ? "tree-category-name" : "tree-item-name"}`}
        onClick={() => {
          if (isCategory) setIsOpen(!isOpen);
        }}
      >
        {node.name + " "}
        {isCategory ? (
          isOpen ? (
            <ChevronDownIcon size={10} />
          ) : (
            <ChevronRightIcon size={10} />
          )
        ) : (
          ""
        )}
      </div>
      {isCategory && isOpen && node.children && node.children.length > 0 && (
        <div className="tree-children">
          {children.length > 0 &&
            children.map((child, index) => <Tree key={index} node={child} />)}
        </div>
      )}
    </>
  );
};

export default Tree;
