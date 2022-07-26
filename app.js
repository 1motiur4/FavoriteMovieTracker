const apiKey = "025578d5ab67135f221a9d7ce8559986";
const MAINURL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=" +
  apiKey +
  "&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHURL =
  "https://api.themoviedb.org/3/search/movie?&api_key=" + apiKey + "&query=";

var onFav = false;

// This grabs a movie by its ID -- for Favorites page
function showFavorites() {
  onFav = true;
  main.innerHTML = "";
  function favURL(movie_ID) {
    const url =
      "https://api.themoviedb.org/3/movie/" + movie_ID + "?&api_key=" + apiKey;
    return url;
  }

  favoritesArray.forEach((element) => {
    fetch(favURL(element))
      .then((res) => res.json())
      .then(function (data) {
        createPage(data);
      });
  });
}

// This grabs an array of movies
function getMoviesData(url) {
  onFav = false;
  main.innerHTML = "";
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      data.results.forEach((element) => {
        createPage(element);
      });
    });
}

// Array for storing favorites, which will get converted into a string to store in local storage
favoritesArray = [];
if (localStorage.getItem("favorites") == null) {
  localStorage.setItem("favorites", JSON.stringify(favoritesArray));
} else {
  favoritesArray = JSON.parse(localStorage.getItem("favorites"));
}

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

function createPage(movieData) {
  const image = document.createElement("img");
  const movieTitle = document.createElement("h2");

  movieTitle.innerHTML = `${movieData.title}`;
  image.src = IMGPATH + movieData.poster_path;

  const containerDiv = document.createElement("div");
  containerDiv.className = "container";
  containerDiv.appendChild(image);

  const overlayDiv = document.createElement("div");
  overlayDiv.className = "overlay";
  overlayDiv.appendChild(movieTitle);
  containerDiv.appendChild(overlayDiv);

  const addToFav = document.createElement("button");
  addToFav.className = "fav";

  if (favoritesArray.includes(movieData.id.toString())) {
    addToFav.innerText = "Remove";
    addToFav.onclick = removeFromFavF;
  } else {
    addToFav.innerText = "Favorite";
    addToFav.onclick = addToFavF;
  }

  containerDiv.appendChild(addToFav);
  main.appendChild(containerDiv);

  var movieId = `${movieData.id}`;
  function addToFavF() {
    favoritesArray.push(movieId);
    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
    showAlert(`${movieData.title} has been added to your favorites!`);
    addToFav.innerText = "Remove";
    addToFav.onclick = removeFromFavF;
  }
  function removeFromFavF() {
    var idToRemove = favoritesArray.findIndex(checkID);
    favoritesArray.splice(idToRemove, 1);
    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
    showAlert(`${movieData.title} has been removed from your favorites!`);
    addToFav.innerText = "Favorite";
    addToFav.onclick = addToFavF;
    if (onFav) {
      showFavorites();
    }
  }
  function checkID(ID) {
    return ID == movieId;
  }
}

function showAlert(message) {
  $(".alert").find(".message").text(message);
  $(".alert").fadeIn("slow", function () {
    setTimeout(function () {
      $(".alert").fadeOut("slow");
    }, 4000);
  });
}

getMoviesData(MAINURL);
