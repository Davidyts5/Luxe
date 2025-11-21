const USERS_KEY = "luxora-users";
const CURRENT_USER_KEY = "luxora-current-user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const authContainers = document.querySelectorAll("[data-auth-status]");
  const currentUser = getCurrentUser();

  authContainers.forEach((container) => {
    if (!container) return;
    if (currentUser) {
      container.innerHTML = `
        <span class="muted" style="font-size:0.9rem;">Hi, ${currentUser.name.split(" ")[0]}</span>
        <button class="btn ghost" data-logout type="button">Logout</button>
      `;
    } else {
      container.innerHTML = `
        <a href="login.html">Login</a>
        <a class="ghost" href="register.html">Create</a>
      `;
    }
  });

  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setCurrentUser(null);
      window.location.href = "index.html";
    });
  });
}

function validatePassword(password) {
  return password.length >= 8;
}

function registerUser(formData) {
  const { name, email, password, confirmPassword } = formData;
  const feedbackEl = document.querySelector("[data-register-feedback]");
  if (!validatePassword(password)) {
    feedbackEl.textContent = "Password must be at least 8 characters.";
    feedbackEl.className = "form-feedback error";
    return;
  }
  if (password !== confirmPassword) {
    feedbackEl.textContent = "Passwords do not match.";
    feedbackEl.className = "form-feedback error";
    return;
  }

  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    feedbackEl.textContent = "Email already registered.";
    feedbackEl.className = "form-feedback error";
    return;
  }

  const newUser = { id: crypto.randomUUID(), name, email, password };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
  feedbackEl.textContent = "Account created. Redirecting...";
  feedbackEl.className = "form-feedback success";
  setTimeout(() => (window.location.href = "index.html"), 1200);
}

function loginUser(formData) {
  const { email, password } = formData;
  const feedbackEl = document.querySelector("[data-login-feedback]");
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    feedbackEl.textContent = "Invalid credentials.";
    feedbackEl.className = "form-feedback error";
    return;
  }
  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  feedbackEl.textContent = "Login successful. Redirecting...";
  feedbackEl.className = "form-feedback success";
  setTimeout(() => (window.location.href = "index.html"), 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(registerForm));
      registerUser(data);
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm));
      loginUser(data);
    });
  }
});
