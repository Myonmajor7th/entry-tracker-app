import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newDate, setNewDate] = useState("");

  const companiesRef = collection(db, "companies");

  useEffect(() => {
    const q = query(companiesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompanies(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const addCompany = async () => {
    if (!newCompany.trim()) return;
    await addDoc(companiesRef, {
      name: newCompany,
      note: newNote,
      date: newDate,
      createdAt: new Date()
    });
    setNewCompany("");
    setNewNote("");
    setNewDate("");
  };

  const updateCompany = async (id, field, value) => {
    const companyDoc = doc(db, "companies", id);
    await updateDoc(companyDoc, {
      [field]: value
    });
  };

  const deleteCompany = async (id) => {
    const companyDoc = doc(db, "companies", id);
    await deleteDoc(companyDoc);
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">就活企業クラウド管理</h1>

      <div className="space-y-2 mb-4">
        <input
          className="w-full border p-2 rounded"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="企業名"
        />
        <input
          className="w-full border p-2 rounded"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="メモ"
        />
        <input
          className="w-full border p-2 rounded"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={addCompany}
        >
          登録
        </button>
      </div>

      <ul className="space-y-3">
        {companies.map((company) => (
          <li key={company.id} className="border p-3 rounded shadow">
            <input
              className="w-full font-semibold mb-1 border-b"
              value={company.name}
              onChange={(e) =>
                updateCompany(company.id, "name", e.target.value)
              }
              placeholder="企業名"
            />
            <textarea
              className="w-full mt-1 border p-2 rounded"
              value={company.note ?? ""}
              onChange={(e) =>
                updateCompany(company.id, "note", e.target.value)
              }
              placeholder="メモ"
            />
            <input
              className="w-full mt-1 border p-2 rounded"
              type="date"
              value={company.date ?? ""}
              onChange={(e) =>
                updateCompany(company.id, "date", e.target.value)
              }
            />
            <button
              className="w-full mt-2 bg-red-500 text-white py-1 rounded"
              onClick={() => deleteCompany(company.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
