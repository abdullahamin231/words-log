import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Word {
	text: string
	definition: string
}

export default function Page() {
	const [words, setWords] = useState<Word[]>([])
	const [newWord, setNewWord] = useState("")
	const [newDefinition, setNewDefinition] = useState("")

	useEffect(() => {
		const ls_words_unparsed = localStorage.getItem("data");
		if (ls_words_unparsed) {
			const parsed_words: Word[] = JSON.parse(ls_words_unparsed);
			setWords(parsed_words);
		}
	}, []);

	const handleAddWord = () => {
		if (newWord && newDefinition) {
			setWords([...words, { text: newWord, definition: newDefinition }])
			localStorage.removeItem("data");
			localStorage.setItem("data", JSON.stringify([...words, { text: newWord, definition: newDefinition }]));
			setNewWord("")
			setNewDefinition("")
		}
	}

	return (
		<div className="min-h-screen bg-zinc-950">
			<div className="container mx-auto px-4 py-8 text-white">
				<h1 className="text-4xl font-bold text-center mb-8">words.log</h1>

				{/* Add Word Drawer */}
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
											<Label htmlFor="word" className="text-white">Word</Label>
											<Input
												className="text-white"
												id="word"
												value={newWord}
												onChange={(e) => setNewWord(e.target.value)}
												placeholder="Enter a word"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="definition" className="text-white">Definition</Label>
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

				{/* Word Grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-20">
					{words && words.length > 0 && words.map((word, index) => (
						<Drawer key={index}>
							<DrawerTrigger asChild>
								<button
									className="py-2 px-4 border border-zinc-800 rounded-lg hover:bg-zinc-800/90 transition-colors text-center bg-zinc-900"
									style={{ width: `${Math.max(100, word.text.length * 15)}px` }}
								>
									{word.text}
								</button>
							</DrawerTrigger>
							<DrawerContent className="dark bg-zinc-950 border-zinc-800">
								<div className="mx-auto w-full max-w-sm bg-zinc-950">
									<DrawerHeader>
										<DrawerTitle>{word.text}</DrawerTitle>
										<DrawerDescription className="text-zinc-400">{word.definition}</DrawerDescription>
									</DrawerHeader>
									<DrawerFooter>
										<DrawerClose asChild>
											<Button variant="ghost" className="border-zinc-600 text-white border">Close</Button>
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
	)
}


