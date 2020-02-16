function getImage(word, callback) {
    $.get("/image?word=" + word, callback);
}
///getImage("", function(r){console.log(r)});

function getFirstDefinition(word, callback) {
    console.log(word);
    $.get("/define?word="+word,function(data){
        callback(data);
    });
}

/// getFirstDefinition("python",function(r){console.log(r)});
var mathTerms = ["sin",
    "cos",
    "rad",
    "tangent",
    "linear tranformation",
    "dot product",
    "cross product",
    "integral",
    "derivative",
    "linear span"];

function getMathGifs(word, callback) {
    $.get("/image?mathimage=" + word, callback);
}

//read file in
function readBlob(opt_startByte, opt_stopByte) {
    var files = document.getElementById('files').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    var file = files[0];

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            document.getElementById('byte_content').textContent = evt.target.result;
        }
    };

    var blob = file.slice(0, file.size);
    reader.readAsBinaryString(blob);
}

window.onload = function () {
    document.querySelector('.readBytesButtons').addEventListener('click', function (evt) {
        if (evt.target.tagName.toLowerCase() == 'button') {
            var startByte = evt.target.getAttribute('data-startbyte');
            var endByte = evt.target.getAttribute('data-endbyte');
            readBlob(startByte, endByte);
        }
    }, false);
}

function getSelText() {
    var txt = '';
    if (window.getSelection) {
        txt = window.getSelection();
    }
    else if (document.getSelection) {
        txt = document.getSelection();
    }
    else if (document.selection) {
        txt = document.selection.createRange().text;
    }
    else{
        document.aform.selectedtext.value = txt;
    }
    return txt;
}

function selectAndDefine() {
    var selectedtext = getSelText();
    getFirstDefinition(selectedtext, def => {
        document.getElementById("definitionText").innerHTML = def;
    });

    if (mathTerms.includes(selectedtext)){
        console.log("Math term")
        getMathGifs(selectedtext, url => {
            document.getElementById("definedPicture").src = url
        });
    } else {
        console.log("Normal")
        getImage(selectedtext, url => {
            document.getElementById("definedPicture").src = url;
        });
    }

}