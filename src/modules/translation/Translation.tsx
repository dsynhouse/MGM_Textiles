import React, { useState } from 'react';
import { Globe, Languages, FileText, Book, ArrowRight, Copy, Check, Upload, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

// Textile-specific glossary terms
const GLOSSARY = [
  { en: 'Reed Count', hi: 'रीड काउंट', ur: 'ریڈ کاؤنٹ', definition: 'Number of dents per unit width of reed' },
  { en: 'Picks per Inch', hi: 'प्रति इंच पिक', ur: 'فی انچ پِکس', definition: 'Number of weft threads per inch of fabric' },
  { en: 'Warp', hi: 'ताना', ur: 'تانا', definition: 'Lengthwise yarns in a woven fabric' },
  { en: 'Weft', hi: 'बाना', ur: 'بانا', definition: 'Crosswise yarns in a woven fabric' },
  { en: 'Beam', hi: 'बीम', ur: 'بیم', definition: 'Cylindrical roller holding wound warp yarns' },
  { en: 'GSM', hi: 'जी.एस.एम.', ur: 'جی ایس ایم', definition: 'Grams per Square Meter — fabric weight measure' },
  { en: 'Efficiency', hi: 'दक्षता', ur: 'کارکردگی', definition: 'Ratio of actual output to maximum possible output' },
  { en: 'Loom', hi: 'करघा', ur: 'کھڈی', definition: 'Machine for weaving warp and weft threads into cloth' },
  { en: 'Yarn Count', hi: 'धागे की काउंट', ur: 'یارن کاؤنٹ', definition: 'Measure of fineness of yarn (Ne, Nm, Tex)' },
  { en: 'Selvage', hi: 'बुनाई का किनारा', ur: 'کپڑے کا کنارہ', definition: 'Finished edge of the fabric to prevent raveling' },
  { en: 'Sizing', hi: 'साइज़िंग', ur: 'سائزنگ', definition: 'Chemical treatment applied to warp yarns for strength' },
  { en: 'Dobby', hi: 'डॉबी', ur: 'ڈابی', definition: 'Weaving mechanism to create small geometric patterns' },
  { en: 'Rapier', hi: 'रेपियर', ur: 'ریپیئر', definition: 'Loom type using a flexible or rigid band to insert weft' },
  { en: 'Air-jet', hi: 'एयर-जेट', ur: 'ایئر جیٹ', definition: 'Loom using compressed air to propel weft yarn' },
  { en: 'Defect', hi: 'दोष', ur: 'خامی', definition: 'Imperfection in fabric requiring correction or marking' },
];

// Simple translation samples
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    machines: 'Machines',
    production: 'Production',
    efficiency: 'Efficiency',
    running: 'Running',
    idle: 'Idle',
    maintenance: 'Maintenance',
    breakdown: 'Breakdown',
    shift: 'Shift',
    morning: 'Morning',
    afternoon: 'Afternoon',
    night: 'Night',
    employee: 'Employee',
    supervisor: 'Supervisor',
    operator: 'Operator',
    order: 'Order',
    completed: 'Completed',
    pending: 'Pending',
    active: 'Active',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    machines: 'मशीनें',
    production: 'उत्पादन',
    efficiency: 'दक्षता',
    running: 'चालू',
    idle: 'निष्क्रिय',
    maintenance: 'रखरखाव',
    breakdown: 'खराबी',
    shift: 'पाली',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    night: 'रात',
    employee: 'कर्मचारी',
    supervisor: 'पर्यवेक्षक',
    operator: 'संचालक',
    order: 'आदेश',
    completed: 'पूर्ण',
    pending: 'लंबित',
    active: 'सक्रिय',
  },
  ur: {
    dashboard: 'ڈیش بورڈ',
    machines: 'مشینیں',
    production: 'پیداوار',
    efficiency: 'کارکردگی',
    running: 'چل رہی ہے',
    idle: 'بیکار',
    maintenance: 'دیکھ بھال',
    breakdown: 'خرابی',
    shift: 'شفٹ',
    morning: 'صبح',
    afternoon: 'دوپہر',
    night: 'رات',
    employee: 'ملازم',
    supervisor: 'نگران',
    operator: 'آپریٹر',
    order: 'آرڈر',
    completed: 'مکمل',
    pending: 'زیر التواء',
    active: 'فعال',
  },
};

