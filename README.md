![Logo](./public/logo%20-%20big.svg)

# 🔤Word Range Multilingual

A minimalist, multilingual word-guessing game built with **React**. Think of it as a mash-up between *Wordle* and a dictionary hunt!

🎯 **Guess the secret word** using alphabetical hints — is it before or after?

---

## 🌍 Features

- ✅ Multilingual support (English, Spanish, Swedish, Greek, French, German)
- 🎯 Clean gameplay logic using alphabetical order
- 🎉 Victory confetti and a forfeit option
- ⚡ Static site with GitHub Pages (no backend!)
- 🧩 Easily expandable with new languages or word lists

---

## 🚀 Try It Live

👉 [Play the Game](https://danielbenedi6.github.io/wordrange-multilingual)

---

## 🧠 How It Works

- On startup, users select a language.
- A random word is selected from the chosen language’s word list.
- Users guess by typing a word and pressing Enter.
- The game gives hints:
  - If guess is **before** or **after** the secret word (alphabetically).
  - If guess is **correct** → 🎉 confetti!
  - If guess is **invalid** → ❌ error message.

---

## 🌐 Multilingual Support

Languages are defined in a single file:  
`/public/assets/languages.json`

Example structure:
```json
[
  {
    "name": "English",
    "code": "en",
    "flag": "/assets/flags/en.svg",
    "wordlist": "/assets/wordlists/en.json",
    "i18n": {
      "user_input": "Type your guess here...",
      "word_not_found": "This word is not in the list. 😱 Try again!",
      "how_to": "## How to Play\n\nGuess the secret word...",
      "play_again": "Play again!",
      "forfeit_button": "Forfeit 😅",
      "forfeit_message": "You gave up!"
    }
  }
]
```

All labels and messages are stored inside the language object, making translation or adding new languages a breeze.

---
## 📚 Word Sources

The word lists used in this project come from high-quality linguistic corpora and frequency dictionaries to ensure both relevance and variety. Words were filtered to remove entries with dashes, apostrophes, spaces, commas, and limited to lengths between 3 and 12 characters.

| Language | Source | Description |
|----------|--------|-------------|
| :es: Spanish | [CORPES - CREA](https://www.rae.es/recursos/banco-de-datos/corpes) | A frequency dictionary based on the Real Academia Española's corpus. |
| :gb: English | [SCOWL - English Word Lists](http://wordlist.aspell.net/) (`english-words.70`) | A widely used collection of English words from multiple dictionaries. |
| 🇸🇪 Swedish | [OpenDictData - Folkets Lexikon](https://github.com/open-dict-data/folkets_sv_en) | A collaborative Swedish-English dictionary maintained by the community. |
| 🇬🇷: Greek | [KELLY Word List (CLARIN:EL)](https://clarin.ellak.gr) | A curated list of the most frequent modern Greek words used in learner resources. |
| :fr: French | [Lexique 3.83](http://www.lexique.org/) | A rich lexical database with frequency, phonology, and morphology data for French. |
| :de: German | [SUBTLEX-DE](http://crr.ugent.be/programs-data/subtitle-frequencies/subtlex-de) | Frequency-based word list compiled from film subtitles for German. |
|  🇰🇷 Korean | [Kimchi Reader](https://kimchi-reader.app/) | Frequencyy-based word list. |

## 🧩 Adding a New Language

1. Create a new word list JSON file in `public/assets/wordlists/xx.json`.
   - Format: an array of words (`["Apple", "Banana", "Cherry", ...]`)
   - Filter out short/long words, words with punctuation, etc.

2. Add a language entry to `languages.json`.

3. Add a flag icon to `/public/assets/flags/`.

4. Add the language to READNE and its source

5. Done! It will appear automatically in the language selector.

---

## ⚙️ Development & Build

### 🔧 Local Dev
```bash
npm install
npm run dev
```

### 🏗️ Build for Production
```bash
npm run build
```

---

## 📦 Deployment (GitHub Pages)

1. Add `homepage` field to `package.json`:
```json
"homepage": "https://yourusername.github.io/secret-word-game"
```

2. Build the project:
```bash
npm run build
```

3. Deploy using [gh-pages](https://www.npmjs.com/package/gh-pages):
```bash
npx gh-pages -d dist
```

GitHub will serve it at your configured homepage URL.

---

## 👥 Contributions Welcome!

This project is open source and open to improvements:
- Add new languages
- Improve the UI/UX
- Add more feedback during the game
- Suggest features or forks!

---

## 📄 License

MIT — free to use, modify, and share.

---

## 🙌 Acknowledgments

- Word lists from sources like **CORPES**, **SCOWL**, **KELLY**, **Lexique**, **SUBTLEX-DE**
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [react-confetti-explosion](https://github.com/belgattitude/react-confetti-explosion)
