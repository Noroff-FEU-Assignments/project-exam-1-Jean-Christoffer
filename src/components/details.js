import FetchHelper from "./fetchHelper.js";
const loader = document.querySelector('.spinner')

const queryString = document.location.search;
const params  = new URLSearchParams(queryString);
const id = params.get("id");

const selectors = [
    '.blog-section',
    '.blog-title',
    '.blog',
    '.blog-container',
    '.date','.author',
    'form',
    '.input-field-name',
    '.input-field-comment',
    '.article-header',
    '.input-field-email',
    '.comment-field',
    '.comment-count'
]
const mapSelect = selectors.map(element => document.querySelector(element))
const [
    blogSection,
    blogTitle,
    blog,
    blogContainer,
    date,
    author,
    form,
    authorName,
    comment, 
    articleHeader,
    email,
    commentField,
    commentCount
] = mapSelect

const months = {

}

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

form.addEventListener('submit', async function(e) {
    e.preventDefault()
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY2}`)
        const post = await API.post(`comments?post=${id}`,{
            "post": id,
            "author_name": `${authorName.value}`,
            "author_email": `${email.value}`,
            "content": `${comment.value}`
        })
   


    } catch(error){
        console.log(error)
    }

})

async function getComments(){
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY2}`)
        const response = await API.get(`comments?post=${id}`)
        const comments = await response.json()

        return comments


    } catch(error){
        console.log(error)
    }
}

function renderHtml(data, comments){

    const formatedText = data.content.rendered
    const parser = new DOMParser();
    const nodes = parser.parseFromString(formatedText, 'text/html').body.childNodes

    
        nodes.forEach(element => {
            const paragraph = document.createElement('p')
            paragraph.className = 'paragraph-text'
            paragraph.textContent =  element.textContent
            return blogContainer.append(paragraph) 
        })

        comments.forEach(comment => {
            const formatedText = comment.content.rendered
            const parser = new DOMParser();
            const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild.textContent;

            const commentContainer = document.createElement('div')
            commentContainer.classList = 'comment-container'

            const comments = document.createElement('p')
            comments.textContent = formatedElement

            const commentAuthor = document.createElement('h4')
            commentAuthor.textContent = comment.author_name

            const dateWritten = document.createElement('small')
            const newDate = new Date(comment.date)
            
            const getDay = newDate.getDate()
            const getMonth = newDate.getMonth() + 1
            const getYear = newDate.getFullYear()
        
            let formatedMonth
            let formatedDay
            
            getMonth < 10 ? formatedMonth = `0${getMonth}` : formatedMonth = getMonth
            getDay < 10 ? formatedDay = `0${getDay}` : formatedDay = getDay
            dateWritten.textContent = `Published: ${formatedDay}.${formatedMonth}.${getYear}`
            commentContainer.append(dateWritten, commentAuthor,comments)
            return commentField.append(commentContainer)
       
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

    commentCount.textContent = `Comments (${comments.length})`

    
}

async function renderPage(){
    try{
        loader.classList.add('show')
        const data = await getData(id)
        const comments = await getComments()
        console.log(comments)
        renderHtml(data, comments)
    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
    }
}
renderPage()