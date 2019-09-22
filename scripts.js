"use strict";

document.addEventListener("DOMContentLoaded", start);

// Global variables
let studentListContainer = document.querySelector(".main-template");
const mainListContainer = document.querySelector(".student-container");
let houseFilter;
let jsonStudents;
let firstspace;
let lastspace;
let activeArray;
let sortBy;
let list;
let bloodType;
const expelledStudents = [];
const inqSquad = [];

const students = {
  fullname: "-fullname-",
  firstname: "-firstname-",
  lastname: "-lastname-",
  house: "-house-",
  blood: "-blood-"
};

//Activate eventlisteners

function start() {
  document.querySelector(".all").addEventListener("click", filterAll);
  document.querySelector(".Ravenclaw").addEventListener("click", filterRavenclaw);
  document.querySelector(".Hufflepuff").addEventListener("click", filterHufflepuff);
  document.querySelector(".Gryffindor").addEventListener("click", filterGryffindor);
  document.querySelector(".Slytherin").addEventListener("click", filterSlytherin);

  document.querySelector(".sortbyfirst").addEventListener("click", sortByFirstname);
  document.querySelector(".sortbylast").addEventListener("click", sortByLastname);
  document.querySelector(".sortbyhouse").addEventListener("click", sortByHouse);

  getJson();
}

// Fetch JSON data

async function getJson() {
  let jsonData = await fetch("https://petlatkea.dk/2019/hogwarts/students.json");
  jsonStudents = await jsonData.json();
  let bloodData = await fetch(
    "https://petlatkea.dk/2019/hogwarts/families.json"
  );
  bloodType = await bloodData.json();
  prepareObjects(jsonStudents);
}

// Clean JSON data and assign it to the placeholders

function prepareObjects(jsonStudents) {
  const arrayOfStudents = [];

  jsonStudents.forEach(student => {
    firstspace = student.fullname.indexOf(" ");
    lastspace = student.fullname.lastIndexOf(" ");
    let firstname = student.fullname.slice(0, firstspace);
    let lastname = student.fullname.slice(lastspace + 1);

    const Student = Object.create(students);

    Student.fullname = student.fullname;
    Student.firstname = firstname;
    Student.lastname = lastname;
    Student.house = student.house;

    arrayOfStudents.push(Student);
  });
  activeArray = arrayOfStudents;

  // Declare my user info and add it to the array
  const myInfo = {
    fullname: "Martin Gatski",
    firstname: "Martin",
    lastname: "Gatski",
    blood: "Pure blood",
    house: "Gryffindor"
  };

  arrayOfStudents.push(myInfo);
  bloodStatus();
  filterList();
}

//Declare and call the filters
function filterAll() {
  houseFilter = "all";
  filterList();
}

function filterRavenclaw() {
  houseFilter = "Ravenclaw";
  filterList();
}

function filterHufflepuff() {
  houseFilter = "Hufflepuff";
  filterList();
}

function filterGryffindor() {
  houseFilter = "Gryffindor";
  filterList();
}

function filterSlytherin() {
  houseFilter = "Slytherin";
  filterList();
}

function onlyAll(person) {
  return person.house === "all";
}

function onlyRavenclaw(person) {
  return person.house === "Ravenclaw";
}

function onlyHufflepuff(person) {
  return person.house === "Hufflepuff";
}

function onlyGryffindor(person) {
  return person.house === "Gryffindor";
}

function onlySlytherin(person) {
  return person.house === "Slytherin";
}

function filterList() {
  list = activeArray;

  if (houseFilter === "all") {
    list = activeArray;
  } else if (houseFilter === "Ravenclaw") {
    list = activeArray.filter(onlyRavenclaw);
  } else if (houseFilter === "Hufflepuff") {
    list = activeArray.filter(onlyHufflepuff);
  } else if (houseFilter === "Gryffindor") {
    list = activeArray.filter(onlyGryffindor);
  } else if (houseFilter === "Slytherin") {
    list = activeArray.filter(onlySlytherin);
  }
  displayList(list);

  sortStudents();
}

// Sorting
function sortByFirstname() {
  sortBy = "firstname";
  filterList();
}

function sortByLastname() {
  sortBy = "lastname";
  filterList();
}