export function Translation() {
  const { language, setLanguage, addDocArticle, currentUser } = useAppStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'glossary' | 'ui-strings' | 'document'>('glossary');
  const [docInput, setDocInput] = useState('');
  const [targetLang, setTargetLang] = useState<'hi' | 'ur'>('hi');
  const [copied, setCopied] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    // Mock OCR processing
    setTimeout(() => {
      setDocInput("MGM Textiles — Standard Operating Procedure\n\nSubject: Rapier Loom Startup\n\n1. Ensure the machine is in idle state.\n2. Check warp tension and reed alignment.\n3. Verify weft insertion mechanism.\n4. Start the machine at low RPM initially.\n5. Monitor for any defects or stops.");
      setIsUploading(false);
    }, 2000);
  };

  const handleSaveToDocs = () => {
    const title = "Translated Document - " + new Date().toLocaleDateString();
    addDocArticle({
      id: `doc${Date.now()}`,
      title,
      category: 'general',
      content: `# ${title}\n\n## Translation (${targetLang.toUpperCase()})\n\n${translatedOutput}\n\n---\n\n## Original Text\n\n${docInput}`,
      tags: ['translated', targetLang],
      author: currentUser.name,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    navigate('/docs');
  };

  const filteredGlossary = GLOSSARY.filter(g =>
    g.en.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.hi.includes(glossarySearch) ||
    g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const translatedOutput = docInput
    .split(' ')
    .map(word => {
      const lower = word.toLowerCase().replace(/[.,!?]/g, '');
      const t = TRANSLATIONS[targetLang][lower];
      return t ? `${t}` : word;
    })
    .join(' ');

  async function handleCopy() {
    await navigator.clipboard.writeText(translatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Translation Hub</h2>
          <p className="section-subtitle">Multilingual support, textile glossary, and document translation</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-secondary">UI Language:</span>
          {(['en', 'hi', 'ur'] as const).map(lang => (
            <button
              key={lang}
              className={`btn btn--sm ${language === lang ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => setLanguage(lang)}
            >
              {lang === 'en' ? '🇬🇧 English' : lang === 'hi' ? '🇮🇳 हिन्दी' : '🇵🇰 اردو'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'glossary', label: 'Textile Glossary', icon: Book },
          { id: 'ui-strings', label: 'UI Translations', icon: Languages },
          { id: 'document', label: 'Document Translation', icon: FileText },
        ].map(t => (
          <button key={t.id} className={`btn ${tab === t.id ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setTab(t.id as any)}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'glossary' && (
        <>
          <div className="search-box mb-6" style={{ maxWidth: 400 }}>
            <Globe size={15} style={{ color: 'var(--text-tertiary)' }} />
            <input value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)} placeholder="Search terms..." />
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>English</th><th>हिन्दी</th><th>اردو</th><th>Definition</th></tr>
              </thead>
              <tbody>
                {filteredGlossary.map(term => (
                  <tr key={term.en}>
                    <td className="fw-semibold">{term.en}</td>
                    <td style={{ fontFamily: 'serif', fontSize: 'var(--text-base)' }}>{term.hi}</td>
                    <td style={{ fontFamily: 'serif', fontSize: 'var(--text-base)', direction: 'rtl' }}>{term.ur}</td>
                    <td className="text-sm text-secondary">{term.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'ui-strings' && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Key</th><th>English</th><th>हिन्दी</th><th>اردو</th></tr>
            </thead>
            <tbody>
              {Object.entries(TRANSLATIONS.en).map(([key, en]) => (
                <tr key={key}>
                  <td className="font-mono text-xs text-secondary">{key}</td>
                  <td className="fw-medium">{en}</td>
                  <td style={{ fontFamily: 'serif' }}>{TRANSLATIONS.hi[key]}</td>
                  <td style={{ fontFamily: 'serif', direction: 'rtl' }}>{TRANSLATIONS.ur[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'document' && (
        <div className="grid-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="fw-semibold">Source (English)</h3>
              <div className="flex gap-2">
                <label className="btn btn--secondary btn--sm" style={{ cursor: 'pointer' }}>
                  {isUploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                  {isUploading ? 'Extracting...' : 'Upload PDF/PNG'}
                  <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
                <span className="badge badge--neutral">EN</span>
              </div>
            </div>
            <textarea
              className="form-control"
              style={{ minHeight: 300, resize: 'vertical' }}
              value={docInput}
              onChange={e => setDocInput(e.target.value)}
              placeholder="Paste your English text here for translation preview..."
            />
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="fw-semibold">Translation</h3>
              <div className="flex gap-2">
                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value as 'hi' | 'ur')}
                >
                  <option value="hi">हिन्दी</option>
                  <option value="ur">اردو</option>
                </select>
                <button className="btn btn--secondary btn--sm" onClick={handleCopy}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="btn btn--primary btn--sm" onClick={handleSaveToDocs} disabled={!translatedOutput}>
                  <Save size={14} /> Save to Docs
                </button>
              </div>
            </div>
            <div
              style={{
                minHeight: 300,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                color: 'var(--text-primary)',
                fontFamily: 'serif',
                fontSize: 'var(--text-base)',
                lineHeight: 1.8,
                direction: targetLang === 'ur' ? 'rtl' : 'ltr',
              }}
            >
              {translatedOutput || <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>Translation will appear here…</span>}
            </div>
            <p className="text-xs text-secondary mt-3">
              * This is a keyword-based preview. Connect to Google Translate API or DeepL for full document translation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
