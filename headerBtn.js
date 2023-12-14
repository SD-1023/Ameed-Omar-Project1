setTimeout(() => {
  // Check if the user has a preference stored in localStorage
  const storedMode = localStorage.getItem("mode");
  const body = document.body;

  const darkModeToggle = document.getElementById("darkModeToggle");
  const DarkModeText = document.getElementById("DarkModeText");

  console.log("storedMode is " + storedMode);

  // Set initial mode based on stored preference or default to light mode
  body.classList.toggle("dark-theme", storedMode == "dark-theme");

  darkModeToggle.onclick = function () {
    console.log("Inside dark/Light mode button");
    document.body.classList.toggle("dark-theme");

    // Save the current mode preference to localStorage
    const currentMode = body.classList.contains("dark-theme")
      ? "dark-theme"
      : "light";
    localStorage.setItem("mode", currentMode);
    console.log("Mode is :: " + currentMode);

    if (DarkModeText.innerText == "Dark Mode") {
      DarkModeText.innerHTML = "Light Mode";
    } else if ((DarkModeText.innerHTML = "Light Mode"))
      DarkModeText.innerText = "Dark Mode";
  };
}, 100);

/* Favouriets button */

function handleFavDisplay() {
  const favLayer = document.getElementById("favourites-container");
  console.log("inside fav btn and " + favLayer.style.display);
  if (favLayer.style.display == "block") {
    favLayer.style.display = "none";
  } else {
    favLayer.style.display = "block";
  }
}
/*
// Check if the user has a preference stored in localStorage
const favList = localStorage.getItem("favList");
const body = document.body;

console.log("storedMode is " + storedMode);
addToFavouriteBtn.onclick = function () {
  console.log("Inside add To Favourite button");
  render(cardAddedToFavList);

  // Save the current mode preference to localStorage
  const currentFavList = body.classList.innerText('favList')
  localStorage.setItem("favList", currentFavList);
  console.log("current Favourites List is :: " + currentFavList);
};
*/
