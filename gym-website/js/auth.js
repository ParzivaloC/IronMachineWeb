console.log("auth.js запущен, DOM готов");

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("openRegister");
  const registerModal = document.getElementById("registerModal");
  const cancelRegister = document.getElementById("cancelRegister");
  const registerForm = document.getElementById("registerForm");
  const formError = document.getElementById("formError");

  const avatar = document.getElementById("userAvatar");
  const userPanel = document.getElementById("userPanel");
  const userInfo = document.getElementById("userInfo");
  const closePanel = document.getElementById("closePanel");
  const logoutBtn = document.getElementById("logout");
  const editBtn = document.getElementById("editUser");

  //поля формы по id
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const middleName = document.getElementById("middleName");
  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");

  //редактирование или новая регистрация
  let isEditing = false;
  const submitBtn = document.getElementById("submitRegister");

  //на всякий случай если модалки каким то чудом сново появятся просто так
  if (registerModal) registerModal.classList.add("hidden");
  if (userPanel) userPanel.classList.add("hidden");

  function isValidPhone(phoneStr) {
    return /^\+\d{7,15}$/.test(phoneStr);
  }

  if (phone) {
    phone.addEventListener("input", () => {
      if (!phone.value.startsWith("+")) {
        phone.value = "+" + phone.value.replace(/\D/g, "");
        return;
      }

      phone.value = "+" + phone.value.slice(1).replace(/\D/g, "");
    });

    phone.addEventListener("focus", () => {
      if (phone.value === "") phone.value = "+";
    });
  }

  function isValidEmail(emailStr) {
    //проверка формата
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  }

  const fieldLabels = {
    firstName: "Имя",
    lastName: "Фамилия",
    age: "Возраст",
    gender: "Пол",
    height: "Рост",
    weight: "Вес",
    phone: "Телефон",
    email: "Email",
  };

  function clearForm() {
    if (firstName) firstName.value = "";
    if (lastName) lastName.value = "";
    if (middleName) middleName.value = "";
    if (age) age.value = "";
    if (gender) gender.value = "";
    if (height) height.value = "";
    if (weight) weight.value = "";
    if (phone) phone.value = "+";
    if (email) email.value = "";
    if (formError) formError.textContent = "";
  }

  //Открытие модалки регистрации по нажатию кнопки
  if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      isEditing = false;
      if (submitBtn) submitBtn.textContent = "Зарегистрироваться";
      clearForm();
      if (formError) formError.textContent = "";
      if (registerModal) registerModal.classList.remove("hidden");
    });
  }

  if (cancelRegister) {
    cancelRegister.addEventListener("click", () => {
      if (registerModal) registerModal.classList.add("hidden");

      isEditing = false;
      if (submitBtn) submitBtn.textContent = "Зарегистрироваться";
      if (formError) formError.textContent = "";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault(); // не перезагружать страницу
      if (formError) formError.textContent = "";

      //считывание значений из полей
      const user = {
        firstName: firstName ? firstName.value.trim() : "",
        lastName: lastName ? lastName.value.trim() : "",
        middleName: middleName ? middleName.value.trim() : "",
        age: age ? age.value.trim() : "",
        gender: gender ? gender.value : "",
        height: height ? height.value.trim() : "",
        weight: weight ? weight.value.trim() : "",
        phone: phone ? phone.value.trim() : "",
        email: email ? email.value.trim() : "",
      };

      //проверка обязательных полей
      const requiredOrder = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "height",
        "weight",
        "phone",
        "email",
      ];
      const missing = requiredOrder.find((key) => {
        //для select gender пустая строка - не выбран
        return !user[key] || user[key].length === 0;
      });

      if (missing) {
        if (formError)
          formError.textContent = `Заполните поле "${
            fieldLabels[missing] || missing
          }"`;
        return;
      }

      //проверка формата
      if (!isValidPhone(user.phone)) {
        if (formError) formError.textContent = "Неверный формат телефона.";
        return;
      }
      if (!isValidEmail(user.email)) {
        if (formError) formError.textContent = "Неверный формат email.";
        return;
      }

      // Всё ок?- сохранение json в локалку
      localStorage.setItem("user", JSON.stringify(user));

      if (registerModal) registerModal.classList.add("hidden");

      if (registerBtn) registerBtn.classList.add("hidden");
      if (isEditing) {
        alert("Данные сохранены");
      } else {
        alert("Регистарция успешна!");
      }
      //alert('Регистрация успешна!');
      isEditing = false;
      if (submitBtn) submitBtn.textContent = "Зарегистрироваться";

      updateHeader();
    });
  }

  //отображение профиля
  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  //Отображение данных пользователя в панели профиля НЕ ТРОГАТЬ!!!!!!!!!!!!!!!!!!
  function renderUserInfo() {
    const raw = localStorage.getItem("user");
    if (!userInfo) return;
    if (!raw) {
      userInfo.innerHTML = "<p>Пользователь не найден.</p>";
      return;
    }
    const u = JSON.parse(raw);
    userInfo.innerHTML = `
      <p><b>Имя:</b> ${escapeHtml(u.firstName)}</p>
      <p><b>Фамилия:</b> ${escapeHtml(u.lastName)}</p>
      ${
        u.middleName
          ? `<p><b>Отчество:</b> ${escapeHtml(u.middleName)}</p>`
          : ""
      }
      <p><b>Возраст:</b> ${escapeHtml(u.age)}</p>
      <p><b>Пол:</b> ${escapeHtml(u.gender)}</p>
      <p><b>Рост (см):</b> ${escapeHtml(u.height)}</p>
      <p><b>Вес (кг):</b> ${escapeHtml(u.weight)}</p>
      <p><b>Телефон:</b> ${escapeHtml(u.phone)}</p>
      <p><b>Email:</b> ${escapeHtml(u.email)}</p>
    `;
  }

  //Кнопки внутри панели профиля
  if (avatar) {
    avatar.addEventListener("click", () => {
      renderUserInfo();
      if (userPanel) userPanel.classList.remove("hidden");
    });
  }

  if (closePanel) {
    closePanel.addEventListener("click", () => {
      if (userPanel) userPanel.classList.add("hidden");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user"); //удаление сохранённых данных
      if (userPanel) userPanel.classList.add("hidden");

      isEditing = false;
      updateHeader();
    });
  }

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const u = JSON.parse(raw);

      //Заполнение поля формы значениями НЕ ТРОГАТЬ!!!!!!!!!!!!!!!!!!
      if (firstName) firstName.value = u.firstName || "";
      if (lastName) lastName.value = u.lastName || "";
      if (middleName) middleName.value = u.middleName || "";
      if (age) age.value = u.age || "";
      if (gender) gender.value = u.gender || "";
      if (height) height.value = u.height || "";
      if (weight) weight.value = u.weight || "";
      if (phone) phone.value = u.phone || "";
      if (email) email.value = u.email || "";

      isEditing = true;
      if (submitBtn) submitBtn.textContent = "Сохранить";

      //Закрытие панели и развёртывание модалки регистрации (в ней пользователь сможет изменить данные)
      if (userPanel) userPanel.classList.add("hidden");
      if (registerModal) registerModal.classList.remove("hidden");
    });
  }

  //сокрытие кнопку регистрации и показываем аватар при наличии user
  function updateHeader() {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      if (registerBtn) registerBtn.classList.add("hidden"); //сокрытие кнопки регистрации
      if (avatar) {
        avatar.classList.remove("hidden"); //показ аватара
        //аватар по букве имени
        avatar.textContent =
          u.firstName && u.firstName[0] ? u.firstName[0].toUpperCase() : "U";
      }
    } else {
      if (registerBtn) registerBtn.classList.remove("hidden");
      if (avatar) avatar.classList.add("hidden");
    }
  }
  updateHeader();
  //Мисклики для закрытия модалок
  window.addEventListener("click", (e) => {
    if (e.target === registerModal) registerModal.classList.add("hidden");
    if (e.target === userPanel) userPanel.classList.add("hidden");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (registerModal) registerModal.classList.add("hidden");
      if (userPanel) userPanel.classList.add("hidden");
    }
  });
});
