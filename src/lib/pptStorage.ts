const DB_NAME = 'darussalam_erp_ppt_storage';
const STORE_NAME = 'ppt_templates';
const DB_VERSION = 1;

export interface StoredPptBinary {
  slideId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  dataUrl: string;
  updatedAt: string;
}

const memoryFallbackMap = new Map<string, StoredPptBinary>();

function openPptDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null);
      return;
    }
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'slideId' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function savePptBinary(record: StoredPptBinary): Promise<void> {
  memoryFallbackMap.set(record.slideId, record);
  const db = await openPptDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(record);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

export async function loadPptBinary(slideId: string): Promise<StoredPptBinary | null> {
  const mem = memoryFallbackMap.get(slideId);
  if (mem) return mem;
  const db = await openPptDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(slideId);
      req.onsuccess = () => {
        const res = (req.result as StoredPptBinary | undefined) || null;
        if (res) memoryFallbackMap.set(slideId, res);
        db.close();
        resolve(res);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function removePptBinary(slideId: string): Promise<void> {
  memoryFallbackMap.delete(slideId);
  const db = await openPptDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(slideId);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

export function triggerDataUrlDownload(dataUrl: string, fileName: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
