async function getImgNum() {
  try {
    // Get folder name from URL
    let url = document.URL;
    url = url.split("/").pop(); // More concise way of getting last part of URL
    console.log(url);

    // Fetch request to get image numbers
    let response = await fetch("/get_img_num", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ folder_name: url })
    });

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse JSON data from response
    let data = await response.json();

    // If data is successful, load images
    if (data.status === 200) {
      let container = document.querySelector(".container");
      let imgs = data.images ;

      let next = data.next;
      let previous = data.previous;

      let previous_button = document.querySelector("#previous");
      let next_button = document.querySelector("#next");

      previous_button.dataset.id = previous;
      next_button.dataset.id = next;


      // Loop through the images and append them to the container
      for (let i = 0; i < imgs.length; i++) {
        console.log(imgs[i]);
        let img = document.createElement("img");
        img.src = `/${url}/${imgs[i]}`;

        img.onload = function () {
          container.append(img); // Append image after it's fully loaded
        };

        img.onerror = function () {
          console.log(`Error loading image: ${imgs[i]}`);

        };
      }
    } else {
      console.log("Error fetching images:", data);
    }
  } catch (err) {
    console.log("Fetch error:", err);
  }
}


getImgNum();


let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let message = document.querySelector("#message");

previous.onclick = function(){
  let data = previous.dataset.id;
  if(data=="null"){
    message.innerHTML = "No previous comic available!"
    let temp = document.querySelector(".temp");
    temp.style.left = "50%";
  }
  else{
    l = `/read/${data}`
    document.location.href = l;
  }
  
}
next.onclick = function(){
  let data = next.dataset.id;

  if(data=="null"){
    
    message.innerHTML = "No next comic available!"
    let temp = document.querySelector(".temp");
    temp.style.left = "50%";
  }
  else{
    l = `/read/${data}`
    document.location.href = l;
  }
}

let close_temp_button = document.querySelector("#close_temp_button");
close_temp_button.onclick = function(){
  let temp = document.querySelector(".temp");
  temp.style.left = "-100%";
}