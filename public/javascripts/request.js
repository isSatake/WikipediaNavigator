$(function(){
  //最初の1曲目
  getCategoryList($('#musicTitle').text());

  //delegate
  $('body').on('click', 'li', function(){
    explore($(this));
  });
});

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    var src = $('#youtube').attr('src');
    $('#youtube').attr('src','&amp;wmode=transparent');
  player = new YT.Player(
    'youtube',
    {
      width: 320,
      height: 240,
      videoId: '',
      playerVars: {
        rel: 0,
        autoplay: 1
      }
    }
  );
}

function getCategoryList(musicTitle){
  var title = ''
  $('body').append('<ul class="categories"></ul>');
  $.get('categorylist/' + musicTitle, function(categoryList){
    $.each(categoryList, function(index, category){
      title = category.title//.replace(/ategory/, '');
      $('ul.categories:last').append('<li class="category">' + title + '</li>');
    });
  });
}

function getCategoryMembers(categoryTitle){
  $('body').append('<ul class="musics"></ul>');
  $.get('categorymember/' + categoryTitle, function(categoryMember){
    $.each(categoryMember, function(index, music){
      $('ul.musics:last').append('<li class="music">' + music.title + '</li>');
    });
  });
}

function playMusic(musicTitle){
  $.get('getmusic/' + musicTitle, function(result){
    player.loadVideoById(result);
  });
}

function explore(element){
  var selected = element;
  if(selected.attr('class') == 'music'){
    playMusic(encodeURIComponent(selected.text()));
    getCategoryList(encodeURIComponent(selected.text()));
  }
  if(selected.attr('class') == 'category'){
    getCategoryMembers(encodeURIComponent(selected.text()));
  }
}
