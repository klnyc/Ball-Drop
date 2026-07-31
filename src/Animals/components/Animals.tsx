import { useMemo } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { animalData } from "../constants";
import Tree from "../../common/components/Tree";

const Animals = () => {
  const sortData = () => {
    return [
      ...animalData.filter((node) => node.type === "category"),
      ...animalData.filter((node) => node.type === "item"),
    ];
  };

  const data = useMemo(() => {
    return sortData();
  }, []);

  return (
    <div className="animal-tree-container">
      <BackToPlayboxButton color="purple" />
      <h3>Animal Tree</h3>
      <div className="animal-tree">
        {data.length > 0 &&
          data.map((node, index) => <Tree key={index} node={node} />)}
      </div>
    </div>
  );
};

export default Animals;
