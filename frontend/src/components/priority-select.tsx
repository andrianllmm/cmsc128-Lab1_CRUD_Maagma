import { PRIORITIES, type Priority } from "@/types/tasks";
import { PriorityBadge } from "@/components/priority-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrioritySelectProps {
  id?: string;
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}

export function PrioritySelect({
  id,
  value,
  onValueChange,
}: PrioritySelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? undefined)}>
      <SelectTrigger id={id} className="border-0">
        <SelectValue placeholder="Select priority">
          {(v: Priority | null) =>
            v ? <PriorityBadge priority={v} /> : "Select priority"
          }
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {PRIORITIES.map((p) => (
          <SelectItem key={p} value={p}>
            <PriorityBadge priority={p} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
