import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Firestore Service Class
class FirestoreService {
  constructor() {
    this.db = db;
  }

  // Create a new document with auto-generated ID
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return {
        success: true,
        id: docRef.id,
        message: "Document created successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Create a document with custom ID
  async createWithId(collectionName, docId, data) {
    try {
      await setDoc(doc(this.db, collectionName, docId), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return {
        success: true,
        id: docId,
        message: "Document created successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Get a single document by ID
  async getById(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() },
        };
      } else {
        return {
          success: false,
          message: "Document not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Get all documents from a collection
  async getAll(collectionName, options = {}) {
    try {
      let q = collection(this.db, collectionName);

      // Apply query constraints if provided
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (options.orderBy) {
        options.orderBy.forEach(([field, direction = "asc"]) => {
          q = query(q, orderBy(field, direction));
        });
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const documents = [];

      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Update a document
  async update(collectionName, docId, data) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return {
        success: true,
        message: "Document updated successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Upsert a document (create if doesn't exist, update if exists)
  async upsert(collectionName, docId, data) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await setDoc(
        docRef,
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      return {
        success: true,
        message: "Document saved successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Delete a document
  async delete(collectionName, docId) {
    try {
      await deleteDoc(doc(this.db, collectionName, docId));
      return {
        success: true,
        message: "Document deleted successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Listen to real-time changes
  onSnapshot(collectionName, callback, options = {}) {
    try {
      let q = collection(this.db, collectionName);

      // Apply query constraints if provided
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (options.orderBy) {
        options.orderBy.forEach(([field, direction = "asc"]) => {
          q = query(q, orderBy(field, direction));
        });
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      return onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        callback(documents);
      });
    } catch (error) {
      console.error("Error setting up real-time listener:", error);
      return null;
    }
  }

  // Listen to a single document
  onDocumentSnapshot(collectionName, docId, callback) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() });
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error("Error setting up document listener:", error);
      return null;
    }
  }

  // Batch operations
  async batchWrite(operations) {
    try {
      const batch = writeBatch(this.db);

      operations.forEach(({ type, collectionName, docId, data }) => {
        const docRef = doc(this.db, collectionName, docId);

        switch (type) {
          case "set":
            batch.set(docRef, { ...data, updatedAt: serverTimestamp() });
            break;
          case "update":
            batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
            break;
          case "delete":
            batch.delete(docRef);
            break;
          default:
            throw new Error(`Invalid batch operation type: ${type}`);
        }
      });

      await batch.commit();
      return {
        success: true,
        message: "Batch operation completed successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Helper methods for common operations
  serverTimestamp() {
    return serverTimestamp();
  }

  increment(value) {
    return increment(value);
  }

  arrayUnion(...elements) {
    return arrayUnion(...elements);
  }

  arrayRemove(...elements) {
    return arrayRemove(...elements);
  }
}

// Create and export a singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;
