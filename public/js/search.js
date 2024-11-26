let search_box = document.querySelector("#search");
let search_display = document.querySelector(".display_search_result");


search_box.addEventListener("input",async function(event){
    let value = search_box.value;
    let form = new FormData();
    form.append("value",value);

    let init = await fetch("/admin/search",{method:"POST",body:form});
    let data = await init.json();

    console.log(data);

    if(data.status!=200){
        search_display.innerHTML = data.msg;
        return;
    }

    data = data.response_data;
    search_display.innerHTML ="";
    
    for(let a =0;a<data.length;a++){
        let html = ` <a href="/comic/${data[a].comic_id}" class="search_content">
        <i class="fas fa-share"></i>
        <p>${data[a].comic_name}</p>
      </a>
      `

      search_display.insertAdjacentHTML("beforeend",html);
    }


})