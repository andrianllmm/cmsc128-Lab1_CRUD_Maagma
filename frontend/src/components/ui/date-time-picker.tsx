import { format, set, startOfToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "cn";

// Adapted from https://time.rdsx.dev

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ["AM", "PM"] as const;

interface DateTimePickerProps {
  id?: string;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  id,
  selected,
  onSelect,
  placeholder = "No date",
  className,
}: DateTimePickerProps) {
  const isPM = selected ? selected.getHours() >= 12 : false;

  // Keep the selected time when picking a new day
  function handleDateSelect(day: Date | undefined) {
    if (!day || !selected) return onSelect(day);
    onSelect(
      set(day, { hours: selected.getHours(), minutes: selected.getMinutes() }),
    );
  }

  // Picking a time without a date uses today
  function handleTimeChange(time: { hours?: number; minutes?: number }) {
    onSelect(set(selected ?? startOfToday(), time));
  }

  function handleHourChange(hour: number) {
    handleTimeChange({ hours: (hour % 12) + (isPM ? 12 : 0) });
  }

  function handlePeriodChange(period: (typeof PERIODS)[number]) {
    if ((period === "PM") === isPM) return;
    const hours = selected?.getHours() ?? 0;
    handleTimeChange({ hours: period === "PM" ? hours + 12 : hours - 12 });
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "justify-start font-normal",
              !selected && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon />
            {selected ? format(selected, "PP p") : placeholder}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={handleDateSelect}
          />

          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            {/* Hours */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {HOURS.map((hour) => (
                  <TimeOption
                    key={hour}
                    label={String(hour)}
                    ariaLabel={`${hour} o'clock`}
                    active={
                      !!selected && selected.getHours() % 12 === hour % 12
                    }
                    onClick={() => handleHourChange(hour)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            {/* Minutes */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {MINUTES.map((minute) => (
                  <TimeOption
                    key={minute}
                    label={String(minute).padStart(2, "0")}
                    ariaLabel={`${minute} minutes`}
                    active={!!selected && selected.getMinutes() === minute}
                    onClick={() => handleTimeChange({ minutes: minute })}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            {/* AM/PM */}
            <ScrollArea>
              <div className="flex p-2 sm:flex-col">
                {PERIODS.map((period) => (
                  <TimeOption
                    key={period}
                    label={period}
                    active={!!selected && (period === "PM") === isPM}
                    onClick={() => handlePeriodChange(period)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface TimeOptionProps {
  label: string;
  ariaLabel?: string;
  active: boolean;
  onClick: () => void;
}

function TimeOption({ label, ariaLabel, active, onClick }: TimeOptionProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant={active ? "default" : "ghost"}
      aria-label={ariaLabel}
      aria-pressed={active}
      className="aspect-square shrink-0 sm:w-full"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
