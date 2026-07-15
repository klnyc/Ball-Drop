import {
  AppleIcon,
  CitrusIcon,
  BananaIcon,
  CherryIcon,
  GrapeIcon,
  CarrotIcon,
  LeafyGreenIcon,
} from "lucide-react";

const icons = [
  {
    icon: <AppleIcon color="#FF5349" />,
    isFruit: true,
  },
  {
    icon: <CitrusIcon color="red" />,
    isFruit: true,
  },
  {
    icon: <CherryIcon color="maroon" />,
    isFruit: true,
  },
  {
    icon: <BananaIcon color="yellow" />,
    isFruit: true,
  },
  {
    icon: <GrapeIcon color="purple" />,
    isFruit: true,
  },
  {
    icon: <LeafyGreenIcon color="green" />,
    isFruit: false,
  },
  {
    icon: <CarrotIcon color="#f36907" />,
    isFruit: false,
  },
];

export default icons;
