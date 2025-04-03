import "./App.css";
import { useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import Game from "./components/Game";
import { Language } from "./components/Input";

const App = () => {
  const [language, setLanguage] = useState<Language | null>(null);

  return (
    <div>
      {!language ? (
        <LanguageSelector onSelect={(path) => setLanguage(path)} />
      ) : (
        <Game language={language} />
      )}
    </div>
  );
};

export default App;
