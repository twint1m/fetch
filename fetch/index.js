const showToast = (toastTitle, toastMessage, backgroundColor) => {
  const name = document.querySelector('.name')
  const message = document.querySelector(".message");
  const toast = document.querySelector(".toast");
  const cross = document.querySelector(".toast__link");
  toast.style.backgroundColor = backgroundColor

  name.textContent = toastTitle
  message.textContent = toastMessage;

  const slideRight = setTimeout(() => {
    toast.style.display = "flex";
    toast.classList.toggle("slide-right");
  }, 2000);

  const slideLeft = () => {
    toast.classList.add("slide-left");
    setTimeout(() => {
      toast.classList.remove("slide-left");
    }, 1000);
  };

  cross.addEventListener("click", () => {
    slideLeft();
    setTimeout(() => {
      toast.style.display = "none";
    }, 1000);
  });
};
 
const removeOldData = () => {
  document.querySelectorAll(".image").forEach((img) => img.remove());
  console.log('foto udaleno');
  document.querySelectorAll("h3").forEach((h) => h.remove());
}

const displayLoader = () => {
  const loader = document.querySelector(".loader");
  const wrapper = document.querySelector(".wrapper");

  loader.classList.remove("hidden");
  wrapper.classList.add("hidden");
};

const hideLoader = () => {
  const loader = document.querySelector(".loader");
  const wrapper = document.querySelector(".wrapper");

  loader.classList.add("hidden");
  wrapper.classList.remove("hidden");
};
removeOldData()
const updateListItems = (data) => {
  removeOldData()
  console.log(data);
  if (data.length != 8 && data[0].status!= 'error') {
    showToast('','Не все картинки получены','yellow')
  } else if (data.length == 8) {
    showToast('Все картинки получены','Все картинки получены', 'green')
  }


  if (data[0].status === 'error') {
    removeOldData()
    console.log('otlovil 500');
    showToast('error', 'Something went wrong', 'red')

  }
  const listItems = document.querySelectorAll(".list > .list__item");
  if (data.length === 0) {
    const span = document.createElement('span');
    span.textContent = 'Изображения не найдены';
    const ul = document.querySelector('.list');
    ul.textContent = ''
    ul.appendChild(span);
  }

  listItems.forEach((element, i) => {

    if (data[i]) {
      element.innerHTML = "";
      const img = document.createElement("img");
      img.classList.add('image')
      const header = document.createElement("h3");
      img.src = data[i].url;
      img.alt = data[i].alt;
      header.textContent = data[i].description;
      element.appendChild(img);
      element.appendChild(header);
    }
  });

};



const fetchData = async () => {
  const response = await fetch("http://slavaver.space/images", {
    method: "GET",
    headers: {
      Username: "twint1m",
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const loadData = async () => {
  try {
    displayLoader();
    const data = await fetchData();
    updateListItems(data);
  } catch (error) {
    console.log(error);
    showToast('Ошибка',"Произошла ошибка при загрузке данных.");
    if (error.status === 500) {
      console.log('500');
      showToast('Ошибка',"Произошла ошибка на сервере.");
    } else {
      console.log('!500');
      showToast('Ошибка',"Произошла ошибка, связанная с сетью.");
    }
  } finally {
    hideLoader();
  }
};

document.addEventListener("DOMContentLoaded", loadData);

const button = document.querySelector(".button");
button.addEventListener("click", loadData);


const postData = () => {
  const form = document.querySelector("form");
  const submitBtn = document.querySelector("#submit-btn");
  const roomNumberInput = document.querySelector("#room-number-input");
  const temperatureInput = document.querySelector("#temperature-input");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const roomNumber = roomNumberInput.value;
    const temperature = parseFloat(temperatureInput.value);

    if (!roomNumber || isNaN(temperature)) {
      showToast("Ошибка", "Пожалуйста, введите номер аудитории и температуру.");
      submitBtn.disabled = false;
      return;
    }

    const data = { class: roomNumber, temp: temperature };

    try {
      const response = await fetch("http://194.67.93.117/temp", {
        method: "POST",
        headers: {
          Username: "twint1m",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных.");
      }

      const result = await response.json();
      showToast("Успех", result.message, "green");
      form.reset();
    } catch (error) {
      console.error(error);
      showToast("Ошибка", "Произошла ошибка при отправке данных.", "red");
    } finally {
      submitBtn.disabled = false;
    }
  });
};
