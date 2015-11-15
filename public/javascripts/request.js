$(function(){
  //最初の1曲目
  getCategoryList($('#musicTitle').text());

  //delegate
  $('body').on('click', 'li', function(){
    explore($(this));
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

function explore(element){
  var selected = element;
  if(selected.attr('class') == 'music'){
    getCategoryList(encodeURIComponent(selected.text()));
  }
  if(selected.attr('class') == 'category'){
    getCategoryMembers(encodeURIComponent(selected.text()));
  }
}
