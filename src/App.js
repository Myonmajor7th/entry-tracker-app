import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const statusOptions = [
  "書類提出中",
  "書類提出済",
  "一次面接",
  "二次面接",
  "三次面接",
  "最終面接"
];

export default function App() {
  const [companies, setCompanies] = useState(() => {
    const stored = localStorage.getItem("companies");
    const parsed = stored ? JSON.parse(stored) : [];
    const fixed = parsed.map(c => ({
      ...c,
      id: c.id || uuidv4()
    }));
    localStorage.setItem("companies", JSON.stringify(fixed));
    return fixed;
  });

  const [newCompany, setNewCompany] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  const addCompany = () => {
    if (!newCompany.trim()) return;
    if (companies.some(c => c.name === newCompany)) return;
    const newEntry = {
      id: uuidv4(),
      name: newCompany,
      status: statusOptions[0],
      note: newNote || "",
      interviewDate: newInterviewDate || ""
    };
    setCompanies([...companies, newEntry]);
    setNewCompany("");
    setNewNote("");
    setNewInterviewDate("");
    alert("企業を追加しました！");
  };

  const updateField = (id, field, value) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === id ? { ...company, [field]: value } : company
      )
    );
  };

  const deleteCompany = (id) => {
    const confirmed = window.confirm("この企業情報を削除しますか？");
    if (confirmed) {
      setCompanies(prev => prev.filter(company => company.id !== id));
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "interviewDate") {
      return sortOrder === "asc"
        ? (a.interviewDate || "").localeCompare(b.interviewDate || "")
        : (b.interviewDate || "").localeCompare(a.interviewDate || "");
    } else if (sortBy === "status") {
      const indexA = statusOptions.indexOf(a.status);
      const indexB = statusOptions.indexOf(b.status);
      return sortOrder === "asc" ? indexA - indexB : indexB - indexA;
    }
    return 0;
  });

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">エントリー企業管理</h1>

      <div className="space-y-2 mb-4">
        <input
          className="w-full border p-2 rounded"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="企業名を入力"
        />
        <input
          className="w-full border p-2 rounded"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="メモを入力（任意）"
        />
        <input
          className="w-full border p-2 rounded"
          type="date"
          value={newInterviewDate}
          onChange={(e) => setNewInterviewDate(e.target.value)}
          placeholder="面接日"
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={addCompany}>
          企業を追加
        </button>
      </div>

      <div className="mb-4 space-x-2">
        <label>並び替え:</label>
        <select
          className="border p-1 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">企業名</option>
          <option value="interviewDate">面接日</option>
          <option value="status">選考状況</option>
        </select>
        <select
          className="border p-1 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">昇順</option>
          <option value="desc">降順</option>
        </select>
      </div>

      <ul className="space-y-3">
        <li className="flex justify-between text-sm text-gray-600 font-bold px-2">
          <div className="w-1/4">企業名</div>
          <div className="w-1/4">選考状況</div>
          <div className="w-1/4">メモ</div>
          <div className="w-1/4">面接日</div>
        </li>
        {sortedCompanies.map((company) => (
          <li key={company.id} className="border p-3 rounded shadow">
            <input
              className="w-full font-semibold mb-1 border-b"
              value={company.name}
              onChange={(e) => updateField(company.id, "name", e.target.value)}
              placeholder="企業名"
            />
            <select
              className="w-full mt-1 border p-2 rounded"
              value={company.status}
              onChange={(e) => updateField(company.id, "status", e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <textarea
              className="w-full mt-1 border p-2 rounded"
              value={company.note ?? ""}
              onChange={(e) => updateField(company.id, "note", e.target.value)}
              placeholder="メモ（任意）"
            />
            <input
              className="w-full mt-1 border p-2 rounded"
              type="date"
              value={company.interviewDate ?? ""}
              onChange={(e) => updateField(company.id, "interviewDate", e.target.value)}
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