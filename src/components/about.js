const selectors = 
[
    '#slides',
    'body',
    '.modal-btn',
    '.about-modal',
]
const mapSelect = selectors.map(element => document.querySelector(element))

const 
[
    slides,
    body,
    modalBtn,
    modal,
    
] = mapSelect

const buttons = document.querySelectorAll('.img-slider-button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const findNext = button.classList.contains('next') ? 1 : -1;
    const activeSlide = slides.querySelector('.active-slide');
    let newIndex = Array.from(slides.children).indexOf(activeSlide) + findNext;

    if (newIndex < 0) {
      newIndex = slides.children.length - 1;
    } else if (newIndex >= slides.children.length) {
      newIndex = 0;
    }

    activeSlide.classList.remove('active-slide');
    slides.children[newIndex].classList.add('active-slide');
  });
});

const imageSlides = document.querySelectorAll('.image-carousel .slide');

const modalImage = modal.querySelector('img');

imageSlides.forEach((slide) => {
  slide.addEventListener('click', () => {
    const clickedImageSrc = slide.querySelector('img').getAttribute('src');
    modalImage.setAttribute('src', clickedImageSrc);
    modal.showModal();
    body.classList.add('stop-scrolling')
  });
});

const dialog = document.querySelector('dialog');
dialog.addEventListener("click", (event) => {

    if (event.target === dialog) {
   
      dialog.close();
      
      body.classList.remove('stop-scrolling')
    }
  });

  modalBtn.addEventListener('click',()=> {
    modal.close()
    const body = document.querySelector('body')
    body.classList.remove('stop-scrolling')
})

