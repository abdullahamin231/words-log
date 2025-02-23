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

const wordsStore = new WordStore();
export default function Page() {
  const [newWord, setNewWord] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  useEffect(() => {
    setWords(wordsStore.getWords());
  }, []);

  const handleAddWord = () => {
    const trimmedWord = newWord.trim();
    const trimmedDefinition = newDefinition.trim();

    if (!trimmedWord) {
      toast.error("Please enter a word");
      return;
    }
    if (!trimmedDefinition) {
      toast.error("Please enter a definition");
      return;
    }

    const maxid = words.length
      ? Math.max(...words.map((w) => Number(w.id)))
      : 0;
    const nextid = maxid + 1;
    wordsStore.addWord(String(nextid), trimmedWord, trimmedDefinition);
    setWords([
      ...words,
      { id: String(nextid), word: trimmedWord, definition: trimmedDefinition },
    ]);
    setNewWord("");
    setNewDefinition("");
  };

  const handleEditClick = (selectedWord: Word) => {
    if (editing === true && editingWord !== null) {
      // editing was true, then clicked = saved
      wordsStore.editWord(editingWord);
      setWords(
        words.map((word) => (word.id === editingWord.id ? editingWord : word)),
      );
    } else {
      setEditingWord(selectedWord);
    }
    setEditing(!editing);
  };

  const handleDeleteWord = (deleteID: string) => {
    wordsStore.deleteWord(deleteID);
    setWords(words.filter((word) => word.id !== deleteID));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold text-center mb-8">words.log</h1>

        {/* Add Word Drawer */}
        <AddWordButton
          newWord={newWord}
          newDefinition={newDefinition}
          setNewDefinition={setNewDefinition}
          setNewWord={setNewWord}
          handleAddWord={handleAddWord}
        />

        {/* Word Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-20">
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
                        <DrawerDescription className="text-zinc-400">
                          {word.definition}
                        </DrawerDescription>
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
                            <Label htmlFor="definition" className="text-white">
                              Definition
                            </Label>
                            <Textarea
                              className="text-white"
                              id="definition"
                              value={editingWord.definition}
                              onChange={(e) =>
                                setEditingWord({
                                  ...editingWord,
                                  definition: e.target.value,
                                })
                              }
                            />
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
