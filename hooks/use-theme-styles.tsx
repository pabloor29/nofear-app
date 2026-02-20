import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSettings } from '@/context/app-settings';

export function useThemeStyles() {
  const { theme } = useAppSettings();
  const systemScheme = useColorScheme();

  const isDark =
    theme === 'dark' ? true :
    theme === 'light' ? false :
    systemScheme === 'dark';

  return {
    isDark,
    bg: { backgroundColor: isDark ? '#1B110E' : '#F8F2F2' },
    text: { color: isDark ? '#F8F2F2' : '#1B110E' },
    textSecondary: { color: isDark ? '#1B110E' : '#F8F2F2' },
    border: { borderColor: isDark ? '#F8F2F2' : '#1B110E' },
    card: { backgroundColor: isDark ? '#2a1a16' : '#ffffff' },
    inputBorder: { borderColor: isDark ? '#4b5563' : '#d1d5db' },
  };
}