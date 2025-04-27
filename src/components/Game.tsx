import { useState, useEffect } from "react";
import Markdown from 'react-markdown'
import { Language } from "./Input";
import confetti from 'canvas-confetti';

function capitalizeFirstLetter(val: string) {
    return val.charAt(0).toUpperCase() + val.slice(1);
}


const Game = ({ language }: { language: Language }) => {
    const [words, setWords] = useState<string[]>([]);
    const [wordsBefore, setWordsBefore] = useState<string[]>([]);
    const [wordsAfter, setWordsAfter] = useState<string[]>([]);
    const [randomWord, setRandomWord] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [endGame, setEndGame] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [forfeited, setForfeited] = useState<boolean>(false);

    useEffect(() => {
        const savedGame = localStorage.getItem('gameState-${language.code}');
        if(savedGame) {
            const state = JSON.parse(savedGame);
            setRandomWord(atob(state.randomWord));
            setWords(state.words);
            setWordsBefore(state.wordsBefore);
            setWordsAfter(state.wordsAfter);
            setEndGame(state.endGame);
        } else {
            fetch(process.env.PUBLIC_URL + language.wordlist)
                .then((res) => res.json())
                .then((data) => data.map((word:string) => capitalizeFirstLetter(word)))
                .then((data) => {
                    setWords(data);
                    setRandomWord(data[Math.floor(Math.random() * (data.length - 2)) + 1]);
    
                    setWordsBefore([data[0]])
                    setWordsAfter([data[data.length - 1]])
                })
                .catch((error) => console.error("Error loading words:", error));
        }
    }, [language.wordlist]);

    useEffect(() => {
        if (randomWord) { // Only save if the game has started
            const state = {
                randomWord: btoa(randomWord),
                words,
                wordsBefore,
                wordsAfter,
                endGame
            };
            localStorage.setItem('gameState-${language.code}', JSON.stringify(state));
        }
    }, [randomWord, words, wordsBefore, wordsAfter, endGame]);

    const resetGame = () => {
        localStorage.removeItem('gameState-${language.code}');
        window.location.reload();
    };

    const triggerConfetti = () => {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 },
        });
    };

    const handleForfeit = () => {
      setEndGame(true);
      setForfeited(true);
      // Optionally skip confetti
    };

    // Handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(capitalizeFirstLetter(event.target.value).trim());
        setErrorMessage(""); // Clear error when the user starts typing
    };

    // Handle "Enter" key press
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if(userInput === randomWord) { // Word is match
                setEndGame(true);
                triggerConfetti(); // 🎉 trigger confetti when winning
            } else if(!words.includes(userInput)) { // Word is not in list
                setErrorMessage(userInput + ": " + language.i18n.word_not_found); // Set error message
                setUserInput(""); // Clear input field after submitting
            } else { // Otherwise
                if(userInput.localeCompare(randomWord, language.code) < 0) {
                    setWordsBefore([...wordsBefore, userInput].sort((a, b) => a.localeCompare(b, language.code)))
                } else {
                    setWordsAfter([...wordsAfter, userInput].sort((a, b) => a.localeCompare(b, language.code)))
                }         
                setUserInput(""); // Clear input field after submitting
            }
        }
    };

    return (
        <div className="container">
            <div className="word-container">
                {wordsBefore.map((word, index) => (
                    <div key={index} className="word">
                        {word}
                    </div>
                ))}
            </div>
            { endGame? (
                <div className="word-container">
                    <div className="word correct-word">
                    {randomWord}
                    {forfeited && <span className="forfeit-label"> ({language.i18n.forfeit_message})</span>}
                    </div>
                    <button className="replay-button" onClick={() => resetGame()}>
                        {language.i18n.play_again}
                    </button>
                </div>
             ) : (
                <div className="input-container">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder={language.i18n.user_input}
                        className="input-field"
                    />
                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                </div>
            )}
            <div className="word-container">
                {wordsAfter.map((word, index) => (
                    <div key={index} className="word">
                        {word}
                    </div>
                ))}
            </div>
            <div  className="markdown-container">
                <Markdown>{language.i18n.how_to}</Markdown>
            </div>
            {!endGame && (
                <button className="forfeit-btn" onClick={handleForfeit}>
                    {language.i18n.forfeit_button}
                </button>
            )}
        </div>
    );
};

export default Game;
