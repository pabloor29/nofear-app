import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type Language = 'fr' | 'en';
export type Theme = 'light' | 'dark' | 'system';

type AppSettingsContextType = {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  language: 'fr',
  theme: 'system',
  setLanguage: () => {},
  setTheme: () => {},
});

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [theme, setThemeState] = useState<Theme>('system');

  // Chargement au démarrage : d'abord AsyncStorage (rapide), puis Supabase (à jour)
  useEffect(() => {
    AsyncStorage.multiGet(['language', 'theme']).then((values) => {
      const lang = values[0][1] as Language;
      const thm = values[1][1] as Theme;
      if (lang) setLanguageState(lang);
      if (thm) setThemeState(thm);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase
        .from('profiles')
        .select('language, theme')
        .eq('id', session.user.id)
        .single();

      if (data?.language) setLanguageState(data.language as Language);
      if (data?.theme) setThemeState(data.theme as Theme);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem('language', lang);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({ language: lang }).eq('id', session.user.id);
    }
  };

  const setTheme = async (thm: Theme) => {
    setThemeState(thm);
    AsyncStorage.setItem('theme', thm);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').update({ theme: thm }).eq('id', session.user.id);
    }
  };

  return (
    <AppSettingsContext.Provider value={{ language, theme, setLanguage, setTheme }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export const useAppSettings = () => useContext(AppSettingsContext);