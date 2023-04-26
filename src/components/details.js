import FetchHelper from "./fetchHelper.js";
const loader = document.querySelector('.spinner')

const queryString = document.location.search;
const params  = new URLSearchParams(queryString);
const id = params.get("id");

const selectors = ['.blog-section','.blog-title','.blog','.blog-container']
const mapSelect = selectors.map(element => document.querySelector(element))
const [blogSection, blogTitle, blog,blogContainer] = mapSelect

async function getData(param){
    try{
        const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}/${param}`)
        const data = await API.get(`?_embed`)
     

        return data


    }catch(error){
        console.log(error)
    }
}

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

    


    blogTitle.textContent =  data.title.rendered


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