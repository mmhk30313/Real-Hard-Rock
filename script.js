// Initialization part...
const $ = (query) => document.querySelector(query);
const getElementById = (id) => document.getElementById(id);

let searchInput = $('#search-input');
let results = $('#results');
let apiUrl = 'https://api.lyrics.ovh';
let lyricsDiv = $('#lyrics');
// lyricsDiv.hide();
let b = 0;
const text_design = ["text-warning","text-info","text-danger","text-success","text-warning","text-primary","text-danger","text-success","text-warning","text-info"];
// console.log(results);
// my start...
const searchBox = document.querySelector('.content-area .search-bar #search-box #search-input');
searchBox.addEventListener('keypress',setQuery);
// console.log(getElementById('search'));
// getElementById('search').addEventListener('click', setQuery('search'));
function setQuery(evt){
  if(evt.keyCode == 13 || evt == 'search'){
    // let node= getElementById("results");
    // while (node.firstChild) {
    //   console.log(node.firstChild);  
    //   node.removeChild(node.firstChild);
    // }
    // console.log("Hey",node.firstChild);  
    
    // console.log(results.innerHTML)
    results.innerHTML = "";
    // console.log(results.innerHTML);
    // let single_lyrics_node = getElementById('single-lyrics');
    // single_lyrics_node.innerHTML = "";
    
    // while(single_lyrics_node.firstChild){
    //   console.log(single_lyrics_node.firstChild);
    //   single_lyrics_node.removeChild(single_lyrics_node.lastChild);
    // }
    songList = [];
    loadData();
  }
}

// songList -> global song...
songList = [];

function loadData(){
  if(!searchInput.value){
    results.innerHTML = "";
    songList = [];
    return;
  }
  // let single_lyrics_node = getElementById('single-lyrics');
  // single_lyrics_node.innerHTML = "";
  results.innerHTML = "";
  // console.log(`${apiUrl}/suggest/${searchInput.value}`);
  fetch(`${apiUrl}/suggest/${searchInput.value}`)
  .then(response => response.json())
  .then(DATA => {
      DATA = DATA.data.slice(0, 10);
      // console.log(typeof (DATA),DATA)
      // console.log(DATA) 
      for (let i = 0; i < DATA.length; i++) {
        const element = DATA[i];
        // console.log(element);
        
        createList(element,i);
      }
    }
  )
}

function createList(result,song_id){
  // console.log(typeof (result),result);
  const title = result.title+' - '+result.artist.name;
  finalSong = {
    "display": title,
    "id": song_id,
    "album": result.album.title,
    "title": result.title,
    "artist": result.artist.name,
    "music": result.preview
  };
  // console.log(finalSong,finalSong.length);
  showList(finalSong);
}
let child = "";
function showList(song){
  // console.log(song.music);
  songList.push(song);//its important...
  child += `<li id="li-${song.id}" class="single-result row align-items-center my-3 p-3">
      <div class="col-md-9">
          <h3 class="lyrics-name ${text_design[song.id]}">${song.display}</h3>
          <p class="author lead">Album by <span>${song.album}</span></p>
          <audio controls id="audio1" data-able-player preload="auto" style="outline:none">
               
          <source ref='themeSong' src="${song.music}" type="audio/mpeg">
          </audio>
      </div>
      <div class="col-md-3 text-md-right text-center">  
        <button onclick="findLyrics(${song.id})" id="btn-${song.id}" class="btn btn-success myButton">Get Lyrics</button>
      </div>
  </li>
  <div id="single-lyrics-${song.id}" class="single-lyrics-${song.id} text-center">
      <!-- ./Get Lyrics  -->
  </div>`;
  if((song.id+1)==10){
    results.innerHTML = child;
    child = "";
  }
}

function findLyrics(id){
  // console.log(songList);
  for(i=0;i<songList.length;i++){
    if(songList[i].id == id){
      // console.log("yes",songList[i].display);
      // console.log(`${apiUrl}/v1/${songList[i].artist}/${songList[i].title}`);
      getElementById(`single-lyrics-${songList[i].id}`).style.display = 'block';
      testSong(songList[i]);
      continue;
    }

    // Kisu ekta korte hobe....
    // console.log(songList[i].id,"-> no");
    getElementById(`single-lyrics-${songList[i].id}`).style.display = 'none';
  }
}
function testSong(song){
    // console.log(song);
    fetch(`${apiUrl}/v1/${song.artist}/${song.title}`)
    .then(res => res.json())
    .then(data => {
      // console.log(song.artist);
      displayLyrics(data,song.display,song.id);
          
    })
    .catch(err => {
      // console.log("there is a problem...");
      const currentDiv =  getElementById(`single-lyrics-${song.id}`);
      currentDiv.innerHTML = "";
      currentDiv.innerHTML = '<p class="lyrics-title text-warning mb-4">The lyrics of '+ song.display +' is not available...</p>';
    })
}
function displayLyrics(data,song,id){
    // console.log("yes",song);
    // const single_lyrics = getElementById(`single-lyrics`);
    const single_lyrics = getElementById(`single-lyrics-${id}`);
    single_lyrics.innerHTML = "";
    let myTemplate = '<h2 class="lyrics-title text-success mb-4">' + song + '</h2>';
    myTemplate += '<div class="lyric text-white" id="thelyrics">' + data.lyrics.replace(/\n/g, '<br />') + '</div>';
    single_lyrics.innerHTML = myTemplate;
}
// const myButton = document.getElementsByClassName("myButton");
// for(let i=0;i<myButton.length;i++){
//   console.log(myButton[i]);
//   myButton[i].addEventListener('click', function(){
//     console.log(this.id);
//   })
// }
// my end...

