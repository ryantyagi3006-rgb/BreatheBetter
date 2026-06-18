import {
  collection, addDoc, getDocs, query, where, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export async function getResults() {
  const user = auth.currentUser;
  if (!user) return [];
  // Query by uid only (no orderBy) so no composite Firestore index is required.
  const q = query(collection(db, 'results'), where('uid', '==', user.uid));
  const snap = await getDocs(q);
  const rows = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      created_at: data.timestamp?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    };
  });
  // Sort newest-first on the client.
  return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function saveResult({ fev1, fvc, ratio, status, readings, calibration_factor }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const doc = await addDoc(collection(db, 'results'), {
    uid: user.uid,
    email: user.email,
    fev1, fvc, ratio, status,
    readings: readings ?? [],
    calibration_factor: calibration_factor ?? 1,
    timestamp: serverTimestamp(),
  });
  return { id: doc.id, fev1, fvc, ratio, status, created_at: new Date().toISOString() };
}
