"use client";

import TranscriptEditor from "@/components/TranscriptEditor";
import type { Transcript } from "@/types/transcript";

type TranscriptCardProps = {
  transcript: Transcript;
  draft: string;
  isEditing: boolean;
  isContinuing: boolean;
  confirmation: string | null;
  onDraftChange: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onContinue: () => void;
  onStartOver: () => void;
};

/** Renders a reviewable transcript and exposes the value for the next product stage. */
export default function TranscriptCard({ transcript, draft, isEditing, isContinuing, confirmation, onDraftChange, onEdit, onSave, onCancel, onContinue, onStartOver }: TranscriptCardProps) {
  return (
    <section className="w-full rounded-2xl border border-indigo-100 bg-white/95 p-5 shadow-xl shadow-indigo-100/60 backdrop-blur sm:p-6" aria-label="Transcript">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Speech-to-Text</p><h2 className="mt-1 text-xl font-bold text-slate-950">Transcript</h2></div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">Transcribed</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">Review the text below before continuing. Your changes are used in the next step.</p>
      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
        {isEditing ? <TranscriptEditor value={draft} onChange={onDraftChange} onSave={onSave} onCancel={onCancel} /> : <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{transcript.text}</p>}
      </div>
      {!isEditing && <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={onStartOver} disabled={isContinuing} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Use another audio</button><div className="flex flex-col gap-2 sm:flex-row"><button type="button" onClick={onEdit} disabled={isContinuing} className="rounded-lg border border-indigo-100 bg-white px-3.5 py-2.5 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit transcript</button><button type="button" onClick={onContinue} disabled={isContinuing || !transcript.text.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{isContinuing ? "Preparing…" : "Continue to AI Understanding"}<span aria-hidden="true">→</span></button></div></div>}
      {confirmation && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">{confirmation}</p>}
      <p className="mt-4 text-xs text-slate-400">Source: {transcript.sourceFileName}{transcript.languageCode ? ` · ${transcript.languageCode}` : ""}</p>
    </section>
  );
}
