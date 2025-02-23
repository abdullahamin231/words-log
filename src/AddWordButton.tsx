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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

interface AddWordButtonProps {
  handleAddWord: (word: string, definitions: string[]) => void;
}

export default function AddWordButton({ handleAddWord }: AddWordButtonProps) {
  const [word, setWord] = useState<string>("");
  const [definitions, setDefinitions] = useState<string[]>([]);

  const addDefinitionField = () => {
    setDefinitions([...definitions, ""]);
  };
  const deleteDefinitionField = (index: number) => {
    // @ts-ignore
    setDefinitions(definitions.filter((def, i) => index !== i));
  };

  const updateDefinition = (index: number, value: string) => {
    const updatedDefinitions = [...definitions];
    updatedDefinitions[index] = value;
    setDefinitions(updatedDefinitions);
  };

  const saveWord = () => {
    const trimmedWord = word.trim();
    const validDefinitions = definitions.map((d) => d.trim()).filter((d) => d);

    if (!trimmedWord) return;
    if (validDefinitions.length === 0) return;

    handleAddWord(trimmedWord, validDefinitions);
    setWord("");
    setDefinitions([""]);
  };

  return (
    <div className="flex justify-center mb-8">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="cursor-pointer">Add word</Button>
        </DrawerTrigger>
        <DrawerContent className="dark bg-zinc-950 border-zinc-800">
          <div className="mx-auto w-full max-w-sm bg-zinc-950">
            <DrawerHeader>
              <DrawerTitle>Add a new word</DrawerTitle>
              <DrawerDescription className="text-zinc-400">
                Enter a word and multiple definitions if needed.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-1 pb-0 space-y-4">
              <div>
                <Label htmlFor="word" className="text-white">
                  Word
                </Label>
                <Input
                  className="text-white"
                  id="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Enter a word"
                />
              </div>

              {/* Scrollable Definitions Section */}
              <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-lg">
                {definitions.map((def, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`definition-${index}`}
                        className="text-white"
                      >
                        Definition {index + 1}
                      </Label>
                      <button
                        onClick={() => deleteDefinitionField(index)}
                        className="p-1 cursor-pointer"
                      >
                        <TrashIcon size={15} color="red" />
                      </button>
                    </div>
                    <Textarea
                      className="text-white"
                      id={`definition-${index}`}
                      value={def}
                      onChange={(e) => updateDefinition(index, e.target.value)}
                      placeholder="Enter definition"
                    />
                  </div>
                ))}
              </div>

              <Button
                className="w-full text-white border border-zinc-700"
                variant="outline"
                onClick={addDefinitionField}
              >
                + Add Definition
              </Button>
            </div>
            <DrawerFooter>
              <div className="flex items-center gap-2 justify-between">
                <Button className="w-full" onClick={saveWord}>
                  Save word
                </Button>
                <DrawerClose asChild>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setWord("");
                      setDefinitions([]);
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
