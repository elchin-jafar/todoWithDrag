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



let events = []

window.addEventListener('load', () => {
    // e.preventDefault()
    renderFromLocal()
})

function validation () {
    if(!(title.value && description.value && date.value && time.value)) {
        header.textContent = 'dude'
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

        // console.log(eventObject);
        events.push(eventObject);
        localStorage.setItem('dataEvent', JSON.stringify(events));
    
        renderEvents()
    } 
      
} 
)

localVanisher.addEventListener('click', ()=> {
    localStorage.clear()
    events = []
    renderFromLocal()
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
    })  
}


function renderFromLocal () {
    containerForEvents.innerHTML = ''
    let dataFromLocal = JSON.parse(localStorage.getItem('dataEvent'))
    if(dataFromLocal){

        dataFromLocal.map((event,index) => {
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
        })
    }
}
// console.log(new Date().getMonth())

let dragged;

leftSide.addEventListener('dragstart', event => {
    console.log(event.target);
    dragged = event.target;
    dragged.style.opacity = 0.5
})

leftSide.addEventListener('dragend', event => {
    event.preventDefault()
    dragged.style.opacity = 1
})

leftSide.addEventListener('dragover', event => {
    event.preventDefault()
})

leftSide.addEventListener('drop', event => {
    event.preventDefault()
    console.log(event.target);
    if(event.target == trashIcon) {
        const targetIndex = dragged.getAttribute('id');
        events.splice(targetIndex,1);
        localStorage.setItem('dataEvent', JSON.stringify(events));
        renderEvents()
    }
    
})