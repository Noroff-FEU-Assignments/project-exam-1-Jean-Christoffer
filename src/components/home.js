
import data from "./data.js";
const latestSection = document.querySelector('.latest-posts-section')


function renderHTML(){

        // Hero section

        //Latest blog posts

        data.forEach(post => {


        const postContainer = document.createElement('div')
        postContainer.className = 'blog-card'

        const imgContainer = document.createElement('div')
        imgContainer.className = 'blog-card-img-container'
        const postImage = document.createElement('img')
        postImage.src = post.img
        postImage.className = 'blog-card-img'
        imgContainer.append(postImage)

        const cardBody = document.createElement('div')
        cardBody.className = 'card-body'

        const category = document.createElement('span')
        category.className = `${post.category} tag`
        category.textContent = `${post.category}`
    
        const postTitle = document.createElement('a')
        postTitle.textContent = post.title
        postTitle.className = 'title-link'
        postTitle.href=`details.html?id=${post.id}`
    
        const postArticle = document.createElement('p')
        postArticle.textContent = post.subTitle
    
        const postArticleContainer = document.createElement('article')
        postArticleContainer.append(postTitle, postArticle)
        
        const cardBottom = document.createElement('div')
        cardBottom.className = 'card-bottom'

        const writer = document.createElement('div')
        writer.className = 'writer'



        const userInfo = document.createElement('div')
        const userName = document.createElement('p')
        userName.textContent = `Writer: ${post.writer}`
        const dateWritten = document.createElement('small')
        dateWritten.textContent = `Published: ${post.date}`
        userInfo.append(userName,dateWritten)
        writer.append( userInfo)
        cardBottom.append(writer)
        cardBody.append(category,postArticleContainer,cardBottom)
        postContainer.append(imgContainer,cardBody)
        
        latestSection.append(postContainer)
        
    });

    

}

renderHTML()

