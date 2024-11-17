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
    let html = ``
    let index = 0;
    while (index < random_comic.length) {
        let html = `
                <div class="child_container">
                    <a href="/comic/${random_comic[index].comic_id}" class="content">
                        <img src="/${random_comic[index].thumbnail_id}" alt="">
                        <p>${random_comic[index].comic_name}</p>
                    </a>
                    <a href="/comic/${random_comic[index+1].comic_id}" class="content">
                        <img src="/${random_comic[index+1].thumbnail_id}" alt="">
                        <p>${random_comic[index+1].comic_name}</p>
                    </a>
                </div>`

        let load_more = document.querySelector("#load_more_button");
        load_more.insertAdjacentHTML("beforebegin",html);
        index = index+2;
    }

}
load_random_comic();

