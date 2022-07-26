const apiUrl =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=025578d5ab67135f221a9d7ce8559986&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=025578d5ab67135f221a9d7ce8559986&query=";

function searchById(movie_ID) {
  const url =
    "https://api.themoviedb.org/3/movie/" +
    movie_ID +
    "?&api_key=025578d5ab67135f221a9d7ce8559986";
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      return data.title;
    });
}

var favArray = [];
if (localStorage.getItem("favorites") == null) {
  localStorage.setItem("favorites", JSON.stringify(favArray));
} else {
  favArray = JSON.parse(localStorage.getItem("favorites"));
}

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

function showMovies(url) {
  main.innerHTML = "";
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      data.results.forEach((element) => {
        const image = document.createElement("img");
        const movieTitle = document.createElement("h2");

        movieTitle.innerHTML = `${element.title}`;
        image.src = IMGPATH + element.poster_path;

        const containerDiv = document.createElement("div");
        containerDiv.className = "container";
        containerDiv.appendChild(image);

        const overlayDiv = document.createElement("div");
        overlayDiv.className = "overlay";
        overlayDiv.appendChild(movieTitle);
        containerDiv.appendChild(overlayDiv);

        const addToFav = document.createElement("button");
        addToFav.className = "fav";

        if (favArray.includes(element.id.toString())) {
          addToFav.innerText = "Remove";
          addToFav.onclick = removeFromFavF;
        } else {
          addToFav.innerText = "Favorite";
          addToFav.onclick = addToFavF;
        }
        containerDiv.appendChild(addToFav);

        main.appendChild(containerDiv);

        var movieId = `${element.id}`;
        function addToFavF() {
          favArray.push(movieId);
          localStorage.setItem("favorites", JSON.stringify(favArray));
          showAlert(`${element.title} has been added to your favorites!`);
          addToFav.innerText = "Remove";
          addToFav.onclick = removeFromFavF;
        }
        function removeFromFavF() {
          var idToRemove = favArray.findIndex(checkID);
          favArray.splice(idToRemove, 1);
          localStorage.setItem("favorites", JSON.stringify(favArray));
          showAlert(`${element.title} has been removed from your favorites!`);
          addToFav.innerText = "Favorite";
          addToFav.onclick = addToFavF;
        }
        function checkID(ID) {
          return ID == movieId;
        }
      });
    });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  main.innerHTML = "";
  const searchTerm = search.value;

  if (searchTerm) {
    showMovies(SEARCHAPI + searchTerm);
    search.value = "";
  }
});

showMovies(apiUrl);

function favURL(movie_ID) {
  const url =
    "https://api.themoviedb.org/3/movie/" +
    movie_ID +
    "?&api_key=025578d5ab67135f221a9d7ce8559986";
  return url;
}

function showFavorites() {
  if (localStorage.getItem("favorites") == null) {
    alert("You have no favorites!");
  } else {
    main.innerHTML = "";
    favArray.forEach((element) => {
      fetch(favURL(element))
        .then((res) => res.json())
        .then(function (data) {
          const image = document.createElement("img");
          const movieTitle = document.createElement("h2");

          movieTitle.innerHTML = `${data.title}`;
          image.src = IMGPATH + data.poster_path;

          const containerDiv = document.createElement("div");
          containerDiv.className = "container";
          containerDiv.appendChild(image);

          const overlayDiv = document.createElement("div");
          overlayDiv.className = "overlay";
          overlayDiv.appendChild(movieTitle);
          containerDiv.appendChild(overlayDiv);

          const addToFav = document.createElement("button");
          addToFav.className = "fav";

          if (favArray.includes(data.id.toString())) {
            addToFav.innerText = "Remove";
            addToFav.onclick = removeFromFavF;
          } else {
            addToFav.innerText = "Favorite";
            addToFav.onclick = addToFavF;
          }
          containerDiv.appendChild(addToFav);

          main.appendChild(containerDiv);

          var movieId = `${data.id}`;
          function addToFavF() {
            favArray.push(movieId);
            localStorage.setItem("favorites", JSON.stringify(favArray));
            showAlert(`${data.title} has been added to your favorites!`);
            addToFav.innerText = "Remove";
            addToFav.onclick = removeFromFavF;
          }
          function removeFromFavF() {
            var idToRemove = favArray.findIndex(checkID);
            favArray.splice(idToRemove, 1);
            localStorage.setItem("favorites", JSON.stringify(favArray));
            showAlert(`${data.title} has been removed from your favorites!`);
            addToFav.innerText = "Favorite";
            addToFav.onclick = addToFavF;
            showFavorites();
          }
          function checkID(ID) {
            return ID == movieId;
          }
        });
    });
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
