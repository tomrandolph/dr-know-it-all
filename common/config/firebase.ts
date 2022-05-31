import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { FirestoreDataConverter, Timestamp } from "firebase/firestore";

export interface Answer {
  addedAt: Timestamp;
  answer: string;
  addedBy: string;
  spaceBefore?: boolean;
}

export interface QuestionDoc {
  created: Timestamp;
  question: string;
  answers: Array<Answer>;
}

const firebaseConfig = {
  apiKey: "AIzaSyA9rDOs2erAibNbBpBjwPjtbyXexUjHtgY",
  authDomain: "dr-know-it-all-a0d32.firebaseapp.com",
  projectId: "dr-know-it-all-a0d32",
  storageBucket: "dr-know-it-all-a0d32.appspot.com",
  messagingSenderId: "23961072700",
  appId: "1:23961072700:web:e7592b3c8400bf63b03f39",
  measurementId: "G-VJT8C91YLY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const questionConverter: FirestoreDataConverter<QuestionDoc> = {
  toFirestore: (data) => data,
  fromFirestore: (snap) => {
    const { created, question, answers } = snap.data();
    return { created, question, answers };
  },
};
