import { defineStore } from "pinia";
import { getStorage, ref, uploadBytesResumable, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import { addDoc, updateDoc, getDocs, deleteDoc, query, where} from "firebase/firestore";
import { refs } from "src/config/firebase/firestoreDatabase";

export const useDocuments = defineStore("documents", {
  state: () => ({}),
  getters: {},
  actions: {
    async addDocument(payload) {
      try {
        const storage = getStorage();
        if (payload) {
          const storageRef = ref(
            storage,
            "/documents/" + payload.name
          );
          const metadata = {
            contentType: payload.type,
          };
          this.totalBytes += payload.size;
          const uploadTask = uploadBytesResumable(storageRef, payload, metadata);
          uploadTask.on("state_changed", (snapshot) => {
            this.progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            snapshot.task.then((res) => {});
          });
          if (storageRef != null) {
            return { status: 200, url: storageRef.fullPath };
          } else {
            return { status: 400 };
          }
        } else {
          return { status: 400 };
        }
      } catch (error) {
        return { status: 400, error: error };
      }
    },
    async addDoc(payload) {
      try {
        if (payload) {
          const docRef = await addDoc(
            refs.addDocument(),
            {
              name: payload.name,
              type: payload.type,
              date: payload.date,
              size: payload.size,
              url: payload.url,
            }
          );
          return {
            status: 200,
          };
        } else {
          return { status: 400 };
        }
      } catch (error) {
        return { status: 400, error: error };
      }
    },
    async modifyDoc(payload) {
      if (payload) {
        console.log(payload);
        try {
          if (payload.file != null) {
            await updateDoc(refs.modifyDocument(payload?.id), {
              name: payload.name,
              type: payload.type,
              date: payload.date,
              size: payload.size,
              url: payload.url,
            });
          } else {
            await updateDoc(refs.modifyDocument(payload?.id), {
              name: payload.name,
              date: payload.date,
            });
          }
          return { status: 200 };
        } catch (error) {
          return { status: 400, error: error };
        }
      } else {
        return { status: 400, error: error };
      }
    },
    async listDocuments() {
      const querySnapshot = await getDocs(refs.getDocuments());
      let fbRows = [];
      querySnapshot.forEach(async(doc) => {
        const row = {
          id: doc.id,
          name: doc.data().name,
          date: doc.data().date,
          type: doc.data().type,
          size: doc.data().size,
          url: doc.data().url,
        };
        fbRows.push(row);
      });
      if (fbRows) {
        return {
          value: fbRows,
          status: 200,
        };
      } else {
        return { status: 400 };
      }
    },
    async getDownloadURL(payload) {
      try {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "/documents/" + payload
        );
        let dateUrl = [];
        await getDownloadURL(storageRef).then((url) => {
          window.open(url);
          dateUrl.push(url);
        });
        return {
          value: dateUrl,
          status: 200,
        };
      } catch (error) {
        return { status: 400, error: error };
      }
    },
    async deleteDocument(payload) {
      const storage = getStorage();
      const desertRef = ref(storage, "/documents/" + payload);
      deleteObject(desertRef).then(() => {
        return { status: 200 };

      }).catch((error) => {
        return { status: 400, error: error };
      });
    },
    async deleteDoc(payload) {
      try {
        const response = await this.listOneDocument(payload);
        await deleteDoc(refs.eliminateDocument(response));
        return { status: 200 };
      } catch (error) {
        return { status: 400, error: error };
      }
    },
    async listOneDocument(payload) {
      try {
        const ref = refs.getDocuments();
        const q = query(ref, where("url", "==", payload));
        const response = await getDocs(q);
        const data = response.docs.map((doc) => {
          return {
            id: doc.id,
          };
        });
        return data[0].id;
      } catch (error) {
        return { status: 400, error: error };
      }
    },
  },
});
