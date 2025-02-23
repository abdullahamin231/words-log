import hashIt from "./Hashing";

const STORAGE_KEY = "words-log-data";

export interface Word {
  id: string;
  word: string;
  definitions: string[];
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
        definitions: newWord.definitions,
      });
    }
  }

  public getWords(): Word[] {
    return Array.from(this.words.values());
  }

  public appendDefinition(word: string, altDefinition: string): boolean {
    const id = hashIt(word);
    if (!this.words.has(id)) return false;

    const currentWord = this.words.get(id);
    if (!currentWord) return false;

    currentWord.definitions.push(altDefinition);
    this.words.set(id, currentWord);
    this.saveWords();
    return true;
  }

  public addNewWord(word: string, definitions: string[]): boolean {
    const id = hashIt(word);
    if (this.words.has(id)) return false;
    this.words.set(id, { id, word, definitions });
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
