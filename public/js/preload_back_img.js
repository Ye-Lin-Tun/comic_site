let perload_img  = [
    "/back_img/back1.jpg",
    "/back_img/back2.jpg",
    "/back_img/back3.jpg",
    "/back_img/back4.jpg",
    "/back_img/back5.jpg",
    "/back_img/back6.jpg",  
]

function preloadImages(imageUrls) {
    console.log("loading images...");
    imageUrls.forEach((url) => {
        const img = new Image(); // Create an Image object
        img.src = url;           // Set the image URL to start preloading
        console.log(`Preloading image: ${url}`);
    });
}

let index = 0;
setInterval(() => {
    document.querySelector(".header").style.background = `url("${perload_img[index]}")`;
    document.querySelector(".header").style.backgroundPosition = "center";
    document.querySelector(".header").style.backgroundRepeat = "no-repeat";
    document.querySelector(".header").style.backgroundSize = "cover";
    index++;
    // console.log(index)
    if(index==6){
        index=0
    }
    // console.log('changed bg!')
},5000);



// Start preloading images when the script runs
preloadImages(perload_img);
