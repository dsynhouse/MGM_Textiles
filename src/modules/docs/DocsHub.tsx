import React, { useState } from 'react';
import { Plus, Search, BookOpen, Tag, Edit3, Save, X, ChevronRight, Clock, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { DocArticle, DocCategory } from '../../types';

const CATEGORIES: { id: DocCategory; label: string; color: string }[] = [
  { id: 'sop',            label: 'SOP',            color: 'var(--color-amber-500)' },
  { id: 'machine-manual', label: 'Machine Manual',  color: 'var(--color-blue-500)' },
  { id: 'quality',        label: 'Quality',         color: 'var(--color-emerald-500)' },
  { id: 'training',       label: 'Training',        color: 'var(--color-violet-500)' },
  { id: 'policy',         label: 'Policy',          color: 'var(--color-rose-500)' },
  { id: 'general',        label: 'General',         color: 'var(--color-navy-400)' },
];

function renderMarkdown(text: string) {
  return text
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:600;margin:1rem 0 0.5rem;color:var(--text-primary)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.125rem;font-weight:700;margin:1.5rem 0 0.5rem;color:var(--text-primary)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:800;margin:0 0 1rem;color:var(--text-accent)">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code style="font-family:var(--font-mono);background:var(--bg-elevated);padding:1px 6px;border-radius:4px;font-size:0.875em">$1</code>')
    .replace(/^\| (.+)$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim());
      return `<tr>${cells.map((c: string) => `<td style="padding:6px 12px;border-bottom:1px solid var(--border-subtle)">${c}</td>`).join('')}</tr>`;
    })
    .replace(/^(\d+)\. (.+)$/gm, '<li style="margin:4px 0;padding-left:8px">$1. $2</li>')
    .replace(/^\- (.+)$/gm, '<li style="margin:4px 0;padding-left:8px;list-style:disc inside">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/^(.+)$/gm, (line) => line.startsWith('<') ? line : `<p style="margin:4px 0">${line}</p>`);
}

