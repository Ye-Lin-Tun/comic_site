let input_box = document.querySelector("#search");
let display_search = document.querySelector(".display_search");


input_box.addEventListener("focus",function (){
    if(search_button.classList=="fas fa-search"){
        search_button.classList = "fas fa-times"
    }
    display_search.style.left = "50%";
})



input_box.addEventListener("input",async function(){
    let search = input_box.value;
    display_search.innerHTML = ``;
    let init = await fetch("/admin/search",{
        method:"POST",
        headers:{
            "Content-Type":"Application/json"
        },
        body:JSON.stringify({search})
    })

    let data  = await init.json();
    if(data.status==404){
        display_search.innerHTML = "<h3> Could not found anything </h3>"
    }
    else if(data.status==200){
        let arr = data.data;
        arr = JSON.parse(arr);
        for(let a =0;a<arr.length;a++){
            let comic_name = arr[a].comic_name;
            let comic_id = arr[a].comic_id;

            let html = ` 
          <a href="/comic/${comic_id}"><i class="fas fa-search"></i>${comic_name}</a>
            `
            display_search.insertAdjacentHTML("beforeend",html);
        }
    }
})