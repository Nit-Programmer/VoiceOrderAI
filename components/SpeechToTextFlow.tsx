"use client";

import { useRef, useState } from "react";

import AudioUploader, { type UploadedAudio } from "@/components/AudioUploader";
import AILoading from "@/components/AILoading";
import LoadingState from "@/components/LoadingState";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TranscriptCard from "@/components/TranscriptCard";
import VoiceRecorder, { type RecordedAudio } from "@/components/VoiceRecorder";
import { AIReasoningError, understandOrder } from "@/services/aiReasoning";
import { validateOrder } from "@/services/orderValidation";
import { saveOrder as saveOrderToHistory } from "@/services/orderHistory";
import { SpeechToTextError, transcribeAudio } from "@/services/speechToText";
import type { StructuredOrder } from "@/types/order";
import type { Transcript } from "@/types/transcript";
import { speak } from "@/services/audioPlayer";
import { generateOrderConfirmation } from "@/services/orderConfirmation";

type WorkflowState = "selecting" | "transcribing" | "reviewingTranscript" | "understanding" | "reviewingOrder";

type SpeechToTextFlowProps = {
  /** Receives the reviewed transcript when AI understanding begins. */
  onTranscriptReady?: (transcript: Transcript) => void;
  /** Receives the confirmed order when a future export or storage stage is connected. */
  onOrderConfirmed?: (order: StructuredOrder) => void;
};

