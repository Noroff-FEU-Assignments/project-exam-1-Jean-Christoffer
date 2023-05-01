import showSnackBar from "./snackBar.js";
const nameInput = document.querySelector('#name')
const mailInput = document.querySelector('#email')
const subjectInput = document.querySelector('#subject')
const contactForm = document.querySelector('.contact-form')
const snackbarWrapper = document.querySelector('.snackbar-wrapper')
const question = document.querySelector('#question')

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault()

    const name= nameInput.value.toLowerCase().trim()
    const email= mailInput.value.toLowerCase().trim()
    const subject = subjectInput.value.toLowerCase().trim()

    const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; 
    const patternMatches = regEx.test(email);

    name.length > 2 ? removeErrorMessage(nameInput) : errorMessage(nameInput,'Please enter a name')
    patternMatches ? removeErrorMessage(mailInput) : errorMessage(mailInput, 'Please enter a valid email')
    subject.length > 3 ?  removeErrorMessage(subjectInput) : errorMessage(subjectInput, 'Please provide a subject')

    if( name.length > 2 && patternMatches && subject.length > 3){
        nameInput.value = ''
        mailInput.value = ''
        subjectInput.value = ''
        question.value = ''
        showSnackBar(snackbarWrapper)
      }
    
})

function errorMessage(input, message){
    let error = input.parentElement.children[2]
    error.textContent = message
    error.classList.add('show')
  
  }

  
function removeErrorMessage(input){
    let error = input.parentElement.children[2]
    error.classList.remove('show')
  } 
