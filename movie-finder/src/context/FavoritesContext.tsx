import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { resetMovieLibrary } from '../data/movies';

interface FavoritesContextValue {
  favorites: number[];
  watched: number[];
  toggleFavorite: (id: number) => void;
  toggleWatched: (id: number) => void;
  isFavorite: (id: number) => boolean;
  isWatched: (id: number) => boolean;
  resetAllStorage: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<number[]>('moviefinder_favorites', []);
  const [watched, setWatched] = useLocalStorage<number[]>('moviefinder_watched', []);

  // useCallback стабилизирует ссылки на функции для карточек, обёрнутых в React.memo
  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setFavorites]
  );

  const toggleWatched = useCallback(
    (id: number) => {
      setWatched((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setWatched]
  );

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);
  const isWatched = useCallback((id: number) => watched.includes(id), [watched]);

  const resetAllStorage = useCallback(() => {
    setFavorites([]);
    setWatched([]);
    resetMovieLibrary();
  }, [setFavorites, setWatched]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        watched,
        toggleFavorite,
        toggleWatched,
        isFavorite,
        isWatched,
        resetAllStorage,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
