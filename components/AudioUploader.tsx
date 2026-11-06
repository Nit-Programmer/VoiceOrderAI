"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = ["mp3", "wav", "m4a", "aac", "ogg"] as const;
const ACCEPTED_FILE_TYPES = "audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg,.mp3,.wav,.m4a,.aac,.ogg";
const SUPPORTED_MIME_TYPES = new Set([
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/wave",
  "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg",
]);

export type UploadedAudio = { file: File; duration: number | null };

export type AudioUploaderProps = {
  /** Called when the user selects the next step. */
  onContinue?: (audio: UploadedAudio) => void;
  /** Called after the selected file's metadata has been read, when available. */
  onFileReady?: (audio: UploadedAudio) => void;
  className?: string;
  id?: string;
};

/** Validates, previews, and plays a local audio file entirely in the browser. */
export default function AudioUploader({ onContinue, onFileReady, className = "", id = "audio-upload" }: AudioUploaderProps) {
  const inputId = useId();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingMetadata, setIsProcessingMetadata] = useState(false);
  const [metadataUnavailable, setMetadataUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const selectFile = (candidate: File | undefined) => {
    if (!candidate) return;
    const validationMessage = getValidationMessage(candidate);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError(null);
    setAudioFile(candidate);
    setAudioUrl(URL.createObjectURL(candidate));
    setDuration(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setMetadataUnavailable(false);
    setIsProcessingMetadata(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };
  const openFilePicker = () => fileInputRef.current?.click();
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };
  const handleDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };
  const handleLoadedMetadata = () => {
    const candidate = audioRef.current?.duration;
    const safeDuration = candidate && Number.isFinite(candidate) ? candidate : null;
    setDuration(safeDuration);
    setIsProcessingMetadata(false);
    setMetadataUnavailable(safeDuration === null);
    if (audioFile) onFileReady?.({ file: audioFile, duration: safeDuration });
  };
  const handleMetadataError = () => {
    setIsProcessingMetadata(false);
    setMetadataUnavailable(true);
  };
  const togglePlayback = async () => {
    const player = audioRef.current;
    if (!player) return;
    if (player.paused) {
      try {
        await player.play();
      } catch {
        setError("Your browser could not play this audio file.");
      }
    } else {
      player.pause();
    }
  };
  const seekTo = (nextTime: number) => {
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };
  const changeVolume = (nextVolume: number) => {
    if (audioRef.current) audioRef.current.volume = nextVolume;
    setVolume(nextVolume);
  };
  const removeFile = () => {
    audioRef.current?.pause();
    setAudioFile(null);
    setAudioUrl(null);
    setDuration(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsProcessingMetadata(false);
    setMetadataUnavailable(false);
    setError(null);
  };

  return (
    <section id={id} className={`w-full rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-xl shadow-indigo-100/60 backdrop-blur sm:p-5 ${className}`} aria-label="Audio upload">
      <input ref={fileInputRef} id={inputId} type="file" accept={ACCEPTED_FILE_TYPES} className="sr-only" onChange={handleInputChange} />
      {!audioFile ? (
        <div
          className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors sm:p-7 ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-indigo-100 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"}`}
          role="button"
          tabIndex={0}
          aria-labelledby={`${inputId}-title`}
          aria-describedby={`${inputId}-description`}
          onClick={openFilePicker}
          onKeyDown={handleDropzoneKeyDown}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }}
          onDrop={handleDrop}
        >
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200" aria-hidden="true"><UploadIcon /></span>
          <h2 id={`${inputId}-title`} className="mt-3 text-base font-bold text-slate-900">Upload a voice recording</h2>
          <p id={`${inputId}-description`} className="mt-1 text-sm leading-6 text-slate-500">Drag and drop your file here, or choose it from your device.</p>
          <button type="button" className="mt-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={(event) => { event.stopPropagation(); openFilePicker(); }}>Choose file</button>
          <p className="mt-3 text-xs text-slate-400">MP3, WAV, M4A, AAC, or OGG · Maximum 25 MB</p>
        </div>
      ) : (
        <UploadedAudioPanel
          audioFile={audioFile} audioUrl={audioUrl} audioRef={audioRef} duration={duration}
          currentTime={currentTime} volume={volume} isPlaying={isPlaying}
          isProcessingMetadata={isProcessingMetadata} metadataUnavailable={metadataUnavailable}
          onLoadedMetadata={handleLoadedMetadata} onMetadataError={handleMetadataError}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)}
          onTogglePlayback={togglePlayback} onSeek={seekTo} onVolumeChange={changeVolume}
          onReplace={openFilePicker} onRemove={removeFile}
          onContinue={() => { if (audioFile) onContinue?.({ file: audioFile, duration }); }}
        />
      )}
      {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
    </section>
  );
}

