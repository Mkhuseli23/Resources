// /src/firebase/storage.js
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from './firebase';

export const uploadFile = async (file, filePath) => {
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
};

