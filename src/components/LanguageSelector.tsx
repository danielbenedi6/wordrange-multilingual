import { useState, useEffect } from "react";

interface Language {
    name: string;
    code: string;
    flag: string;
    wordlist: string;
}

const LanguageSelector = ({ onSelect }: { onSelect: (wordlist: string) => void }) => {
    const [languages, setLanguages] = useState<Language[]>([]);
  
    useEffect(() => {
      fetch(process.env.PUBLIC_URL+"/assets/languages.json")
        .then((res) => res.json())
        .then((data) => setLanguages(data))
        .catch((error) => console.error("Error loading languages:", error));
    }, []);
  
    return (
      <div className="home-container">
        <h2 className="title">Select Your Language</h2>
        <div className="button-container">
          {languages.map((lang) => (
            <button key={lang.code} className="language-btn" onClick={() => onSelect(lang.wordlist)}>
              <img
                src={process.env.PUBLIC_URL + lang.flag}
                alt={lang.name}
                className="language-flag"
              />
              <p className="language-name">{lang.name}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default LanguageSelector;