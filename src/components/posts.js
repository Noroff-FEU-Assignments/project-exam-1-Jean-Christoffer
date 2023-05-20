import FetchHelper from "./fetchHelper.js";
import { gsap } from "gsap";

const selectors =
[
    '.spinner',
    '.post-section',
    '.category',
    '.load-more',
    '.sort-date',
    '.search-form',
    '#search',
]

const mapSelect = selectors.map(element => document.querySelector(element))

const 
[
    loader,
    postSection,
    category,
    loadMore,
    sortDate,
    searchForm,
    searchInput,

] = mapSelect

let pages = 1;
let blogPosts = [];
let total = 0;
let categoriesArr = [];
let posts = []

async function getCategory() {
  const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}`);
  const response = await API.get(`categories`);
  const categories = await response.json();
  categoriesArr.push(...categories);

  return categoriesArr;
}

getCategory();

async function getData(categoryValue = "", searchQuery = "") {
  try {
    const API = new FetchHelper(`${import.meta.env.VITE_API_KEY}posts`);
    let response;
    if (searchQuery !== "") {
      response = await API.get(`?_embed&search=${searchQuery}`);
    } else {
      response = await API.get(
        `?_embed${
          categoryValue ? categoryValue : ""
        }&orderby=date&order=desc&page=${pages}`
      );
    }
    const data = await response.json();

    total = response.headers.get("x-wp-totalpages");
    return [data, total];
  } catch (error) {
    console.log(error);
  }
}

function renderHTML(data, totalPosts, animate = true) {
  blogPosts = data;
  postSection.textContent = "";
  const total = Number.parseInt(totalPosts, 10);
  console.log(pages, total);


  if (pages === total || blogPosts.length === 0) {
    loadMore.style.display = "none";
  } else {
    loadMore.style.display = "block";
  }

  if (blogPosts.length === 0) {
    const noResults = document.createElement("h2");
    noResults.textContent = `No results matching "${searchInput.value}" found`;
    noResults.style.textAlign = "center";
    postSection.append(noResults);
  }

  
  blogPosts.forEach((post) => {
    const formatedText = post.excerpt.rendered;
    const parser = new DOMParser();
    const formatedElement = parser.parseFromString(formatedText, "text/html")
      .body.firstChild;
    const formattedFinal = formatedElement.textContent;

    const articleContainer = document.createElement("div");
    articleContainer.className = "article-container";
    articleContainer.id = post.id;

    const imgContainer = document.createElement("a");
    imgContainer.className = "posts-img-container";
    const articleImg = document.createElement("img");
    articleImg.src = `${post._embedded["wp:featuredmedia"][0].source_url}`;
    articleImg.alt = `${post._embedded["wp:featuredmedia"][0].alt_text}`;
    imgContainer.href = `details.html?id=${post.id}`;
    imgContainer.append(articleImg);

    const titleContainer = document.createElement("div");
    titleContainer.className = "article-title-container";

    const postTitle = document.createElement("a");
    postTitle.textContent = post.title.rendered;
    postTitle.className = "title-link";
    postTitle.href = `details.html?id=${post.id}`;

    const postArticle = document.createElement("p");
    postArticle.textContent = formattedFinal;
    postArticle.className = "subTitle-text";

    titleContainer.append(postTitle, postArticle);
    articleContainer.append(imgContainer, titleContainer);
    postSection.append(articleContainer);
  });

  if (animate) {
    gsap.fromTo(
      `.article-container`,
      {
        x: "200%",
      },
      {
        x: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          each: 0.15,
          from: "start",
        },
      }
    );
  }
}

//filter
category.addEventListener("change", () => {
  pages = 1;
  posts = []
  let found = categoriesArr.find((item) => item.name === category.value);
  found ? renderPage(`&categories=${found.id || ""}`, "") : renderPage("", "");
});



//search
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  search(searchInput.value);
});
function search(cleaner) {
  pages = 1;
  posts = []
  const trimmed = cleaner.trim();
  const urlConvert = encodeURIComponent(trimmed);

  renderPage("", urlConvert);
}
loadMore.addEventListener("click", async () => {
  if (pages < total) {
    pages += 1;
    sortDate.value = "newest"
    renderPage('','',false)
  }
});


async function renderPage(categoryValue = "", searchQuery = "", animate) {
  try {
    loader.classList.add("show");
    const [data, totalPosts] = await getData(categoryValue, searchQuery);
    posts.push(...data)
    console.log(posts)
    sortDate.addEventListener("change", () => {
      let sortedValue;
    
      if (sortDate.value === "oldest") {
        sortedValue = posts
          .slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      if (sortDate.value === "newest") {
        sortedValue = posts
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      renderHTML(sortedValue,totalPosts, true);
    });
    renderHTML(posts, totalPosts, animate);
  } catch (error) {
    console.log(error);
  } finally {
    loader.classList.remove("show");
  }
}

window.addEventListener("load", () => {
  category.value = "";
  sortDate.value = "newest";
});

renderPage();
