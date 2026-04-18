import * as SecureStore from 'expo-secure-store';

// Encapsulates secure storage — callers don't know the underlying mechanism
class StorageService {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  async getObject<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }
}

export const storageService = new StorageService();
