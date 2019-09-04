const baseLink = "https://petlatkea.dk/2019/students1991.json";
document.querySelector(".down").style.cursor = "pointer";
const template = document.querySelector("template").content;
const parent = document.querySelector("main");

function loadAll() {
  fetch(baseLink)
    .then(e => e.json())
    .then(show);
}

function show(projects) {
  // const firstName = document.querySelector(".firstname");
  // const lastName = document.querySelector(".lastname");

  projects.forEach(project => {
    const clone = template.cloneNode(true);
    let fullName = project.fullname.split(" ");
    let firstName = fullName[0];
    let lastName = fullName[1];
    console.log(fullName);

    clone.querySelector(".firstname").textContent = firstName;
    clone.querySelector(".lastname").textContent = lastName;
    clone.querySelector(".house").textContent = project.house;

    parent.appendChild(clone);
  });
}
loadAll();


// SORTBY
// function sortByFirst() {
//   document.querySelector(".down").style.transform = "rotate(-180deg)";
// }

// function sortByLast() {
//   document.querySelector(".down").style.transform = "rotate(-135deg)";
// }

// function sortByHouse() {

// };

// FILTERS

// RESET BUTTON