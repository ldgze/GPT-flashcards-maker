function Dashboard() {
  const me = {};

  me.showMessage = function (message, type = "danger") {
    const messagesDiv = document.querySelector("#messages");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
           <div>${message}</div>
           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    messagesDiv.append(wrapper);
  };

  me.reloadCards = async function () {
    console.log("reloading cards");
    const res = await fetch("/api/cards");
    if (res.status !== 200) {
      me.showMessage("Error loading cards");
      return;
    }
    const cards = await res.json();

    console.log("got cards", cards);

    me.renderCards(cards);
  };

  const renderCard = function (card) {
    return `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Question</h5>
        <p class="card-text">${card.question}</p>
        <h5 class="card-title">Answer</h5>
        <p class="card-text">${card.answer}</p>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="editCard(${card.id})">Edit</button>
          
          <button class="btn btn-danger" onclick="deleteCard(${card.id})">Delete</button>
        </div>
      </div>
    </div>
  `;
  };

  me.renderCards = function (cards) {
    const cardsDiv = document.querySelector("#cards");

    cardsDiv.innerHTML = cards.map(renderCard).join("\n");
  };

  const formCreateCard = document.querySelector("form#create");
  console.log("formCreateCard", formCreateCard);

  async function onCreateCard(evt) {
    // Avoids re rendering
    evt.preventDefault();

    const formData = new FormData(formCreateCard);
    console.log("onCreateCard", evt, "formData", formData);

    const res = await fetch("/api/cards/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (res.ok) {
      me.showMessage("Card created", "success");
      formCreateCard.reset();
      me.reloadCards();
    } else {
      me.showMessage("Error creating prompt", "danger");
    }
  }

  formCreateCard.addEventListener("submit", onCreateCard);

  return me;
}

const dashboard = Dashboard();
console.log("dashboard", dashboard);

dashboard.reloadCards();