export function DocsHub() {
  const { docArticles, addDocArticle, updateDocArticle } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<DocCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(docArticles[0]?.id ?? null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'sop' as DocCategory, content: '', tags: '' });

  const filtered = docArticles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCat === 'all' || a.category === filterCat;
    return matchSearch && matchCat;
  });

  const selectedArticle = docArticles.find(a => a.id === selectedId);

  function startEdit() {
    if (!selectedArticle) return;
    setEditContent(selectedArticle.content);
    setEditing(true);
  }

  function saveEdit() {
    if (!selectedId) return;
    updateDocArticle(selectedId, {
      content: editContent,
      updatedAt: new Date().toISOString().split('T')[0],
      version: (selectedArticle?.version ?? 1) + 1,
    });
    setEditing(false);
  }

  function handleCreateArticle() {
    const id = `doc${Date.now()}`;
    addDocArticle({
      ...newArticle,
      id,
      tags: newArticle.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: 'Arjun Mehta',
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setSelectedId(id);
    setShowNewModal(false);
    setNewArticle({ title: '', category: 'sop', content: '', tags: '' });
  }

  const catInfo = (id: DocCategory) => CATEGORIES.find(c => c.id === id);

  return (
    <div className="page-content" style={{ padding: 0, display: 'flex', height: 'calc(100vh - var(--header-height))' }}>
      {/* Sidebar Panel */}
      <div className="docs-sidebar">
        <div className="docs-sidebar__header">
          <div className="flex items-center justify-between mb-4">
            <h2 className="fw-bold">Documentation</h2>
            <button className="btn btn--primary btn--sm" onClick={() => setShowNewModal(true)}>
              <Plus size={14} /> New
            </button>
          </div>
          <div className="search-box mb-3">
            <Search size={13} style={{ color: 'var(--text-tertiary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs..." />
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              className={`btn btn--sm ${filterCat === 'all' ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setFilterCat('all')}
            >All</button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`btn btn--sm ${filterCat === c.id ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setFilterCat(c.id)}
                style={{ color: filterCat === c.id ? '' : c.color }}
              >{c.label}</button>
            ))}
          </div>
        </div>

        <div className="docs-sidebar__list">
          {filtered.map(a => {
            const cat = catInfo(a.category);
            return (
              <button
                key={a.id}
                className={`docs-sidebar__item ${selectedId === a.id ? 'docs-sidebar__item--active' : ''}`}
                onClick={() => { setSelectedId(a.id); setEditing(false); }}
              >
                <div className="flex items-start gap-2">
                  <div style={{ width: 3, height: '100%', minHeight: 40, background: cat?.color ?? 'var(--color-navy-400)', borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
                  <div className="flex-1 min-w-0">
                    <div className="fw-medium text-sm truncate">{a.title}</div>
                    <div className="text-xs text-secondary mt-1 flex items-center gap-2">
                      <span style={{ color: cat?.color }}>{cat?.label}</span>
                      <span>v{a.version}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-secondary p-4">No documents found.</p>}
        </div>
      </div>

      {/* Main Content */}
      <div className="docs-main">
        {selectedArticle ? (
          <>
            <div className="docs-main__header">
              <div>
                <h1 className="fw-bold text-2xl">{selectedArticle.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  {catInfo(selectedArticle.category) && (
                    <span className="badge" style={{
                      background: catInfo(selectedArticle.category)!.color + '22',
                      color: catInfo(selectedArticle.category)!.color,
                      border: `1px solid ${catInfo(selectedArticle.category)!.color}44`
                    }}>
                      {catInfo(selectedArticle.category)!.label}
                    </span>
                  )}
                  <span className="text-xs text-secondary flex items-center gap-1">
                    <Clock size={12} /> Updated {selectedArticle.updatedAt}
                  </span>
                  <span className="text-xs text-secondary">v{selectedArticle.version}</span>
                  <span className="text-xs text-secondary">by {selectedArticle.author}</span>
                </div>
                {selectedArticle.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {selectedArticle.tags.map(t => (
                      <span key={t} className="badge badge--neutral" style={{ fontSize: 10 }}>
                        <Tag size={9} /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button className="btn btn--secondary" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
                    <button className="btn btn--primary" onClick={saveEdit}><Save size={15} /> Save</button>
                  </>
                ) : (
                  <button className="btn btn--secondary" onClick={startEdit}><Edit3 size={15} /> Edit</button>
                )}
              </div>
            </div>

            <div className="docs-main__body">
              {editing ? (
                <textarea
                  className="form-control"
                  style={{ minHeight: 500, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', lineHeight: 1.8, resize: 'vertical' }}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                />
              ) : (
                <div
                  className="docs-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedArticle.content) }}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full flex-col gap-4" style={{ color: 'var(--text-tertiary)' }}>
            <BookOpen size={48} />
            <p>Select a document to read or create a new one</p>
          </div>
        )}
      </div>

      {/* New Article Modal */}
      {showNewModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowNewModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">New Article</h2>
              <button className="btn btn--ghost btn--icon" onClick={() => setShowNewModal(false)}><X size={18} /></button>
            </div>
            <div className="modal__body">
              <div className="form-group mb-4">
                <label className="form-label">Title *</label>
                <input className="form-control" value={newArticle.title} onChange={e => setNewArticle(a => ({ ...a, title: e.target.value }))} placeholder="Article title" />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Category</label>
                <select className="form-control" value={newArticle.category} onChange={e => setNewArticle(a => ({ ...a, category: e.target.value as DocCategory }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-control" value={newArticle.tags} onChange={e => setNewArticle(a => ({ ...a, tags: e.target.value }))} placeholder="loom, safety, startup" />
              </div>
              <div className="form-group">
                <label className="form-label">Content (Markdown supported)</label>
                <textarea className="form-control" style={{ fontFamily: 'var(--font-mono)', minHeight: 200 }} value={newArticle.content} onChange={e => setNewArticle(a => ({ ...a, content: e.target.value }))} placeholder="# Article Title&#10;&#10;Write your content here using markdown..." />
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn--secondary" onClick={() => setShowNewModal(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleCreateArticle} disabled={!newArticle.title}>Create Article</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
