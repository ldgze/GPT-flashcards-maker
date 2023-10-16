function Profile() {
  const profile = {};

  const formUpdate = document.querySelector("form#update");
  console.log("formUpdate", formUpdate);

  profile.showMessage = function (message, type = "danger") {
    const messagesDiv = document.querySelector("#messages");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
               <div>${message}</div>
               <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

    messagesDiv.append(wrapper);
  };

  async function onFormUpdate(evt) {
    // Avoids re rendering
    evt.preventDefault();

    const formData = new FormData(formUpdate);
    console.log("onRegistartion", evt, "formData", formData);

    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (res.ok) {
      // UpformUpdate was successful
      profile.showMessage("Update succeed, you can login now", "success");
    } else {
      const error = await res.text();
      profile.showMessage(error, "danger");
    }
  }

  formUpdate.addEventListener("submit", onFormUpdate);

  return profile;
}

const profile = Profile();
profile.showMessage("Please update your username and password.", "info");
