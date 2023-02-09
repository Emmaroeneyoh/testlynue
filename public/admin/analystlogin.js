const form = document.querySelector(".form");
const email_error = document.querySelector(".email");
const password_error = document.querySelector(".password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //
  const email = form.email.value;
  const password = form.password.value;

  console.log("login worked", email, password);

  try {
    const res = await fetch("/analyst/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log(data);
    if (data.user) {
      location.assign("/");
      console.log("user log im");
    }
    if (data.error) {
      email_error.innerHTML = data.error.email;
      password_error.innerHTML = data.error.password;
    } else {
      email_error.innerHTML = "";
      password_error.innerHTML = "";
    }
  } catch (err) {}
});
