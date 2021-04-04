"use strict";

const seriesContainer = document.querySelector(".js-series-container");
const inputElement = document.querySelector(".js-input");
const formElement = document.querySelector(".js-form");
const buttonElement = document.querySelector(".js-button");
const ulFavorites = document.querySelector(".js-favorites");

let series = [];
let favorites = [];

// API

function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      series = [];
      for (const serie of data) {
        let title = serie.show.name;
        let img = serie.show.image;
        let id = serie.show.id;
        series.push({
          id: id,
          img: img,
          title: title,
        });
      }
      renderSeries();
      renderFavorites();
      listenSerieEvents();
    });
}
buttonElement.addEventListener("click", getDataFromApi);

// LOCAL STORAGE
function setInLocalStorage() {
  const stringFav = JSON.stringify(favorites); // convierte en string el array
  localStorage.setItem("favorites", stringFav);
}

// TRAER DATOS LS vs LLAMAR API
function getFromLocalStorage() {
  const localStorageFav = localStorage.getItem("favorites");
  if (localStorageFav === null) {
    getDataFromApi();
  } else {
    const arrayFav = JSON.parse(localStorageFav); // convierte en array de nuevo
    favorites = arrayFav;
  }
}
//FILTRADO POR CADA TECLA PRESIONADA
function handleFilter() {
  renderFavorites();
  getDataFromApi();
  renderSeries();
}
inputElement.addEventListener("keyup", handleFilter);

// RENDER
function renderSeries() {
  let htmlCode = "";
  for (const serie of series) {
    htmlCode += `<li class="item1 js-favorite" id="${serie.id}">`;
    if (serie.img === null) {
      htmlCode +=
        '<img class="item2" src="https://via.placeholder.com/210x295/ffffff/666666/?"/>';
    } else {
      htmlCode += `<img class="item2" src="${serie.img.medium}"/>`;
    }
    htmlCode += `<h3>${serie.title}</h3>`;
    htmlCode += "</li>";
  }
  seriesContainer.innerHTML = htmlCode;
  listenSerieEvents();
}

// LISTEN SERIES EVENTS

function listenSerieEvents() {
  const serieElements = document.querySelectorAll(".js-favorite");
  for (const serieElement of serieElements) {
    serieElement.addEventListener("click", handleSerie);
  }
}

// Retorna ID de la serie seleccionada

function handleSerie(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const favoritesFoundIndex = favorites.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });
  if (favoritesFoundIndex === -1) {
    const serieFound = series.find(function (serie) {
      return serie.id === clickedSerieId;
    });
    favorites.push(serieFound);
  } else {
    favorites.splice(favoritesFoundIndex, 1);
  }
  setInLocalStorage();
  renderFavorites();
}

// FAVORITES te devuelve la serie seleccionada como FAV
function isFavoriteSerie(series) {
  return !!favorites.find((favorite) => favorite.show.id === series.show.id);
}

// RENDER FAVORITES
function renderFavorites() {
  let htmlFav = "";
  for (const serie of favorites) {
    htmlFav += `<li class="item1 js-favorite js-clicked" id="${serie.id}">`;
    htmlFav += `<img class="item2 js-clicked" src="${serie.img.medium}"/>`;
    htmlFav += `<h3 class="js-clicked">${serie.title}</h3>`;
    htmlFav += "</li>";
    if (isFavoriteSerie) {
      ulFavorites.classList.add("js-clicked");
    } else {
    }
  }
  ulFavorites.innerHTML = htmlFav;
  listenSerieEvents();
}

// PREVENT DEFAULT
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener("submit", handleForm);

// ARRANCAR LA PÁGINA
getFromLocalStorage();
