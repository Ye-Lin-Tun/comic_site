let active_search_box_button = document.querySelector("#active_search_box_button");
active_search_box_button.onclick = function () {
    document.querySelector("#site_logo").style.display = "none"
    document.querySelector(".nav_icon").style.display = "none";
    document.querySelector(".search_box").style.display = "flex"
}

let close_search_box_button = document.querySelector("#close_search_box_button");
close_search_box_button.onclick = function(){
    document.querySelector("#site_logo").style.display = "block"
    document.querySelector(".nav_icon").style.display = "flex";
    document.querySelector(".search_box").style.display = "none"

    // closing display_search_result
    document.querySelector(".display_search_result").style.left = "-100%";

}


let search = document.querySelector("#search");
search.addEventListener("focus",function(){
    document.querySelector(".display_search_result").style.left = "50%";
})


  // swiper element
// Initialize Swiper

