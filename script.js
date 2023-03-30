"use strict";

const newAttendeeFormElement = document.querySelector("#add-new");

const newAttendeeFirstname = newAttendeeFormElement.querySelector(
  "#new-attendee-firstname"
);
const newAttendeeLastname = newAttendeeFormElement.querySelector(
  "#new-attendee-lastname"
);
const newAttendeeAge =
  newAttendeeFormElement.querySelector("#new-attendee-age");

const newAttendeeAddButton =
  newAttendeeFormElement.querySelector("#add-new-attendee");

/************************************************************************* */

const editAttendeeFormElement = document.querySelector("#edit");

const editAttendeeFirstname = editAttendeeFormElement.querySelector(
  "#edit-attendee-firstname"
);
const editAttendeeLastname = editAttendeeFormElement.querySelector(
  "#edit-attendee-lastname"
);
const editAttendeeAge =
  editAttendeeFormElement.querySelector("#edit-attendee-age");

const editAttendeeID = editAttendeeFormElement.querySelector("#attendee-id");

const editAttendeeButton =
  editAttendeeFormElement.querySelector("#edit-attendee");

/************************************************************************* */

const deleteAllButton = document.querySelector("#delete-all");

const listElement = document.querySelector("#attendee-list");

const state = {
  attendees: [],
};

function getAllAttendees() {
  fetch("http://localhost:3000/attendees")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      state.attendees = data;
      console.log(state.attendees);
      render();
    });
}

function createListEntry(
  attendeeID,
  attendeeFirstName,
  attendeeLastName,
  attendeeAge
) {
  const li = document.createElement("li");

  const editLi = document.createElement("button");
  editLi.innerText = "edit";

  editLi.addEventListener("click", () => {
    editAttendeeFirstname.value = attendeeFirstName;
    editAttendeeLastname.value = attendeeLastName;
    editAttendeeAge.value = attendeeAge;
    editAttendeeID.value = attendeeID;
  });

  const deleteLi = document.createElement("button");
  deleteLi.innerText = "x";

  deleteLi.addEventListener("click", () => {
    fetch("http://localhost:3000/attendees/" + attendeeID, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => getAllAttendees());
  });

  const liText = document.createTextNode(
    attendeeFirstName + " " + attendeeLastName + ", (" + attendeeAge + ")"
  );

  li.append(editLi, deleteLi, liText);

  return li;
}

function render() {
  listElement.innerHTML = "";

  for (let attendee of state.attendees) {
    if (
      attendee.firstname &&
      typeof attendee.firstname === "string" &&
      attendee.firstname.length > 1
    ) {
      const entry = createListEntry(
        attendee.id,
        attendee.firstname,
        attendee.lastname,
        attendee.age
      );
      listElement.appendChild(entry);
    }
  }
}

//Add new Attendee ***************************************************************
function addAttendeeToApi() {
  const newAttendeeFirstname = newAttendeeFormElement.querySelector(
    "#new-attendee-firstname"
  );
  const newAttendeeLastname = newAttendeeFormElement.querySelector(
    "#new-attendee-lastname"
  );
  const newAttendeeAge =
    newAttendeeFormElement.querySelector("#new-attendee-age");

  const newAttendee = {
    firstname: newAttendeeFirstname.value,
    lastname: newAttendeeLastname.value,
    age: newAttendeeAge.value,
  };

  if (
    newAttendeeFirstname.value !== "" &&
    newAttendeeLastname.value !== "" &&
    newAttendeeAge.value !== ""
  ) {
    fetch("http://localhost:3000/attendees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAttendee),
    })
      .then((response) => response.json())
      .then((newAttendeeFromApi) => {
        state.attendees.push(newAttendeeFromApi);
        getAllAttendees();
        //render();
      });
  }
}

//Update Attendee *************************************************************************
function updateAttendee() {
  const editAttendeeFirstname = editAttendeeFormElement.querySelector(
    "#edit-attendee-firstname"
  );
  const editAttendeeLastname = editAttendeeFormElement.querySelector(
    "#edit-attendee-lastname"
  );
  const editAttendeeAge =
    editAttendeeFormElement.querySelector("#edit-attendee-age");

  const editAttendeeID = editAttendeeFormElement.querySelector("#attendee-id");

  const updatedAttendee = {
    id: editAttendeeID.value,
    firstname: editAttendeeFirstname.value,
    lastname: editAttendeeLastname.value,
    age: editAttendeeAge.value,
  };

  return fetch("http://localhost:3000/attendees/" + updatedAttendee.id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(updatedAttendee),
  })
    .then((response) => response.json())
    .then(() => {
      getAllAttendees();
    });
}

//Delete All Attendees *********************************************************************
//Delete Single Attendee *******************************************************************
async function deleteAttendee(attendee) {
  return fetch("http://localhost:3000/attendees/" + attendee.id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function deleteAllAttendees() {
  const deleteRequests = state.attendees.map(deleteAttendee);

  await Promise.all(deleteRequests);

  getAllAttendees();
}

newAttendeeFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  addAttendeeToApi();
});

editAttendeeFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  updateAttendee();
});

deleteAllButton.addEventListener("click", deleteAllAttendees);

getAllAttendees();
