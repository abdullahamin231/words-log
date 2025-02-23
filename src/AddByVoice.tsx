import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon, PencilIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }
}

const WORD_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export default function AddByVoice({
  addToStore,
}: {
  addToStore: (word: string, def: string[]) => void;
}) {
  const [recordingState, setRecordingState] = useState<
    "start" | "end" | "recording"
  >("start");
  const [transcript, setTranscript] = useState("");
  const [recordingStep, setRecordingStep] = useState<"recording" | "finalise">(
    "recording",
  );
  const recognitionRef = useRef<null | any>(null);
  const [finalTranscript, setFinalTranscript] = useState<Set<string>>(
    new Set(),
  );
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const saveWordsAndClose = async () => {
    for (const word of finalTranscript) {
      const response = await fetch(`${WORD_API}${word}`);
      if (response.ok) {
        if (response.status === 404) continue;
        const data = await response.json();
        const wordData = data[0];
        const meanings = wordData["meanings"];
        const tempDefinitions: string[] = [];
        for (let i = 0; i < Math.min(1, meanings.length); ++i) {
          const definitions = meanings[i]["definitions"];
          for (let j = 0; j < Math.min(2, definitions.length); ++j) {
            tempDefinitions.push(definitions[j]["definition"]);
          }
        }
        addToStore(word, tempDefinitions);
        toast(`${word} added.`);
      }
    }

    setRecordingStep("recording");
    setRecordingState("start");
    setFinalTranscript(new Set());
    setTranscript("");
  };

  const handleDeleteWord = (word: string) => {
    setFinalTranscript((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(word);
      return updatedSet;
    });
  };

  const handleEditWord = (oldWord: string, newWord: string) => {
    if (!newWord || newWord.length < 2) return;
    setFinalTranscript((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(oldWord);
      updatedSet.add(newWord);
      return updatedSet;
    });
    setEditingWord(null);
  };

  const processTranscript = (text: string): Set<string> => {
    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 1);
    return new Set(words);
  };

  const startRecording = () => {
    toast.info(
      "Recording started. Speak clearly—recording will stop when you pause.",
    );
    const LANG = "en-US";
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition)();

    recognition.lang = LANG;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript((prev) => (prev ? prev + " " + text : text));
    };

    recognition.onstart = () => setRecordingState("recording");
    recognition.onend = () => setRecordingState("end");

    recognitionRef.current = recognition;
    recognition.start();
  };

  const clearTranscript = () => {
    setTranscript("");
    setFinalTranscript(new Set());
  };

  return (
    <div className="flex justify-center mb-8">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="cursor-pointer">Add by Voice</Button>
        </DrawerTrigger>
        <DrawerContent className="dark bg-zinc-950 border-zinc-800">
          <div className="mx-auto w-full max-w-sm bg-zinc-950">
            <DrawerHeader>
              <DrawerTitle>
                Store multiple words by speaking into your microphone
              </DrawerTitle>
              <DrawerDescription>
                We will automatically fetch the definitions for you.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-1 pb-0 space-y-4 flex flex-col">
              {recordingStep !== "finalise" && (
                <>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="default"
                      onClick={startRecording}
                      disabled={recordingState === "recording"}
                    >
                      Start Recording
                    </Button>
                    <Button
                      className="text-white"
                      variant="ghost"
                      onClick={clearTranscript}
                    >
                      Clear transcript
                    </Button>
                  </div>
                  <Textarea
                    className="text-white"
                    value={transcript}
                    readOnly
                  />
                </>
              )}
              {recordingStep === "finalise" && (
                <>
                  <p className="font-bold text-white">Processed Transcript</p>
                  <p className="text-sm text-zinc-400">
                    Make sure spellings are correct before saving.
                  </p>
                  <div className="flex flex-row items-center flex-wrap w-full gap-1">
                    {[...finalTranscript].map((word: string) => (
                      <div
                        key={word}
                        className="flex items-center gap-2 bg-zinc-900 px-2 py-1 rounded-lg"
                      >
                        {editingWord === word ? (
                          <input
                            className="bg-transparent text-white border-b border-zinc-500 focus:outline-none"
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onBlur={() => handleEditWord(word, editedValue)}
                            autoFocus
                          />
                        ) : (
                          <p className="text-white">{word}</p>
                        )}
                        <button
                          className="text-blue-500/50 cursor-pointer hover:text-blue-700"
                          onClick={() => {
                            setEditingWord(word);
                            setEditedValue(word);
                          }}
                        >
                          <PencilIcon size={18} />
                        </button>
                        <button
                          className="text-red-500/50 cursor-pointer hover:text-red-700"
                          onClick={() => handleDeleteWord(word)}
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <DrawerFooter>
              {recordingStep === "finalise" ? (
                <DrawerClose asChild>
                  <Button variant="secondary" onClick={saveWordsAndClose}>
                    Save words
                  </Button>
                </DrawerClose>
              ) : (
                <Button
                  variant="secondary"
                  className="text-white"
                  disabled={recordingState === "start"}
                  onClick={() => {
                    setRecordingStep("finalise");
                    setFinalTranscript(processTranscript(transcript));
                  }}
                >
                  Finalise words
                </Button>
              )}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
