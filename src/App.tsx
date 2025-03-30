import "./App.css";
import { useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import Game from "./components/Game";

const App = () => {
  const [wordlistPath, setWordlistPath] = useState<string | null>(null);

  return (
    <div>
      {!wordlistPath ? (
        <LanguageSelector onSelect={(path) => setWordlistPath(path)} />
      ) : (
        <Game wordlistPath={wordlistPath} />
      )}
    </div>
  );
};

export default App;
