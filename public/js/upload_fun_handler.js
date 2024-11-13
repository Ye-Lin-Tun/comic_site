

let active_new_comic_form = document.querySelector("#active_new_comic_form");
active_new_comic_form.onclick = function(){
    let active_new_comic_form = document.querySelector("#active_new_comic_form");
    active_new_comic_form.innerHTML=="Create Now"? active_new_comic_form.innerHTML="Cancel":active_new_comic_form.innerHTML="Create Now";

    let new_comic_form = document.querySelector("#new_comic_form");
    new_comic_form.classList.toggle("active_new_comic_form");
}

// submiting the new_comic_form

let new_comic_form = document.querySelector("#new_comic_form");
new_comic_form.addEventListener("submit",async function(event){
    event.preventDefault();
    let form = new FormData(this);

    let new_comic_form = document.querySelector("#new_comic_form");
    new_comic_form.classList.toggle("active_new_comic_form");

    let pop_up = document.querySelector(".pop_up");
    pop_up.style.top = "1rem";

    pop_up.innerHTML = `<h3> Processing... </h3>`;

    let init = await fetch("/new_comic",{
        method:"POST",
        body:form
    })

    let data = await init.json();
    
    let html=""
    if(data.status==200){
        html+=`<h3>Comic created!</h3>
        <p>Comic has been created! ${data.comic_id} is the comic_id and use it to upload episode.Dont need to remember it visit <a href="/admin/all">here</a>if u forget it!!!!</p>
        <a href="/yawainaing778/upload" class="btn">Back</a>`
    }
    else{
        html+=`<h3>Failed!</h3>
        <p>FAILED to create! Reson ${data.msg}</p>
        <a href="/yawainaing778/upload" class="btn">Back</a>`
    }


    pop_up.innerHTML = html;

    
})
