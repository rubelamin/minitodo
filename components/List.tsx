import { BaseItem } from "@/types/task";
import React from "react";

type ListProps<T extends BaseItem> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keExtractor?: (item: T) => string | number;
};

const TaskList = <T extends BaseItem>({
  items,
  renderItem,
  keExtractor,
}: ListProps<T>) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={keExtractor ? keExtractor(item) : item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
