const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const imageSearch = require("./image-search-google");
const app = express();
const path = require('path');
const router = express.Router();

//file routing
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/SharkNotes.html'));
});

router.get('/scripts.js',function(req,res){
  res.sendFile(path.join(__dirname+'/scripts.js'));
});

router.get('/SharkNotes.png',function(req,res){
    res.sendFile(path.join(__dirname+'/SharkNotes.png'));
});

//post handling
// app.use(express.bodyParser());
app.get('/define', function(req, res) {
  var word = req.query.word
  console.log(word);
  getFirstDefinition(word,function(ret){
      console.log(ret);
      res.send(ret);
    });
});

app.get('/image', (req, res) => {
    var word = req.query.word
    const client = new imageSearch('002036387038026599704:yq3cuxvmjzj', 'AIzaSyCTI1kHjGY2DM8Jeidm5ol10AshgHXP8LQ');
    const options = { page: 1 };
    return client.search(word, options)
        .then(images => res.send(images[0].url))
        .catch(error => console.log(error));
})

app.get('/mathimage', (req, res) => {
    var word = req.query.word
    const client = new imageSearch('002036387038026599704:yq3cuxvmjzj', 'AIzaSyCTI1kHjGY2DM8Jeidm5ol10AshgHXP8LQ');
    const options = { page: 1 };
    client.search(word + " gif", options).then(images => {
        return res.send(images[0].url);
    }).catch(error => console.log(error));
});

//post processing
function getWebPage(url, f_handle) {
    request({
        method: 'GET',
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
        }
    }, f_handle);
}

function getFirstDefinition(word, callback) {
    getWebPage("https://www.dictionary.com/browse/" + word,
        function (err, response, body) {
            if (err) {
                return console.error(err);
            }
            var $ = cheerio.load(body);
            var first_definition = $(".one-click-content").first();
            return callback(first_definition.text());
        });
}

/*function getFirstDefinition(word, callback) {
    var $ = cheerio.load(body);
    var first_definition = $(".one-click-content").first();
    return callback(first_definition.text());
}*/

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');