import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sakakeja_saved_listings';

export function useSavedListings() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved listings from localStorage', e);
    }
    return [];
  });

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Failed to save listings to localStorage', e);
    }
  }, [savedIds]);

  // Sync across tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setSavedIds(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse storage event for saved listings', e);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  const toggleSave = useCallback((id: string): boolean => {
    let nowSaved = false;
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        nowSaved = false;
        return prev.filter((item) => item !== id);
      } else {
        nowSaved = true;
        return [id, ...prev];
      }
    });
    return nowSaved;
  }, []);

  const removeSaved = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSavedIds([]);
  }, []);

  return {
    savedIds,
    isSaved,
    toggleSave,
    removeSaved,
    clearAll,
    savedCount: savedIds.length,
  };
}
