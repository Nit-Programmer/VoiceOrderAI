export type Transcript = {
  id: string;
  text: string;
  sourceFileName: string;
  languageCode?: string;
  model?: string;
  createdAt: string;
};

export type TranscriptionResponse = {
  transcript: Transcript;
};
