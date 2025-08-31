// Example: src/utils/orderHandler.ts
import { db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const saveOrderAndNotify = async (orderData) => {
  // Save order
  await addDoc(collection(db, "orders"), {
    ...orderData,
    createdAt: serverTimestamp(),
  });

  // Save notification
  await addDoc(collection(db, "notifications"), {
    message: `New order placed by ${orderData.userEmail} for ${orderData.productName}`,
    createdAt: serverTimestamp(),
    status: "unread"
  });
};
