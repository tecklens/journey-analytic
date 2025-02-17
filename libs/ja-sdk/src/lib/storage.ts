export interface StorageOptions {
  dbName?: string | null;
  storeName?: string | null;
}

export class Storage {
  dbName: string;
  storeName: string;
  db: any;

  constructor(options: StorageOptions) {
    this.dbName = options.dbName ?? 'ja-db'
    this.storeName = options.storeName ?? 'rr_event'
    this.db = null;

    this.initDB()
  }

  private initDB() {
    const request = indexedDB.open(this.dbName, 2);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = () => {
      console.warn("Không thể mở IndexedDB, sẽ sử dụng localStorage.");
    };
  }

  async addEvent(event: any) {
    if (this.db) {
      const tx = this.db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      store.add({ data: event });

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
      });
    } else {
      console.warn("IndexedDB lỗi, lưu vào localStorage.");
      const events = JSON.parse(localStorage.getItem("rrweb-events") || "[]");
      events.push(event);
      localStorage.setItem("rrweb-events", JSON.stringify(events));
    }
  }

  async getAllEvents(): Promise<any[]> {
    return new Promise((resolve) => {
      if (!this.db) {
        console.warn("IndexedDB lỗi, lấy từ localStorage.");
        resolve(JSON.parse(localStorage.getItem("rrweb-events") || "[]"));
        return;
      }

      const tx = this.db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result.map((r: any) => r.data));
      request.onerror = () => resolve([]);
    });
  }

  async clearAllEvents() {
    return new Promise((resolve) => {
      if (this.db) {
        const tx = this.db.transaction(this.storeName, 'readwrite');

        const store = tx.objectStore(this.storeName);
        store.clear();
        tx.oncomplete = () => resolve(true)
      } else {
        localStorage.removeItem('rrweb-events');
        resolve(true)
      }
    })
  }
}