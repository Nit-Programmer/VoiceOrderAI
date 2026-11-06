"use client";

type TranscriptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

/** Provides an accessible, controlled editing surface for a transcript. */
export default function TranscriptEditor({ value, onChange, onSave, onCancel }: TranscriptEditorProps) {
  return (
    <div className="mt-4">
      <label htmlFor="transcript-editor" className="sr-only">Edit transcript</label>
      <textarea id="transcript-editor" value={value} onChange={(event) => onChange(event.target.value)} rows={7} className="w-full resize-y rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-inner shadow-slate-100 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Cancel</button>
        <button type="button" onClick={onSave} disabled={!value.trim()} className="rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save changes</button>
      </div>
    </div>
  );
}
