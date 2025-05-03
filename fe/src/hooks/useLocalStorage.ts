import { useState, useEffect } from 'react';

export interface UseLocalStorageOptions {
  /**
   * Xử lý lỗi khi đọc/ghi dữ liệu
   */
  onError?: (error: Error) => void;
}

/**
 * Hook quản lý dữ liệu trong localStorage với TypeScript
 * 
 * @param key - Khóa để lưu trữ trong localStorage
 * @param initialValue - Giá trị mặc định khi không có dữ liệu
 * @param options - Tùy chọn cấu hình bổ sung
 * @returns [value, setValue] - Giá trị hiện tại và hàm cập nhật
 */
export function useLocalStorage<T>(
  key: string, 
  initialValue: T, 
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void] {
  const { onError = console.error } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      onError(error as Error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      onError(error as Error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
        } catch (error) {
          onError(error as Error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, onError]);

  return [storedValue, setValue];
}

export default useLocalStorage;