function sortByHouse() {
  sortBy = "house";
  filterList();
}

function sortStudents() {
  if (sortBy === "firstname") {
    activeArray.sort(function (a, b) {
      if (a.firstname < b.firstname) {
        return -1;
      } else {
        return 1;
      }
    });

  }
  if (sortBy === "lastname") {
    activeArray.sort(function (a, b) {
      if (a.lastname < b.lastname) {
        return -1;
      } else {
        return 1;
      }
    });

  }
  if (sortBy === "house") {
    activeArray.sort(function (a, b) {
      if (a.house < b.house) {
        return -1;
      } else {
        return 1;
      }
    });

  }
}


//Display list after filters and sorting
function displayList(list) {
  document.querySelector(".student-container").textContent = " ";

  list.forEach(person => {
    let clone = studentListContainer.cloneNode(true).content;
    clone.querySelector(".firstname").textContent = person.firstname;
    clone.querySelector(".lastname").textContent = person.lastname;
    clone.querySelector(".house").textContent = person.house;
    clone.querySelector(".remove").addEventListener("click", function () {
      expellStudent(person);
    });
    clone.querySelector(".inqsquad-btn").addEventListener("click", function () {
      addInqSquad(person);
    })
    clone.querySelector(".prefect-btn").addEventListener("click", function () {
      addPrefect(person);
    })
    clone.querySelector(".firstname").addEventListener("click", () => {
      openModal(person);
    });
    clone.querySelector(".lastname").addEventListener("click", () => {
      openModal(person);
    });
    mainListContainer.appendChild(clone);
  });

  //Counter for users in different houses
  const counter = {
    Gryffindor: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
    Slytherin: 0,
  };
  activeArray.forEach(student => {
    counter[student.house]++;
  });

  document.querySelector(".countGryffindor").innerHTML = "( " + counter.Gryffindor + " )";
  document.querySelector(".countRavenclaw").innerHTML = "( " + counter.Ravenclaw + " )";
  document.querySelector(".countHufflepuff").innerHTML = "( " + counter.Hufflepuff + " )";
  document.querySelector(".countSlytherin").innerHTML = "( " + counter.Slytherin + " )";
  document.querySelector(".countAll").innerHTML = "( " + activeArray.length + " )";
}

//Display modal and inject relevant data
function openModal(student) {
  let name = student.fullname.split(" ");
  let firstName = name[0];
  let lastName = name[name.length - 1];
  let firstLetterFirstName = firstName.substring(0, 1);
  let imageName = lastName + "_" + firstLetterFirstName + ".png";
  imageName = imageName.toLowerCase();

  document.querySelector(".modal-bg").classList.add("showmodal");
  modal.querySelector(".modal-name").textContent =
    student.fullname;
  modal.querySelector(".modal-house").textContent = student.house;
  modal.querySelector(".modal-img").src = "images/" + imageName;
  modal.querySelector(".modal-bloodstatus").textContent = student.blood;
  modal.querySelector(".modal-bg").addEventListener("click", closeModal);

  if (student.house === "Gryffindor") {
    document.querySelector("#modal-content").style.backgroundImage = "url('images/gryffindor-bg.jpg')";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#modal-content").style.backgroundImage = "url('images/ravenclaw-bg.jpg')";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#modal-content").style.backgroundImage = "url('images/hufflebuff-bg.jpg')";
  } else if (student.house === "Slytherin") {
    document.querySelector("#modal-content").style.backgroundImage = "url('images/slytherin-bg.jpg')";
  }
}

function closeModal() {
  document.querySelector(".modal-bg").classList.remove("showmodal");
}


// EXPELL STUDENT
function expellStudent(student) {

  let pos = activeArray.indexOf(student);

  if (student.lastname === "Gatski") {
    alert("Not today!");
  } else {
    activeArray.splice(pos, 1);
    expelledStudents.push(student);
    document.querySelector(".countExpelled").textContent = "( " + expelledStudents.length + " )";

    list = expelledStudents;

    displayExpelledStudent(list);
  }
  filterList();
}

