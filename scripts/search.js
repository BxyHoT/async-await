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
const selectSearchParam = document.querySelector("select");
//results
const resultContainer = document.querySelector("#result-container");
const spinner = document.querySelector(".spinner");
const resultTitle = document.querySelector("p");
const resultList = document.querySelector("#content");
// search by id
const searchButtonById = document.querySelectorAll(".button")[1];
const searchFildById = document.querySelectorAll(".input")[1];
const selectSearchParamById = document.querySelectorAll("select")[1];

searchButton.addEventListener("click", getReult);
searchFild.addEventListener("keydown", (event) => {
  if (event.key === "Enter") getReult();
});
deleteButton.addEventListener("click", closeSearchResult);

//by id
searchButtonById.addEventListener("click", getReultById);
searchFildById.addEventListener("keydown", (event) => {
  if (event.key === "Enter") getReultById();
});

async function getSearchResult() {
  spinner.style.visibility = "visible";

  const isCharacter = selectSearchParam.value === "characters";
  const isPlanet = selectSearchParam.value === "planets";
  const isSpecies = selectSearchParam.value === "species";

  if (isCharacter) {
    let result = await starWars.searchCharacters(searchFild.value);
    result = result.results;

    if (checkEmptyResult(result)) return;

    result = result[0];

    addResultToHTML(result);
  }

  if (isPlanet) {
    let result = await starWars.searchPlanets(searchFild.value);
    result = result.results;

    if (checkEmptyResult(result)) return;

    result = result[0];

    addResultToHTML(result);
  }

  if (isSpecies) {
    let result = await starWars.searchSpecies(searchFild.value);
    result = result.results;

    if (checkEmptyResult(result)) return;

    result = result[0];

    addResultToHTML(result);
  }
}

async function getSearchReultById() {
  spinner.style.visibility = "visible";

  const isCharacterById = selectSearchParamById.value === "characters";
  const isPlanetById = selectSearchParamById.value === "planets";
  const isSpeciesById = selectSearchParamById.value === "species";

  if (isCharacterById) {
    let result = await starWars.getCharactersById(Number(searchFildById.value));
    if (result.detail === "Not found") {
      setEmptyResult();
      endSearch();
      return;
    }
    addResultToHTML(result);
  }
  if (isPlanetById) {
    let result = await starWars.getPlanetsById(Number(searchFildById.value));
    if (result.detail === "Not found") {
      setEmptyResult();
      endSearch();
      return;
    }
    addResultToHTML(result);
  }
  if (isSpeciesById) {
    let result = await starWars.getSpeciesById(Number(searchFildById.value));
    if (result.detail === "Not found") {
      setEmptyResult();
      endSearch();
      return;
    }
    addResultToHTML(result);
  }
}

function closeSearchResult() {
  resultContainer.style.visibility = "hidden";
  resultTitle.innerHTML = "";
  resultList.innerHTML = "";
}

function setEmptyResult() {
  resultTitle.textContent = "Not found";
  resultList.textContent = "";
}

function endSearch() {
  setTimeout(() => {
    spinner.style.visibility = "hidden";
    resultContainer.style.visibility = "visible";
  }, 300);
}

async function addResultToHTML(result) {
  resultTitle.textContent = result.name;
  const ul = document.createElement("ul");

  for (const [key, value] of Object.entries(result)) {
    const li = document.createElement("li");

    if (Array.isArray(value) && value.length > 1) {
      li.textContent = `${key}:`;
      const ulList = document.createElement("ul");

      if (key === "films") {
        value.forEach(async (filmUrl) => {
          const liList = document.createElement("li");
          let film = await starWars.getFilmsById(getFilmIdByURL(filmUrl));
          liList.textContent = film.title;
          ulList.appendChild(liList);
        });
      } else {
        value.forEach((item) => {
          const liList = document.createElement("li");
          liList.textContent = item;
          ulList.appendChild(liList);
        });
      }

      li.appendChild(ulList);
      ul.appendChild(li);
      continue;
    }

    if (key === "species") {
      let species = await starWars.getSpeciesById(getSpeciesIdByURL(value));
      li.textContent = `${key}: ${species.name}`;
      ul.appendChild(li);
      continue;
    }

    if (key === "homeworld" && value !== null) {
      let planet = await starWars.getPlanetsById(getPlanetIdByURL(value));
      li.textContent = `${key}: ${planet.name}`;
      ul.appendChild(li);
      continue;
    }

    li.textContent = `${key}: ${value}`;
    ul.appendChild(li);
  }

  resultList.appendChild(ul);
  endSearch();
}

function getSpeciesIdByURL(url) {
  const regex = /species\/(\d+)\/?/;
  return url[0].match(regex)[1];
}

function getFilmIdByURL(url) {
  const regex = /.*\/(\d+)\/?/;
  return url.match(regex)[1];
}

function getPlanetIdByURL(url) {
  const regex = /\/planets\/(\d+)\//;
  return url.match(regex)[1];
}

function checkEmptyResult(respose) {
  if (respose.length < 1) {
    setEmptyResult();
    endSearch();
    return true;
  }
  return false;
}

function getReult() {
  if (searchFild.value === "" || !isNaN(searchFild.value)) {
    closeSearchResult();
    return;
  }
  closeSearchResult();
  getSearchResult();
}

function getReultById() {
  if (searchFildById.value === "" || isNaN(Number(searchFildById.value))) {
    closeSearchResult();
    return;
  }
  closeSearchResult();
  getSearchReultById();
}
