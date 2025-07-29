import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Obter os UIDs dos administradores do arquivo .env
  const adminUIDs = import.meta.env.VITE_ADMIN_UIDS?.split(",") || [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Verifica se o usuário é admin
        setIsAdmin(adminUIDs.includes(currentUser.uid));

        const userRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            nome: currentUser.displayName,
            criadoEm: serverTimestamp(),
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
