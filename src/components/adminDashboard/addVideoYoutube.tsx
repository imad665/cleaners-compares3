'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddVideoForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
  });
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false);

  const extractVideoId = (url: string) => {
    const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'url') {
      const id = extractVideoId(value);
      if (id) {
        setVideoId(id);
        setError('');
      } else {
        setVideoId('');
        setError('Invalid YouTube URL.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (!videoId || !form.category) {
      setError('Please provide a valid YouTube URL and select a category.');
      return;
    }

    const res = await fetch('/api/admin/videos/fromYoutube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        url: `https://www.youtube.com/embed/${videoId}`,
        description: form.description,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        category: form.category,
      }),
    });
    setLoading(false)

    if (res.ok) {
      toast.success('Video saved!');
      setForm({ title: '', url: '', description: '', category: '' });
      setVideoId('');
      onSuccess();
    } else {
      toast.error('Failed to save.');
    }
  };

  const categories = [
    'Dry Cleaning Machines',
    'Laundry Machines',
    'Laundry Dryers',
    'Guide Videos',
    'Wet Cleaning Systems',
    'Company Profile Videos',
    'Flat Work Ironers',
    'Packaging / Folding',
    'Shirt Machines',
    'Laundry Installations',
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Add YouTube Video</h2>

      <input
        type="text"
        name="title"
        placeholder="Video Title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-2 border mb-2 rounded"
        required
      />
      <input
        type="text"
        name="url"
        placeholder="YouTube URL"
        value={form.url}
        onChange={handleChange}
        className="w-full p-2 border mb-2 rounded"
        required
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 border mb-2 rounded"
      />

      <div className="mb-4">
        <Select
          value={form.category}
          onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {videoId && (
        <iframe
          className="mb-4 w-full"
          height="215"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Preview"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}

      <button
        type="submit"
        disabled={!videoId || !form.category || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {!loading?"Save Video":"Loading..."}
      </button>
    </form>
  );
}
