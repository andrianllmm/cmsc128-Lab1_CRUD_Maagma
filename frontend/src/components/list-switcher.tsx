import type { List } from "@/types/lists";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListSwitcherProps {
  lists: List[];
  listId: string;
  userId: string;
  onChange: (listId: string) => void;
}

export function ListSwitcher({
  lists,
  listId,
  userId,
  onChange,
}: ListSwitcherProps) {
  const labelOf = (id: string | null) => {
    const list = lists.find((l) => l._id === id);
    return list ? listLabel(list, userId) : "Select a list";
  };

  return (
    <Select value={listId} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger aria-label="List" className="min-w-0 flex-1">
        <SelectValue className="truncate">{labelOf}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {lists.map((list) => (
          <SelectItem key={list._id} value={list._id}>
            {listLabel(list, userId)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Lists shared with the user also show who owns them
function listLabel(list: List, userId: string) {
  return list.owner._id === userId
    ? list.name
    : `${list.name} · ${list.owner.displayName}`;
}