type UploadedAudioPanelProps = {
  audioFile: File; audioUrl: string | null; audioRef: RefObject<HTMLAudioElement | null>;
  duration: number | null; currentTime: number; volume: number; isPlaying: boolean;
  isProcessingMetadata: boolean; metadataUnavailable: boolean;
  onLoadedMetadata: () => void; onMetadataError: () => void; onTimeUpdate: () => void;
  onPlay: () => void; onPause: () => void; onEnded: () => void; onTogglePlayback: () => void;
  onSeek: (time: number) => void; onVolumeChange: (volume: number) => void;
  onReplace: () => void; onRemove: () => void; onContinue: () => void;
};

/** Displays local file metadata, a custom browser audio player, and next-step actions. */
function UploadedAudioPanel({ audioFile, audioUrl, audioRef, duration, currentTime, volume, isPlaying, isProcessingMetadata, metadataUnavailable, onLoadedMetadata, onMetadataError, onTimeUpdate, onPlay, onPause, onEnded, onTogglePlayback, onSeek, onVolumeChange, onReplace, onRemove, onContinue }: UploadedAudioPanelProps) {
  const volumeControlId = useId();
  const metadataValue = isProcessingMetadata ? "Reading audio metadata…" : metadataUnavailable ? "Not available" : formatDuration(duration);
  return (
    <div>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" onLoadedMetadata={onLoadedMetadata} onError={onMetadataError} onTimeUpdate={onTimeUpdate} onPlay={onPlay} onPause={onPause} onEnded={onEnded} />}
      <div className="flex items-start gap-3 rounded-xl bg-indigo-50/70 p-3.5 sm:p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-indigo-600 shadow-sm" aria-hidden="true"><AudioFileIcon /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900" title={audioFile.name}>{audioFile.name}</p>
          <dl className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <div><dt className="sr-only">File type</dt><dd>Type: {displayFileType(audioFile)}</dd></div>
            <div><dt className="sr-only">File size</dt><dd>Size: {formatFileSize(audioFile.size)}</dd></div>
            <div><dt className="sr-only">Duration</dt><dd>Duration: {metadataValue}</dd></div>
          </dl>
        </div>
        {isProcessingMetadata && <span className="mt-1 size-4 shrink-0 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-label="Loading audio metadata" />}
      </div>
      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:p-4" aria-label="Audio player">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onTogglePlayback} className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-200 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" aria-label={isPlaying ? "Pause audio" : "Play audio"}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <span className="w-10 text-right font-mono text-xs tabular-nums text-slate-500">{formatDuration(currentTime)}</span>
          <input type="range" min="0" max={duration ?? 0} step="0.1" value={Math.min(currentTime, duration ?? 0)} onChange={(event) => onSeek(Number(event.target.value))} disabled={!duration} className="h-1.5 min-w-0 flex-1 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed" aria-label="Audio playback position" />
          <span className="w-10 font-mono text-xs tabular-nums text-slate-500">{formatDuration(duration)}</span>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <VolumeIcon /><label className="sr-only" htmlFor={volumeControlId}>Audio volume</label>
          <input id={volumeControlId} type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => onVolumeChange(Number(event.target.value))} className="h-1.5 w-24 cursor-pointer accent-indigo-600" />
          <span className="w-8 text-right text-xs tabular-nums text-slate-500">{Math.round(volume * 100)}%</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={onReplace} className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Replace file</button>
          <button type="button" onClick={onRemove} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Remove file</button>
        </div>
        <button type="button" onClick={onContinue} disabled={isProcessingMetadata} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-slate-300 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Continue to Speech-to-Text <span aria-hidden="true">→</span></button>
      </div>
    </div>
  );
}

function getValidationMessage(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const isAudioMimeType = !file.type || SUPPORTED_MIME_TYPES.has(file.type.toLowerCase()) || file.type.startsWith("audio/");
  if (!extension || !SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number]) || !isAudioMimeType) return "Please choose an MP3, WAV, M4A, AAC, or OGG audio file.";
  if (file.size > MAX_FILE_SIZE_BYTES) return "This file is larger than 25 MB. Please choose a smaller recording.";
  return null;
}
function displayFileType(file: File) { return file.type ? file.type.replace("audio/", "").toUpperCase() : file.name.split(".").pop()?.toUpperCase() ?? "Audio"; }
function formatFileSize(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
function formatDuration(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  const totalSeconds = Math.floor(value);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
function UploadIcon() { return <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 16V3m0 0L7 8m5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function AudioFileIcon() { return <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2V8Zm0 0v6h6M8 16a2 2 0 1 0 0-4v5m0-2h2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function PlayIcon() { return <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" /></svg>; }
function PauseIcon() { return <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zm7 0h3v14h-3z" /></svg>; }
function VolumeIcon() { return <svg viewBox="0 0 24 24" className="size-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
