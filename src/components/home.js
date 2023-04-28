
import FetchHelper from "./fetchHelper.js";
const latestSection = document.querySelector('#latest')
const loader = document.querySelector('.spinner')





let maxPerPage = `&per_page=6`
let dateDescending = `&orderby=date&order=desc`

async function getData(){
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}`)
        const data = await API.get(`?_embed${maxPerPage}${dateDescending}`)
     
        return data


    }catch(error){
        console.log(error)
    }
}



async function renderHTML(data){

        // Hero section

        //Latest blog posts

        try{
            data.forEach(async post => {


                const formatedText = post.excerpt.rendered
                const parser = new DOMParser();
                const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild;
                const formattedFinal = formatedElement.textContent;



                const postContainer = document.createElement('div')
                postContainer.className = 'blog-card'
                

                const imgContainer = document.createElement('div')
                imgContainer.className = 'blog-card-img-container'
                const postImage = document.createElement('img')
                postImage.src = `${post._embedded['wp:featuredmedia'][0].source_url}`
                postImage.className = 'blog-card-img'
                imgContainer.append(postImage)
        
                const cardBody = document.createElement('div')
                cardBody.className = 'card-body'
        
                const category = document.createElement('span')
                category.className = `${post._embedded['wp:term'][0][0].name} tag`
               
                category.textContent = `${post._embedded['wp:term'][0][0].name}`
            
                const postTitle = document.createElement('a')
                postTitle.textContent = post.title.rendered
                postTitle.className = 'title-link'
                postTitle.href=`details.html?id=${post.id}`


                const readMore = document.createElement('a')
                readMore.textContent = 'Read more'

                readMore.href = `details.html?id=${post.id}`
                readMore.className = 'read-more'
            
                const postArticle = document.createElement('p')
                postArticle.textContent = formattedFinal
                postArticle.className = 'subTitle-text'
            
                const postArticleContainer = document.createElement('article')
                postArticleContainer.append(postTitle, postArticle,readMore)
                
                const cardBottom = document.createElement('div')
                cardBottom.className = 'card-bottom'
        
                const writer = document.createElement('div')
                writer.className = 'writer'
        
        
        
                const userInfo = document.createElement('div')
                const userName = document.createElement('p')
                userName.textContent = `Author: ${post._embedded.author[0].name}`


                const dateWritten = document.createElement('small')
                const newDate = new Date(post.date)
                
                const getDay = newDate.getDate()
                const getMonth = newDate.getMonth() + 1
                const getYear = newDate.getFullYear()
            
                let formatedMonth
                let formatedDay
                
                getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
                getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
                dateWritten.textContent = `Published: ${formatedDay}.${formatedMonth}.${getYear}`



                userInfo.append(userName,dateWritten)
                writer.append( userInfo)
                cardBottom.append(writer)
                cardBody.append(category,postArticleContainer,cardBottom)
                postContainer.append(imgContainer,cardBody)
                
                latestSection.append(postContainer)
                
            });   
        }catch(error){
            console.log(error)
        }

    

}

async function renderPage(){
    try{
        loader.classList.add('show')
        const data = await getData()
        renderHTML(data)

    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
        sliderFunction()
    }
}
renderPage()



//Slider 
const next = document.querySelector('.arrow-right')
const prev = document.querySelector('.arrow-left')
const slider = document.querySelector('.slider')

function sliderFunction(){
    const cards = document.querySelectorAll('.blog-card')
    const firstCard = cards[0]

    let firstCardWidth = firstCard.clientWidth  + 18

    next.addEventListener('click',()=> {
        slider.scrollLeft += firstCardWidth
        pageChecker()
    })
    prev.addEventListener('click',()=> {
        slider.scrollLeft -= firstCardWidth
        pageChecker()
    })

}

function pageChecker(){

    let sliderWidth = slider.scrollWidth - slider.clientWidth

    const timeOutPrev = () => {
        slider.scrollLeft > 0 ? prev.disabled = false : prev.disabled =  true
    }
    const timeOutNext = () => {
        slider.scrollLeft === sliderWidth ? next.disabled = true : next.disabled =  false
    }
    console.log(slider.scrollLeft)
    setTimeout(timeOutPrev,60)
    setTimeout(timeOutNext,60)

    clearTimeout(timeOutPrev)
    clearTimeout(timeOutNext)
}