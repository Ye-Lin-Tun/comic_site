function get_name(total_char) {
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!";
    let final_random_name = "";
    for (let i = 0; i < total_char; i++) {
        let random_number = Math.floor(Math.random() * str.length);
        final_random_name += str[random_number];
    }
    return final_random_name;
}

async function unique_id(comic_name_collection) {
    while (true) {
        try{
            let temp_comic_id = get_name(8);
            let check = await comic_name_collection.find({ comic_id: temp_comic_id });
            if (check[0] == undefined) {
                return temp_comic_id
            }
        }
        catch(err){}
    }
}

async function unique_folder_id(comic_folder_collection) {
    while (true) {
        try {
            let temp_comic_id = get_name(10);
            let check = await comic_folder_collection.find({[temp_comic_id]:temp_comic_id}).toArray();
            
            if (check.length==0) {
                return temp_comic_id;
            }
        }
        catch(err){
            console.log(err);
        }
    }
}

module.exports.random_name = { get_name, unique_id, unique_folder_id }