function displayExpelledStudent(list) {
  console.log(list);
  document.querySelector(".expelledTextContainer").textContent = "";

  list.forEach(expelledStudent => {
    let li = document.createElement("li");

    li.textContent = expelledStudent.fullname;

    document.querySelector(".expelledTextContainer").appendChild(li);
  });
}

// BLOOD STATUS----------------------------------------------------------------


function bloodStatus() {
  activeArray.forEach(student => {
    bloodType.half.forEach(name => {
      if (name === student.lastname) {
        student.blood = "Half blood";
      }
    });
    bloodType.pure.forEach(name => {
      if ((name === student.lastname && student.blood) === "-blood-") {
        student.blood = "Pure blood";
      }
    });
    if (student.blood === "-blood-") {
      student.blood = "Muggle blood";
    }
  });
}

// INQUSITORIAL SQUAD--------------------------------------------------------

function addInqSquad(student) {
  list = inqSquad;

  if (student.house === "Slytherin") {
    inqSquad.push(student);
    displayInqList(list);
    inqSquadHack();
  } else if (student.blood === "Pure blood") {
    inqSquad.push(student);
    displayInqList(list);
    inqSquadHack(list);
  } else {
    alert("This student cannot be added!");
  }
};


function displayInqList(list) {
  document.querySelector(".inqsquadcontainer2").textContent = "";

  list.forEach(inqStud => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.dataset.name = inqStud.firstname;
    button.classList.add("removesquad-btn");

    li.textContent = inqStud.fullname + " - " + inqStud.house;
    button.textContent = "Remove";
    document.querySelector(".inqsquadcontainer2").appendChild(li);
    document.querySelector(".inqsquadcontainer2").appendChild(button);
  });

  removeInqSquadButton(list);
}

function removeInqSquadButton(list) {
  document.querySelectorAll(".removesquad-btn").forEach(removebtn => {
    removebtn.addEventListener("click", removeInqSquad);
  });
}

function removeInqSquad(list) {
  let selectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfInqSquad(selectedStudent);
  inqSquad.splice(selectedStudentIndex, 1);
  displayInqList(inqSquad);
}

function findIndexOfInqSquad(name) {
  return inqSquad.findIndex(stud => stud.firstname === name);
}

//Deletes last object in array after 5 seconds
function inqSquadHack() {
  setTimeout(function () {
    inqSquad.pop();
    displayInqList(inqSquad);
  }, 5000);
};


//ADD PREFECTS----------------------------------------------------------------------

let gryffindorPrefectArr = [];
let hufflepuffPrefectArr = [];
let ravenclawPrefectArr = [];
let slytherinPrefectArr = [];

function addPrefect(student) {


  if (student.house === "Gryffindor") {
    addGryffindorPrefects(student);
  } else if (student.house === "Hufflepuff") {
    addHufflepuffPrefects(student);
  } else if (student.house === "Slytherin") {
    addSlytherinPrefects(student);
  } else {
    addRavenclawPrefects(student);
  }
}

// Gryffindor prefects

function addGryffindorPrefects(student) {

  if (gryffindorPrefectArr.length < 2) {
    gryffindorPrefectArr.push(student);

    list = gryffindorPrefectArr;

    displayGryffindorPrefects(list);
  } else {
    alert("There can only be 2 prefects per house!");
  }
}

function displayGryffindorPrefects(list) {
  document.querySelector(".GprefectTextContainer").textContent = "";

  list.forEach(prefectStudent => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.dataset.name = prefectStudent.firstname;
    button.classList.add("removeprefect-btn");

    li.textContent = prefectStudent.fullname;
    button.textContent = "Remove";

    document.querySelector(".GprefectTextContainer").appendChild(li);
    document.querySelector(".GprefectTextContainer").appendChild(button);
  });
  removePrefectButton(list);
}

function removePrefectButton(list) {
  document.querySelectorAll(".removeprefect-btn").forEach(removebtn => {
    removebtn.addEventListener("click", removePrefect);
  });
}

function removePrefect(list) {
  let slectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfPrefect(slectedStudent);
  gryffindorPrefectArr.splice(selectedStudentIndex, 1);
  displayGryffindorPrefects(gryffindorPrefectArr);
}

function findIndexOfPrefect(name) {
  return gryffindorPrefectArr.findIndex(stud => stud.firstname === name);
}

