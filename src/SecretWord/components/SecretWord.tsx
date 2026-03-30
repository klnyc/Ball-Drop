import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Trash } from "lucide-react";
import Modal from "../../common/components/Modal";
import { isRealWord, getSecretWord, getRelatedWords } from "../services";

const SecretWord = () => {
  const [secretWord, setSecretWord] = useState<string>("");
  const [relatedWords, setRelatedWords] = useState<string[]>([]);
  const [wordInput, setWord] = useState<string>("");
  const [wordGuesses, setWordGuesses] = useState<string[]>([]);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showLoseModal, setShowLoseModal] = useState<boolean>(false);
  const [showSecretModal, setShowSecretModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadSecretWord = async () => {
    setLoading(true);
    const secretWord = await getSecretWord();
    const relatedWordList = await getRelatedWords(secretWord);
    setSecretWord(secretWord);
    setRelatedWords(relatedWordList);
    setLoading(false);
  };

  useEffect(() => {
    loadSecretWord();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  };

  const validateWord = async (word: string): Promise<boolean> => {
    if (wordGuesses.length > 10) {
      setError("Maximum 10 guesses only. Please delete a word.");
      return false;
    }
    const string = word.trim();
    const exists = wordGuesses.some((word) => word === string);

    if (exists) {
      setError("Word has already been added.");
      return false;
    }

    const isReal = await isRealWord(string);

    if (!string || !isReal) {
      setError("Invalid word.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const isValid = await validateWord(wordInput);
    if (isValid) {
      setWordGuesses([...wordGuesses, wordInput]);
      setError("");
    }
    setWord("");
  };

  const deleteWord = (word: string) => {
    const newWords = wordGuesses.filter(
      (existingWord) => existingWord !== word,
    );
    setWordGuesses(newWords);
  };

  const handleGuesses = () => {
    const isCorrectGuess = wordGuesses.some((word) => word === secretWord);
    isCorrectGuess ? setShowWinModal(true) : setShowLoseModal(true);
  };

  const reset = () => {
    loadSecretWord();
    setWord("");
    setWordGuesses([]);
    setError("");
  };

  return (
    <div id="secret-word-container">
      <div className="secret-word-text">
        {loading ? ". . ." : " * ".repeat(secretWord.length)}
      </div>
      <div className="secret-word-clues">
        <div>CLUES</div>
        <div>{loading ? ". . ." : relatedWords.join(" ")}</div>
      </div>
      <div className="secret-word-error">{error || ""}</div>
      <div className="secret-word-guess-container">
        {wordGuesses.length ? (
          wordGuesses.map((word) => {
            return (
              <div key={word} className="secret-word-guess">
                {word}
                <Trash
                  size={12}
                  className="secret-word-delete-icon"
                  onClick={() => deleteWord(word)}
                />
              </div>
            );
          })
        ) : (
          <div className="secret-word-guess-empty-state">
            <div>The stars above represent the letters of the secret word.</div>
            <div>Add up to 10 words to guess the secret word.</div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="add-word-input"
          value={wordInput}
          onChange={handleChange}
        />
        <button type="submit">Add word</button>
        <button type="button" onClick={() => handleGuesses()}>
          Guess
        </button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <button type="button" onClick={() => setShowSecretModal(true)}>
          Reveal secret
        </button>
      </form>

      <Link to="/">
        <button className="back-to-playbox-button">Back to Playbox</button>
      </Link>

      {showWinModal && (
        <Modal
          text={`You win! The secret word is ${secretWord}.`}
          onClose={() => setShowWinModal(false)}
        />
      )}

      {showLoseModal && (
        <Modal
          text="You did not guess the secret word correctly. Try again."
          onClose={() => setShowLoseModal(false)}
        />
      )}

      {showSecretModal && (
        <Modal text={secretWord} onClose={() => setShowSecretModal(false)} />
      )}
    </div>
  );
};

export default SecretWord;
