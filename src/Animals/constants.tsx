import { TreeNode } from "../common/components/Tree";

export const animalData: TreeNode[] = [
  {
    name: "Mammal",
    type: "category",
    children: [
      {
        name: "Cat",
        type: "category",
        children: [
          {
            name: "Tiger",
            type: "category",
            children: [
              { name: "Bengal Tiger", type: "item" },
              { name: "Siberian Tiger", type: "item" },
              { name: "South China Tiger", type: "item" },
            ],
          },
          { name: "Lion", type: "item" },
          {
            name: "Leopard",
            type: "category",
            children: [
              { name: "Clouded Leopard", type: "item" },
              { name: "Snow Leopard", type: "item" },
            ],
          },
          { name: "Cheetah", type: "item" },
        ],
      },
      {
        name: "Dog",
        type: "category",
        children: [
          {
            name: "Domestic",
            type: "category",
            children: [
              { name: "German Shepherd", type: "item" },
              { name: "Golden Retriever", type: "item" },
              { name: "Labrador Retriever", type: "item" },
              { name: "Bulldog", type: "item" },
              { name: "Poodle", type: "item" },
            ],
          },
          {
            name: "Wild",
            type: "category",
            children: [
              { name: "Gray Wolf", type: "item" },
              { name: "Coyote", type: "item" },
              { name: "Dingo", type: "item" },
              { name: "African Wild Dog", type: "item" },
              { name: "Island Fox", type: "item" },
            ],
          },
        ],
      },
      {
        name: "Horse",
        type: "category",
        children: [
          { name: "Zebra", type: "item" },
          { name: "Arabian", type: "item" },
          { name: "Donkey", type: "item" },
        ],
      },
    ],
  },
];