// Hufflepuff prefects

function addHufflepuffPrefects(student) {

  if (hufflepuffPrefectArr.length < 2) {
    hufflepuffPrefectArr.push(student);

    list = hufflepuffPrefectArr;

    displayHufflepuffPrefects(list);
  } else {
    alert("There can only be 2 prefects per house!");
  }
}

function displayHufflepuffPrefects(list) {
  document.querySelector(".HprefectTextContainer").textContent = "";

  list.forEach(prefectStudent => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.dataset.name = prefectStudent.firstname;
    button.classList.add("removeprefect-btn");

    li.textContent = prefectStudent.fullname;
    button.textContent = "Remove";

    document.querySelector(".HprefectTextContainer").appendChild(li);
    document.querySelector(".HprefectTextContainer").appendChild(button);
  });
  removePrefectButton(list);
}

function removePrefectButton(list) {
  document.querySelectorAll(".removeprefect-btn").forEach(removebtn => {
    removebtn.addEventListener("click", removePrefect);
  });
}

function removePrefect(list) {
  let slectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfPrefect(slectedStudent);
  hufflepuffPrefectArr.splice(selectedStudentIndex, 1);
  displayHufflepuffPrefects(hufflepuffPrefectArr);
}

function findIndexOfPrefect(name) {
  return hufflepuffPrefectArr.findIndex(stud => stud.firstname === name);
}

// Slytherin prefects

function addSlytherinPrefects(student) {

  if (slytherinPrefectArr.length < 2) {
    slytherinPrefectArr.push(student);

    list = slytherinPrefectArr;

    displaySlytherinPrefects(list);
  } else {
    alert("There can only be 2 prefects per house!");
  }
}

function displaySlytherinPrefects(list) {
  document.querySelector(".SprefectTextContainer").textContent = "";

  list.forEach(prefectStudent => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.dataset.name = prefectStudent.firstname;
    button.classList.add("removeprefect-btn");

    li.textContent = prefectStudent.fullname;
    button.textContent = "Remove";

    document.querySelector(".SprefectTextContainer").appendChild(li);
    document.querySelector(".SprefectTextContainer").appendChild(button);
  });
  removePrefectButton(list);
}

function removePrefectButton(list) {
  document.querySelectorAll(".removeprefect-btn").forEach(removebtn => {
    removebtn.addEventListener("click", removePrefect);
  });
}

function removePrefect(list) {
  let slectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfPrefect(slectedStudent);
  slytherinPrefectArr.splice(selectedStudentIndex, 1);
  displaySlytherinPrefects(slytherinPrefectArr);
}

function findIndexOfPrefect(name) {
  return slytherinPrefectArr.findIndex(stud => stud.firstname === name);
}

// Ravenclaw prefects

function addRavenclawPrefects(student) {

  if (ravenclawPrefectArr.length < 2) {
    ravenclawPrefectArr.push(student);

    list = ravenclawPrefectArr;

    displayRavenclawPrefects(list);
  } else {
    alert("There can only be 2 prefects per house!");
  }
}

function displayRavenclawPrefects(list) {
  document.querySelector(".RprefectTextContainer").textContent = "";

  list.forEach(prefectStudent => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.dataset.name = prefectStudent.firstname;
    button.classList.add("removeprefect-btn");

    li.textContent = prefectStudent.fullname;
    button.textContent = "Remove";

    document.querySelector(".RprefectTextContainer").appendChild(li);
    document.querySelector(".RprefectTextContainer").appendChild(button);
  });
  removePrefectButton(list);
}

function removePrefectButton(list) {
  document.querySelectorAll(".removeprefect-btn").forEach(removebtn => {
    removebtn.addEventListener("click", removePrefect);
  });
}

function removePrefect(list) {
  let slectedStudent = this.dataset.name;
  let selectedStudentIndex = findIndexOfPrefect(slectedStudent);
  ravenclawPrefectArr.splice(selectedStudentIndex, 1);
  displayRavenclawPrefects(ravenclawPrefectArr);
}

function findIndexOfPrefect(name) {
  return ravenclawPrefectArr.findIndex(stud => stud.firstname === name);
}