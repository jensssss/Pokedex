# 🧩 Pokémon Explorer

A simple web app that allows users to search, browse, and filter Pokémon using the [PokéAPI](https://pokeapi.co/). Built with vanilla JavaScript and fetch API, it includes features like search by name, type filter, modal with detailed stats, and pagination.

---

## 📸 Features

- 🔎 **Search Pokémon by name**
- 🧪 **Filter Pokémon by type**
- 📄 **Load more Pokémon with pagination**
- 🧬 **View detailed Pokémon info in a modal**
- 🔊 **Play Pokémon cries**
- 📦 **Preloads Pokémon names for fast filtering**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pokemon-explorer.git
cd pokemon-explorer
```

### 2. Open the App

Simply open `index.html` in your browser.

> No build tools, npm, or bundlers required.

---

## 🛠️ Code Overview

### 📁 Main Elements

- **`input`** — Text field for search.
- **`.load-more-btn`** — Loads the next batch of Pokémon.
- **`#typeFilter`** — Dropdown to filter Pokémon by type.
- **`.content`** — Container for displaying Pokémon cards.

### ⚙️ Main Functions

- `loadPokemon()` — Loads a batch of Pokémon.
- `loadType()` — Fetches all available types.
- `searchPokemonName()` — Direct name search using full fetch.
- `loadAllPokemonNames()` — Loads all names for instant partial search.
- `openModal(pokemonName)` — Opens a modal with Pokémon details.
- `showCard(pokemon, response)` — Generates the HTML for each card.

---

## 📚 How It Works

1. **Initial Load**  
   Loads the first 20 Pokémon and their types.

2. **Name Search**  
   - Press **Enter** or type to see instant results.
   - Fetches individual Pokémon data based on typed name.

3. **Type Filter**  
   - Selecting a type loads all Pokémon of that type.
   - Works independently from search.

4. **Details Modal**  
   - Shows image, type, stats, height/weight.
   - Includes a cry sound (OGG file).

---

## 📦 API Used

- [https://pokeapi.co/](https://pokeapi.co/)
  - `GET /pokemon`
  - `GET /type`
  - `GET /pokemon/{name}`

---

## 🧙‍♂️ To Do / Ideas

- ✅ Modal for detailed view
- ⬜ Add loading spinner
- ⬜ Add caching mechanism for faster loading
- ⬜ Responsive design improvements
- ⬜ Dark mode toggle

---

## 💡 Credits

- Pokémon data and assets provided by [PokéAPI](https://pokeapi.co/)
- UI logic and implementation by _[Your Name Here]_
