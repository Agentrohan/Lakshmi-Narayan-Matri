import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
interface Profile {
  id: string;
  submittedAt: string;
  fullName?: string;
  gender?: string;
  dob?: string;
  birthPlace?: string;
  address?: string;
  raas?: string;
  gana?: string;
  gotra?: string;
  shakha?: string;
  nakshatra?: string;
  charan?: string;
  naad?: string;
  mangal?: string;
  diet?: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  education?: string;
  occupation?: string;
  jobLocation?: string;
  income?: string;
  fatherName?: string;
  fatherDetails?: string;
  motherName?: string;
  motherDetails?: string;
  siblings?: string;
  maritalStatus?: string;
  vyanga?: string;
  vyangaDetail?: string;
  ageMin?: string;
  ageMax?: string;
  expectedHeight?: string;
  expectedEducation?: string;
  partnerExpectations?: string;
  contact1?: string;
  contact2?: string;
  transactionId?: string;
  profilePhotoUrl?: string;
  profilePhotoBase64?: string;
  aadharBase64?: string;
  iqCode?: string;
  suggestedTo?: string[];
  verified?: boolean;
}
interface Message {
  id: string;
  sentAt: string;
  read: boolean;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function parseHeightCm(h?: string): number {
  if (!h) return 0;
  // handles "5'7\"", "170 cm", "170", "5.7"
  const ft = h.match(/(\d+)['\s](\d+)/);
  if (ft) return Math.round(parseInt(ft[1]) * 30.48 + parseInt(ft[2]) * 2.54);
  const cm = h.match(/(\d+)/);
  return cm ? parseInt(cm[1]) : 0;
}
function parseAge(dob?: string): number {
  if (!dob) return 0;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
const EDIT_FIELDS: {
  key: keyof Profile;
  label: string;
  type?: 'select' | 'textarea';
  options?: string[];
}[] = [{
  key: 'fullName',
  label: 'Full Name'
}, {
  key: 'gender',
  label: 'Gender',
  type: 'select',
  options: ['Male', 'Female']
}, {
  key: 'dob',
  label: 'Date of Birth'
}, {
  key: 'birthPlace',
  label: 'Birth Place'
}, {
  key: 'address',
  label: 'Address',
  type: 'textarea'
}, {
  key: 'raas',
  label: 'Raas'
}, {
  key: 'gana',
  label: 'Gana'
}, {
  key: 'gotra',
  label: 'Gotra'
}, {
  key: 'shakha',
  label: 'Shakha'
}, {
  key: 'nakshatra',
  label: 'Nakshatra'
}, {
  key: 'charan',
  label: 'Charan'
}, {
  key: 'naad',
  label: 'Naad'
}, {
  key: 'mangal',
  label: 'Mangal',
  type: 'select',
  options: ['Yes', 'No', 'Partial']
}, {
  key: 'diet',
  label: 'Diet',
  type: 'select',
  options: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian']
}, {
  key: 'height',
  label: 'Height'
}, {
  key: 'weight',
  label: 'Weight'
}, {
  key: 'bloodGroup',
  label: 'Blood Group'
}, {
  key: 'education',
  label: 'Education',
  type: 'textarea'
}, {
  key: 'occupation',
  label: 'Occupation',
  type: 'textarea'
}, {
  key: 'jobLocation',
  label: 'Job Location'
}, {
  key: 'income',
  label: 'Annual Income'
}, {
  key: 'fatherName',
  label: "Father's Name"
}, {
  key: 'fatherDetails',
  label: "Father's Details",
  type: 'textarea'
}, {
  key: 'motherName',
  label: "Mother's Name"
}, {
  key: 'motherDetails',
  label: "Mother's Details",
  type: 'textarea'
}, {
  key: 'siblings',
  label: 'Siblings',
  type: 'textarea'
}, {
  key: 'maritalStatus',
  label: 'Marital Status'
}, {
  key: 'vyanga',
  label: 'Vyanga/Disability',
  type: 'select',
  options: ['No', 'Yes']
}, {
  key: 'vyangaDetail',
  label: 'Vyanga Detail',
  type: 'textarea'
}, {
  key: 'partnerExpectations',
  label: 'Partner Expectations',
  type: 'textarea'
}, {
  key: 'contact1',
  label: 'Contact 1'
}, {
  key: 'contact2',
  label: 'Contact 2'
}];
const iClass = 'w-full rounded border border-accent/40 bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors';
function EditProfileModal({
  profile,
  onClose,
  onSave
}: {
  profile: Profile;
  onClose: () => void;
  onSave: (updated: Profile) => void;
}) {
  const [form, setForm] = useState<Partial<Profile>>(() => {
    const init: Record<string, string> = {};
    for (const f of EDIT_FIELDS) init[f.key] = profile[f.key] as string | undefined ?? '';
    return init as Partial<Profile>;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  function set(key: keyof Profile, value: string) {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  }
  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSave({
        ...profile,
        ...form
      });
      onClose();
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-accent/40 shadow-2xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-accent/20" style={{
        background: 'rgba(45,27,105,0.06)'
      }}>
          <div>
            <p className="font-heading text-primary font-bold text-lg">Edit Profile</p>
            <p className="text-xs text-muted-foreground">{profile.fullName || 'Unknown'}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary text-2xl leading-none transition-colors">×</button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 max-h-[65vh] overflow-y-auto">
          {EDIT_FIELDS.map(f => <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
              {f.type === 'select' ? <select value={form[f.key] as string ?? ''} onChange={e => set(f.key, e.target.value)} className={iClass}>
                  <option value="">— Select —</option>
                  {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
                </select> : f.type === 'textarea' ? <textarea value={form[f.key] as string ?? ''} onChange={e => set(f.key, e.target.value)} rows={3} className={iClass + ' resize-y'} /> : <input type="text" value={form[f.key] as string ?? ''} onChange={e => set(f.key, e.target.value)} className={iClass} />}
            </div>)}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-accent/20 flex items-center justify-between gap-3">
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          {!error && <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg border border-accent/40 text-primary hover:bg-accent/10 transition-colors font-medium">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="text-sm px-5 py-2 rounded-lg text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" style={{
            background: '#2D1B69',
            border: '1px solid #C9A84C'
          }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>;
}

// ── Profile Card ──────────────────────────────────────────────────────────────
function ProfileCard({
  profile: initialProfile,
  serialNo,
  index,
  onDelete,
  onUpdate
}: {
  profile: Profile;
  serialNo: number;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (updated: Profile) => void;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/profiles/${profile.id}`, {
        method: 'DELETE'
      });
      onDelete(profile.id);
    } catch (_) {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }
  function handleEditSave(updated: Profile) {
    setProfile(updated);
    onUpdate(updated);
  }
  async function buildProfileHtml(): Promise<string> {
    const origin = window.location.origin;
    let logoBase64 = `${origin}/assets/logo.png`;
    try {
      const resp = await fetch(`${origin}/assets/logo.png`);
      const blob = await resp.blob();
      logoBase64 = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (_) {}
    const photoBase64 = profile.profilePhotoBase64 || '';
    const personalFields = [['Full Name', profile.fullName], ['Gender', profile.gender], ['Date of Birth', profile.dob], ['Birth Place', profile.birthPlace], ['Address', profile.address], ['Raas', profile.raas], ['Gana', profile.gana], ['Gotra', profile.gotra], ['Shakha', profile.shakha], ['Nakshatra', profile.nakshatra], ['Charan', profile.charan], ['Naad', profile.naad], ['Mangal', profile.mangal], ['Diet', profile.diet], ['Height', profile.height], ['Weight', profile.weight], ['Blood Group', profile.bloodGroup]].filter(([, v]) => v).map(([l, v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('');
    return `
      <html><head><title>${profile.fullName || 'Profile'} — LNM Biodata</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1A1040; max-width: 720px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 14px; margin-bottom: 20px; }
        .header img.logo { width: 64px; height: 64px; object-fit: contain; display: block; margin: 0 auto 8px; }
        .header h1 { color: #2D1B69; font-size: 20px; margin: 0 0 2px; }
        .header .sub { color: #7A5C3A; font-size: 12px; margin: 0 0 4px; font-style: italic; }
        .header p { color: #999; font-size: 11px; margin: 0; }
        h2 { color: #2D1B69; font-size: 13px; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #C9A84C; padding-bottom: 3px; text-transform: uppercase; letter-spacing: 0.05em; }
        .row { display: flex; gap: 16px; margin-bottom: 5px; }
        .label { font-weight: bold; min-width: 150px; font-size: 11px; color: #5B4E8A; }
        .value { font-size: 11px; color: #1A1040; }
        .personal-section { display: flex; gap: 24px; align-items: flex-start; }
        .personal-fields { flex: 1; }
        .personal-photo { flex-shrink: 0; width: 130px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 4px; }
        .personal-photo img { width: 120px; height: 120px; object-fit: cover; border-radius: 50%; border: 3px solid #C9A84C; display: block; }
        .personal-photo .name { font-size: 12px; font-weight: bold; color: #2D1B69; text-align: center; margin-top: 6px; }
        .expectations { font-size: 11px; color: #1A1040; line-height: 1.6; padding: 8px; background: #f5f3ff; border-left: 3px solid #C9A84C; border-radius: 4px; }
        .footer { margin-top: 40px; font-size: 10px; color: #bbb; border-top: 1px solid #eee; padding-top: 10px; text-align: center; }
      </style></head><body>
      <div class="header">
        <img class="logo" src="${logoBase64}" alt="Lakshmi Narayan Matrimony Logo" />
        <h1>${profile.fullName || 'Biodata'}</h1>
        <p class="sub">लक्ष्मी नारायण वधू-वर सूचक</p>
        <p>Submitted: ${new Date(profile.submittedAt).toLocaleString('en-IN')}</p>
      </div>
      <h2>Personal Details</h2>
      <div class="personal-section">
        <div class="personal-fields">${personalFields}</div>
        ${photoBase64 ? `<div class="personal-photo"><img src="${photoBase64}" alt="Profile Photo" /><p class="name">${profile.fullName || ''}</p></div>` : ''}
      </div>
      <h2>Education &amp; Occupation</h2>
      ${[['Education', profile.education], ['Occupation', profile.occupation], ['Job Location', profile.jobLocation], ['Annual Income', profile.income]].filter(([, v]) => v).map(([l, v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('')}
      <h2>Family Details</h2>
      ${[["Father's Name", profile.fatherName], ["Father's Details", profile.fatherDetails], ["Mother's Name", profile.motherName], ["Mother's Details", profile.motherDetails], ['Siblings', profile.siblings], ['Vyanga', profile.vyanga], ['Vyanga Detail', profile.vyangaDetail]].filter(([, v]) => v).map(([l, v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('')}
      <h2>Contact Details</h2>
      ${[['Contact 1', profile.contact1], ['Contact 2', profile.contact2]].filter(([, v]) => v).map(([l, v]) => `<div class="row"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('')}
      <h2>Partner Expectations</h2>
      ${profile.partnerExpectations ? `<div class="expectations">${profile.partnerExpectations}</div>` : '<p style="font-size:11px;color:#999;">Not specified.</p>'}
      <div class="footer">Lakshmi Narayan Matrimony — Confidential. For internal use only. Do not distribute.</div>
      </body></html>
    `;
  }
  async function printProfile() {
    const html = await buildProfileHtml();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
  }
  async function downloadProfile() {
    const html = await buildProfileHtml();
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;visibility:hidden;background:#ffffff;';
    document.body.appendChild(iframe);
    await new Promise<void>(resolve => {
      iframe.onload = () => resolve();
      iframe.srcdoc = html;
    });
    await new Promise(r => setTimeout(r, 800));
    try {
      const {
        toJpeg
      } = await import('html-to-image');
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) throw new Error('No iframe document');
      const bodyEl = iframeDoc.body;
      bodyEl.style.margin = '0';
      bodyEl.style.background = '#ffffff';
      const dataUrl = await toJpeg(bodyEl, {
        width: 794,
        pixelRatio: 2,
        quality: 0.92,
        backgroundColor: '#ffffff'
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${profile.fullName || 'biodata'}-LNM.jpg`;
      a.click();
    } finally {
      document.body.removeChild(iframe);
    }
  }
  const fields: [string, string | undefined][] = [['Gender', profile.gender], ['DOB', profile.dob], ['Birth Place', profile.birthPlace], ['Raas', profile.raas], ['Nakshatra', profile.nakshatra], ['Gotra', profile.gotra], ['Mangal', profile.mangal], ['Diet', profile.diet], ['Height', profile.height], ['Blood Group', profile.bloodGroup], ['Education', profile.education], ['Occupation', profile.occupation], ['Income', profile.income], ['Marital Status', profile.maritalStatus], ['Contact 1', profile.contact1], ['Transaction ID', profile.transactionId]];
  return <motion.div className="bg-card rounded-xl border border-accent/30 shadow-sm overflow-hidden" initial={{
    opacity: 0,
    y: 12
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2
    }
  }} transition={{
    duration: 0.3,
    delay: index * 0.04,
    ease: 'easeOut' as const
  }} layout>
      <div className="flex items-center justify-between px-5 py-4 border-b border-accent/20 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {(profile.profilePhotoBase64 || profile.profilePhotoUrl) && <img src={profile.profilePhotoBase64 || profile.profilePhotoUrl} alt={profile.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-accent/40 shrink-0" />}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-heading text-primary font-semibold text-base">{profile.fullName || 'Unknown'}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-accent/60 text-accent" style={{
              background: 'rgba(201,168,76,0.1)'
            }}>
                #{serialNo}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {profile.gender} &nbsp;•&nbsp; Submitted: {new Date(profile.submittedAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setExpanded(!expanded)} className="text-xs px-3 py-1.5 rounded border border-accent/40 text-primary hover:bg-accent/10 transition-colors font-medium">
            {expanded ? 'Collapse' : 'View Details'}
          </button>
          <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded border border-accent/60 text-primary hover:bg-accent/10 transition-colors font-medium" style={{
          borderColor: '#C9A84C'
        }}>
            ✏ Edit
          </button>
          <button onClick={printProfile} className="text-xs px-3 py-1.5 rounded text-primary-foreground font-medium transition-colors hover:opacity-90" style={{
          background: '#2D1B69',
          border: '1px solid #C9A84C'
        }}>
            🖨 Print
          </button>
          <button onClick={downloadProfile} className="text-xs px-3 py-1.5 rounded text-primary-foreground font-medium transition-colors hover:opacity-90" style={{
          background: '#1E3A8A',
          border: '1px solid #C9A84C'
        }}>
            ⬇ Download
          </button>
          {!confirmDelete ? <button onClick={() => setConfirmDelete(true)} className="text-xs px-3 py-1.5 rounded border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors font-medium">
              🗑 Delete
            </button> : <div className="flex gap-1 items-center">
              <span className="text-xs text-destructive font-medium">Sure?</span>
              <button onClick={handleDelete} disabled={deleting} className="text-xs px-2 py-1 rounded bg-destructive text-white font-medium hover:opacity-90 disabled:opacity-50">
                {deleting ? '...' : 'Yes'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs px-2 py-1 rounded border border-accent/40 text-primary hover:bg-accent/10">No</button>
            </div>}
        </div>
      </div>
      <div className="px-5 py-3 flex flex-wrap gap-x-4 gap-y-1">
        {fields.slice(0, 6).map(([label, value]) => value ? <span key={label} className="text-xs text-muted-foreground">
            <span className="font-medium text-card-foreground/70">{label}:</span> {value}
          </span> : null)}
      </div>
      {expanded && <div className="px-5 pb-5 border-t border-accent/10 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
            {fields.map(([label, value]) => value ? <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm text-card-foreground font-medium">{value}</p>
              </div> : null)}
            {profile.address && <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm text-card-foreground font-medium">{profile.address}</p>
              </div>}
            {profile.siblings && <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Siblings</p>
                <p className="text-sm text-card-foreground font-medium">{profile.siblings}</p>
              </div>}
            {profile.partnerExpectations && <div className="col-span-3">
                <p className="text-xs text-muted-foreground mb-1">Partner Expectations</p>
                <p className="text-sm text-card-foreground leading-relaxed bg-muted rounded-lg px-3 py-2 border border-accent/20">{profile.partnerExpectations}</p>
              </div>}
          </div>
        </div>}
      {editing && <EditProfileModal profile={profile} onClose={() => setEditing(false)} onSave={handleEditSave} />}
    </motion.div>;
}

// ── Message Card ──────────────────────────────────────────────────────────────
function MessageCard({
  msg,
  onMarkRead
}: {
  msg: Message;
  onMarkRead: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return <motion.div className={`bg-card rounded-xl border shadow-sm overflow-hidden ${msg.read ? 'border-accent/20' : 'border-accent/60'}`} initial={{
    opacity: 0,
    y: 8
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.25,
    ease: 'easeOut' as const
  }} layout>
      <div className="flex items-center justify-between px-5 py-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {!msg.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" title="Unread" />}
          <div>
            <p className="font-heading text-primary font-semibold text-sm">{msg.name || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">
              {msg.phone && <span>{msg.phone} &nbsp;•&nbsp;</span>}
              {new Date(msg.sentAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setExpanded(!expanded)} className="text-xs px-3 py-1.5 rounded border border-accent/40 text-primary hover:bg-accent/10 transition-colors font-medium">
            {expanded ? 'Hide' : 'Read'}
          </button>
          {!msg.read && <button onClick={() => onMarkRead(msg.id)} className="text-xs px-3 py-1.5 rounded text-primary-foreground font-medium hover:opacity-90" style={{
          background: '#2D1B69',
          border: '1px solid #C9A84C'
        }}>
              Mark Read
            </button>}
        </div>
      </div>
      {expanded && <div className="px-5 pb-4 border-t border-accent/10 pt-3">
          {msg.email && <p className="text-xs text-muted-foreground mb-2">Email: <span className="text-card-foreground">{msg.email}</span></p>}
          <p className="text-sm text-card-foreground leading-relaxed bg-muted rounded-lg px-3 py-2 border border-accent/20 whitespace-pre-wrap">
            {msg.message || <span className="italic text-muted-foreground">No message body.</span>}
          </p>
        </div>}
    </motion.div>;
}

// ── Matching Panel ────────────────────────────────────────────────────────────
function MatchingPanel({
  profiles,
  onSuggest
}: {
  profiles: Profile[];
  onSuggest: (profileId: string, suggestedIds: string[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchSearch, setMatchSearch] = useState('');
  const [suggestSearch, setSuggestSearch] = useState('');
  const [alreadySearch, setAlreadySearch] = useState('');
  const selected = profiles.find(p => p.id === selectedId) ?? null;

  // derive serial number from position in full profiles array
  function serialOf(id: string) {
    return profiles.findIndex(p => p.id === id) + 1;
  }
  const filteredList = profiles.filter(p => !matchSearch || (p.fullName || '').toLowerCase().includes(matchSearch.toLowerCase()) || String(serialOf(p.id)).includes(matchSearch) || (p.contact1 || '').includes(matchSearch));
  function getSortedOpposite(p: Profile): Profile[] {
    const opposite = p.gender === 'Male' ? 'Female' : 'Male';
    const pAge = parseAge(p.dob);
    const pHt = parseHeightCm(p.height);
    return profiles.filter(c => c.id !== p.id && c.gender === opposite).map(c => ({
      profile: c,
      ageDiff: Math.abs(parseAge(c.dob) - pAge),
      htDiff: Math.abs(parseHeightCm(c.height) - pHt)
    })).sort((a, b) => a.ageDiff + a.htDiff * 0.3 - (b.ageDiff + b.htDiff * 0.3)).map(x => x.profile);
  }
  async function markSuggested(candidateId: string) {
    if (!selected) return;
    const current = selected.suggestedTo ?? [];
    const updated = current.includes(candidateId) ? current.filter(id => id !== candidateId) : [...current, candidateId];
    await fetch(`/api/profiles/${selected.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        suggestedTo: updated
      })
    });
    onSuggest(selected.id, updated);
  }
  const alreadySuggestedIds = selected?.suggestedTo ?? [];
  const allOpposite = selected ? getSortedOpposite(selected) : [];
  const newSuggestions = allOpposite.filter(c => !alreadySuggestedIds.includes(c.id));
  const alreadySuggestedProfiles = allOpposite.filter(c => alreadySuggestedIds.includes(c.id));
  function filterBySearch(list: Profile[], q: string) {
    if (!q) return list;
    const lq = q.toLowerCase();
    return list.filter(c => (c.fullName || '').toLowerCase().includes(lq) || String(serialOf(c.id)).includes(q) || (c.occupation || '').toLowerCase().includes(lq));
  }
  const visibleSuggestions = filterBySearch(newSuggestions, suggestSearch);
  const visibleAlready = filterBySearch(alreadySuggestedProfiles, alreadySearch);
  function MatchCard({
    c,
    rank
  }: {
    c: Profile;
    rank: number;
  }) {
    const ageDiff = selected ? Math.abs(parseAge(c.dob) - parseAge(selected.dob)) : 0;
    const htDiff = selected ? Math.abs(parseHeightCm(c.height) - parseHeightCm(selected.height)) : 0;
    const isSuggested = alreadySuggestedIds.includes(c.id);
    return <div className={`bg-card rounded-xl border px-4 py-3 flex flex-col gap-2 ${isSuggested ? 'border-accent/50' : 'border-accent/20'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-5 shrink-0 font-bold">{rank}</span>
          {c.profilePhotoBase64 || c.profilePhotoUrl ? <img src={c.profilePhotoBase64 || c.profilePhotoUrl} className="w-10 h-10 rounded-full object-cover border border-accent/40 shrink-0" alt="" /> : <div className="w-10 h-10 rounded-full bg-muted border border-accent/20 shrink-0 flex items-center justify-center text-sm font-bold text-muted-foreground">
              {(c.fullName || '?')[0]}
            </div>}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-primary text-sm">{c.fullName}</p>
              <span className="text-xs text-accent font-bold">#{serialOf(c.id)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Age: {parseAge(c.dob) || '—'} (Δ{ageDiff}yr) &nbsp;•&nbsp; Height: {c.height || '—'} (Δ{htDiff}cm) &nbsp;•&nbsp; {c.occupation || '—'}
            </p>
          </div>
          <button onClick={() => markSuggested(c.id)} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all shrink-0 ${isSuggested ? 'border-destructive/40 text-destructive hover:bg-destructive/10' : 'text-primary-foreground hover:opacity-90'}`} style={!isSuggested ? {
          background: '#2D1B69',
          border: '1px solid #C9A84C'
        } : {}}>
            {isSuggested ? '✕ Remove' : 'Mark Suggested'}
          </button>
        </div>
        {c.partnerExpectations && <div className="ml-9 pl-3 border-l-2 border-accent/30">
            <p className="text-xs text-muted-foreground font-medium mb-0.5">Partner Expectations:</p>
            <p className="text-xs text-card-foreground/80 leading-relaxed line-clamp-3">{c.partnerExpectations}</p>
          </div>}
      </div>;
  }
  return <div className="flex gap-6 flex-col lg:flex-row">
      {/* Left: profile list */}
      <div className="lg:w-64 shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select a Profile</p>
        <input type="text" value={matchSearch} onChange={e => setMatchSearch(e.target.value)} placeholder="Search name or #code..." className="w-full rounded-lg border border-accent/40 bg-card px-3 py-2 text-xs mb-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors" />
        <div className="flex flex-col gap-2 max-h-[65vh] overflow-y-auto pr-1">
          {filteredList.length === 0 && <p className="text-sm text-muted-foreground">No profiles found.</p>}
          {filteredList.map(p => <button key={p.id} onClick={() => {
          setSelectedId(p.id);
          setSuggestSearch('');
          setAlreadySearch('');
        }} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${selectedId === p.id ? 'border-accent bg-accent/10' : 'border-accent/20 bg-card hover:border-accent/50'}`}>
              {p.profilePhotoBase64 || p.profilePhotoUrl ? <img src={p.profilePhotoBase64 || p.profilePhotoUrl} className="w-8 h-8 rounded-full object-cover border border-accent/40 shrink-0" alt="" /> : <div className="w-8 h-8 rounded-full bg-muted border border-accent/20 shrink-0 flex items-center justify-center text-xs text-muted-foreground font-bold">
                  {(p.fullName || '?')[0]}
                </div>}
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">{p.fullName || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">{p.gender} &nbsp;•&nbsp; #{serialOf(p.id)}</p>
              </div>
            </button>)}
        </div>
      </div>

      {/* Right: match view */}
      <div className="flex-1 min-w-0">
        {!selected ? <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            ← Select a profile to see matches
          </div> : <>
            {/* Selected profile summary */}
            <div className="bg-card rounded-xl border border-accent/40 px-5 py-4 mb-6 flex items-center gap-4">
              {(selected.profilePhotoBase64 || selected.profilePhotoUrl) && <img src={selected.profilePhotoBase64 || selected.profilePhotoUrl} className="w-14 h-14 rounded-full object-cover border-2 border-accent shrink-0" alt="" />}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading font-bold text-primary text-lg">{selected.fullName}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-accent/60 text-accent" style={{
                background: 'rgba(201,168,76,0.1)'
              }}>#{serialOf(selected.id)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selected.gender} &nbsp;•&nbsp; Age: {parseAge(selected.dob) || '—'} &nbsp;•&nbsp; Height: {selected.height || '—'} &nbsp;•&nbsp; {selected.occupation || '—'}
                </p>
              </div>
            </div>

            {/* ── Section 1: New Suggestions ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Suggestions ({newSuggestions.length})
                </p>
                <input type="text" value={suggestSearch} onChange={e => setSuggestSearch(e.target.value)} placeholder="Search suggestions..." className="rounded-lg border border-accent/40 bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors w-48" />
              </div>
              {newSuggestions.length === 0 ? <p className="text-sm text-muted-foreground">No new suggestions — all opposite-gender profiles have already been suggested.</p> : visibleSuggestions.length === 0 ? <p className="text-sm text-muted-foreground">No matches for "{suggestSearch}".</p> : <div className="flex flex-col gap-3">
                  {visibleSuggestions.map((c, i) => <MatchCard key={c.id} c={c} rank={i + 1} />)}
                </div>}
            </div>

            {/* ── Section 2: Already Suggested ── */}
            {alreadySuggestedProfiles.length > 0 && <div>
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Already Suggested ({alreadySuggestedProfiles.length})
                  </p>
                  <input type="text" value={alreadySearch} onChange={e => setAlreadySearch(e.target.value)} placeholder="Search already suggested..." className="rounded-lg border border-accent/40 bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors w-48" />
                </div>
                {visibleAlready.length === 0 ? <p className="text-sm text-muted-foreground">No matches for "{alreadySearch}".</p> : <div className="flex flex-col gap-3 opacity-80">
                    {visibleAlready.map((c, i) => <MatchCard key={c.id} c={c} rank={i + 1} />)}
                  </div>}
              </div>}
          </>}
      </div>
    </div>;
}

// ── Raw Data Panel ────────────────────────────────────────────────────────────
const PROFILE_TEXT_FIELDS: {
  key: keyof Profile;
  label: string;
}[] = [{
  key: 'fullName',
  label: 'Full Name'
}, {
  key: 'gender',
  label: 'Gender'
}, {
  key: 'dob',
  label: 'Date of Birth'
}, {
  key: 'birthPlace',
  label: 'Birth Place'
}, {
  key: 'address',
  label: 'Address'
}, {
  key: 'raas',
  label: 'Raas'
}, {
  key: 'gana',
  label: 'Gana'
}, {
  key: 'gotra',
  label: 'Gotra'
}, {
  key: 'shakha',
  label: 'Shakha'
}, {
  key: 'nakshatra',
  label: 'Nakshatra'
}, {
  key: 'charan',
  label: 'Charan'
}, {
  key: 'naad',
  label: 'Naad'
}, {
  key: 'mangal',
  label: 'Mangal'
}, {
  key: 'diet',
  label: 'Diet'
}, {
  key: 'height',
  label: 'Height'
}, {
  key: 'weight',
  label: 'Weight'
}, {
  key: 'bloodGroup',
  label: 'Blood Group'
}, {
  key: 'education',
  label: 'Education'
}, {
  key: 'occupation',
  label: 'Occupation'
}, {
  key: 'jobLocation',
  label: 'Job Location'
}, {
  key: 'income',
  label: 'Annual Income'
}, {
  key: 'fatherName',
  label: 'Father Name'
}, {
  key: 'fatherDetails',
  label: 'Father Details'
}, {
  key: 'motherName',
  label: 'Mother Name'
}, {
  key: 'motherDetails',
  label: 'Mother Details'
}, {
  key: 'siblings',
  label: 'Siblings'
}, {
  key: 'maritalStatus',
  label: 'Marital Status'
}, {
  key: 'vyanga',
  label: 'Vyanga/Disability'
}, {
  key: 'vyangaDetail',
  label: 'Vyanga Detail'
}, {
  key: 'partnerExpectations',
  label: 'Partner Expectations'
}, {
  key: 'contact1',
  label: 'Contact 1'
}, {
  key: 'contact2',
  label: 'Contact 2'
}, {
  key: 'transactionId',
  label: 'Transaction ID'
}, {
  key: 'submittedAt',
  label: 'Submitted At'
}];
function RawDataPanel({
  profiles
}: {
  profiles: Profile[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rawSearch, setRawSearch] = useState('');
  const [imageModal, setImageModal] = useState<{
    src: string;
    label: string;
  } | null>(null);
  const filtered = profiles.filter(p => !rawSearch || (p.fullName || '').toLowerCase().includes(rawSearch.toLowerCase()) || (p.contact1 || '').includes(rawSearch) || String(profiles.findIndex(x => x.id === p.id) + 1).includes(rawSearch));
  const selected = profiles.find(p => p.id === selectedId) ?? null;
  const serialOf = (id: string) => profiles.findIndex(p => p.id === id) + 1;

  // ── CSV Download ──────────────────────────────────────────────────────────
  function downloadCSV() {
    const headers = ['#', ...PROFILE_TEXT_FIELDS.map(f => f.label), 'Has Photo', 'Has Aadhar'];
    const rows = profiles.map((p, i) => [String(i + 1), ...PROFILE_TEXT_FIELDS.map(f => {
      const v = p[f.key];
      if (v == null) return '';
      const s = String(v).replace(/"/g, '""').replace(/\n/g, ' ');
      return `"${s}"`;
    }), p.profilePhotoBase64 ? 'Yes' : 'No', p.aadharBase64 ? 'Yes' : 'No']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LNM-Profiles.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Complete backup download ──────────────────────────────────────────────
  async function downloadCompleteBackup() {
    try {
      const response = await fetch('/api/backup/export');
      if (!response.ok) throw new Error('Export failed');
      const backup = await response.json();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LNM-Complete-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (_) {
      window.alert('The complete backup could not be downloaded. Please try again.');
    }
  }

  async function importCompleteBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const confirmed = window.confirm('This will replace all current profiles and inbox messages with the selected backup. Continue?');
    if (!confirmed) {
      event.target.value = '';
      return;
    }
    try {
      const backup = JSON.parse(await file.text());
      const response = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backup),
      });
      const result = await response.json() as { error?: string; profilesRestored?: number; messagesRestored?: number };
      if (!response.ok) throw new Error(result.error || 'Import failed');
      window.alert(`Backup restored: ${result.profilesRestored ?? 0} profiles and ${result.messagesRestored ?? 0} messages.`);
      window.location.reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'The backup could not be imported.');
    } finally {
      event.target.value = '';
    }
  }

  // ── TXT Download ─────────────────────────────────────────────────────────
  function downloadTXT() {
    const lines: string[] = [];
    profiles.forEach((p, i) => {
      lines.push(`${'='.repeat(60)}`);
      lines.push(`PROFILE #${i + 1}`);
      lines.push(`${'='.repeat(60)}`);
      PROFILE_TEXT_FIELDS.forEach(f => {
        const v = p[f.key];
        if (v) lines.push(`${f.label}: ${v}`);
      });
      lines.push(`Has Profile Photo: ${p.profilePhotoBase64 ? 'Yes' : 'No'}`);
      lines.push(`Has Aadhar Card: ${p.aadharBase64 ? 'Yes' : 'No'}`);
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LNM-Profiles.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
  return <div>
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <p className="font-heading font-bold text-primary text-lg">Raw Registration Data</p>
          <p className="text-xs text-muted-foreground">{profiles.length} profiles — select one to view all fields and uploaded images</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadCompleteBackup} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-colors">
            ⬇ Complete Backup
          </button>
          <label className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-accent/50 text-primary font-medium hover:bg-accent/10 transition-colors cursor-pointer">
            ⬆ Restore Backup
            <input type="file" accept="application/json,.json" className="sr-only" onChange={importCompleteBackup} />
          </label>
          <button onClick={downloadCSV} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-accent/50 text-primary font-medium hover:bg-accent/10 transition-colors">
            ⬇ CSV
          </button>
          <button onClick={downloadTXT} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-accent/50 text-primary font-medium hover:bg-accent/10 transition-colors">
            ⬇ TXT
          </button>
        </div>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Left: profile list */}
        <div className="lg:w-60 shrink-0">
          <input type="text" value={rawSearch} onChange={e => setRawSearch(e.target.value)} placeholder="Search name, phone, #..." className="w-full rounded-lg border border-accent/40 bg-card px-3 py-2 text-xs mb-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors" />
          <div className="flex flex-col gap-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.length === 0 && <p className="text-sm text-muted-foreground">No profiles found.</p>}
            {filtered.map(p => <button key={p.id} onClick={() => setSelectedId(p.id)} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all ${selectedId === p.id ? 'border-accent bg-accent/10' : 'border-accent/20 bg-card hover:border-accent/40'}`}>
                {p.profilePhotoBase64 ? <img src={p.profilePhotoBase64} className="w-8 h-8 rounded-full object-cover border border-accent/40 shrink-0" alt="" /> : <div className="w-8 h-8 rounded-full bg-muted border border-accent/20 shrink-0 flex items-center justify-center text-xs text-muted-foreground font-bold">
                    {(p.fullName || '?')[0]}
                  </div>}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-primary truncate">{p.fullName || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">#{serialOf(p.id)} · {p.gender || '—'}</p>
                </div>
              </button>)}
          </div>
        </div>

        {/* Right: detail view */}
        <div className="flex-1 min-w-0">
          {!selected ? <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border border-dashed border-accent/30 rounded-xl">
              ← Select a profile to view raw data
            </div> : <div className="bg-card rounded-xl border border-accent/20 overflow-hidden">
              {/* Profile header */}
              <div className="px-5 py-4 border-b border-accent/20 flex items-center gap-4" style={{
            background: 'rgba(45,27,105,0.06)'
          }}>
                <div className="flex gap-3">
                  {selected.profilePhotoBase64 ? <button onClick={() => setImageModal({
                src: selected.profilePhotoBase64!,
                label: 'Profile Photo'
              })} className="group relative">
                      <img src={selected.profilePhotoBase64} className="w-16 h-16 rounded-full object-cover border-2 border-accent" alt="Profile" />
                      <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">View</span>
                    </button> : <div className="w-16 h-16 rounded-full bg-muted border-2 border-accent/30 flex items-center justify-center text-xl font-bold text-muted-foreground">
                      {(selected.fullName || '?')[0]}
                    </div>}
                  {selected.aadharBase64 && <button onClick={() => setImageModal({
                src: selected.aadharBase64!,
                label: 'Aadhar Card'
              })} className="group relative">
                      <img src={selected.aadharBase64} className="w-16 h-16 rounded-lg object-cover border-2 border-accent/50" alt="Aadhar" />
                      <span className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">Aadhar</span>
                    </button>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-bold text-primary text-base">{selected.fullName || 'Unknown'}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-accent/60 text-accent" style={{
                  background: 'rgba(201,168,76,0.1)'
                }}>#{serialOf(selected.id)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selected.gender} · {selected.occupation || '—'} · {selected.contact1 || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selected.profilePhotoBase64 ? '✓ Photo uploaded' : '✗ No photo'} &nbsp;·&nbsp;
                    {selected.aadharBase64 ? '✓ Aadhar uploaded' : '✗ No Aadhar'}
                  </p>
                </div>
              </div>

              {/* All fields table */}
              <div className="overflow-x-auto max-h-[55vh] overflow-y-auto">
                <table className="w-full text-xs">
                  <tbody>
                    {PROFILE_TEXT_FIELDS.map(f => {
                  const v = selected[f.key];
                  if (!v) return null;
                  return <tr key={f.key} className="border-b border-accent/10 hover:bg-accent/5 transition-colors">
                          <td className="px-4 py-2 font-medium text-muted-foreground w-40 shrink-0 align-top">{f.label}</td>
                          <td className="px-4 py-2 text-card-foreground break-words whitespace-pre-wrap">{String(v)}</td>
                        </tr>;
                })}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>
      </div>

      {/* Image lightbox modal */}
      {imageModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setImageModal(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">{imageModal.label}</p>
              <button onClick={() => setImageModal(null)} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
            </div>
            <img src={imageModal.src} className="w-full rounded-xl object-contain max-h-[75vh]" alt={imageModal.label} />
            <a href={imageModal.src} download={`${imageModal.label.replace(' ', '-')}.jpg`} className="mt-3 block text-center text-xs text-accent hover:underline" onClick={e => e.stopPropagation()}>
              ⬇ Download image
            </a>
          </div>
        </div>}
    </div>;
}
function VerificationPanel({
  profiles,
  onVerify
}: {
  profiles: Profile[];
  onVerify: (id: string, verified: boolean) => void;
}) {
  const unverified = profiles.filter(p => !p.verified);
  const verified = profiles.filter(p => p.verified);
  function serialOf(id: string) {
    return profiles.findIndex(p => p.id === id) + 1;
  }
  async function toggleVerify(p: Profile) {
    const next = !p.verified;
    await fetch(`/api/profiles/${p.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        verified: next
      })
    });
    onVerify(p.id, next);
  }
  function VerifyCard({
    p
  }: {
    p: Profile;
  }) {
    return <div className={`bg-card rounded-xl border px-5 py-4 flex gap-5 items-start ${p.verified ? 'border-green-500/30' : 'border-accent/40'}`}>
        {/* Aadhar image */}
        <div className="shrink-0">
          {p.aadharBase64 ? <img src={p.aadharBase64} alt="Aadhar Card" style={{
          width: 200,
          height: 'auto',
          borderRadius: 8,
          border: '1px solid rgba(201,168,76,0.4)'
        }} /> : <div style={{
          width: 200,
          height: 120
        }} className="rounded-lg bg-muted border border-accent/20 flex items-center justify-center">
              <p className="text-xs text-muted-foreground text-center px-3">No Aadhar<br />uploaded</p>
            </div>}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-heading font-bold text-primary text-base">{p.fullName || 'Unknown'}</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full border border-accent/60 text-accent" style={{
            background: 'rgba(201,168,76,0.1)'
          }}>#{serialOf(p.id)}</span>
            {p.verified && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/30 font-medium">✓ Verified</span>}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{p.gender} &nbsp;•&nbsp; DOB: {p.dob || '—'}</p>
          <p className="text-xs text-muted-foreground mb-3">Submitted: {new Date(p.submittedAt).toLocaleDateString('en-IN')}</p>
          <button onClick={() => toggleVerify(p)} className={`text-xs px-4 py-1.5 rounded-lg border font-medium transition-all ${p.verified ? 'border-destructive/40 text-destructive hover:bg-destructive/10' : 'text-primary-foreground hover:opacity-90'}`} style={!p.verified ? {
          background: '#2D1B69',
          border: '1px solid #C9A84C'
        } : {}}>
            {p.verified ? 'Unmark Verified' : 'Mark as Verified'}
          </button>
        </div>
      </div>;
  }
  return <div>
      {profiles.length === 0 && <p className="text-sm text-muted-foreground text-center py-16">No profiles submitted yet.</p>}

      {unverified.length > 0 && <>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Pending Verification ({unverified.length})
          </p>
          <div className="flex flex-col gap-4 mb-8">
            {unverified.map(p => <VerifyCard key={p.id} p={p} />)}
          </div>
        </>}

      {verified.length > 0 && <>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Verified ({verified.length})
          </p>
          <div className="flex flex-col gap-4">
            {verified.map(p => <VerifyCard key={p.id} p={p} />)}
          </div>
        </>}
    </div>;
}

// ── Server Diagnostics Panel ──────────────────────────────────────────────────
interface DiagnosticsReport {
  timestamp: string;
  serverUptime: number;
  nodeVersion: string;
  memoryMB: number;
  dbStatus: 'connected' | 'error';
  dbError?: string;
  profileCount: number | null;
  profileCountError?: string;
  messageCount: number | null;
  recentSubmissions: Array<{
    id: string;
    profileNumber: number;
    fullName: string | null;
    gender: string | null;
    contact1: string | null;
    submittedAt: string | null;
    transactionId: string | null;
    verified: boolean;
    hasPhoto: boolean;
    hasAadhar: boolean;
    hasPaymentScreenshot: boolean;
  }>;
  recentSubmissionsError?: string;
  integrityCheck: {
    total: number;
    missingName: number;
    missingContact: number;
    missingTransaction: number;
    missingPaymentScreenshot: number;
  } | null;
}
function ServerDiagnosticsPanel() {
  const [report, setReport] = useState<DiagnosticsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [screenshotModal, setScreenshotModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [screenshotData, setScreenshotData] = useState<{
    base64: string | null;
    txnId: string | null;
  } | null>(null);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  async function fetchDiagnostics() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/diagnostics', {
        headers: {
          'x-admin-token': 'lnm-admin-2024'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReport(data);
      setLastFetched(new Date().toLocaleTimeString('en-IN'));
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }
  async function viewPaymentScreenshot(id: string, name: string) {
    setScreenshotModal({
      id,
      name
    });
    setScreenshotData(null);
    setScreenshotLoading(true);
    try {
      const res = await fetch(`/api/admin/payment-screenshot/${id}`, {
        headers: {
          'x-admin-token': 'lnm-admin-2024'
        }
      });
      const json = await res.json();
      setScreenshotData({
        base64: json.paymentScreenshotBase64 || null,
        txnId: json.transactionId || null
      });
    } catch {
      setScreenshotData({
        base64: null,
        txnId: null
      });
    } finally {
      setScreenshotLoading(false);
    }
  }
  useEffect(() => {
    fetchDiagnostics();
  }, []);
  function formatUptime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-primary text-xl font-bold">Server Diagnostics</h2>
          {lastFetched && <p className="text-xs text-muted-foreground mt-0.5">Last refreshed: {lastFetched}</p>}
        </div>
        <button onClick={fetchDiagnostics} disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <strong>Error fetching diagnostics:</strong> {error}
        </div>}

      {report && <>
          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`rounded-xl p-4 border text-center ${report.dbStatus === 'connected' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-2xl font-bold font-heading ${report.dbStatus === 'connected' ? 'text-green-700' : 'text-red-700'}`}>
                {report.dbStatus === 'connected' ? '✓' : '✗'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Database</p>
              <p className={`text-xs font-semibold ${report.dbStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {report.dbStatus === 'connected' ? 'Connected' : 'Error'}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-accent/20 text-center">
              <p className="text-2xl font-bold font-heading text-primary">{report.profileCount ?? '?'}</p>
              <p className="text-xs text-muted-foreground mt-1">Profiles in DB</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-accent/20 text-center">
              <p className="text-2xl font-bold font-heading text-primary">{report.memoryMB} MB</p>
              <p className="text-xs text-muted-foreground mt-1">Memory Used</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-accent/20 text-center">
              <p className="text-lg font-bold font-heading text-primary">{formatUptime(report.serverUptime)}</p>
              <p className="text-xs text-muted-foreground mt-1">Server Uptime</p>
            </div>
          </div>

          {report.dbError && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              <strong>Database Error:</strong> {report.dbError}
            </div>}

          {/* Integrity Check */}
          {report.integrityCheck && <div className="bg-card rounded-xl border border-accent/20 p-5">
              <h3 className="font-heading text-primary font-semibold mb-3">Data Integrity Check (last 50 profiles)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[{
            label: 'Total Checked',
            value: report.integrityCheck.total,
            warn: false
          }, {
            label: 'Missing Name',
            value: report.integrityCheck.missingName,
            warn: report.integrityCheck.missingName > 0
          }, {
            label: 'Missing Contact',
            value: report.integrityCheck.missingContact,
            warn: report.integrityCheck.missingContact > 0
          }, {
            label: 'Missing Txn ID',
            value: report.integrityCheck.missingTransaction,
            warn: report.integrityCheck.missingTransaction > 0
          }, {
            label: 'Missing Payment Screenshot',
            value: report.integrityCheck.missingPaymentScreenshot,
            warn: report.integrityCheck.missingPaymentScreenshot > 0
          }].map((item, i) => <div key={i} className={`rounded-lg p-3 text-center border ${item.warn ? 'bg-amber-50 border-amber-200' : 'bg-muted border-transparent'}`}>
                    <p className={`text-xl font-bold font-heading ${item.warn ? 'text-amber-700' : 'text-primary'}`}>{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  </div>)}
              </div>
            </div>}

          {/* Recent Submissions */}
          <div className="bg-card rounded-xl border border-accent/20 p-5">
            <h3 className="font-heading text-primary font-semibold mb-3">Last 10 Submissions</h3>
            {report.recentSubmissionsError && <p className="text-red-600 text-sm mb-3">Error: {report.recentSubmissionsError}</p>}
            {report.recentSubmissions.length === 0 ? <p className="text-muted-foreground text-sm">No submissions found.</p> : <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">#</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Name</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Gender</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Contact</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Txn ID</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Photo</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Payment</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Verified</th>
                      <th className="text-left py-2 px-2 text-xs text-muted-foreground font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.recentSubmissions.map(sub => <tr key={sub.id} className="border-b border-accent/10 hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-2 font-mono text-xs text-muted-foreground">{sub.profileNumber}</td>
                        <td className="py-2 px-2 font-medium text-primary">{sub.fullName || <span className="text-red-400 italic">missing</span>}</td>
                        <td className="py-2 px-2 text-muted-foreground">{sub.gender || '—'}</td>
                        <td className="py-2 px-2 font-mono text-xs">{sub.contact1 || <span className="text-red-400 italic">missing</span>}</td>
                        <td className="py-2 px-2 font-mono text-xs">{sub.transactionId || <span className="text-amber-500 italic">none</span>}</td>
                        <td className="py-2 px-2 text-center">{sub.hasPhoto ? <span className="text-green-600">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 px-2 text-center">
                          {sub.hasPaymentScreenshot ? <button onClick={() => viewPaymentScreenshot(sub.id, sub.fullName || `#${sub.profileNumber}`)} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                              View
                            </button> : <span className="text-amber-500 text-xs italic">none</span>}
                        </td>
                        <td className="py-2 px-2 text-center">{sub.verified ? <span className="text-green-600 font-semibold">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 px-2 text-xs text-muted-foreground whitespace-nowrap">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  }) : '—'}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </div>

          {/* Server Info */}
          <div className="bg-card rounded-xl border border-accent/20 p-5">
            <h3 className="font-heading text-primary font-semibold mb-3">Server Info</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[['Node.js Version', report.nodeVersion], ['Server Time', new Date(report.timestamp).toLocaleString('en-IN')], ['Uptime', formatUptime(report.serverUptime)], ['Heap Memory', `${report.memoryMB} MB`]].map(([label, value]) => <div key={label} className="flex justify-between py-1.5 border-b border-accent/10">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-primary font-medium">{value}</span>
                </div>)}
            </div>
          </div>
        </>}

      {/* Payment Screenshot Modal */}
      {screenshotModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setScreenshotModal(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-accent/40" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-primary font-bold">Payment Screenshot</h3>
                <p className="text-xs text-muted-foreground">{screenshotModal.name}</p>
              </div>
              <button onClick={() => setScreenshotModal(null)} className="text-muted-foreground hover:text-primary text-xl leading-none">×</button>
            </div>
            {screenshotLoading ? <div className="text-center py-10 text-muted-foreground text-sm">Loading...</div> : screenshotData?.base64 ? <>
                {screenshotData.txnId && <p className="text-xs text-muted-foreground mb-3">Transaction ID: <span className="font-mono text-primary font-semibold">{screenshotData.txnId}</span></p>}
                <img src={screenshotData.base64} alt="Payment screenshot" className="w-full rounded-lg border border-accent/30 object-contain max-h-96" />
                <a href={screenshotData.base64} download={`payment-${screenshotModal.name}.jpg`} className="mt-3 block text-center text-xs text-primary underline">
                  Download Screenshot
                </a>
              </> : <div className="text-center py-10 text-muted-foreground text-sm">No payment screenshot uploaded for this profile.</div>}
          </div>
        </div>}
    </div>;
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'overview' | 'matching' | 'verification' | 'inbox' | 'rawdata' | 'server'>('overview');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  useEffect(() => {
    if (!sessionStorage.getItem('lnm_admin')) {
      navigate('/admin');
      return;
    }
    Promise.all([fetch('/api/profiles').then(r => r.json()).catch(() => []), fetch('/api/messages').then(r => r.json()).catch(() => [])]).then(([p, m]) => {
      setProfiles(p);
      setMessages(m);
      setLoading(false);
    });
  }, [navigate]);
  function logout() {
    sessionStorage.removeItem('lnm_admin');
    navigate('/admin');
  }
  function handleDelete(id: string) {
    setProfiles(prev => prev.filter(p => p.id !== id));
  }
  function handleUpdate(updated: Profile) {
    setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  }
  async function handleMarkRead(id: string) {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          read: true
        })
      });
      setMessages(prev => prev.map(m => m.id === id ? {
        ...m,
        read: true
      } : m));
    } catch (_) {}
  }
  function handleSuggest(profileId: string, suggestedIds: string[]) {
    setProfiles(prev => prev.map(p => p.id === profileId ? {
      ...p,
      suggestedTo: suggestedIds
    } : p));
  }
  function handleVerify(id: string, verified: boolean) {
    setProfiles(prev => prev.map(p => p.id === id ? {
      ...p,
      verified
    } : p));
  }
  const filtered = profiles.filter(p => !search || (p.fullName || '').toLowerCase().includes(search.toLowerCase()) || (p.contact1 || '').includes(search));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const unreadCount = messages.filter(m => !m.read).length;
  const unverifiedCount = profiles.filter(p => !p.verified).length;
  const TABS = [{
    id: 'overview' as const,
    label: 'Overview',
    icon: '👤'
  }, {
    id: 'matching' as const,
    label: 'Matching',
    icon: '💑'
  }, {
    id: 'verification' as const,
    label: 'Verification',
    icon: '🪪',
    badge: unverifiedCount
  }, {
    id: 'inbox' as const,
    label: 'Inbox',
    icon: '📬',
    badge: unreadCount
  }, {
    id: 'rawdata' as const,
    label: 'Raw Data',
    icon: '📦'
  }, {
    id: 'server' as const,
    label: 'Server',
    icon: '🖥️'
  }];
  return <div className="bg-background min-h-screen">
      <Helmet>
        <title>Admin Dashboard — Lakshmi Narayan Matrimony</title>
        <meta name="description" content="Admin dashboard for managing matrimonial profiles and messages." />
        <link rel="canonical" href="https://lakshminarayanmatrimony.in/admin/dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Admin Header */}
      <div className="bg-primary border-b-2 border-accent px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-heading text-accent font-bold text-lg">Admin Dashboard</p>
          <p className="text-accent/60 text-xs">Lakshmi Narayan Matrimony</p>
        </div>
        <button onClick={logout} className="text-xs px-4 py-2 rounded border border-accent/40 text-accent hover:bg-primary-foreground/10 transition-colors">
          Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{
          label: 'Total Profiles',
          value: profiles.length
        }, {
          label: 'Male',
          value: profiles.filter(p => p.gender === 'Male').length
        }, {
          label: 'Female',
          value: profiles.filter(p => p.gender === 'Female').length
        }, {
          label: 'Unread Messages',
          value: unreadCount
        }].map((stat, i) => <div key={i} className={`bg-card rounded-xl p-5 border text-center ${i === 3 && unreadCount > 0 ? 'border-accent' : 'border-accent/20'}`}>
              <p className="font-heading text-primary text-3xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
            </div>)}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted rounded-xl p-1 w-fit flex-wrap">
          {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${tab === t.id ? 'bg-card text-primary shadow-sm font-semibold' : 'text-muted-foreground hover:text-primary'}`}>
              {t.icon} {t.label}
              {t.badge && t.badge > 0 ? <span className="bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{t.badge}</span> : null}
            </button>)}
        </div>

        {loading ? <div className="text-center py-16 text-muted-foreground">Loading...</div> : tab === 'overview' ? <>
            <div className="mb-5">
              <input type="text" value={search} onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }} placeholder="Search by name or phone number..." className="w-full rounded-lg border border-accent/40 bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors" />
            </div>
            {filtered.length === 0 ? <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">{search ? 'No profiles match your search.' : 'No profiles submitted yet.'}</p>
              </div> : <>
                <AnimatePresence mode="popLayout">
                  <div className="flex flex-col gap-4">
                    {paginated.map((profile, i) => {
                const globalSerial = profiles.findIndex(p => p.id === profile.id) + 1;
                return <ProfileCard key={profile.id} profile={profile} serialNo={globalSerial} index={i} onDelete={handleDelete} onUpdate={handleUpdate} />;
              })}
                  </div>
                </AnimatePresence>
                {totalPages > 1 && <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-accent/40 text-sm font-medium text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/10 transition-colors">
                      ← Prev
                    </button>
                    {Array.from({
              length: totalPages
            }, (_, i) => i + 1).map(pg => <button key={pg} onClick={() => setPage(pg)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors border ${pg === currentPage ? 'text-primary-foreground border-transparent' : 'border-accent/30 text-primary hover:bg-accent/10'}`} style={pg === currentPage ? {
              background: '#2D1B69',
              border: '1px solid #C9A84C'
            } : {}}>{pg}</button>)}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-accent/40 text-sm font-medium text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/10 transition-colors">
                      Next →
                    </button>
                  </div>}
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} profiles
                </p>
              </>}
          </> : tab === 'matching' ? <MatchingPanel profiles={profiles} onSuggest={handleSuggest} /> : tab === 'verification' ? <VerificationPanel profiles={profiles} onVerify={handleVerify} /> : tab === 'rawdata' ? <RawDataPanel profiles={profiles} /> : tab === 'server' ? <ServerDiagnosticsPanel /> : <>
            {messages.length === 0 ? <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">No messages yet. Messages from the Contact Us page will appear here.</p>
              </div> : <div className="flex flex-col gap-4">
                {messages.map(msg => <MessageCard key={msg.id} msg={msg} onMarkRead={handleMarkRead} />)}
              </div>}
          </>}
      </div>
    </div>;
}
