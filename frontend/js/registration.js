function Registration() {
  const registration = {};

  const formRegistration = document.querySelector("form#registration");
  console.log("formRegistration", formRegistration);

  registration.showMessage = function (message, type = "danger") {
    const messagesDiv = document.querySelector("#messages");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
             <div>${message}</div>
             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;

    messagesDiv.append(wrapper);
  };

  async function onRegistration(evt) {
    // Avoids re rendering
    evt.preventDefault();

    const formData = new FormData(formRegistration);
    console.log("onRegistartion", evt, "formData", formData);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (res.ok) {
      // Registration was successful
      registration.showMessage(
        "Registration succeed, you can login now",
        "success",
      );
    } else {
      const error = await res.text();
      registration.showMessage(error, "danger");
    }
  }

  formRegistration.addEventListener("submit", onRegistration);

  return registration;
}

const registration = Registration();
registration.showMessage("Please update your username and password.", "info");
