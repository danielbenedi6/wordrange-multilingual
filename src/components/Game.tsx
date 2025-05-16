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
    const [indexBefore, setIndexBefore] = useState<number>(0);
    const [wordsAfter, setWordsAfter] = useState<string[]>([]);
    const [indexAfter, setIndexAfter] = useState<number>(0);
    const [randomWord, setRandomWord] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [endGame, setEndGame] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [forfeited, setForfeited] = useState<boolean>(false);

    useEffect(() => {
        const savedGame = localStorage.getItem('gameState-'+language.code);
        if(savedGame) {
            const state = JSON.parse(savedGame);
            setRandomWord(atob(state.randomWord));
            setWords(state.words);
            setWordsBefore(state.wordsBefore);
            setIndexBefore(state.indexBefore);
            setWordsAfter(state.wordsAfter);
            setIndexAfter(state.indexAfter);
        } else {
            fetch(process.env.PUBLIC_URL + language.wordlist)
                .then((res) => res.json())
                .then((data) => data.map((word:string) => capitalizeFirstLetter(word)))
                .then((data) => {
                    setWords(data);
                    setRandomWord(data[Math.floor(Math.random() * (data.length - 2)) + 1]);
    
                    setWordsBefore([data[0]])
                    setIndexBefore(0)
                    setWordsAfter([data[data.length - 1]])
                    setIndexAfter(data.length - 1)
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
                indexBefore,
                wordsAfter,
                indexAfter
            };
            localStorage.setItem('gameState-'+language.code, JSON.stringify(state));
        }
    }, [randomWord, words, wordsBefore, indexBefore, wordsAfter, indexAfter]);

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
      localStorage.removeItem('gameState-'+language.code);
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
                localStorage.removeItem('gameState-'+language.code);
            } else {
                var index = words.indexOf(userInput)
                if( index === -1) { // Word is not in list
                    setErrorMessage(userInput + ": " + language.i18n.word_not_found); // Set error message
                    setUserInput(""); // Clear input field after submitting
                } else { // Otherwise
                    if(userInput.localeCompare(randomWord, language.code) < 0) {
                        setWordsBefore([...wordsBefore, userInput].sort((a, b) => a.localeCompare(b, language.code)))
                        setIndexBefore((prev) => Math.max(prev, index)); 
                    } else {
                        setWordsAfter([...wordsAfter, userInput].sort((a, b) => a.localeCompare(b, language.code)))
                        setIndexAfter((prev) => Math.min(prev, index));
                    }         
                    setUserInput(""); // Clear input field after submitting
                }
            }
        }
    };

    const handleClick = () => {
        window.open("https://" + language.code + ".wiktionary.com/wiki/" + randomWord.toLocaleLowerCase(), "_blank", "noopener,noreferrer")
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
                    <div onClick={handleClick} className="word correct-word">
                    {randomWord}
                    <span className="forfeit-label"> {language.i18n.number_attempts.replace("%d", (wordsAfter.length + wordsBefore.length - 2).toString() )}</span>
                    {forfeited && <span className="forfeit-label"> ({language.i18n.forfeit_message})</span>}
                    </div>
                    <button className="replay-button" onClick={() => window.location.reload()}>
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
                        placeholder={language.i18n.user_input.replace("%d", (indexAfter - indexBefore - 1).toString())}
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
