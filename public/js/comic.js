

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
        else if (data.status != 200) {
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

async function load_about_comic(data) {
    let name = data.comic_details.comic_name;
    let author = data.comic_details.author;
    let artist = data.comic_details.artist;
    let genres = data.comic_details.genres;
    let release_year = data.comic_details.release_year;
    let status = data.comic_details.status;
    let thumbnail_id = data.comic_details.thumbnail_id;

    let html = `
    <div class="blur_bg"> </div>  
    <img src="/thumbnail/${thumbnail_id}" id="thumbnail" alt="" loading="lazy">
    
    
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
    </div>
    `
    document.querySelector(".about_comic").innerHTML = html;
   
}

async function load_episodes(comic_id) {
    let form = new FormData();
    form.append("comic_id", comic_id);
    form.append("access", "episode");

    let init = await fetch("/admin/comic_details", { method: "POST", body: form });
    let data = await init.json();

    let name = data.comic_name
    data = data.episode;

    let episode = document.querySelector(".episode");
    if (data.length < 1) {
        episode.innerHTML = `<h3 style="color:#fff"> No episode avaiable for now </h3>`
        return;
    }



    for (let a = 0; a < data.length; a++) {
        let html = `
            <a href="/read/${data[a]}" class="box">
                <div class="episode_number">${a + 1}</div>
                <p>${name}-Episode-${a + 1}</p>
            </a>
        `

        episode.insertAdjacentHTML("beforeend", html);
    }
}

async function main() {
    let url = document.URL
    url = url.split("/");
    let comic_id = url[url.length - 1];

    let data = await fetch_data(comic_id);
    load_about_comic(data);
    const img = document.getElementById('thumbnail');
    img.onload = () => {
        Vibrant.from(img)
            .getPalette()
            .then((palette) => {
                // Map through all color swatches
                const colors = [
                    palette.Vibrant,
                
                    palette.DarkVibrant,

                    // palette.DarkMuted,

                ]
                    .filter((swatch) => swatch) // Remove null swatches
                    .map((swatch) => `rgb(${swatch.rgb[0]}, ${swatch.rgb[1]}, ${swatch.rgb[2]})`);

                // Generate gradient using all colors
                // const gradient = `linear-gradient(to bottom, #000, #000, ${colors.join(", ")}, #000,)`;
                const gradient = `linear-gradient(to bottom, #131212,${colors.join(", ")},#131212)`;

                // Apply gradient as background
                document.querySelector(".blur_bg").style.background = gradient;
            })
            .catch((error) => {
                console.error("Error analyzing image:", error);
            });
    };
    load_episodes(comic_id);
}

main();


