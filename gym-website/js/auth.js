console.log("auth.js запущен, DOM готов");

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("openRegister");
  const registerModal = document.getElementById("registerModal");
  const cancelRegister = document.getElementById("cancelRegister");
  const registerForm = document.getElementById("registerForm");

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

  if (phone) {
    phone.addEventListener("input", () => {
      if (!phone.value.startsWith("+")) {
        phone.value = "+" + phone.value.replace(/\D/g, ""); //регулярное выражение
        return; //всё что не цифры - не вводим
      }

      phone.value = "+" + phone.value.slice(1).replace(/\D/g, "");
    });

    phone.addEventListener("focus", () => {
      if (phone.value === "") phone.value = "+";
    });
  }

  // const fieldLabels = {
  //   firstName: "Имя",
  //   lastName: "Фамилия",
  //   age: "Возраст",
  //   gender: "Пол",
  //   height: "Рост",
  //   weight: "Вес",
  //   phone: "Телефон",
  //   email: "Email",
  // };

  function clearForm() {
    firstName.value = "";
    lastName.value = "";
    middleName.value = "";
    age.value = "";
    gender.value = "";
    height.value = "";
    weight.value = "";
    phone.value = "+";
    email.value = "";
  }

  //Открытие модалки регистрации по нажатию кнопки
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isEditing = false;
    clearForm();
    registerModal.classList.remove("hidden");
  });

  cancelRegister.addEventListener("click", () => {
    if (registerModal) registerModal.classList.add("hidden");

    isEditing = false;
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // не перезагружать страницу

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

    // Всё ок?- сохранение json в локалку
    localStorage.setItem("user", JSON.stringify(user));

    registerModal.classList.add("hidden");
    registerBtn.classList.add("hidden");

    if (isEditing) {
      alert("Данные сохранены");
    } else {
      alert("Регистарция успешна!");
    }

    isEditing = false;
    updateHeader();
  });

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
      <p><b>Имя:</b> ${u.firstName}</p>
      <p><b>Фамилия:</b> ${u.lastName}</p>
      ${u.middleName ? `<p><b>Отчество:</b> ${u.middleName}</p>` : ""}
      <p><b>Возраст:</b> ${u.age}</p>
      <p><b>Пол:</b> ${u.gender}</p>
      <p><b>Рост (см):</b> ${u.height}</p>
      <p><b>Вес (кг):</b> ${u.weight}</p>
      <p><b>Телефон:</b> ${u.phone}</p>
      <p><b>Email:</b> ${u.email}</p>
    `;
  }

  //Кнопки внутри панели профиля
  avatar.addEventListener("click", () => {
    renderUserInfo();
    userPanel.classList.remove("hidden");
  });

  closePanel.addEventListener("click", () => {
    userPanel.classList.add("hidden");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user"); //удаление сохранённых данных
    userPanel.classList.add("hidden");

    isEditing = false;
    updateHeader();
  });

  editBtn.addEventListener("click", () => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const u = JSON.parse(raw);

    firstName.value = u.firstName || "";
    lastName.value = u.lastName || "";
    middleName.value = u.middleName || "";
    age.value = u.age || "";
    gender.value = u.gender || "";
    height.value = u.height || "";
    weight.value = u.weight || "";
    phone.value = u.phone || "";
    email.value = u.email || "";

    isEditing = true;
    submitBtn.textContent = "Сохранить";

    //Закрытие панели и развёртывание модалки регистрации (в ней пользователь сможет изменить данные)
    userPanel.classList.add("hidden");
    registerModal.classList.remove("hidden");
  });

  //сокрытие кнопку регистрации и показываем аватар при наличии user
  function updateHeader() {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      registerBtn.classList.add("hidden"); //сокрытие кнопки регистрации
      avatar.classList.remove("hidden"); //показ аватара
      avatar.textContent =
        u.firstName && u.firstName[0] ? u.firstName[0].toUpperCase() : "U";
    } else {
      registerBtn.classList.remove("hidden");
      avatar.classList.add("hidden");
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

//Логика для кнопок Купить План//
function isLoggedIn() {
  return !!localStorage.getItem('user');
}

document.querySelectorAll('.buy-plan').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();//чтобы не переходить сразу по href

    if (isLoggedIn()) {
      const href = link.getAttribute('href') || 'courses.html';
      window.location.href = href;
    } else {
      isEditing = false;
      if (submitBtn) submitBtn.textContent = 'Зарегистрироваться';//меняет текст кнопки
      if (typeof clearForm === 'function') clearForm();
      if (registerModal) registerModal.classList.remove('hidden');//открывает окно регистарции
    }
  });
});












});
