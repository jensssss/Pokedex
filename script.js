let content = document.querySelector('.content'); // Container to display Pokémon cards
const inpt = document.querySelector('input'); // Input field for search
const typeFilter = document.querySelector('#typeFilter'); // Dropdown filter for Pokémon type
const loadMoreBtn = document.querySelector('.load-more-btn'); // Button to load more Pokémon
let card = '';
let offset = 0; // Initial offset for pagination
let limit = 20; // Number of Pokémon to load per request
let allPokemonNames = []; // Will hold all Pokémon names and URLs

// When user presses 'Enter', run the search by name function
inpt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPokemonName();
})

// When user types in the search bar, filter visible Pokémon cards
inpt.addEventListener('input', async () => {
    if(inpt.value === '') return
    const keyword = inpt.value.toLowerCase();
    content.innerHTML = '';
    loadMoreBtn.style.display = 'none';

    if (keyword.length < 1) return;

    const filtered = allPokemonNames.filter(p => p.name.includes(keyword));
    const limited = filtered.slice(0, 500); // Limit number of results to avoid lag (e.g., show top 200 matches)

    for (const p of limited) {
        const res = await fetch(p.url);
        const data = await res.json();
        content.innerHTML += showCard(p, data);
    }
});


// Function to load all Pokémon types into the dropdown
function loadType() {
    fetch('https://pokeapi.co/api/v2/type/')
        .then(response => response.json())
        .then(response => {
            const typeList = response.results;
            typeList.forEach(type => {
                let option = document.createElement('option');
                option.innerHTML = type.name;
                if(option.innerHTML !== 'stellar' && option.innerHTML !== 'unknown'){
                    option.classList.add(`type-${type.name}`);
                    typeFilter.appendChild(option); // Add each type as an option
                }
            });
        });
}

// When user selects a different type from the dropdown
typeFilter.addEventListener('change', function () {
    loadMoreBtn.style.display = 'none'; // Hide the "Load More" button
    content.innerHTML = ''; // Clear the current cards
    inpt.value = ''; // Reset the search input
    let type = this.value; // Get the selected type
    if(!type) return loadPokemonAllType();
    fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then(response => response.json())
        .then(response => {
            let pokemonList = response.pokemon; // Get all Pokémon with that type
            pokemonList.forEach(p => {
                fetch(p.pokemon.url)
                    .then(response => response.json())
                    .then(response => {
                        content.innerHTML += showCard(response, response); // Display Pokémon card
                    });
            });
        });
});

function loadPokemonAllType(){
    loadMoreBtn.style.display = 'block'; // Show "Load More" button
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=500`)
        .then(response => response.json())
        .then(response => {
            const pokemonList = response.results;
            pokemonList.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(response => {
                        content.innerHTML += showCard(pokemon, response); // Display Pokémon cards
                    });
            });
            offset += limit; // Update offset for next batch
        });
}

// Function to search Pokémon by name (triggered on Enter key)
function searchPokemonName() {
    if(inpt.value === '') return
    content.innerHTML = ''; // Clear current content
    loadMoreBtn.style.display = 'none'; // Hide "Load More" button
    const keyWord = inpt.value.toLowerCase(); // Get search keyword

    fetch(`https://pokeapi.co/api/v2/pokemon/${keyWord}`)
        .then(response => {
            if (!response.ok) throw new Error('Not found');
            return response.json();
        })
        .then(response => {
            content.innerHTML = showCard(response, response); // Show the searched Pokémon
        })
        .catch(error => {
            content.innerHTML = `<p style="color:red; text-align:center;">Pokémon not found</p>`; // Error message
        });
}

// Function to load a batch of Pokémon (pagination)
function loadPokemon() {
    loadMoreBtn.style.display = 'block'; // Show "Load More" button
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(response => {
            const pokemonList = response.results;
            pokemonList.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(response => {
                        content.innerHTML += showCard(pokemon, response); // Display Pokémon cards
                    });
            });
            offset += limit; // Update offset for next batch
        });
}

function loadAllPokemonNames() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10000')
        .then(response => response.json())
        .then(data => {
            allPokemonNames = data.results; // [{name, url}, ...]
        });
}


// Function to open the modal box and show detailed info
function openModal(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const modal = document.getElementById("pokemonModal");
            const modalBody = document.getElementById("modalBody");

            let typeList = data.types.map(t => `<span class="type-${t.type.name}">${t.type.name}</span>`).join(' ');

            const imgUrl =
                data.sprites.other?.['official-artwork']?.front_default ||
                data.sprites.other?.dream_world?.front_default ||
                data.sprites.front_default || 'fallback.png';
            
            let type = data.types[0].type.name;

            modalBody.innerHTML = `
                <img src="${imgUrl}" class="img-fluid mb-3" alt="${data.name}">
                
                <div class="info-block mb-4">
                    <div class="info-row">
                        <span class="info-label">Height:</span>
                        <span class="info-label-value">${data.height / 10}'</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Weight:</span>
                        <span class="info-label-value">${data.weight / 10} lbs</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Type:</span>
                        <span class="info-label-value"> ${typeList}</span>
                    </div>
                    <div class="info-row mt-3">
                        <span class="info-label">Cry:</span>
                        <span class="info-label-value"> 
                            <button onclick="document.getElementById('pokemonCry').play()">🔊 Play</button>
                        </span>
                        <audio id="pokemonCry" src="https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg"></audio>
                    </div>
                </div>

                <p class="mt-3"><strong>Base Stats:</strong></p>
                <div class="stats">
                    ${data.stats.map(stat => `
                        <div class="stat-row mb-2">
                            <span class="stat-name">${stat.stat.name.toUpperCase()}</span>
                            <div class="stat-bar-container">
                                <div class="stat-bar type-${type}" style="width: ${stat.base_stat / 2}%"></div>
                            </div>
                            <span class="stat-value">${stat.base_stat}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            modal.style.display = "block"; // Show the modal
        });
}

// Function to close the modal
function closeModal() {
    document.getElementById("pokemonModal").style.display = "none"; // Hide modal
}

// Function to generate a Pokémon card element
function showCard(pokemon, response) { 
    let typeSpans = '';
    response.types.forEach(t => {
        const type = t.type.name;
        typeSpans += `<span class="type-${type}">${type}</span>`; // Add span for each type
    });

    let imageUrl =
        response.sprites.other.dream_world.front_default ||
        response.sprites.other['official-artwork'].front_default ||
        response.sprites.front_default || 
        'fallback.png'; // Use fallback if no image available

    return `
    <div class="card" onclick="openModal('${pokemon.name}')">
        <img src="${imageUrl}" alt="">
        <p>#${response.id}</p> 
        <p class="name">${pokemon.name.toUpperCase()}</p>
        <p class="type">${typeSpans}</p>
        <p class="detail-btn" onclick="openModal('${pokemon.name}')">Details</p>
    </div>`;
}

// Load Pokémon and types when the page first loads
loadPokemon(); // Load the first batch of Pokémon
loadType(); // Load available Pokémon types into the filter dropdown
loadAllPokemonNames();