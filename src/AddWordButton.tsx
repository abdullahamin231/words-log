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

interface AddWordButtonProps {
  newWord: string;
  setNewWord: React.Dispatch<React.SetStateAction<string>>;
  newDefinition: string;
  setNewDefinition: React.Dispatch<React.SetStateAction<string>>;
  handleAddWord: () => void;
}
export default function AddWordButton({
  newWord,
  setNewWord,
  newDefinition,
  setNewDefinition,
  handleAddWord,
}: AddWordButtonProps) {
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
                Enter a word and its definition below.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-1 pb-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="word" className="text-white">
                    Word
                  </Label>
                  <Input
                    className="text-white"
                    id="word"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Enter a word"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="definition" className="text-white">
                    Definition
                  </Label>
                  <Textarea
                    className="text-white"
                    id="definition"
                    value={newDefinition}
                    onChange={(e) => setNewDefinition(e.target.value)}
                    placeholder="Enter the definition"
                  />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleAddWord}>Save word</Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
