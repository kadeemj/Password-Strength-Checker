# Password Strength Checker

A minimal, client-side password strength checker. Type a password and get an instant rating — nothing is sent to a server.

**Live locally:** open [`index.html`](index.html) in a browser, or serve the folder with any static file server.

## Features

- Instant strength rating: Weak / Fair / Good / Strong
- Checklist for length, lowercase, uppercase, numbers, and symbols
- Flags common passwords, keyboard sequences, and repeated characters
- Show / hide password toggle
- Fully private — evaluation runs only in your browser

## Usage

```bash
# Option A — open the file directly
open index.html

# Option B — local static server
npx serve .
```

Then open the URL shown (use **http://**, not https://).

## How scoring works

Strength is computed from:

1. **Length** — bonuses at 8+, 12+, and 16+ characters (counted as Unicode characters, not UTF-16 units)  
2. **Character variety** — lowercase, uppercase, digits, symbols  
3. **Penalties** — common passwords, sequential runs (`abc`, `123`, `qwerty`), and repeated characters  

**Strong** requires at least 12 characters; shorter passwords top out at Good even with full variety.

The result maps to four levels and updates the meter and tip on every keystroke.

## Project structure

```
.
├── index.html   # UI
├── styles.css   # Layout and strength colors
├── app.js       # Scoring logic
├── README.md
└── LICENSE
```

No build step, frameworks, or dependencies.

## Privacy

Passwords never leave the page. There are no analytics, APIs, or network calls related to the password itself (only Google Fonts for typography).

## License

[MIT](LICENSE)
