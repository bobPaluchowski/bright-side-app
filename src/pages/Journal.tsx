import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, FileText, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: selectedEntry?.content || '',
    onUpdate: ({ editor }) => {
      if (selectedEntry) {
        const updatedEntry = {
          ...selectedEntry,
          content: editor.getHTML(),
        };
        handleSave(updatedEntry);
      }
    },
  });

  useEffect(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    if (selectedEntry) {
      editor?.commands.setContent(selectedEntry.content);
      setTitle(selectedEntry.title);
    }
  }, [selectedEntry, editor]);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: 'New Entry',
      content: '',
      date: new Date().toISOString(),
    };
    setEntries([newEntry, ...entries]);
    setSelectedEntry(newEntry);
    setTitle('New Entry');
    localStorage.setItem('journal_entries', JSON.stringify([newEntry, ...entries]));
  };

  const handleSave = (entry: JournalEntry) => {
    const updatedEntries = entries.map((e) =>
      e.id === entry.id ? { ...entry, title } : e
    );
    setEntries(updatedEntries);
    localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    toast.success('Entry saved');
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter((e) => e.id !== id);
    setEntries(updatedEntries);
    setSelectedEntry(null);
    localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    toast.success('Entry deleted');
  };

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold font-quicksand">Journal</h2>
          <button
            onClick={handleNewEntry}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Plus className="w-5 h-5 text-accent" />
          </button>
        </div>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedEntry?.id === entry.id
                  ? 'bg-secondary'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-center justify-between">
                <FileText className="w-4 h-4 text-gray-500" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <h3 className="text-sm font-medium mt-2">{entry.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(entry.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        {selectedEntry ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-semibold bg-transparent border-none focus:outline-none font-quicksand"
                placeholder="Entry Title"
              />
              <button
                onClick={() => handleSave(selectedEntry)}
                className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
            <EditorContent
              editor={editor}
              className="prose max-w-none font-open-sans"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select an entry or create a new one
          </div>
        )}
      </div>
    </div>
  );
}