import type { PracticeKind } from "@/lib/store";

const DB_NAME = "photoshop-academy";
const STORE = "practice-uploads";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available in this environment."));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IDB open failed"));
  });

  return dbPromise;
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = run(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(request.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

function keyOf(slug: string, kind: PracticeKind): string {
  return `${slug}:${kind}`;
}

export async function saveUploadBlob(
  slug: string,
  kind: PracticeKind,
  blob: Blob,
): Promise<void> {
  await withStore("readwrite", (store) => store.put(blob, keyOf(slug, kind)));
}

export async function loadUploadBlob(
  slug: string,
  kind: PracticeKind,
): Promise<Blob | null> {
  const result = await withStore<Blob | undefined>("readonly", (store) =>
    store.get(keyOf(slug, kind)) as IDBRequest<Blob | undefined>,
  );
  return result ?? null;
}

export async function deleteUploadBlob(
  slug: string,
  kind: PracticeKind,
): Promise<void> {
  await withStore("readwrite", (store) => store.delete(keyOf(slug, kind)));
}

export async function deleteAllForLesson(slug: string): Promise<void> {
  await Promise.all([
    deleteUploadBlob(slug, "before").catch(() => {}),
    deleteUploadBlob(slug, "after").catch(() => {}),
  ]);
}

export async function clearAllUploadBlobs(): Promise<void> {
  await withStore("readwrite", (store) => store.clear());
}
