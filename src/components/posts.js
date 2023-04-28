import FetchHelper from "./fetchHelper.js";

const loader = document.querySelector('.spinner')
const postSection = document.querySelector('.post-section')
const category = document.querySelector('.category')
const loadMore = document.querySelector('.load-more')
let pages = 3


async function getDataID(categoryValue = ''){
    if (categoryValue === '') return;
    const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}`)
    const response = await API.get(`?_embed&orderby=date&order=desc`)
    const categories = await response.json()
    const categoryData = categories.find(item => item._embedded['wp:term'][0][0].name === categoryValue)
    const categoryId = categoryData._embedded['wp:term'][0][0].id

    return `&categories=${categoryId}`
  }

async function getData(categoryValue = ''){
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}`)
        const response  = await API.get(`?_embed${categoryValue ? categoryValue : ''}&orderby=date&order=desc&per_page=${pages}`)      
        const data = await response.json();

        const totalPosts = response.headers.get('x-wp-total');
        
        
        return [data, totalPosts]
    }catch(error){
        console.log(error)
    }
}




 function renderHTML(data, totalPosts){

    let blogPosts = data
    const total = Number.parseInt(totalPosts,10)
    const postArr = Number.parseInt(data.length,10)
    postSection.textContent = ''

    console.log(total, postArr)
    loadMore.addEventListener('click',  () => {
        if (postArr < total) {
          pages += 3;
          
          renderPage();
        } 
      });
      if(postArr === total){
        loadMore.style.display = 'none'
      }else{
        loadMore.style.display = 'block'
      }
    
       
    blogPosts.map( post => {


                const formatedText = post.excerpt.rendered
                const parser = new DOMParser();
                const formatedElement = parser.parseFromString(formatedText, 'text/html').body.firstChild;
                const formattedFinal = formatedElement.textContent;

                const articleContainer = document.createElement('div')
                articleContainer.className = 'article-container'
                
                const imgContainer = document.createElement('div')
                imgContainer.className = 'posts-img-container'
                const articleImg = document.createElement('img')
                articleImg.src = `${post._embedded['wp:featuredmedia'][0].source_url}`
                imgContainer.append(articleImg)

                const titleContainer = document.createElement('div')
                titleContainer.className = 'article-title-container'

                const postTitle = document.createElement('a')
                postTitle.textContent = post.title.rendered
                postTitle.className = 'title-link'
                postTitle.href=`details.html?id=${post.id}`

                const postArticle = document.createElement('p')
                postArticle.textContent = formattedFinal
                postArticle.className = 'subTitle-text'

                titleContainer.append(postTitle,postArticle)
                articleContainer.append(imgContainer, titleContainer)            
                postSection.append(articleContainer)
            });   
        

    

}
//filter
category.addEventListener('change',()=>{
    

    renderPage(`${category.value || ''}`)


})




async function renderPage(categoryValue = ''){
    try{
        loader.classList.add('show')
        
        const dataID = await getDataID(categoryValue)
        const [data, totalPosts ]= await getData(dataID) 
        renderHTML(data,totalPosts)

    }catch(error){
        console.log(error)
    }finally{
        loader.classList.remove('show')
    }
}


renderPage()
