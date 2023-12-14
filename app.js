// Fetch Data from API
function fetchData() {
  const apiUrl = "https://tap-web-1.herokuapp.com/topics/list";
  const loadingIndicator = document.getElementById("loadingIndicator");

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
      document.getElementById("num-topics").innerText =
        "Something went wrong. Web topics failed to load.";
    });
}

let dataList = [];
let dynamicCategories = [];

// This is the function that render cards in viweport
function render(data) {
  //if find data, hide loading inductor
  if (data) {
    loadingIndicator.style.display = "none";
    // Display nums of topics found on data fethced bt API
    document.getElementById("num-topics").innerText =
      '"' + data.length + '"' + " Web Topics Found";

    // First:  You should ensure that past draws are deleted
    const cardTemplate = document.getElementById("card-template");
    try {
      for (const el of cardTemplate.parentElement.querySelectorAll(
        "a.card-container"
      )) {
        el.remove();
      }
    } catch {
      console.log("No cards to remove");
    }
    // Sec:  You can start drawing using a none dispaly template

    //Create node for each card in data
    data.forEach((item) => {
      const newNode = cardTemplate.content.cloneNode(true);
      newNode.querySelector("#course-field").innerText = item.category;
      newNode.querySelector("#course-title").innerText = item.topic;
      newNode.querySelector("#course-img").src = "./Logos/" + item.image;
      newNode.querySelector("#course-img").alt = item.image;
      newNode.querySelector("#author-name").innerText = item.name;
      newNode.querySelector("#card-container").id = item.id;
      newNode.querySelector("#starsIcons").innerHTML = drawStarsIcon(
        item.rating
      );
      //Appened a new card for parent
      cardTemplate.parentElement.append(newNode);
    });
    // Set the href for each card based on its ID
    document.querySelectorAll("#card-container").forEach(function (card) {
      card.addEventListener("click", function () {
        // Get the card's ID
        var cardId = card.id;
        console.log("This card ID is: " + cardId);
        // Generate the corresponding href based on the card's ID
        var href = "./details.html/" + cardId;
        // Navigate to the generated href
        window.location.href = href;
      });
    });
  } // No data found
  else {
    loadingIndicator.style.display = "none";
  }
}

fetchData().then((data) => {
  // Get Search bar element
  const searchInput = document.getElementById("searchInput");
  // Get sort dropdown element
  const mySortDropdown = document.getElementById("mySortDropdown");

  dataList = data;
  render(dataList);

  // Event listener for input changes Search
  searchInput.addEventListener("input", handleSearch);

  function handleSearch() {
    const searchTerm = searchInput.value;

    // Filter data based on the search term
    const filteredDataBySearch = FilterdDataList.filter((item) => {
      console.log("handle search return: ");
      if (item.topic.toLowerCase().includes(searchTerm.toLowerCase()))
        return true;
      else return false;
    });
    render(filteredDataBySearch);
  }
  var SortedDataList = dataList;
  var FilterdDataList = dataList;
  // Add an event listener for the 'change' event in Sort Dropdown
  mySortDropdown.addEventListener("change", function () {
    searchInput.value = "";
    // Get the selected option's value
    const selectedOption = mySortDropdown.value;
    // console.log("Sort By Selected Option2:" + mySortDropdown[1].textContent);
    // Defult(option1): Sort them according ID
    if (selectedOption == "Default") {
      SortedDataList = FilterdDataList.sort((a, b) => a.id - b.id);
      render(SortedDataList);
      SortedDataList = dataList;
    }
    // Topic Name(option2)
    else if (selectedOption == "Topic-Title") {
      SortedDataList = FilterdDataList.sort((a, b) => {
        // Convert names to uppercase for case-insensitive sorting
        const nameA = a.topic.toUpperCase();
        const nameB = b.topic.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      render(SortedDataList);
      //Author Name (option3)
    } else if (selectedOption == "Author-Name") {
      SortedDataList = FilterdDataList.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      render(SortedDataList);
    }
  });

  //Fill dynamic category array
  dataList.forEach((item) => {
    if (!dynamicCategories.includes(item.category))
      dynamicCategories.push(item.category);
  });
  console.log("category num is : " + dynamicCategories.length);
  console.log(dynamicCategories);

  // Get filter dropdown element
  const myFilterdDropdown = document.getElementById("myFilterdDropdown");

  // Loop through the array and create option elements
  dynamicCategories.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item; // Set the value (you can set it to something else if needed)
    optionElement.textContent = item; // Set the text content

    // Append the option element to the dropdown
    myFilterdDropdown.appendChild(optionElement);
  });
  myFilterdDropdown.addEventListener("change", function () {
    searchInput.value = "";
    SortedDataList = dataList;
    // Get the selected option's value
    const selectedOption = myFilterdDropdown.value;
    console.log("Filterd By: :" + selectedOption);
    if (selectedOption == "Default") {
      FilterdDataList = dataList;
      render(dataList);
      return;
    }
    FilterdDataList = SortedDataList.filter(
      (item) => item.category == selectedOption
    );
    render(FilterdDataList);
  });
});
function redirectToLinkbyCardId(cardId) {
  console.log("Clicked card ID: " + cardId);
  var redirectLink = `./details.html?id=${cardId}`;
  window.location.href = redirectLink;
}

function drawStarsIcon(rating) {
  let consideredRating = Math.round(rating);
  let stars = "";
  for (i = 0; i < consideredRating; i++) {
    stars += ` <ion-icon class="star-icon" name="star" style="margin-left="4px"></ion-icon>`;
  }
  if (rating - (consideredRating - 1) > 0.5)
    stars += ` <ion-icon class="star-icon" name="star-outline"></ion-icon>`;
  if (consideredRating == 3)
    stars += ` <ion-icon class="star-icon" name="star-outline"></ion-icon>`;
  return stars;
}
