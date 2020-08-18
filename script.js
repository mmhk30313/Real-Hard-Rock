// Initialization part...

let searchInput = $('#search-input');
let results = $('#results');
let apiUrl = 'https://api.lyrics.ovh';
let lyricsDiv = $('#lyrics');
lyricsDiv.hide();
let b = 0;
const text_design = ["text-warning","text-info","text-danger","text-success","text-warning","text-primary","text-danger","text-success","text-warning","text-info"];

//Input song name from the search box
const searchBox = document.querySelector('.content-area .search-bar #search-box #search-input');
searchBox.addEventListener('keypress',setQuery);
function setQuery(evt){
    if(evt.keyCode == 13 || evt=='click'){
        // localStorage.clear();
        suggestions();
    }
}

//Clearing result when search box is empty...

function removeResults() {
  $('.result').remove();
  b=0;
  perResult = [];
}

//Load input text from the search box for fetching valid api...

function suggestions() {
  var input = searchInput.val();
  if (!input) {
    removeResults();
    return;
  }
//   console.log(`${apiUrl}'/suggest/'${term}`);
  fetch(apiUrl+'/suggest/'+input)
  .then(response => response.json())
  .then(data => displayResults(data))
  .catch(err => console.log(err))
}

//Displaying 10 lists of different type of single result...

function displayResults(data) {
    removeResults();
    // console.log(data);
    var finalResults = [];
    var seenResults = [];
    data.data.forEach(function (result) {
      if (seenResults.length >= 10) {
        return;
      }
      //Not for the same song or album...
      var t = result.title + ' - ' + result.artist.name;
      if (seenResults.indexOf(t) >= 0) {
        return;
      }
      seenResults.push(t);
      finalResults.push({
        display: t,
        artist: result.artist.name,
        title: result.title,
        album: result.album.title,
        id: b++,
        audio: result.preview
      });
    });

    var l = finalResults.length;
    myKey = [];
    finalResults.forEach(function (result, i) {
      var c = 'result';
      if (i == l-1) {
        c += ' result-last'
      }
      var e = $(`<li class=" ${c} single-result row align-items-center my-3 p-3">
        <div class="col-md-9">
            <h3 class="lyrics-name ${text_design[result.id]}">${result.display}</h3>
            <p class="author lead">Album by <span>${result.album}</span></p><br>
            <audio controls id="audio1" data-able-player preload="auto" style="outline:none">
               
            <source ref='themeSong' src="${result.audio.replace('http','https')}" type="audio/mpeg">
            </audio>
        </div>
        <div class="col-md-3 text-md-right text-center">
            <button onclick="findSongLyrics(${result.id})" id="btn-${result.id}" class="lyrics-btn btn btn-success" title="After clicking, go to down for the lyrics">Get Lyrics</button>
        </div>
      </li>
      `);
      results.append(e);
      myKey.push(result);
    //   console.log(myKey);
        
    });
}

//Finding Song Lyrics by clicking 'Get Lyrics" button...

function findSongLyrics(id){
    document.getElementById('single-lyric').innerHTML = "";
    // console.log(myKey[id]);
    const result = myKey[id];
    songLyrics(result);
}

//Find song lyrics...

function songLyrics(song) {
    // console.log(apiUrl + '/v1/' + song.artist + '/' + song.title);
    fetch(apiUrl + '/v1/' + song.artist + '/' + song.title)
    .then(response => response.json())
    .then(data => checkData(data,song))
}

//Checking valid data...

function checkData(data,song){
    try{
        if(data.error == "No lyrics found"){ //Invalid data...
            throw Error;
        }
        // console.log(data);
        displaySong(data,song);//Valid data...
    }catch(err){
        let html = '<p class="lyrics-title text-warning mb-4">The lyrics of '+ song.display +' is not available...</p>';
        // console.log(apiUrl + '/v1/' + song.artist + '/' + song.title,'\n',song.id,'\n',"data:",data,"\n",html);
        const parentNode = document.getElementById('single-lyric');
        parentNode.innerHTML = html;
    }
}

//Displaying valid song lyrics...

function displaySong(data,song) {
    let myTemplate = '<h2 class="lyrics-title text-success mb-4">' + song.display + '</h2>';
    myTemplate += '<div class="lyric text-white" id="thelyrics">' + data.lyrics.replace(/\n/g, '<br />') + '</div>';
    // console.log(apiUrl + '/v1/' + song.artist + '/' + song.title,'\n',song.id,'\n',"data:",data,"\n",myTemplate);
    const parentNode = document.getElementById('single-lyric');
    parentNode.innerHTML = myTemplate;
}

