import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';

function FormFieldset({ legend, children }: {legend: string;children: React.ReactNode;}) {
  return (
    <fieldset className="border border-accent/50 rounded-lg p-5 mb-6">
      <legend className="px-3 py-1 font-heading text-primary font-semibold text-sm tracking-wide bg-card rounded border border-accent/40">
        {legend}
      </legend>
      <div className="mt-3">{children}</div>
    </fieldset>);
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  note?: string;
  error?: string;
  fieldId?: string;
}

function Field({ label, required = false, children, note, error, fieldId }: FieldProps) {
  return (
    <div id={fieldId} className="flex flex-col gap-1 mb-4 scroll-mt-24">
      <label className="text-xs font-medium text-card-foreground/80">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
      {note && !error && <p className="text-xs text-muted-foreground italic">{note}</p>}
    </div>);
}

const inputClass = 'w-full rounded border border-accent/40 bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors';
const inputErrorClass = 'w-full rounded border-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition-colors';
const selectClass = 'w-full rounded border border-accent/40 bg-background px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors';

// ── Crop Modal ────────────────────────────────────────────────────────────────
// Frame size adapts to screen: 260px on desktop, 80vw on small screens (max 300)
const FRAME = 260;

interface CropModalProps {
  src: string;
  onConfirm: (base64: string) => void;
  onCancel: () => void;
}

