let new_form_close_btn = document.querySelector("#new_form_close_button");
new_form_close_btn.onclick = function(){
    let new_form_input_box = document.querySelector(".new_comic_input_box");
    new_form_input_box.style.top = "-110%"
}

let new_comic_button = document.querySelector("#new_comic_button");
new_comic_button.onclick = function(){
    let new_form_input_box = document.querySelector(".new_comic_input_box");
    new_form_input_box.style.top = "10%"
}


function sumbit_new_comic(event){
    event.preventDefault(); // Prevent the default form submission behavior
    let new_form = new FormData(this);

    let new_form_input_box = document.querySelector(".new_comic_input_box");
    new_form_input_box.style.top = "-110%"

    let result_show_box = document.querySelector(".result_show_box");
    result_show_box.style.left = "50%"

    
    fetch("/new_comic", {
        method: "post",
        body: new_form
    }).then((val) => {
        return val.json();
    }).then((data) => {
        if(data.status==200){
           result_show_box.innerHTML = `<div class="show_message">
            <p class="text">
                Comic created!
            </p>

            <p>
                comic_id = ${data.comic_id}
            </p>

            <b>** dont need to remember this comic id visit <a href="/yawainaing778/viewall">here</a> if you need it</b>
            <a href="/yawainaing778/upload" class="btn">Back</a>

        </div>`
        }
        else{
            console.log("inside else error");
            result_show_box.innerHTML = `<div class="show_message">
            <p class="text">
                Comic creation failed!
            </p>

            <p>
                Reason:${data.msg}
            </p>

            <a href="/yawainaing778/upload" class="btn">Back</a>

        </div>`
        }
        console.log(data);
    }).catch((err) => {

        console.log(err);
    });
}

// Attach the submit event listener to the form only once, when the DOM is loaded
let new_comic_form = document.querySelector("#new_comic_form");
new_comic_form.addEventListener("submit", sumbit_new_comic);



