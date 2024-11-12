let url = document.URL
url = url.split("/");
let comic_id = url[url.length-1];

insetData();

async function getComicData(comic_id) {
    let init = await fetch(`/get_comic`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Setting the header to tell the server it's JSON
        },
        body: JSON.stringify({comic_id: comic_id }) // Convert to JSON string
    });
    let data = await init.json();
    return data;
}

async function loadEp(ep,name,thubmnail){
    
    for(let a  =0;a<ep.length;a++){
        let pdf_id = ep[a];
        let ep_number = a+1;

        let html = `<a href="/read/${pdf_id}" class="box">
            <div class="container">
                <div class="img_container">
                    <img src="/${thubmnail}" alt="">
                    <p class="number">${ep_number}</p>
                </div>
                <p>${name} ep-${ep_number}</p>
            </div>
        </a>`

        document.querySelector(".ep").insertAdjacentHTML("beforeend",html);

    }
}

async function insetData() {
    try{
        let data = await getComicData(comic_id);
        if(data.status!=200){
            throw new Error(data.msg);
        }
        data = data.data;
        let thubmnail = data.thubmnail;
        let name = data.name;
        let title = name;
        if(data.status=="end"){
            title = title+"🔴"
        }
        else{
            title = title+"🟢"
        }

        let type = data.type
        let description  = data.description;
        let folder_names = data.folder_names;


         

        await new   Promise((res,rej)=>{
            let img = new Image();
            img.src = `/${thubmnail}`


            img.onload = function(){
                console.log("image loaded!");
                let comic_thubmnail = document.querySelector("#comic_thubmnail");
                comic_thubmnail.src = thubmnail;

                document.querySelector(".description").innerHTML = description;
                document.querySelector(".type").innerHTML = type;
                document.querySelector(".name").innerHTML = title;
                document.querySelector(".total_pdf").innerHTML = "Total episode - "+folder_names.length

                loadEp(folder_names,name,thubmnail)
            }
        })
    }
    catch(err){
        console.log(err);
    }
}




