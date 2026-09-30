import { useTheme } from "next-themes";
import {
  ThemeSwitcher as KiboThemeSwitcher,
  type ThemeSwitcherProps,
} from "@/components/kibo-ui/theme-switcher";

type Theme = NonNullable<ThemeSwitcherProps["value"]>;

// Connects Kibo UI's theme switcher to next-themes
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return <KiboThemeSwitcher value={theme as Theme} onChange={setTheme} />;
}
