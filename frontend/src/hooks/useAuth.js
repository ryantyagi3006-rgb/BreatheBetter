import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser]       = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (['auth/user-not-found', 'auth/invalid-credential', 'auth/wrong-password'].includes(e.code)) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        throw e;
      }
    }
  }, []);

  const signOut = useCallback(() => fbSignOut(auth), []);

  return { user, loading, login, signOut };
}
