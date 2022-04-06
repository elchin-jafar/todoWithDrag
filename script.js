const title = document.querySelector("#input-title");
const date = document.querySelector("#input-date");
const time = document.querySelector("#input-time");
const description = document.querySelector("#input-des");
const button = document.querySelector("button");
const containerForEvents = document.querySelector(".separate-event-from-trash");
const formHolder = document.querySelector(".form-holder");
const rightSide = document.querySelector(".right-side");
const trash = document.querySelector(".trash");
const trashIcon = document.querySelector(".trash>i");
const header = document.querySelector("h2");
// const localVanisher = document.querySelector(".clear-local");
const countdownSection = document.querySelector("section");
const sectionTimer = document.querySelector(".timer");
const xBtn = document.querySelector(".x-button");
const timerTitle = document.querySelector(".timer-title");
const timerDes = document.querySelector(".timer-description");
const blurred = document.querySelector(".blurred")


let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



let events = [];

window.addEventListener("load", () => {
  let dataFromLocal = JSON.parse(localStorage.getItem("dataEvent"));
  if (dataFromLocal) {
    events = dataFromLocal;
    if(events.length < 4) {
      containerForEvents.classList.remove("scroll-y")
    } else {
      containerForEvents.classList.add("scroll-y")
    }
    renderEvents();
  }
});

function validation() {
  if (!(title.value && description.value && date.value && time.value)) {
    header.textContent = "Fill the all entries";
    header.classList.add("condition");
    return false;
  } else {
    header.textContent = "Create new event";
    header.classList.remove("condition");
    return true;
  }
}

button.addEventListener("click", (e) => {
  e.preventDefault();
  if (validation()) {
    const eventObject = {
      title: title.value,
      description: description.value,
      date: `${date.value},${time.value}`,
    };

    events.push(eventObject);
    if(events.length < 4) {
      containerForEvents.classList.remove("scroll-y")
    } else {
      containerForEvents.classList.add("scroll-y")
    }
    localStorage.setItem("dataEvent", JSON.stringify(events));

    renderEvents();
  }
});

// localVanisher.addEventListener("click", () => {
//   localStorage.clear();
//   events = [];
//   renderEvents();
// });

function renderEvents() {
  containerForEvents.innerHTML = "";

  events.map((event, index) => {
    const eventWrapper = document.createElement("div");
    eventWrapper.classList.add("event-wrapper");
    eventWrapper.setAttribute("draggable", true);
    eventWrapper.setAttribute("id", index);
    const renderedTime = document.createElement("div");
    renderedTime.classList.add("time");
    const day = document.createElement("div");
    const month = document.createElement("div");
    const eventName = document.createElement("p");
    eventName.classList.add("event-name");

    day.textContent = new Date(event.date).getDate();
    month.textContent = months[new Date(event.date).getMonth()];
    eventName.textContent = event.title;

    renderedTime.append(day, month);
    eventWrapper.append(renderedTime, eventName);
    containerForEvents.append(eventWrapper);
    rightSide.append(containerForEvents);

    //drag

    eventWrapper.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("uniqueId", event.target.id);
      console.log(event);
      event.target.style.opacity = 0.5;
    });


  

    eventWrapper.addEventListener("dragend", (event) => {
      event.preventDefault();
      event.target.style.opacity = 1;
    });

    //Countdown

    eventWrapper.addEventListener("click", () => {
      countdownSection.classList.add("countdown");
      blurred.classList.add("blur-on");
      containerForEvents.style.zIndex = 1;
      formHolder.style.zIndex = 1;
      trash.style.zIndex = 1;
      // localVanisher.style.zIndex = 1;
      
        timerTitle.textContent = event.title.toUpperCase();
        timerDes.textContent = event.description;

        const x = setInterval(
        
        function () {
          const countDownDate = new Date(event.date).getTime();
  
          const now = new Date().getTime();
  
          const distance = countDownDate - now;

          console.log(distance);
          if(distance > 0) {
            
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            

              sectionTimer.textContent =  
                days + "d " + hours + "h " + minutes + "m " + seconds + "s ";  
            
          } else {
            
            sectionTimer.textContent = "EXPIRED";
          }
        }
        , 1000);

        xBtn.addEventListener("click", () => {
            clearInterval(x);
            containerForEvents.style.zIndex = 2;
            formHolder.style.zIndex = 2;
            trash.style.zIndex = 2;
            // localVanisher.style.zIndex = 2;
            blurred.classList.remove("blur-on")
            setTimeout(() => {
              sectionTimer.innerHTML = `<img src="./asset/Eclipse-1s-200px.svg" alt="loading" />`;
            }, 500);
            countdownSection.classList.remove("countdown");
            
          })
          
        ;
      
      
    });
  });
}


//  drop

trash.addEventListener("dragover", (event) => {
  event.preventDefault();
});

trash.addEventListener("drop", (event) => {
  event.preventDefault();
  let eventData = event.dataTransfer.getData("uniqueId");
  console.log(event);
  console.log(eventData);
  events.splice(eventData, 1);
  localStorage.setItem("dataEvent", JSON.stringify(events));
  renderEvents();
});
