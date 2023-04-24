const hamburger = document.querySelector('.hamburger')
const nav = document.querySelector('.nav')


let activeClass = false
hamburger.addEventListener('click',  () => {

  activeClass = !activeClass

  if(activeClass){
    hamburger.classList.add('active')
    nav.classList.add('active')
  }else{
    hamburger.classList.remove('active')
    nav.classList.remove('active')
  }

})

