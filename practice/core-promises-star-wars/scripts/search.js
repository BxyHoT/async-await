// Методы, которые могут пригодиться:
// starWars.searchCharacters(query),
// starWars.searchPlanets(query),
// starWars.searchSpecies(query).
// starWars.getCharactersById(id),
// starWars.getPlanetsById(id),
// starWars.getSpeciesById(id)

// Тут ваш код.
const searchButton = document.querySelector(".button");
const deleteButton = document.querySelector(".delete");
const searchFild = document.querySelector(".input");
const resultContainer = document.querySelector("#result-container");
const spinner = document.querySelector(".spinner");

searchButton.addEventListener("click", getSearchResult);
searchFild.addEventListener("keydown", (event) => {
  if (event.key === "Enter") getSearchResult();
});
deleteButton.addEventListener("click", closeSearchResult);

function getSearchResult() {
  closeSearchResult();
  if (searchFild.value === "") return;

  spinner.style.visibility = "visible";

  const selectSearchParam = document.querySelector("select");
  const isCharacter = selectSearchParam.value === "characters";
  const isPlanet = selectSearchParam.value === "planets";
  const isSpecies = selectSearchParam.value === "species";
  const resultTitle = document.querySelector("p");
  const resultList = document.querySelector("#content");

  if (isCharacter) {
    searchCharactersResult(searchFild.value);
  }
  if (isPlanet) {
  }
  if (isSpecies) {
  }

  function searchCharactersResult(searchParam) {
    const resultSearch = starWars
      .searchCharacters(searchParam)
      .then((character) => character.results[0]);

    resultSearch.then((results) => {
      if (!results) {
        return;
      }
      resultTitle.innerText = results.name;
    });

    resultSearch.then((results) => {
      if (!results) {
        setNotFound();
        return;
      }
      addListFromResult(results);
    });
    searchEnd();
  }

  function addListFromResult(object) {
    const resultText = document.createElement("ul");

    if (object)
      for (const [key, value] of Object.entries(object)) {
        const li = document.createElement("li");

        if (Array.isArray(value) && value.length > 1) {
          const ul = document.createElement("ul");

          value.forEach((value) => {
            const liFromArrayValue = document.createElement("li");
            liFromArrayValue.textContent = `${value}`;
            ul.appendChild(liFromArrayValue);
          });

          li.textContent = `${key}:`;
          li.appendChild(ul);
          resultText.appendChild(li);
          continue;
        }

        if (key === "homeworld") {
          const planetId = getPlanetIdByUrl(value);
          starWars.getPlanetsById(planetId).then((planet) => {
            li.textContent = `${key}: ${planet.name}`;
            resultText.appendChild(li);
          });
          continue;
        }

        li.textContent = `${key}: ${value}`;
        resultText.appendChild(li);
      }

    resultList.appendChild(resultText);
  }

  function setNotFound() {
    resultTitle.textContent = "Not found";
    resultList.textContent = "";
  }

  function searchEnd() {
    return setTimeout(() => {
      spinner.style.visibility = "hidden";
      resultContainer.style.visibility = "visible";
    }, 300);
  }

  function getPlanetIdByUrl(url) {
    const regex = /\/planets\/(\d+)\//;
    return url.match(regex)[1];
  }

  console.log(resultList);
}

function closeSearchResult() {
  resultContainer.style.visibility = "hidden";
}
