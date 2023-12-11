function fetchData() {
  const apiUrl = "https://tap-web-1.herokuapp.com/topics/list";

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
let dataList = [];
let dynamicCategories = [];

// This is the function that draw cards in viweport
function render(data) {
  // First:  you should ensure that past draws are deleted
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
  // Sec:  you can start drawing using a none dispaly tamplate
  // Display nums of topics found
  document.getElementById("num-topics").innerText =
    '"' + data.length + '"' + " Web Topics Found";
  data.forEach((item) => {
    const newNode = cardTemplate.content.cloneNode(true);
    newNode.querySelector("#course-field").innerText = item.category;
    newNode.querySelector("#course-title").innerText = item.topic;
    newNode.querySelector("#course-img").src = "./Logos/" + item.image;
    newNode.querySelector("#course-img").alt = item.image;
    newNode.querySelector("#author-name").innerText = item.name;
    cardTemplate.parentElement.append(newNode);
  });
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
    const filteredData = FilterdDataList.filter((item) => {
      console.log("handle search return: ");
      if (item.topic.toLowerCase().includes(searchTerm.toLowerCase()))
        return true;
      else return false;
    });
    render(filteredData);
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
        const nameA = a.topic.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
        const nameB = b.topic.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0; // Names are equal
      });
      render(SortedDataList);
      //Author Name (option3)
    } else if (selectedOption == "Author-Name") {
      SortedDataList = FilterdDataList.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0; // Names are equal
      });
      // console.log(dataList);
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
