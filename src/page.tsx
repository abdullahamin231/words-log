import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import WordStore, { Word } from "./wordStore";
import AddWordButton from "./AddWordButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AddByVoice from "./AddByVoice";
import hashIt from "./Hashing";

const wordsStore = new WordStore();
export default function Page() {
  const [words, setWords] = useState<Word[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  useEffect(() => {
    setWords(wordsStore.getWords());
  }, []);

  const addWord = (word: string, definitions: string[]) => {
    const trimmedWord = word.trim();
    const trimmedDefinitions = definitions
      .map((def) => def.trim())
      .filter((def) => def);

    if (!trimmedWord) {
      toast.error("Please enter a word");
      return;
    }
    if (trimmedDefinitions.length === 0) {
      toast.error("Please enter at least one definition");
      return;
    }

    if (wordsStore.addNewWord(trimmedWord, trimmedDefinitions)) {
      setWords([
        ...words,
        {
          id: hashIt(trimmedWord),
          word: trimmedWord,
          definitions: trimmedDefinitions,
        },
      ]);
    } else {
      toast.error("Word already saved");
    }
  };

  const handleEditClick = (selectedWord: Word) => {
    if (editing && editingWord) {
      wordsStore.editWord(editingWord);
      setWords(
        words.map((word) => (word.id === editingWord.id ? editingWord : word)),
      );
      setEditingWord(null);
    } else {
      setEditingWord({
        ...selectedWord,
        definitions: [...selectedWord.definitions],
      });
    }
    setEditing(!editing);
  };

  const handleDeleteWord = (deleteID: string) => {
    wordsStore.deleteWord(deleteID);
    setWords(words.filter((word) => word.id !== deleteID));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 text-white flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-8">words.log</h1>

        <div className="flex flex-row items-center gap-1 mx-auto">
          {/* Add Word Drawer */}
          <AddWordButton handleAddWord={addWord} />

          <AddByVoice addToStore={addWord} />
        </div>

        {/* Word Grid */}
        <div className="flex flex-row items-center flex-wrap gap-4 mx-20">
          {words &&
            words.length > 0 &&
            words.map((word) => (
              <Drawer key={word.id}>
                <DrawerTrigger asChild>
                  <button className="py-2 px-4 border border-zinc-800 rounded-lg hover:bg-zinc-800/90 transition-colors text-center bg-zinc-900 w-fit">
                    {word.word}
                  </button>
                </DrawerTrigger>
                <DrawerContent className="dark bg-zinc-950 border-zinc-800">
                  <div className="mx-auto w-full max-w-sm bg-zinc-950">
                    {!editing && (
                      <DrawerHeader>
                        <DrawerTitle>{word.word}</DrawerTitle>
                        <div className="max-h-48 overflow-y-auto">
                          {word.definitions?.map((def) => {
                            return (
                              <DrawerDescription
                                key={hashIt(def)}
                                className="text-zinc-400"
                              >
                                {def}
                              </DrawerDescription>
                            );
                          })}
                        </div>
                      </DrawerHeader>
                    )}
                    {editing && editingWord && word.id === editingWord.id && (
                      <div className="px-4 py-1 pb-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="word" className="text-white">
                              Word
                            </Label>
                            <Input
                              className="text-white"
                              id="word"
                              value={editingWord.word}
                              onChange={(e) =>
                                setEditingWord({
                                  ...editingWord,
                                  word: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white">Definitions</Label>
                            <p className="text-zinc-600 text-sm">
                              Emptying the input deletes the definition
                            </p>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                              {editingWord.definitions.map((def, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col gap-1"
                                >
                                  <Textarea
                                    className="text-white"
                                    value={editingWord.definitions[index]}
                                    onChange={(e) => {
                                      let newDefs = [
                                        ...editingWord.definitions,
                                      ];
                                      newDefs = newDefs.filter(
                                        (def) => def.length > 0,
                                      );
                                      newDefs[index] = e.target.value.trim();
                                      setEditingWord({
                                        ...editingWord,
                                        definitions: newDefs,
                                      });
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <DrawerFooter>
                      <div className="flex items-center gap-1 w-full">
                        <Button
                          className="w-full"
                          onClick={() => handleEditClick(word)}
                          variant={editing ? "default" : "secondary"}
                        >
                          {editing ? "Save" : "Edit"}
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => handleDeleteWord(word.id)}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                      <DrawerClose asChild>
                        <Button
                          variant="ghost"
                          className="border-zinc-600 text-white border"
                        >
                          Close
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            ))}
          {words.length === 0 && (
            <h2 className="text-center">No saved words found.</h2>
          )}
        </div>
      </div>
    </div>
  );
}
