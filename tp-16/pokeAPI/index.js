const lista = document.getElementById("lista");
const cargarMasBtn = document.getElementById("cargarMas");
const spinner = document.getElementById("spinner");
let offset = 0;
const limit = 151;

function cargarPokemon(offset, limit) {
    cargarMasBtn.style.display = "none";
    spinner.style.display = "block";
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const promesas = data.results.map(datos =>
            fetch(datos.url).then(res => res.json())
            );
            Promise.all(promesas)
        .then(pokemones => {
            pokemones.sort((a, b) => a.id - b.id);

            pokemones.forEach(pokemon => {
                const movimientos = pokemon.moves.slice(0, 4).map(mov => `<li>${mov.move.name}</li>`).join("");
                const tipos = pokemon.types.map(t => t.type.name).join(", ");
                const habilidades = pokemon.abilities.map(a => a.ability.name).join(", ");

            const mostrar = `
                <li>
                    <p class = "nombre"><strong>#${pokemon.id}</strong> ${pokemon.name}</p>
                    <div>
                        <button onclick="extra(this)">Ver más</button>
                        <div class="verMas">
                            <div class="imagen"><img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"></div>
                            <p><strong>Tipo:</strong> ${tipos}</p>
                            <p><strong>Habilidades:</strong> ${habilidades}</p>
                            <p><strong>Movimientos:</strong></p>
                            <ul>
                                ${movimientos}
                            </ul>
                        </div>
                    </div>
                </li>
                `;

            lista.innerHTML += mostrar;
            cargarMasBtn.style.display = "block";
            });
            spinner.style.display = "none";
        })
        .catch(error => {
            console.error("Error al obtener detalles de los Pokémon:", error);
            spinner.style.display = "none";
        });
    })
    .catch(error => {
            console.error("Error al obtener la lista de Pokémon:", error);
            spinner.style.display = "none";
        });
}

cargarPokemon(offset, 151);

cargarMasBtn.addEventListener("click", () => {
    offset += limit;
    cargarPokemon(offset, 50);
});

function extra(boton) {
    const verMasDiv = boton.nextElementSibling;
    verMasDiv.classList.toggle("activo");

    if (verMasDiv.classList.contains("activo")) {
        boton.textContent = "Ver menos";
    } else {
        boton.textContent = "Ver más";
    }
}

