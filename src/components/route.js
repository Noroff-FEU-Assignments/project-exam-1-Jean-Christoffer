window.onload = function(){
    const path = window.location.pathname.split('/')

    switch(path[1])
    {
        case "":
        {
            loadPage('home');
            break;
        }
        case "contact":
        {
            loadPage('contact');
            break;
        }
        case "posts":
        {
            loadPage('posts');
            break;
        }
        case "about":
        {
            loadPage('about');
            break;
        }    
        case "archive":
        {
            loadPage('archive');
            break;
        }
        default:
        {
            loadPage('404')
            break;

        }         
    }

    document.querySelectorAll('.menu_item').forEach(item => {
        item.addEventListener('click',()=> {
            const path = item.getAttribute('value')
            loadPage(path)
            if(path === 'home'){
                window.history.pushState('','','/')
                return;
            }
            window.history.pushState('','',path)
        })
    })
    function loadPage($path){
        if($path === '') return;

        const container = document.querySelector('#container')

        const request = new XMLHttpRequest()
        request.open('GET','pages/' + $path + '.html');
        request.send()
        request.onload = function(){
            if(request.status === 200){
                container.innerHTML = request.responseText;
                document.title = $path;
            }
        }
    }
}