function CropModal({ src, onConfirm, onCancel }: CropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropFrameRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  // Keep latest values in refs so touch handlers (attached via addEventListener) can read them
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const imgSizeRef = useRef({ w: 0, h: 0 });

  // Responsive frame size
  const frameSize = Math.min(FRAME, typeof window !== 'undefined' ? window.innerWidth * 0.78 : FRAME);
  const frameSizeRef = useRef(frameSize);

  // Keep refs in sync with state
  useEffect(() => { offsetRef.current = offset; }, [offset]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { imgSizeRef.current = imgSize; }, [imgSize]);

  function clampOffset(ox: number, oy: number, s: number) {
    const iw = imgSizeRef.current.w * s;
    const ih = imgSizeRef.current.h * s;
    const fs = frameSizeRef.current;
    return {
      x: Math.min(0, Math.max(fs - iw, ox)),
      y: Math.min(0, Math.max(fs - ih, oy)),
    };
  }

  function onImgLoad() {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setImgSize({ w, h });
    imgSizeRef.current = { w, h };
    const fs = frameSizeRef.current;
    const initScale = Math.max(fs / w, fs / h);
    setScale(initScale);
    scaleRef.current = initScale;
    const initOffset = { x: (fs - w * initScale) / 2, y: (fs - h * initScale) / 2 };
    setOffset(initOffset);
    offsetRef.current = initOffset;
  }

  // Update live preview canvas whenever offset/scale changes
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgSize.w) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const fs = frameSizeRef.current;
    const displayToNatural = 1 / scale;
    const srcX = -offset.x * displayToNatural;
    const srcY = -offset.y * displayToNatural;
    const srcW = fs * displayToNatural;
    const srcH = fs * displayToNatural;
    ctx.clearRect(0, 0, 80, 80);
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 80, 80);
  }, [offset, scale, imgSize]);

  // Attach touch listeners with passive:false so preventDefault() works on iOS Safari.
  // React synthetic touch events cannot set passive:false, so we must use addEventListener directly.
  useEffect(() => {
    const el = cropFrameRef.current;
    if (!el) return;

    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      const t = e.touches[0];
      dragStart.current = { mx: t.clientX, my: t.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      if (!dragStart.current) return;
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.mx;
      const dy = t.clientY - dragStart.current.my;
      const newOffset = clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scaleRef.current);
      setOffset(newOffset);
      offsetRef.current = newOffset;
    }

    function handleTouchEnd() {
      dragStart.current = null;
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale));
  }, [scale, imgSize]);

  function onMouseUp() { dragStart.current = null; }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const fs = frameSizeRef.current;
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const minScale = Math.max(fs / (imgSize.w || 1), fs / (imgSize.h || 1));
    const newScale = Math.min(4, Math.max(minScale, scale + delta));
    const cx = fs / 2;
    const cy = fs / 2;
    const newOx = cx - (cx - offset.x) * (newScale / scale);
    const newOy = cy - (cy - offset.y) * (newScale / scale);
    setScale(newScale);
    setOffset(clampOffset(newOx, newOy, newScale));
  }

  function handleScaleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fs = frameSizeRef.current;
    const minScale = Math.max(fs / (imgSize.w || 1), fs / (imgSize.h || 1));
    const newScale = Math.min(4, Math.max(minScale, parseFloat(e.target.value)));
    const cx = fs / 2;
    const cy = fs / 2;
    const newOx = cx - (cx - offset.x) * (newScale / scale);
    const newOy = cy - (cy - offset.y) * (newScale / scale);
    setScale(newScale);
    setOffset(clampOffset(newOx, newOy, newScale));
  }

  function handleConfirm() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx || !imgRef.current) return;
    const fs = frameSizeRef.current;
    const displayToNatural = 1 / scale;
    const srcX = -offset.x * displayToNatural;
    const srcY = -offset.y * displayToNatural;
    const srcW = fs * displayToNatural;
    const srcH = fs * displayToNatural;
    ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, 200, 200);
    onConfirm(canvas.toDataURL('image/jpeg', 0.85));
  }

  const gridLines = frameSize / 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3" style={{ touchAction: 'none' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-3 w-full" style={{ maxWidth: 340, border: '2px solid #C9A84C', padding: '18px 16px 16px' }}>
        <h3 style={{ color: '#2D1B69', fontWeight: 700, fontSize: 16, margin: 0 }}>Adjust Your Photo</h3>
        <p style={{ color: '#888', fontSize: 11, margin: 0, textAlign: 'center' }}>Drag to reposition · Slider to zoom</p>

        {/* Main crop frame — touch listeners attached via useEffect with passive:false */}
        <div
          ref={cropFrameRef}
          className="relative select-none"
          style={{
            width: frameSize,
            height: frameSize,
            border: '3px solid #C9A84C',
            borderRadius: 10,
            overflow: 'hidden',
            background: '#e8e4f5',
            cursor: 'grab',
            flexShrink: 0,
            touchAction: 'none',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        >
          {/* Photo */}
          <img
            ref={imgRef}
            src={src}
            alt="Crop"
            draggable={false}
            onLoad={onImgLoad}
            style={{
              position: 'absolute',
              left: offset.x,
              top: offset.y,
              width: imgSize.w * scale,
              height: imgSize.h * scale,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
          {/* Square grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            <div style={{ position: 'absolute', inset: 0,
              backgroundImage: `linear-gradient(rgba(201,168,76,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.55) 1px, transparent 1px)`,
              backgroundSize: `${gridLines}px ${gridLines}px`,
            }} />
            {[['0','0','auto','auto'],['0','auto','auto','0'],['auto','0','0','auto'],['auto','auto','0','0']].map(([t,r,b,l], i) => (
              <div key={i} style={{
                position: 'absolute', top: t === '0' ? 0 : 'auto', right: r === '0' ? 0 : 'auto',
                bottom: b === '0' ? 0 : 'auto', left: l === '0' ? 0 : 'auto',
                width: 18, height: 18,
                borderTop: (t === '0') ? '3px solid #C9A84C' : 'none',
                borderBottom: (b === '0') ? '3px solid #C9A84C' : 'none',
                borderLeft: (l === '0') ? '3px solid #C9A84C' : 'none',
                borderRight: (r === '0') ? '3px solid #C9A84C' : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* Zoom slider */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>🔍 Zoom</span>
          <input
            type="range"
            min={Math.max(frameSize / (imgSize.w || 1), frameSize / (imgSize.h || 1))}
            max={4}
            step={0.01}
            value={scale}
            onChange={handleScaleChange}
            style={{ flex: 1, accentColor: '#2D1B69' }}
          />
        </div>

        {/* Live preview + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <canvas
              ref={previewCanvasRef}
              width={80}
              height={80}
              style={{ border: '2px solid #C9A84C', borderRadius: 6, background: '#f0effa', display: 'block' }}
            />
            <span style={{ fontSize: 10, color: '#888' }}>Preview (200×200)</span>
          </div>
          <p style={{ fontSize: 11, color: '#555', flex: 1, lineHeight: 1.5, margin: 0 }}>
            This square shows exactly how your photo will appear on your profile. Adjust until your face is centred.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #C9A84C', background: '#fff', fontSize: 13, color: '#2D1B69', cursor: 'pointer', fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #C9A84C', background: '#2D1B69', fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
          >
            Use This Photo
          </button>
        </div>
      </div>
    </div>
  );
}




export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [vyangaYes, setVyangaYes] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const photoBase64Ref = useRef<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Field-level validation errors — keyed by fieldId
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Images are auto-compressed before submission — no hard per-file size limit shown to users

  // ── Validation ──────────────────────────────────────────────────────────────
  // Returns { valid: true } or { valid: false, errors: Record<fieldId, message>, firstId: string }
  function validateForm(payload: Record<string, string>): { valid: true } | { valid: false; errors: Record<string, string>; firstId: string } {
    const errors: Record<string, string> = {};

    if (!payload.fullName?.trim())
      errors['field-fullName'] = 'Please enter your full name.';

    if (!payload.gender)
      errors['field-gender'] = 'Please select Male or Female.';

    if (!payload.dob)
      errors['field-dob'] = 'Please enter your date of birth.';

    if (!payload.birthPlace?.trim())
      errors['field-birthPlace'] = 'Please enter your birth place.';

    if (!payload.address?.trim())
      errors['field-address'] = 'Please enter your residential address.';

    if (!payload.mangal)
      errors['field-mangal'] = 'Please select Yes or No for Mangal.';

    if (!payload.diet)
      errors['field-diet'] = 'Please select Vegetarian or Non-Vegetarian.';

    if (!photoBase64Ref.current)
      errors['field-photo'] = 'Please upload your profile photo.';

    if (!payload.education?.trim())
      errors['field-education'] = 'Please enter your education details.';

    if (!payload.occupation?.trim())
      errors['field-occupation'] = 'Please enter your occupation.';

    if (!payload.fatherName?.trim())
      errors['field-fatherName'] = "Please enter your father's name.";

    if (!payload.motherName?.trim())
      errors['field-motherName'] = "Please enter your mother's name.";

    const contact = payload.contact1?.trim().replace(/\s/g, '');
    if (!contact) {
      errors['field-contact1'] = 'Please enter a contact number.';
    } else if (!/^(\+91)?[6-9]\d{9}$/.test(contact)) {
      errors['field-contact1'] = 'Please enter a valid 10-digit Indian mobile number.';
    }

    // transactionId and paymentScreenshot are optional — do not block submission

    if (Object.keys(errors).length === 0) return { valid: true };

    // Find the first error field in DOM order
    const allIds = [
      'field-fullName','field-gender','field-dob','field-birthPlace','field-address',
      'field-mangal','field-diet','field-photo','field-education','field-occupation',
      'field-fatherName','field-motherName','field-contact1',
    ];
    const firstId = allIds.find(id => errors[id]) ?? Object.keys(errors)[0];
    return { valid: false, errors, firstId };
  }

  function scrollToField(fieldId: string) {
    // Small delay so React has painted the error highlight before we scroll
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
      // Focus the first input/select/textarea inside the field for accessibility
      const focusable = el.querySelector<HTMLElement>('input, select, textarea');
      if (focusable) {
        setTimeout(() => focusable.focus({ preventScroll: true }), 350);
      }
    }, 30);
  }

  // Clear a field error as soon as the user starts fixing it
  function clearError(fieldId: string) {
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[fieldId]; return n; });
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleCropConfirm(base64: string) {
    photoBase64Ref.current = base64;
    setPhotoPreview(base64);
    setCropSrc(null);
    clearError('field-photo');
  }

  function handleRemovePhoto() {
    photoBase64Ref.current = null;
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  function handleCropCancel() {
    setCropSrc(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    // Extract all form values synchronously before any awaits
    const payload: Record<string, string> = {};
    try {
      new FormData(form).forEach((v, k) => { if (typeof v === 'string') payload[k] = v; });
    } catch {
      setSubmitError('Could not read the form. Please refresh the page and try again. If it keeps happening, call us at +91 9225800617.');
      return;
    }

    // ── Client-side validation — highlight and scroll to first problem ──
    const validation = validateForm(payload);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      scrollToField(validation.firstId);
      // Show a plain summary at the top of the error list
      const count = Object.keys(validation.errors).length;
      setSubmitError(
        count === 1
          ? 'One field needs your attention — it has been highlighted below.'
          : `${count} fields need your attention — they have been highlighted below.`
      );
      return;
    }

    setFieldErrors({});
    setSubmitError(null);
    setUploading(true);

    try {
      // Attach profile photo
      if (photoBase64Ref.current) payload.profilePhotoBase64 = photoBase64Ref.current;

      // Check payload size — profile photo only, so this should always be fine
      const HARD_LIMIT_MB = 9;
      const bodyStr = JSON.stringify(payload);
      const sizeMB = new TextEncoder().encode(bodyStr).length / 1024 / 1024;
      if (sizeMB > HARD_LIMIT_MB) {
        setSubmitError('Your profile photo is too large to upload. Please choose a smaller image and try again. Call us at +91 9225800617 if you need help.');
        setUploading(false);
        return;
      }

      // Fetch with a 90-second timeout — large base64 payloads on slow mobile
      // connections can take a while, but we must not hang forever.
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 90_000);

      let res: Response;
      try {
        res = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyStr,
          signal: controller.signal,
        });
      } catch (fetchErr) {
        const isTimeout = fetchErr instanceof Error && fetchErr.name === 'AbortError';
        setSubmitError(
          isTimeout
            ? 'The submission timed out — your internet connection may be slow. Please try again. If it keeps happening, call us at +91 9225800617.'
            : 'Network error — please check your internet connection and try again. Your data has NOT been saved. If this keeps happening, call us at +91 9225800617.'
        );
        setUploading(false);
        return;
      } finally {
        clearTimeout(fetchTimeout);
      }

      if (!res.ok) {
        let msg = `Submission failed (server error ${res.status}). Please try again or contact us at +91 9225800617.`;
        try {
          const json = await res.json();
          if (json.message) msg = json.message;
          else if (json.error) msg = json.error;
        } catch { /* ignore parse error */ }
        setSubmitError(msg);
        setUploading(false);
        return;
      }

      // Confirm the server actually saved it
      let savedId: string | null = null;
      try {
        const json = await res.json();
        savedId = json.id || null;
      } catch { /* non-critical */ }

      if (!savedId) {
        setSubmitError('Registration could not be confirmed. Please contact us at +91 9225800617 with your name.');
        setUploading(false);
        return;
      }

      setUploading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      // Catch-all — nothing should reach here, but if it does the form unblocks
      const msg = err instanceof Error ? err.message : String(err);
      // Strip out any technical jargon before showing to user
      const isTechnical = /FormData|HTMLFormElement|parameter \d|is not of type|TypeError|ReferenceError|SyntaxError/i.test(msg);
      setSubmitError(
        isTechnical
          ? 'Something went wrong while preparing your form. Please refresh the page and try again. If it keeps happening, call us at +91 9225800617.'
          : `${msg} — If this keeps happening, call us at +91 9225800617.`
      );
      setUploading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="bg-card border-2 border-accent rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl"
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}>

          <p className="text-4xl mb-4">🙏</p>
          <h2 className="font-heading text-primary text-2xl font-bold mb-3">Thank You for Registering!</h2>
          <p className="text-card-foreground/80 text-sm leading-relaxed mb-6">
            Your biodata has been received securely. Our team will carefully review your profile and send you highly compatible matches directly on WhatsApp. Your personal information is kept strictly confidential.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border border-accent/30 rounded-lg px-4 py-2 bg-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Your data is secure and will never be shared publicly.
          </div>
        </motion.div>
      </div>);

  }

  const site = 'https://lakshminarayanmatrimony.in';
  const ogImage = `${site}/og-image.svg`;
  const regTitle = 'Register for Marathi Matrimony | Lakshmi Narayan Matrimony';
  const regDesc = 'Register your Marathi matrimonial profile — submit biodata, astrological details (Raas, Nakshatra, Gotra, Mangal), family background. Hand-picked matches sent to WhatsApp. Maharashtra.';
  const regJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${site}/register#webpage`,
        url: `${site}/register`,
        name: regTitle,
        description: regDesc,
        isPartOf: { '@id': `${site}/#website` },
        about: { '@id': `${site}/#organization` },
        inLanguage: ['en', 'mr'],
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: 'Register', item: `${site}/register` },
          ],
        },
      },
    ],
  };

  return (
    <div className="bg-background">
      <Helmet>
        <html lang="en" />
        <title>{regTitle}</title>
        <meta name="description" content={regDesc} />
        <meta name="keywords" content="register Marathi matrimony, Marathi biodata registration Maharashtra, वधू वर नोंदणी, Hindu matrimonial registration, Marathi bride groom registration" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href={`${site}/register`} />
        <meta property="og:site_name" content="Lakshmi Narayan Matrimony" />
        <meta property="og:title" content={regTitle} />
        <meta property="og:description" content={regDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/register`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Register your Marathi matrimonial profile" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={regTitle} />
        <meta name="twitter:description" content={regDesc} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(regJsonLd)}</script>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary py-14 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {[30, 60, 90, 120].map((r, i) => <circle key={i} cx="200" cy="100" r={r} stroke="#C9A84C" strokeWidth="0.8" fill="none" />)}
          </svg>
        </div>
        <motion.h1
          className="font-heading text-4xl font-bold text-accent mb-2 relative z-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}>

          Register Your Profile
        </motion.h1>
        <p className="text-white/60 text-sm relative z-10">All information is kept strictly confidential</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <form ref={formRef} onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg" style={{ border: '1.5px solid rgba(201,168,76,0.4)' }}>

          {/* PERSONAL DETAILS */}
          <FormFieldset legend="Personal Details / वैयक्तिक माहिती">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <Field label="Full Name / पूर्ण नाव" required fieldId="field-fullName" error={fieldErrors['field-fullName']}>
                <input name="fullName" type="text" className={fieldErrors['field-fullName'] ? inputErrorClass : inputClass} placeholder="Enter your full name" onChange={() => clearError('field-fullName')} />
              </Field>
              <Field label="Gender / लिंग" required fieldId="field-gender" error={fieldErrors['field-gender']}>
                <div className={`flex gap-6 mt-1 p-2 rounded ${fieldErrors['field-gender'] ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                  {['Male', 'Female'].map((g) =>
                  <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="gender" value={g} className="accent-primary" onChange={() => clearError('field-gender')} /> {g}
                    </label>
                  )}
                </div>
              </Field>
              <Field label="Date of Birth / जन्म तारीख" required fieldId="field-dob" error={fieldErrors['field-dob']}>
                <input name="dob" type="date" className={fieldErrors['field-dob'] ? inputErrorClass : inputClass} onChange={() => clearError('field-dob')} />
              </Field>
              <Field label="Time of Birth / जन्मवेळ">
                <div className="grid grid-cols-4 gap-2">
                  <select name="tobHour" className={selectClass}>
                    <option value="">HH</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const v = String(i + 1).padStart(2, '0');
                      return <option key={v} value={v}>{v}</option>;
                    })}
                  </select>
                  <select name="tobMinute" className={selectClass}>
                    <option value="">MM</option>
                    {Array.from({ length: 60 }, (_, i) => {
                      const v = String(i).padStart(2, '0');
                      return <option key={v} value={v}>{v}</option>;
                    })}
                  </select>
                  <select name="tobSecond" className={selectClass}>
                    <option value="">SS</option>
                    {Array.from({ length: 60 }, (_, i) => {
                      const v = String(i).padStart(2, '0');
                      return <option key={v} value={v}>{v}</option>;
                    })}
                  </select>
                  <select name="tobAmPm" className={selectClass}>
                    <option value="">AM/PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </Field>
              <Field label="Birth Place / जन्म ठिकाण" required fieldId="field-birthPlace" error={fieldErrors['field-birthPlace']}>
                <input name="birthPlace" type="text" className={fieldErrors['field-birthPlace'] ? inputErrorClass : inputClass} placeholder="City, State" onChange={() => clearError('field-birthPlace')} />
              </Field>
              <Field label="Residential Address / पत्ता" required fieldId="field-address" error={fieldErrors['field-address']}>
                <input name="address" type="text" className={fieldErrors['field-address'] ? inputErrorClass : inputClass} placeholder="Current residential address" onChange={() => clearError('field-address')} />
              </Field>
              <Field label="Raas / राशी">
                <select name="raas" className={selectClass}>
                  <option value="">Select Raas</option>
                  {['Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischik (Scorpio)', 'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Gana / गण">
                <select name="gana" className={selectClass}>
                  <option value="">Select Gana</option>
                  {['Dev Gana', 'Manushya Gana', 'Rakshasa Gana'].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Gotra / गोत्र">
                <input name="gotra" type="text" className={inputClass} placeholder="Enter gotra" />
              </Field>
              <Field label="Shakha / शाखा">
                <input name="shakha" type="text" className={inputClass} placeholder="Enter shakha" />
              </Field>
              <Field label="Nakshatra / नक्षत्र">
                <select name="nakshatra" className={selectClass}>
                  <option value="">Select Nakshatra</option>
                  {['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Charan / चरण">
                <input name="charan" type="text" className={inputClass} placeholder="Enter charan (1–4)" />
              </Field>
              <Field label="Naad / नाद">
                <input name="naad" type="text" className={inputClass} placeholder="Enter naad" />
              </Field>
              <Field label="Mangal / मंगळ" required fieldId="field-mangal" error={fieldErrors['field-mangal']}>
                <div className={`flex gap-6 mt-1 p-2 rounded ${fieldErrors['field-mangal'] ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                  {['Yes', 'No'].map((v) =>
                  <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="mangal" value={v} className="accent-primary" onChange={() => clearError('field-mangal')} /> {v}
                    </label>
                  )}
                </div>
              </Field>
              <Field label="Diet / आहार" required fieldId="field-diet" error={fieldErrors['field-diet']}>
                <div className={`flex gap-6 mt-1 p-2 rounded ${fieldErrors['field-diet'] ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                  {['Vegetarian', 'Non-Vegetarian'].map((v) =>
                  <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="diet" value={v} className="accent-primary" onChange={() => clearError('field-diet')} /> {v}
                    </label>
                  )}
                </div>
              </Field>
              <Field label="Height / उंची">
                <input name="height" type="text" className={inputClass} placeholder='e.g. 5&apos;6"' />
              </Field>
              <Field label="Weight / वजन">
                <input name="weight" type="text" className={inputClass} placeholder="e.g. 60 kg" />
              </Field>
              <Field label="Blood Group / रक्तगट">
                <select name="bloodGroup" className={selectClass}>
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Profile Picture / प्रोफाइल फोटो" required fieldId="field-photo" error={fieldErrors['field-photo']}>
                <div className={`flex items-center gap-3 p-2 rounded ${fieldErrors['field-photo'] ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                  {photoPreview ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative shrink-0 cursor-pointer group" onClick={() => setCropSrc(photoPreview)}>
                        <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-accent/60" />
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-medium">Re-crop</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Photo added
                        </span>
                        <button type="button" onClick={handleRemovePhoto} className="text-xs text-red-600 hover:text-red-800 underline text-left w-fit">Remove photo</button>
                      </div>
                    </div>
                  ) : (
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-sm text-card-foreground/70 file:mr-3 file:py-2 file:px-4 file:rounded file:border file:border-accent/50 file:text-xs file:font-medium file:bg-muted file:text-primary hover:file:bg-accent/10 cursor-pointer" />
                  )}
                </div>
              </Field>
            </div>
          </FormFieldset>

          {/* EDUCATION & OCCUPATION */}
          <FormFieldset legend="Education & Occupation / शिक्षण आणि व्यवसाय">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <Field label="Education / शिक्षण" required fieldId="field-education" error={fieldErrors['field-education']}>
                <input name="education" type="text" className={fieldErrors['field-education'] ? inputErrorClass : inputClass} placeholder="e.g. B.E., MBA, B.Com" onChange={() => clearError('field-education')} />
              </Field>
              <Field label="Occupation / व्यवसाय" required fieldId="field-occupation" error={fieldErrors['field-occupation']}>
                <input name="occupation" type="text" className={fieldErrors['field-occupation'] ? inputErrorClass : inputClass} placeholder="e.g. Software Engineer, Doctor" onChange={() => clearError('field-occupation')} />
              </Field>
              <Field label="Job Location / नोकरीचे ठिकाण">
                <input name="jobLocation" type="text" className={inputClass} placeholder="City, State / Country" />
              </Field>
              <Field label="Annual Income / वार्षिक उत्पन्न">
                <input name="income" type="text" className={inputClass} placeholder="e.g. ₹4,50,000 per year" />
              </Field>
            </div>
          </FormFieldset>

          {/* FAMILY DETAILS */}
          <FormFieldset legend="Family Details / कौटुंबिक माहिती">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <Field label="Father's Name / वडिलांचे नाव" required fieldId="field-fatherName" error={fieldErrors['field-fatherName']}>
                <input name="fatherName" type="text" className={fieldErrors['field-fatherName'] ? inputErrorClass : inputClass} placeholder="Father's full name" onChange={() => clearError('field-fatherName')} />
              </Field>
              <Field label="Father's Details / वडिलांची माहिती">
                <input name="fatherDetails" type="text" className={inputClass} placeholder="e.g. Occupation, native place" />
              </Field>
              <Field label="Mother's Name / आईचे नाव" required fieldId="field-motherName" error={fieldErrors['field-motherName']}>
                <input name="motherName" type="text" className={fieldErrors['field-motherName'] ? inputErrorClass : inputClass} placeholder="Mother's full name" onChange={() => clearError('field-motherName')} />
              </Field>
              <Field label="Mother's Details / आईची माहिती">
                <input name="motherDetails" type="text" className={inputClass} placeholder="e.g. Homemaker, occupation" />
              </Field>
              <Field label="Sibling Details / भाऊ-बहिणींची माहिती">
                <textarea name="siblings" className={`${inputClass} resize-none`} rows={3} placeholder="e.g. 1 elder brother (married), 1 younger sister (unmarried)" />
              </Field>
              <div>
                <Field label="Vyanga / Disability / व्यंग">
                  <div className="flex gap-6 mt-1 mb-2">
                    {['None', 'Yes'].map((v) =>
                    <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="vyanga" value={v} className="accent-primary" onChange={() => setVyangaYes(v === 'Yes')} /> {v}
                      </label>
                    )}
                  </div>
                  {vyangaYes && <input name="vyangaDetail" type="text" className={inputClass} placeholder="Please describe briefly" />}
                </Field>
              </div>
            </div>
          </FormFieldset>

          {/* EXPECTATIONS */}
          <FormFieldset legend="Partner Expectations / अपेक्षा">
            <Field label="Partner Expectations / जोडीदाराकडून अपेक्षा">
              <textarea
                name="partnerExpectations"
                className={`${inputClass} resize-none`}
                rows={4}
                maxLength={500}
                placeholder="Describe what you are looking for in a life partner — values, personality, lifestyle, family background, etc. (max 500 characters)" />
              <p className="text-xs text-muted-foreground text-right mt-1">Max 500 characters</p>
            </Field>
          </FormFieldset>

          {/* CONTACT */}
          <FormFieldset legend="Contact Details / संपर्क माहिती">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <Field label="Contact No. 1 / संपर्क क्र. १" required fieldId="field-contact1" error={fieldErrors['field-contact1']}>
                <input name="contact1" type="tel" className={fieldErrors['field-contact1'] ? inputErrorClass : inputClass} placeholder="+91 XXXXX XXXXX" onChange={() => clearError('field-contact1')} />
              </Field>
              <Field label="Contact No. 2 / संपर्क क्र. २">
                <input name="contact2" type="tel" className={inputClass} placeholder="+91 XXXXX XXXXX (optional)" />
              </Field>
            </div>
          </FormFieldset>

          {/* PAYMENT */}
          <div className="mt-6">
            <h3 className="font-heading text-primary text-xl font-bold text-center mb-1">Complete Your Registration — ₹501</h3>
            <p className="text-center text-muted-foreground text-xs mb-6">Please pay ₹501 via UPI to complete your registration.</p>

            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-56 h-56 rounded-xl overflow-hidden border-2 border-accent/60 bg-white shadow-md">
                  <img src="/assets/upi-qr.jpeg" alt="UPI QR Code — Scan to Pay" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">UPI ID:</p>
                  <p className="font-sans text-primary font-semibold text-sm border border-accent/40 rounded px-3 py-1 bg-background tracking-normal">9225800617@upi</p>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={uploading}
            className="w-full mt-4 py-4 rounded-xl font-heading font-bold text-lg text-primary-foreground transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: '#2D1B69', border: '2px solid #C9A84C' }}
            whileHover={{ boxShadow: '0 0 20px 6px rgba(201,168,76,0.35)' }}
            whileTap={{ scale: 0.98 }}>
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>
                Submitting… please wait, do not close this page
              </span>
            ) : 'Submit Registration'}
          </motion.button>

          {/* Error banner — shown when submission fails */}
          {submitError && (
            <div className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 px-5 py-4 flex gap-3 items-start">
              <svg className="shrink-0 mt-0.5 text-destructive" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <p className="text-sm font-semibold text-destructive mb-0.5">Submission Failed</p>
                <p className="text-sm text-destructive/90 leading-relaxed">{submitError}</p>
                <p className="text-xs text-muted-foreground mt-2">Please fix the issue above and try submitting again. Your form data is still filled in.</p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-3">🔒 Your information is encrypted and kept strictly confidential.</p>
        </form>
      </div>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>);


}