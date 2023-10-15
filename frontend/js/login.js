function Login() {
  const login = {};

  const formLogin = document.querySelector("form#login");

  login.showMessage = function (message, type = "danger") {
    const messagesDiv = document.querySelector("#messages");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
           <div>${message}</div>
           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    messagesDiv.append(wrapper);
  };

  async function onLogin(evt) {
    // Avoids re rendering
    evt.preventDefault();

    const formData = new FormData(formLogin);
    console.log("onLogin", evt, "formData", formData);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    if (res.ok) {
      // Login was successful
      window.location.replace("dashboard.html");
    } else {
      login.showMessage("Login failed", "danger");
    }
  }

  formLogin.addEventListener("submit", onLogin);

  return login;
}

const login = Login();
login.showMessage(
  "Please enter your credentials. If you don't have an account, please register first.",
  "info",
);
login.showMessage(
  "The default username is 'user' and the default password is 'password'",
  "info",
);