/** Coordinates existing audio inputs with the reusable Speech-to-Text review stage. */
export default function SpeechToTextFlow({ onTranscriptReady, onOrderConfirmed }: SpeechToTextFlowProps) {
  const [state, setState] = useState<WorkflowState>("selecting");
  const [fileName, setFileName] = useState("");
  const [pendingAudio, setPendingAudio] = useState<{ file: File; duration: number | null } | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [draft, setDraft] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<StructuredOrder | null>(null);
  const [orderDraft, setOrderDraft] = useState<StructuredOrder | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);
  const [orderWarnings, setOrderWarnings] = useState<string[]>([]);
  const savedOrderId = useRef<string | null>(null);

  const startTranscription = async (file: File, duration: number | null) => {
    if (duration !== null && duration > 30) {
      setError("This recording is too long to transcribe. Please choose a clip under 30 seconds.");
      return;
    }

    setError(null);
    setOrderConfirmation(null);
    setPendingAudio({ file, duration });
    setFileName(file.name);
    setState("transcribing");

    try {
      const response = await transcribeAudio(file);
      setTranscript(response.transcript);
      setDraft(response.transcript.text);
      setState("reviewingTranscript");
    } catch (error) {
      setError(getFriendlyErrorMessage(error instanceof SpeechToTextError ? error.message : "", "We couldn’t turn this audio into text. Please try again."));
      setState("selecting");
    }
  };

  const handleUploadedAudio = ({ file, duration }: UploadedAudio) => void startTranscription(file, duration);
  const handleRecordedAudio = ({ blob, duration, mimeType }: RecordedAudio) => {
    const extension = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "m4a" : "webm";
    const file = new File([blob], `voiceorder-recording.${extension}`, { type: mimeType });
    void startTranscription(file, duration);
  };
  const saveTranscript = () => {
    if (!transcript || !draft.trim()) return;
    setTranscript({ ...transcript, text: draft.trim() });
    setIsEditing(false);
  };
  const startOrderUnderstanding = async () => {
    if (!transcript) return;
    setError(null);
    setOrderConfirmation(null);
    setOrderWarnings([]);
    savedOrderId.current = null;
    onTranscriptReady?.(transcript);
    setState("understanding");

    try {
      const response = await understandOrder(transcript.text);
      const validation = validateOrder(response.order);
      setOrder(validation.order);
      setOrderDraft(validation.order);
      setOrderWarnings(validation.warnings);
      setState("reviewingOrder");
    } catch (error) {
      setError(getFriendlyErrorMessage(error instanceof AIReasoningError ? error.message : "", "We couldn’t understand this order. Please try again."));
      setState("reviewingTranscript");
    }
  };
  const saveOrder = () => {
    if (!orderDraft) return;
    const validation = validateOrder(orderDraft);
    if (!isOrderValid(validation.order)) return;
    setOrder(validation.order);
    setOrderDraft(validation.order);
    setOrderWarnings(validation.warnings);
    savedOrderId.current = null;
    setIsEditingOrder(false);
  };
  const confirmOrder = async () => {
    if (!order) return;
    if (!savedOrderId.current) savedOrderId.current = saveOrderToHistory(order).id;
    onOrderConfirmed?.(order);
    setOrderConfirmation("Order confirmed and ready for the next workflow stage.");
    try {
     const confirmation = await generateOrderConfirmation(order);
     await speak(confirmation);
     
    } catch {
      // The confirmed order remains available even if audio playback is unavailable.
    }
  };
  const startOver = () => {
    setState("selecting");
    setTranscript(null);
    setDraft("");
    setIsEditing(false);
    setPendingAudio(null);
    setError(null);
    setOrder(null);
    setOrderDraft(null);
    setIsEditingOrder(false);
    setOrderConfirmation(null);
    setOrderWarnings([]);
    savedOrderId.current = null;
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl">
      {state === "selecting" && <><div className="grid gap-5 md:grid-cols-2"><AudioUploader onContinue={handleUploadedAudio} /><VoiceRecorder onContinue={handleRecordedAudio} /></div>{error && <ErrorMessage message={error} onRetry={pendingAudio ? () => void startTranscription(pendingAudio.file, pendingAudio.duration) : undefined} retryLabel="Retry transcription" />}</>}
      {state === "transcribing" && <LoadingState fileName={fileName} />}
      {state === "reviewingTranscript" && transcript && <><TranscriptCard transcript={transcript} draft={draft} isEditing={isEditing} isContinuing={false} confirmation={null} onDraftChange={setDraft} onEdit={() => setIsEditing(true)} onSave={saveTranscript} onCancel={() => { setDraft(transcript.text); setIsEditing(false); }} onContinue={startOrderUnderstanding} onStartOver={startOver} />{error && <ErrorMessage message={error} onRetry={() => void startOrderUnderstanding()} retryLabel="Retry AI understanding" />}</>}
      {state === "understanding" && <AILoading />}
      {state === "reviewingOrder" && order && orderDraft && <OrderSummaryCard order={order} draft={orderDraft} isEditing={isEditingOrder} confirmation={orderConfirmation} warnings={orderWarnings} onDraftChange={setOrderDraft} onEdit={() => setIsEditingOrder(true)} onSave={saveOrder} onCancelEdit={() => { setOrderDraft(order); setIsEditingOrder(false); }} onBack={() => { setError(null); setOrderConfirmation(null); setState("reviewingTranscript"); }} onConfirm={confirmOrder} />}
    </div>
  );
}

function ErrorMessage({ message, onRetry, retryLabel }: { message: string; onRetry?: () => void; retryLabel?: string }) {
  return <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert"><span>{message}</span>{onRetry && <button type="button" onClick={onRetry} className="inline-flex min-h-9 items-center rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-rose-700 shadow-sm ring-1 ring-rose-200 transition-colors hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">{retryLabel ?? "Retry"}</button>}</div>;
}

function getFriendlyErrorMessage(message: string, fallback: string) {
  if (!message || /^\s*[{[]/.test(message) || /(?:api|gemini|gnani).*(?:error|status)|deadline_exceeded/i.test(message)) return fallback;
  return message;
}

function isOrderValid(order: StructuredOrder) {
  return order.items.length > 0 && order.items.every((item) => item.name.trim() && Number.isFinite(item.quantity) && item.quantity > 0);
}
