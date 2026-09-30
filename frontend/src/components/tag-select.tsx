import { TAGS, type Tag } from "@/types/tasks";
import { TagBadge } from "@/components/tag-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TagSelectProps {
  id?: string;
  value: Tag | undefined;
  onValueChange: (value: Tag | undefined) => void;
}

export function TagSelect({ id, value, onValueChange }: TagSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? undefined)}>
      <SelectTrigger id={id} className="border-0 dark:bg-transparent">
        <SelectValue placeholder="Select tag">
          {(v: Tag | null) => (v ? <TagBadge tag={v} /> : "Select tag")}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {TAGS.map((t) => (
          <SelectItem key={t} value={t}>
            <TagBadge tag={t} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
