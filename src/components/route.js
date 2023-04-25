const spinner = document.querySelector('.spinner')
window.addEventListener("hashchange", function () {
    // Get the hash value from the URL
    var hash = window.location.hash;
  
    // Load the appropriate content based on the hash value
    if (hash === "#home") {
      spinner.classList.add('show')
      fetch("pages/home.html")
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          document.getElementById("content").innerHTML = html;
        }).finally(()=>{spinner.classList.remove('show')})
    } else if (hash === "#about") {
      fetch("pages/about.html")
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          document.getElementById("content").innerHTML = html;
        });
    } else if (hash === "#contact") {
      fetch("pages/contact.html")
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          document.getElementById("content").innerHTML = html;
        });
    } else if (hash === "#posts") {
        fetch("pages/posts.html")
          .then(function (response) {
            return response.text();
          })
          .then(function (html) {
            document.getElementById("content").innerHTML = html;
          });
      } else if (hash === "#archive") {
        fetch("pages/archive.html")
          .then(function (response) {
            return response.text();
          })
          .then(function (html) {
            document.getElementById("content").innerHTML = html;
          });
      }
  });
  window.dispatchEvent(new Event("hashchange"));
  