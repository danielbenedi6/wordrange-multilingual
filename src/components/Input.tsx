export interface i18n {
    user_input: string;
    word_not_found: string;
    how_to: string;
    play_again: string;
    number_attempts: string;
    forfeit_button: string;
    forfeit_message: string;
}

export interface Language {
    name: string;
    code: string;
    flag: string;
    wordlist: string;
    i18n: i18n;
}