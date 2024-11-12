let upload_comic = document.querySelector("#upload_comic");
// toggle the check comic form
upload_comic.onclick = function () {
    let upload_pdf = document.querySelector("#upload_pdf");
    upload_pdf.style.left = "50%"
}

// off the check coic form
let upload_pdf_close_btn = document.querySelector("#upload_pdf_close_btn");
upload_pdf_close_btn.onclick = function () {
    let upload_pdf = document.querySelector("#upload_pdf");
    upload_pdf.style.left = "-100%"
}

// close file_upload_form
let close_file_upload_btn = document.querySelector("#close_file_upload_btn");
close_file_upload_btn.onclick = function () {
    let upload_file = document.querySelector(".upload_file");
    upload_file.style.left = "-100%";
}

// checking comic_id

let check_comic_id_form = document.querySelector(".check_comic_id_form");
check_comic_id_form.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        let form = new FormData();
        let comic_id = document.querySelector("#comic_id");
        form.append("comic_id", comic_id.value);

        // after getting form close the check_comic_form 
        let upload_pdf = document.querySelector("#upload_pdf");
        upload_pdf.style.left = "-100%"

        // opening result show box
        let result_show_box = document.querySelector(".result_show_box");
        result_show_box.innerHTML = "<h1>⌚ Processing... <h1>"
        result_show_box.style.left = "50%";
        let init = await fetch("/check_comic_id", { method: "POST", body: form });
        let data = await init.json();


        if (data.status == 400) {
            let html = `<h1> Comic not found! </h1> 
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>`;
            result_show_box.innerHTML = html;
            return;
        }

        // if comic found close the result_show_box and on the file uploader form;
        result_show_box.style.left = "-100%";
        let upload_file = document.querySelector(".upload_file");
        upload_file.style.left = "50%";

        let comic_name = document.querySelector("#comic_name");
        comic_name.textContent = data.comic_name;

        define_file_upload(data.comic_id);
    }
    catch (err) {
        console.log(err);
    }

})


function define_file_upload(comic_id) {
    console.log(comic_id);
    let file_form = document.querySelector("#file_form");
    file_form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let form = new FormData(this);
        form.append("comic_id", comic_id);

        let xhr = new XMLHttpRequest();

        let upload_pdf = document.querySelector("#upload_file");
        upload_pdf.style.left = "-100%";

        let result_show_box = document.querySelector(".result_show_box");
        result_show_box.style.left = "50%"

        result_show_box.innerHTML = `<h1>Uploading...</h1>
        <div class="loading_bar"><div class="show_upload"></div></div>`

        xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                let percentComplete = (event.loaded / event.total) * 100;  // Calculate percentage of upload completion
                console.log(Math.round(percentComplete));
                document.querySelector(".show_upload").style.width = Math.round(percentComplete) + "%";
                if (percentComplete >= 100) {
                    result_show_box.innerHTML = `<h1>File uploaded! Converting pdf to images that might take sometimes realx and dont close the browser even dont press home button😅</h1>`
                }
            }
        });

        xhr.onload = function () {
            let response_json = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {

                result_show_box.innerHTML = `<h1>All Done!</h1>
            <p> Comic url </p>
            <p class="link">${document.baseURI}comic/${response_json.comic_id}</p>
            <p> pdf url </p>
            <P class="link">${document.baseURI}read/${response_json.pdf_id}</p>
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>
            `
            } else {
                console.log("here");
                result_show_box.innerHTML = `<h1>FAILED! reason = ${response_json.msg}</h1>
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>
            `
            }

        };

        xhr.onerror = function () {
            result_show_box.innerHTML = `<h1>FAILED! reason = ${response_json.msg}</h1>
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>
            `
        };

        xhr.open('POST', '/upload_pdf', true);  // Change `/upload_endpoint` to your server route
        xhr.send(form);

    })
}



function upload_pdf_file(event) {
    event.preventDefault();
    let form = new FormData(this);
    let xhr = new XMLHttpRequest();

    let upload_pdf = document.querySelector("#upload_pdf");
    upload_pdf.style.left = "-100%";

    let result_show_box = document.querySelector(".result_show_box");
    result_show_box.style.left = "50%"

    result_show_box.innerHTML = `<h1>Uploading...</h1>
        <div class="loading_bar"><div class="show_upload"></div></div>`

    xhr.upload.addEventListener('progress', function (event) {
        if (event.lengthComputable) {
            let percentComplete = (event.loaded / event.total) * 100;  // Calculate percentage of upload completion
            console.log(Math.round(percentComplete));
            document.querySelector(".show_upload").style.width = Math.round(percentComplete) + "%";
            if (percentComplete >= 100) {
                result_show_box.innerHTML = `<h1>Finishing up!One moment please!</h1>`
            }
        }
    });

    xhr.onload = function () {
        let response_json = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {

            result_show_box.innerHTML = `<h1>All Done!</h1>
            <p> Comic url </p>
            <p class="link">${document.baseURI}comic/${response_json.comic_id}</p>
            <p> pdf url </p>
            <P class="link">${document.baseURI}read/${response_json.pdf_id}</p>
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>
            `
        } else {
            console.log("here");
            result_show_box.innerHTML = `<h1>FAILED! reason = ${response_json.msg}</h1>
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>
            `
        }

    };

    xhr.onerror = function () {
        result_show_box.innerHTML = `<h1>FAILED! reason = ${response_json.msg}</h1>
            <a href="/yawainaing778/upload" style="margin-top:1rem" class="btn">Back</a>
            `
    };

    xhr.open('POST', '/upload_pdf', true);  // Change `/upload_endpoint` to your server route
    xhr.send(form);
}




