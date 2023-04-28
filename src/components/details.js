import FetchHelper from "./fetchHelper.js";
const loader = document.querySelector('.spinner')

const queryString = document.location.search;
const params  = new URLSearchParams(queryString);
const id = params.get("id");

const selectors = ['.blog-section','.blog-title','.blog','.blog-container','.date','.author','form',
'.input-field-name','.input-field-comment','.article-header']
const mapSelect = selectors.map(element => document.querySelector(element))
const [blogSection, blogTitle, blog,blogContainer,date,author,form,authorName,comment, articleHeader] = mapSelect

async function getData(param){
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}/${param}`)
        const response = await API.get(`?_embed`)
        const data = await response.json(); 
     

        return data


    }catch(error){
        console.log(error)
    }
}

form.addEventListener('submit', function(e) {
    
    e.preventDefault()
    const data = JSON.stringify({
        
        author_name: authorName.value,
        content: comment.value
    })

    fetch(`https://wave.jeandahldev.no/wp-json/wp/v2/comments`,{
        method:'post',
        headers:{
            'Content-Type': 'application/json',
        },
        body: data
    })
    .then((response) => {
        if(response.ok === true){
            console.log('worked!')
        }
        return response.json()
    }).catch(error => console.log(error))
    
})


function renderHtml(data){

    const formatedText = data.content.rendered
    const parser = new DOMParser();
    const nodes = parser.parseFromString(formatedText, 'text/html').body.childNodes

    
        nodes.forEach(element => {
            const paragraph = document.createElement('p')
            paragraph.className = 'paragraph-text'
            paragraph.textContent =  element.textContent
            return blogContainer.append(paragraph) 
        })

    

    articleHeader.style.backgroundImage = `url(${data._embedded['wp:featuredmedia'][0].source_url})`
    blogTitle.textContent =  data.title.rendered
    author.textContent = `Author: ${data._embedded.author[0].name}`
    
    
    const newDate = new Date(data.date)
    

    const getDay = newDate.getDate()
    const getMonth = newDate.getMonth() + 1
    const getYear = newDate.getFullYear()

    let formatedMonth
    let formatedDay
    
    getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
    getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
    date.textContent =`Published: ${formatedDay}.${formatedMonth}.${getYear}`

    
}

async function renderPage(){
    try{
        loader.classList.add('show')
        const data = await getData(id)
        renderHtml(data)
    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
    }
}
renderPage()