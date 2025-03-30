import { useState, useEffect } from "react";

const Game = ({ wordlistPath }: { wordlistPath: string }) => {
    const [words, setWords] = useState<string[]>([]);
    const [wordsBefore, setWordsBefore] = useState<string[]>([]);
    const [wordsAfter, setWordsAfter] = useState<string[]>([]);
    const [randomWord, setRandomWord] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [endGame, setEndGame] = useState<boolean>(false);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + wordlistPath)
            .then((res) => res.json())
            .then((data) => {
                setWords(data);
                setRandomWord(data[Math.floor(Math.random() * (data.length - 2)) + 1]);

                setWordsBefore([data[0]])
                setWordsAfter([data[data.length - 1]])
            })
            .catch((error) => console.error("Error loading words:", error));
    }, [wordlistPath]);

    // Handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    // Handle "Enter" key press
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if(userInput === randomWord) { // Word is match
                console.log("Found!");
                setEndGame(true);
            } else if(!words.includes(userInput)) { // Word is not in list
                console.log("Not in list!");
                setUserInput(""); // Clear input field after submitting
            } else { // Otherwise
                console.log("Keep trying");     
                if(userInput < randomWord) {
                    setWordsBefore([...wordsBefore, userInput].sort())
                } else {
                    setWordsAfter([...wordsAfter, userInput].sort())
                }         
                setUserInput(""); // Clear input field after submitting
            }
        }
    };

    return (
        <div className="container">
            <div className="word-container">
                {wordsBefore.map((word, index) => (
                    <div className="word">
                        {word}
                    </div>
                ))}
            </div>
            { endGame? (
                <div className="word-container">
                    <div className="word correct-word">
                        {randomWord}
                    </div>
                </div>
             ) : (
                <div className="input-container">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your guess here..."
                        className="input-field"
                    />
                </div>
            )}
            <div className="word-container">
                {wordsAfter.map((word, index) => (
                    <div className="word">
                        {word}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Game;
