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
    const cardElement = document.createElement("div");
    cardElement.classList.add("card", "mb-3");

    cardElement.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">Question</h5>
      <p class="card-text" id="cardQuestion">${card.question}</p>
      <h5 class="card-title" >Answer</h5>
      <p class="card-text" id="cardAnswer">${card.answer}</p>
      <div class="btn-group">
        <button id="editBtn" class="btn btn-primary" ">Edit</button>
        <button id="saveBtn" class="btn btn-success">Save</button>
        <button id="deleteBtn" class="btn btn-danger" ">Delete</button>
      </div>
    </div>
  `;

    cardElement
      .querySelector("#editBtn")
      .addEventListener("click", () => onEditCard(cardElement));

    cardElement
      .querySelector("#deleteBtn")
      .addEventListener("click", onDeleteCard(card));

    cardElement.querySelector("#saveBtn").style.display = "none";

    function onEditCard(cardElement) {
      console.log("editing card", card);
      const cardQuestionElement = cardElement.querySelector("#cardQuestion");
      const cardQuestionText = cardQuestionElement.innerText;

      const cardAnswerElement = cardElement.querySelector("#cardAnswer");
      const cardAnswerText = cardAnswerElement.innerText;

      const questionInput = document.createElement("input");
      questionInput.value = cardQuestionText;

      const answerInput = document.createElement("input");
      answerInput.value = cardAnswerText;

      questionInput.classList.add("form-control");
      answerInput.classList.add("form-control");

      cardQuestionElement.replaceWith(questionInput);
      cardAnswerElement.replaceWith(answerInput);

      const editBtn = cardElement.querySelector("#editBtn");
      editBtn.style.display = "none";

      const saveBtn = cardElement.querySelector("#saveBtn");
      saveBtn.style.display = "block";

      saveBtn.addEventListener("click", async function () {
        const newCardQuestionText = questionInput.value;
        const newCardAnswerText = answerInput.value;

        const res = await fetch("/api/cards/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: card._id,
            question: newCardQuestionText,
            answer: newCardAnswerText,
          }),
        });

        if (res.ok) {
          me.showMessage("Card updated", "success");
          me.reloadCards();
        } else {
          me.showMessage("Error updating card", "danger");
          return;
        }
      });
    }

    return cardElement;
  };

  function onDeleteCard(card) {
    return async function () {
      const res = await fetch("/api/cards/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: card._id }),
      });

      if (res.ok) {
        me.showMessage("Card deleted", "warning");
        me.reloadCards();
      } else {
        me.showMessage("Error deleting card", "danger");
        return;
      }
    };
  }

  me.renderCards = function (cards) {
    const cardsDiv = document.querySelector("#cards");

    cardsDiv.innerHTML = "";
    for (let card of cards) cardsDiv.append(renderCard(card));
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
