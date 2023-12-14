function fetchData() {
  var urlParams = new URLSearchParams(window.location.search);

  // Get the value of a id query parameter
  var idParam = urlParams.get("id");
  console.log("ID Parameter:", idParam);
  const apiUrl = "https://tap-web-1.herokuapp.com/topics/details/" + idParam;
  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched successfully:", data);

      return data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error.message);
    });
}
var cardData = [];
fetchData().then((data) => {
  cardData = data;
  const errorMsgDataFaild = document.getElementById("errorMsgDataFaild");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const allDetailsContent = document.getElementById("allDetailsContent");

  if (!cardData) {
    console.log("No Data Found");
    errorMsgDataFaild.style.display = "block";
    loadingIndicator.style.display = "none";
    allDetailsContent.style.display = "none";
  } else {
    loadingIndicator.style.display = "none";
    allDetailsContent.style.display = "block";

    const category = document.getElementById("category");
    const topic = document.getElementById("topic");
    const description = document.getElementById("description");
    const author = document.getElementById("author");
    const image = document.getElementById("image");
    const topic_card = document.getElementById("topic_card");
    const topic_table = document.getElementById("topic_table");

    category.innerText = data.category;
    topic.innerText = data.topic;
    description.innerText = data.description;
    author.innerText = data.name;
    image.src = "./Logos/" + data.image;
    topic_card.innerText = data.topic;
    topic_table.innerText = data.topic + " Sub Topics";

    // Get the table body element
    const tableBody = document.querySelector("#dynamic-table");

    // Access the array property
    const mySubTopics = data.subtopics;

    for (let i = 0; i < mySubTopics.length; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `<td><ion-icon name="checkmark-circle-outline"
                        class="checkmark-circle-outline"
                        ></ion-icon> ${mySubTopics[i]}</td> `;
      console.log("table items should be" + mySubTopics[i]);
      tableBody.appendChild(row);
    }
    // Iterate through the data and create table rows
    //   mySubTopics.forEach((item) => {
    //     console.log("Table Topic :  " + item);
    //   });
  }
});
var cardAddedToFavList = {};
function render(data) {
  // First:  you should ensure that past draws are deleted
  const favTemplate = document.getElementById("fav-template");
  if (Object.keys(data).length === 0) {
    console.log("No Data find in array");
    try {
      for (const el of favTemplate.parentElement.querySelectorAll(
        "div.favs-card"
      )) {
        el.remove();
        console.log("We romve the node");
        return;
      }
    } catch {
      console.log("No cards to remove");
    }
  }
  console.log("Start init new node");
  // Sec:  you can start init and drawing using a none dispaly tamplate
  const newFavNode = favTemplate.content.cloneNode(true);
  newFavNode.querySelector("#favTopic").innerText = data.topic;
  newFavNode.querySelector("#favImg").src = "./Logos/" + data.image;
  favTemplate.parentElement.append(newFavNode);
}

document.addEventListener("DOMContentLoaded", function () {
  var addToFavouriteBtn = document.getElementById("addToFavouriteBtn");
  var addToFavText = document.getElementById("addToFavText");

  if (addToFavouriteBtn !== null) {
    // Add a click event listener to the button
    addToFavouriteBtn.addEventListener("click", function () {
      // Your code to run when the button is clicked
      console.log("Favourites Button clicked!");

      // cardAddedToFav = True;
      if (addToFavText.innerText == "Add to Favourites") {
        cardAddedToFavList["topic"] = cardData.topic;
        cardAddedToFavList["image"] = cardData.image;
        console.log("card added is : " + cardAddedToFavList["topic"]);
        render(cardAddedToFavList);
        document.getElementById("AddToFavHeart").style.display = "none";
        addToFavText.innerText = "Remove from Favourites";
      } else if (addToFavText.innerText == "Remove from Favourites") {
        addToFavText.innerText = "Add to Favourites";
        document.getElementById("AddToFavHeart").style.display = "block";

        cardAddedToFavList = {};
        console.log(
          "card Removed From Fav List is " + cardAddedToFavList["topic"]
        );
        render(cardAddedToFavList);
      }
    });
  } else {
    console.error("Button not found!");
  }
});
