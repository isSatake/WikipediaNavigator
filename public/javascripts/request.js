$(function(){
  getCategoryList('君が代');
  getCategoryMembers(encodeURIComponent('Category:1880年代の音楽'));
});

function getCategoryList(musicTitle){
  $('body').append('<ul class="categories"></ul>');
  $.get('categorylist/' + musicTitle, function(categoryList){
    $.each(categoryList, function(index, category){
      $('ul.categories:last').append('<li class="category">' + category.title + '</li>');
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
