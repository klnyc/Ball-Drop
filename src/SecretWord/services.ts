export const isRealWord = async (word: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const getSecretWord = async (): Promise<string> => {
  try {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const letterIndex = Math.floor(Math.random() * alphabet.length);
    const letter = alphabet[letterIndex];

    const response = await fetch(
      `https://api.datamuse.com/words?sp=${letter}*`,
    );

    const data = await response.json();
    const wordIndex = Math.floor(Math.random() * data.length);

    return data[wordIndex].word;
  } catch (error) {
    return "error";
  }
};

export const getRelatedWords = async (word: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?ml=${word}&max=10`,
    );
    const data = await response.json();
    return data.map(
      (wordObject: { [word: string]: string }) => wordObject.word,
    );
  } catch (error) {
    return [];
  }
};
