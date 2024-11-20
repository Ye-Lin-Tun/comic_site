

async function fetch_data(comic_id) {
    try {
        let form = new FormData();
        form.append("comic_id", comic_id);
        form.append("access", "fully");
        let init = await fetch("/admin/comic_details", { method: "POST", body: form });
        let data = await init.json();

        if (data.status == 400 && data.msg == "Comic not found!") {
            let notFoundHtml = `
                <section class="not_found">
                    <img src="/img/404.jpg" alt="">
                    <a href="/" class="back_btn">Back</a>
                </section>`
            document.querySelector("body").insertAdjacentHTML("beforeend", notFoundHtml);
            return false;
        }
        else if (data.status !=200) {
            document.querySelector(".pop_up").style.top = '1rem';
            document.querySelector(".pop_up").innerHTML = ` <h3 id="pop_up_header">Error</h3>
            <p id="pop_up_message">${data.msg}</p>`;

            setTimeout(() => {
                document.querySelector(".pop_up").style.top = '-100%';
            }, 5000);

            return false;
        }

        return data;


    }
    catch (err) {
        console.log(err);
    }
}

async function load_about_comic(data){
    let name = data.comic_details.comic_name;
    let author = data.comic_details.author;
    let artist =data.comic_details.artist;
    let genres = data.comic_details.genres;
    let release_year = data.comic_details.release_year;
    let status  = data.comic_details.status;
    let thumbnail_id = data.comic_details.thumbnail_id;
    
    let html = `

    <img src="/${thumbnail_id}" alt="" loading="lazy">
    
    
    <div class="details">
      <h3 class="comic_name">${name}</h3>

      <p class="details_head">Author(s)</p>
      <p class="data">${author}</p>

      <p class="details_head">Artist(s)</p>
      <p class="data">${artist}</p>

      <p class="details_head">Genre(s)</p>
      <p class="data">${genres}</p>


      <p class="details_head">Release</p>
      <p class="data">${release_year}</p>

      <p class="details_head">Status</p>
      <p class="data">${status}</p>
    `
    document.querySelector(".about_comic").innerHTML = html;
}

async function main() {
    let url = document.URL
    url = url.split("/");
    let comic_id = url[url.length - 1];

    let data = await fetch_data(comic_id);
    console.log(data.comic_details);
    load_about_comic(data);
}

main();