import { firestoreDB } from "src/config/firebase/index";
import { collection, doc} from "firebase/firestore";
import * as Constants from "src/constants";

const refs = {
  addDocument: () => collection(firestoreDB, Constants.COLLECTIONS.DOCUMENTS),
  modifyDocument: (id) => doc(firestoreDB, Constants.COLLECTIONS.DOCUMENTS, id),
  getDocuments: () => collection(firestoreDB, Constants.COLLECTIONS.DOCUMENTS),
  eliminateDocument: (id) => doc(firestoreDB, Constants.COLLECTIONS.DOCUMENTS, id),
};

export { refs };
