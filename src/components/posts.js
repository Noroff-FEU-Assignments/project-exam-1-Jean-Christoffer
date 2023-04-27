import FetchHelper from "./fetchHelper.js";

const loader = document.querySelector('.spinner')
const postSection = document.querySelector('.post-section')
const loadMore = document.querySelector('.load-more')
const loadLess = document.querySelector('.load-less')
const category = document.querySelector('.category')
const sortFunction = document.querySelector('.oldest-newest')


let count = 100
let maxPerPage = `&per_page=${count}`
let titleAscending = `?orderby=title&order=asc`
let orderByCategory = `?categories=5`

let dateAscending = `&orderby=date&order=asc`
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

loadLess.style.display = 'none'
loadMore.addEventListener('click',() => {
    count = 12
    loadMore.style.display = 'none'
    loadLess.style.display = 'block'
    renderPage()
    
})
loadLess.addEventListener('click',()=>{
    count = 2
    loadMore.style.display = 'block'
    loadLess.style.display = 'none'
    renderPage()
})



 function renderHTML(data, categoryValue,value){

    postSection.textContent = ''
    
    let blogPosts = data
    const filteredPosts = data.filter((posts) =>
     posts._embedded['wp:term'][0][0].name.includes(categoryValue))

    if(value === 'select'){
        blogPosts = filteredPosts
    }




        
    blogPosts.map( post => {


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
                
                postSection.append(postContainer)
                
            });   
        

    

}
category.addEventListener('change',()=>{
    
    renderPage(category.value,'select')
})
sortFunction.addEventListener('change',()=>{
    if(sortFunction.value === 'old'){

        blogPosts.sort((a,b)=> {
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)
                

           return aDate - bDate

        })
    }
    if(sortFunction.value === 'new'){

        blogPosts.sort((a,b)=> {
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)
            
           return bDate - aDate
        })
    }
    
})

async function renderPage(categoryValue = '', value = ''){
    try{
        loader.classList.add('show')
        const data = await getData()
        renderHTML(data,categoryValue,value)

    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
    }
}

window.onload = () => {
    category.value = ''
    sortFunction.value = 'new'
}
renderPage()
