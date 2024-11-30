let active_episode_deleter  = document.querySelector("#active_episode_deleter");
let delete_episode_form  = document.querySelector("#delete_episode_form");
active_episode_deleter.onclick = function(){
    delete_episode_form.classList.toggle("active_delete_episode_form")
    if(active_episode_deleter.innerHTML = "Delete"){
        active_episode_deleter.innerHTML = "Cancel"
    }
    else{
        active_episode_deleter.innerHTML   = "Delete"
    }
}

delete_episode_form.onsubmit  = async function(event){
    event.preventDefault();
    let form = new FormData(this);
    let init  = await fetch("/admin/delete_episode",{method:"POST",body:form});
    let data = await init.json();
    if(data.status!=200){
        let delete_pop_up = document.querySelector(".delete_pop_up");
        delete_pop_up.innerHTML = `<h3> Error </h3> <p> ${data.msg} </p> <a href="/yawainaing778/upload" class="btn">Back</a>`;
        delete_pop_up.style.top = "1rem";
        return;
    }

    if(data.status==200){
        let delete_pop_up = document.querySelector(".delete_pop_up");
        delete_pop_up.innerHTML = `<h3> Deleted </h3> <a href="/yawainaing778/upload" class="btn">Back</a>`;
        delete_pop_up.style.top = "1rem";
    }
    
}