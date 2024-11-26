async function main(){
    let url = document.URL;
    let folder_name = url.split("/");
    folder_name = folder_name[folder_name.length-1];
    
    let form = new FormData();
    form.append("folder_id",folder_name);

    let init = await fetch("admin/folder_details",{method:"POST",body:form});
    let data = await init.json();
    console.log(data);
    create_content_box(data);

    for(let a =0;a<data.images.length;a++){
        let img = document.createElement("img");
        img.src = `/data/${folder_name}/${data.images[a]}`;

        img.onload = function () {
            document.querySelectorAll(".content")[a].innerHTML = '';
            document.querySelectorAll(".content")[a].insertAdjacentElement("beforeend",img)
        };

        img.onerror = function () {
          console.log(`Error loading image: ${imgs[i]}`);

        };
    }


}


function create_content_box(data){
    let total_images = data.total_images;
    let comic_image = document.querySelector(".comic_image");
    for(let a  =0;a<total_images;a++){
        comic_image.insertAdjacentHTML("beforeend",`<div class="content">
                                                    <div class="loader"></div>
                                                    </div>`)     
                                      
    }

}

function load_images(data,folder_id){
    let images  = data.images;
    let path = `/data/${folder_id}`;
}
 

  

main();