const form = document.querySelector(".form");
const email_error = document.querySelector(".email");
const password_error = document.querySelector(".password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  //
  const email = form.email.value;
  const password = form.password.value;
  const firstname = form.firstname.value;
  const lastname = form.lastname.value;

  const phoneNumber = form.phoneNumber.value;
  const address = form.address.value;
  console.log("login worked", email, password);

  try {
    const res = await fetch("/analyst/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstname,
        lastname,
        phoneNumber,

        address,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log(data);
    if (data.user) {
      location.assign("/");
      console.log("user log im");
    }
    if (data.err.email) {
      console.log("email exist");
      alert("email already exist");
    } else if (data.err.email) {
      alert("password is less");
    } else {
      email_error.innerHTML = "";
      password_error.innerHTML = "";
    }
  } catch (err) {}
});
