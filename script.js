const title =  document.querySelector('#input-title')
const date = document.querySelector('#input-date')
const time = document.querySelector('#input-time')
const description = document.querySelector('#input-des')
const button = document.querySelector('button')
const containerForEvents = document.querySelector('.separate-event-from-trash')
const leftSide = document.querySelector('.left-side')
const trash = document.querySelector('.trash')
const trashIcon = document.querySelector('.trash>i')
const header = document.querySelector('h2')
const localVanisher = document.querySelector('.clear-local')
const countdownSection = document.querySelector('section')
const sectionTimer = document.querySelector(".timer")
const xBtn = document.querySelector(".x-button")
let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

xBtn.addEventListener("click")

let events = []

window.addEventListener('load', () => {
    let dataFromLocal = JSON.parse(localStorage.getItem('dataEvent'))
    if(dataFromLocal) {
        events = dataFromLocal
        renderEvents()
    }
    
})

function validation () {
    if(!(title.value && description.value && date.value && time.value)) {
        header.textContent = 'Fill the all entries'
        header.classList.add('condition')
        return false
    }
    else {
        header.textContent = 'Create new event'
        header.classList.remove('condition')
        return true
    }
}




button.addEventListener('click', e => {
    e.preventDefault()
    if(validation()) {
    
        const eventObject = {
            title: title.value,
            description: description.value,
            date: `${date.value},${time.value}` 
        }

        events.push(eventObject);
        localStorage.setItem('dataEvent', JSON.stringify(events));
    
        renderEvents()
    } 
      
} 
)

localVanisher.addEventListener('click', ()=> {
    localStorage.clear()
    events = []
    renderEvents()
})

function renderEvents() {
    
    containerForEvents.innerHTML = ''

    events.map((event,index)=>{
        
    const eventWrapper = document.createElement('div')
    eventWrapper.classList.add('event-wrapper')
    eventWrapper.setAttribute('draggable', true)
    eventWrapper.setAttribute('id', index)
    const renderedTime = document.createElement('div')
    renderedTime.classList.add('time')
    const day = document.createElement('div')
    const month = document.createElement('div')
    const eventName = document.createElement('p')
    eventName.classList.add('event-name')
    
    
    day.textContent = new Date(event.date).getDate()
    month.textContent = months[(new Date(event.date).getMonth())]
    eventName.textContent = event.title
    
    renderedTime.append(day,month)
    eventWrapper.append(renderedTime,eventName)
    containerForEvents.append(eventWrapper)
    leftSide.append(containerForEvents)


    //drag 


    eventWrapper.addEventListener('dragstart', event => {
        event.dataTransfer.setData('uniqueId', event.target.id)
        console.log(event);
        event.target.style.opacity = 0.5
    })
    
    eventWrapper.addEventListener('dragend', event => {
        event.preventDefault()
        event.target.style.opacity = 1
    })
    
    //Countdown
    
    
    eventWrapper.addEventListener("click", e=>{
        console.log(event.date);
        countdownSection.classList.add("countdown")
        var countDownDate = new Date(event.date).getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  sectionTimer.textContent = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    sectionTimer.textContent = "EXPIRED";
  }
}, 1000);
    })
    })  
    
}

//  drop

trash.addEventListener('dragover', event => {
    event.preventDefault()
})

trash.addEventListener('drop', event => {
    event.preventDefault()
    let eventData = event.dataTransfer.getData('uniqueId')
    console.log(event);
    console.log(eventData);
    events.splice(eventData,1);
    localStorage.setItem('dataEvent', JSON.stringify(events));
    renderEvents()
})

