type Direction = "up" | "down" | "idle";

interface ElevatorInterface {
  currentFloor: number;
  direction: Direction;
  queue: number[];
  requestFloor: (floor: number) => void;
  onFloorChange?: (floor: number) => void; // callback to talk to React
}

class ElevatorLogic implements ElevatorInterface {
  currentFloor: number = 1;
  direction: Direction = "idle";
  queue: number[] = [];
  onFloorChange?: (floor: number) => void; // callback to talk to React

  requestFloor = (floor: number) => {
    if (this.queue.includes(floor) || this.currentFloor === floor) return;
    this.queue.push(floor);
    if (this.direction === "idle") this.move();
  };

  move = async () => {
    const nextFloor = this.queue[0];

    if (!nextFloor) {
      this.direction = "idle";
      return;
    }

    nextFloor > this.currentFloor
      ? (this.direction = "up")
      : (this.direction = "down");

    while (this.currentFloor !== nextFloor) {
      this.direction === "up" ? this.currentFloor++ : this.currentFloor--;

      // triggers React to rerender the elevator to move to the current floor
      // React needs a state change to trigger a rerender
      if (this.onFloorChange) {
        this.onFloorChange(this.currentFloor);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)); // wait at arrived floor
    this.queue.shift();
    this.move();
  };
}

export { ElevatorLogic, type ElevatorInterface };
