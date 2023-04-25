
import data from "./data.js";



function renderHTML(){

        // Hero section

        const homeHeader = document.createElement('div')
        homeHeader.className = 'home-header'
        
        const heroText = document.createElement('div')
        heroText.className = 'hero-text'

        const heroTitle = document.createElement('h1')
        heroTitle.className = 'title-site title-home'
        heroTitle.textContent = 'Welcome to WAVE'
        const heroSubtitle = document.createElement('h2')
        heroSubtitle.textContent = 'The number one electro blog'

        heroText.append(heroTitle,heroSubtitle)
        homeHeader.append(heroText)

        const latestPosts = document.createElement('section')
        const latestPostsTitle = document.createElement('h1')
        latestPostsTitle.textContent = 'Latest posts'
        latestPosts.append(latestPostsTitle)

        //Latest blog posts

        data.forEach(post => {


        const postContainer = document.createElement('div')

        const postImage = document.createElement('img')
        postImage.src = post.img
    
        const postTitle = document.createElement('h2')
        postTitle.textContent = post.title
    
        const postArticle = document.createElement('p')
        postArticle.textContent = post.subTitle
    
        const postArticleContainer = document.createElement('article')
        postArticleContainer.append(postTitle, postArticle)
    
        postContainer.append(postArticleContainer, postImage)
        
        latestPostContainer.append(postContainer)
        
    });

    

}

renderHTML()

