$(function(){
  getCategoryList('君が代');
  getCategoryMembers(encodeURIComponent('Category:1880年代の音楽'));

  $('ul').on('click', 'li', function(){
    var clicked = $(this);
    if(clicked.attr('class') == 'music'){
      getCategoryList(clicked.text());
    }
    if(clicked.attr('class') == 'category'){
      getCategoryMembers(encodeURIComponent(clicked.text()));
    }
  });
});

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
