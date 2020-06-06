const jimp = require('jimp')
const Instagram = require('instagram-web-api')
const { promisify } = require("util")
const { readFile } = require("fs")
const { IgApiClient } = require('instagram-private-api')
const readFileAsync = promisify(readFile);

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();


//


var request = require('request');
const axios = require('axios');
const api = axios.create({
    baseURL : "https://www.xvideos.com/threads/video-comments/get-posts/top/"
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


 function getXVideosComment(){
    var rand = getRandomInt(1,30);
    request({
        uri: `https://www.xvideos.com/lang/portugues/${rand}`,
    
    }, (error,response,body) => {
    
        let x = body.match(/xv\.thumbs\.prepareVideo\(([0-9]+)\);/);
        let id = x[1];
        async function getcomment(){
            //console.log("retry");
           // console.log(id,rand)
            var comment = await api.get(`${id}/0/0`);
            if(comment.data.posts.nb_posts_total == 0){
                getXVideosComment();
            }else{
                var maxLen = Object.keys(comment.data.posts.posts).length
                let randC = getRandomInt(0,maxLen-1);
               var obj = Object.entries(comment.data.posts.posts);
                if(obj[randC][1].message.includes("&")){
                    getXVideosComment();
                }else{
                    
                    var comment = (`${obj[randC][1].message}`)
                    var nome = obj[randC][1].name
                    GerarImagem(comment,nome)
                }

            }
            
        }
        getcomment();
    });
    }






//


today = dd + '/' + mm + '/' + yyyy;

const ig = new IgApiClient()

async function login() {
    ig.state.generateDevice("username");
    await ig.account.login("username", "password");
}

login()

const Publicar = async () => {

    await ig.publish.photo({
        file: await readFileAsync("dados.jpg"),
        caption: "Comentario Aleatorio do Xvideos [BOT]"
    })
/*
    await ig.publish.story({
        file: await readFileAsync("dados.jpg")
    })
*/
}


const GerarImagem = async (comment,nome) => {
    let backgroundImage = await jimp.read('./jimp/fundo.png')
    let fontToWrite = await jimp.loadFont(jimp.FONT_SANS_16_BLACK)
    let fontee = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)

    //backgroundImage.print(fontToWrite, 140, 158, "x")
    //backgroundImage.print(fontee, 300, 85, today)
    backgroundImage.print(fontToWrite, 72, 180, nome)
    backgroundImage.print(fontToWrite, 74, 234, comment)
    //backgroundImage.print(fontToWrite, 140, 335, "x")
    await backgroundImage.writeAsync("dados.jpg")
    .then(async () => {
        await Publicar()
    })
    
}





    getXVideosComment()
