const lista = document.getElementById("lista");
let tipo = "Chinese";

function cargarComidas(tipo) {
    spinner.style.display = "block";
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${tipo}`)
        .then(response => response.json())
        .then(data => {
            const meals = data.meals;
            const detallesPromesas = meals.map(meal =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(response => response.json())
                .then(mealData => mealData.meals[0])
            );
            Promise.all(detallesPromesas)
        .then(mealsData => {
            mealsData.sort((a, b) => a.strMeal.localeCompare(b.strMeal));

            mealsData.forEach(mealInfo => {
                const instrucciones = mealInfo.strInstructions.replace(/step/gi, '<br>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Step</strong>');
                const ingredientes = [...Array(20).keys()]
                    .map(i => {
                        const ingrediente = mealInfo[`strIngredient${i + 1}`];
                        const medida = mealInfo[`strMeasure${i + 1}`];
                        return ingrediente && ingrediente.trim() !== "" ? `<li>${ingrediente} - ${medida}</li>` : '';
                    })
                    .join('');

                const contenido = `
                <li>
                <p class = "nombre"><strong>${mealInfo.strMeal}</strong></p>
                <button onclick="extra(this)">Ver más</button>
                <div class="verMas">
                    <p>Categoria: ${mealInfo.strCategory} - Area: ${mealInfo.strArea}</p>
                    <div class="imagen"><img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}"></div>
                    <p><strong>Instrucciones:</strong><br>${instrucciones}</p>
                    <p><strong>Ingredientes:</strong></p>
                    <ul>${ingredientes}</ul>
                </div>
                </li>
                `;

                lista.innerHTML += contenido;
            });
            spinner.style.display = "none";
        })
        .catch(error => {
            console.error("Error obteniendo detalles:", error);
            spinner.style.display = "none";
        });
        })
        .catch(error => {
            console.error("Error obteniendo la lista:", error);
            spinner.style.display = "none";
        });
}

cargarComidas(tipo);

function extra(boton) {
    const verMasDiv = boton.nextElementSibling;
    verMasDiv.classList.toggle("activo");
    boton.textContent = verMasDiv.classList.contains("activo") ? "Ver menos" : "Ver más";
}

document.querySelectorAll(".btn-pais").forEach(boton => {
    boton.addEventListener("click", () => {
        document.getElementById("titulo").textContent = `Comidas de ${boton.textContent}`;
        const tipo = boton.value;
        lista.innerHTML = "";
        cargarComidas(tipo);
    });
});
