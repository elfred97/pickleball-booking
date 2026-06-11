import { useState, useEffect, FormEvent } from 'react';
import { api } from '../../api/client';
import type { Court } from '../../types';

export default function Courts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [error, setError] = useState('');

  function loadCourts() {
    api.getAllCourts().then(setCourts).catch(console.error);
  }

  useEffect(() => {
    loadCourts();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.createCourt({ name: newName, number: Number(newNumber) });
      setNewName('');
      setNewNumber('');
      loadCourts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add court');
    }
  }

  async function toggleActive(court: Court) {
    await api.updateCourt(court._id, { isActive: !court.isActive });
    loadCourts();
  }

  async function handleDelete(id: string) {
    if (!confirm('Deactivate this court? It will no longer be available for booking.')) return;
    try {
      await api.deleteCourt(id);
      loadCourts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cannot delete court');
    }
  }

  const nextNumber = courts.length > 0 ? Math.max(...courts.map((c) => c.number)) + 1 : 1;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Manage Courts</h1>
      <p className="text-gray-600 mb-6">
        Add or deactivate courts as your facility expands. Currently {courts.filter((c) => c.isActive).length} active.
      </p>

      <div className="mb-8 max-w-md rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4">Add New Court</h2>
        {error && (
          <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Court ${nextNumber}`}
            required
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder={String(nextNumber)}
            min={1}
            required
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-court-600 px-4 py-2 text-sm font-medium text-white hover:bg-court-700"
          >
            Add
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <div
            key={court._id}
            className={`rounded-xl bg-white p-5 shadow-sm border ${
              court.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{court.name}</h3>
                <p className="text-gray-400 text-sm">Court #{court.number}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  court.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {court.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => toggleActive(court)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
              >
                {court.isActive ? 'Deactivate' : 'Activate'}
              </button>
              {court.isActive && (
                <button
                  onClick={() => handleDelete(court._id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
