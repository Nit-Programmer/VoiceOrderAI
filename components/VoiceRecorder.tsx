"use client";

import { useEffect, useRef, useState } from "react";

export type RecordedAudio = {
  blob: Blob;
  duration: number;
  mimeType: string;
};

export type VoiceRecorderProps = {
  /** Called after a recording is stopped. */
  onRecordingReady?: (recording: RecordedAudio) => void;
  /** Called when the user wants to transcribe the completed browser recording. */
  onContinue?: (recording: RecordedAudio) => void;
  className?: string;
  id?: string;
};

/** Records audio locally with the browser MediaRecorder API; it never uploads captured audio. */
export default function VoiceRecorder({ onRecordingReady, onContinue, className = "", id = "voice-recorder" }: VoiceRecorderProps) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const [status, setStatus] = useState<"idle" | "recording" | "ready">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState("audio/webm");
  const [recording, setRecording] = useState<RecordedAudio | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const releaseMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => () => {
    stopTimer();
    releaseMicrophone();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Audio recording is not supported by this browser. You can upload a recording instead.");
      return;
    }

    setError(null);
    if (audioUrl) setAudioUrl(null);
    setRecording(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getPreferredMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        const recordedMimeType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: recordedMimeType });
        const completedRecording = { blob, duration: elapsedRef.current, mimeType: recordedMimeType };
        setAudioUrl(URL.createObjectURL(blob));
        setAudioMimeType(recordedMimeType);
        setRecording(completedRecording);
        setStatus("ready");
        stopTimer();
        releaseMicrophone();
        onRecordingReady?.(completedRecording);
      });

      recorderRef.current = recorder;
      elapsedRef.current = 0;
      setElapsed(0);
      recorder.start();
      setStatus("recording");
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
      }, 1000);
    } catch (exception) {
      releaseMicrophone();
      setError(getMicrophoneErrorMessage(exception));
    }
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") recorder.stop();
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecording(null);
    setElapsed(0);
    elapsedRef.current = 0;
    setStatus("idle");
    setError(null);
  };

  const downloadExtension = mimeToExtension(audioMimeType);
  const continueWithRecording = () => {
    if (recording) onContinue?.(recording);
  };

  return (
    <section id={id} className={`w-full rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-xl shadow-indigo-100/60 backdrop-blur sm:p-5 ${className}`} aria-label="Voice recorder">
      {status === "idle" && (
        <div className="rounded-xl border border-indigo-100 bg-slate-50 p-5 text-center sm:p-7">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200" aria-hidden="true"><MicrophoneIcon /></span>
          <h2 className="mt-3 text-base font-bold text-slate-900">Record in your browser</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">Use your microphone to capture a new customer conversation.</p>
          <button type="button" onClick={startRecording} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><MicrophoneIcon />Start recording</button>
          <p className="mt-3 text-xs text-slate-400">Your browser will ask for microphone permission.</p>
        </div>
      )}

      {status === "recording" && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-5 text-center sm:p-7" aria-live="polite">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-200" aria-hidden="true"><span className="size-3 animate-pulse rounded-full bg-white" /></div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-rose-700"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-rose-600" /></span>Recording</div>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-slate-900">{formatDuration(elapsed)}</p>
          <button type="button" onClick={stopRecording} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"><StopIcon />Stop recording</button>
        </div>
      )}

      {status === "ready" && audioUrl && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-white text-emerald-600 shadow-sm" aria-hidden="true"><CheckIcon /></span><div><h2 className="text-sm font-bold text-slate-900">Recording ready</h2><p className="text-xs text-slate-500">Duration: {formatDuration(elapsed)} · Stored only in this browser</p></div></div>
          <audio className="mt-4 w-full" controls src={audioUrl}>Your browser does not support audio playback.</audio>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={audioUrl} download={`voiceorder-recording.${downloadExtension}`} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><DownloadIcon />Download</a>
            <button type="button" onClick={deleteRecording} className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete recording</button>
            {onContinue && <button type="button" onClick={continueWithRecording} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Continue to Speech-to-Text <span aria-hidden="true">→</span></button>}
          </div>
        </div>
      )}

      {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
    </section>
  );
}

function getPreferredMimeType() {
  const supportedTypes = ["audio/ogg;codecs=opus", "audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
  return supportedTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

function getMicrophoneErrorMessage(exception: unknown) {
  if (exception instanceof DOMException && exception.name === "NotAllowedError") return "Microphone access was blocked. Allow microphone permission, then try again.";
  if (exception instanceof DOMException && exception.name === "NotFoundError") return "No microphone was found. Connect one, or upload an existing recording instead.";
  return "We could not start the microphone. Please try again or upload an existing recording.";
}

function mimeToExtension(mimeType: string) {
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "m4a";
  return "webm";
}

function formatDuration(seconds: number) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
function MicrophoneIcon() { return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7" strokeLinecap="round" /></svg>; }
function StopIcon() { return <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg>; }
function CheckIcon() { return <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function DownloadIcon() { return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
