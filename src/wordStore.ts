const STORAGE_KEY = "words-log-data";

export interface Word {
  id: string;
  word: string;
  definition: string;
  sentences?: string[];
}

export default class WordStore {
  words: Map<string, Word>;
  saveTimeout: any;

  public constructor() {
    const ls_words_str = localStorage.getItem(STORAGE_KEY);
    if (ls_words_str) {
      const parsed_words = new Map<string, Word>(JSON.parse(ls_words_str));
      this.words = parsed_words;
    } else {
      this.words = new Map<string, Word>();
    }
    this.saveTimeout = 1000;
  }

  public editWord(newWord: Word) {
    if (this.words.has(newWord.id)) {
      this.words.delete(newWord.id);
      this.words.set(newWord.id, {
        id: newWord.id,
        word: newWord.word,
        definition: newWord.definition,
        sentences: newWord.sentences,
      });
    }
  }

  public getWords(): Word[] {
    return Array.from(this.words.values());
  }

  public addWord(
    id: string,
    word: string,
    definition: string,
    sentences: string[] = [],
  ): boolean {
    if (this.words.has(id)) return false;
    this.words.set(id, { id, word, definition, sentences });
    this.saveWords();
    return true;
  }

  public deleteWord(id: string) {
    if (!this.words.has(id)) return false;
    this.words.delete(id);
    this.saveWords();
    return true;
  }

  private saveWords() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(
      () =>
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(this.words.entries())),
        ),
      500,
    );
  }
}
