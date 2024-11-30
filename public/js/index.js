let active_search_box_button = document.querySelector("#active_search_box_button");
active_search_box_button.onclick = function () {
    document.querySelector("#site_logo").style.display = "none"
    document.querySelector(".nav_icon").style.display = "none";
    document.querySelector(".search_box").style.display = "flex"
}

let close_search_box_button = document.querySelector("#close_search_box_button");
close_search_box_button.onclick = function () {
    document.querySelector("#site_logo").style.display = "block"
    document.querySelector(".nav_icon").style.display = "flex";
    document.querySelector(".search_box").style.display = "none"

    // closing display_search_result
    document.querySelector(".display_search_result").style.left = "-100%";

}


let search = document.querySelector("#search");
search.addEventListener("focus", function () {
    document.querySelector(".display_search_result").style.left = "50%";
})

async function load_random_comic() {
    let init = await fetch("/admin/random_comic", { method: "GET" });
    let data = await init.json();

    if (data.status != 200) {
        console.log("Error");
        return;
    }



    let random_comic = data.random_comic;
    console.log(random_comic)
   
    let a = 0;
    let comic_container = document.querySelector(".comic_container");
    comic_container.innerHTML  = '';
    while (a < random_comic.length) {
        
        if(random_comic[a].status=="OnGoing"){
            let html = `
                <a href="comic/${random_comic[a].comic_id}" class="content">
                    <div class="status_on_thumbnail">${random_comic[a].status}</div>
                    <img src="thumbnail/${random_comic[a].thumbnail_id}" alt="">
                    <div class="comic_title">
                        <p class="comic_name">${random_comic[a].comic_name}</p>
                        <div class="view">
                            <i class="fas fa-eye"></i>
                            <p>${random_comic[a].views}</p>
                        </div>
                    </div>
                </a>
            `

            comic_container.insertAdjacentHTML("beforeend",html);
        }

        if(random_comic[a].status=="End"){
            let html = `
                <a href="comic/${random_comic[a].comic_id}" class="content">
                    <div class="status_on_thumbnail red">${random_comic[a].status}</div>
                    <img src="thumbnail/${random_comic[a].thumbnail_id}" alt="">
                    <div class="comic_title">
                        <p class="comic_name">${random_comic[a].comic_name}</p>
                        <div class="view">
                            <i class="fas fa-eye"></i>
                            <p>${random_comic[a].views}</p>
                        </div>
                    </div>
                </a>
            `
            comic_container.insertAdjacentHTML("beforeend",html);

        }
        a++;
    }

}
load_random_comic();

