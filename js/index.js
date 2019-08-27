var musicList = [];
var currentIndex = 0; //list[currentIndex]第几首
var audio = new Audio(); //创建对象
audio.autoplay = true; //设置自动播放
var clock;
//获取歌曲顺序
getMusicList(function(list){
    musicList = list;
    loadMusic(list[currentIndex]);
    generateList(list);
    // var song = list[0];
    // var music = new Audio(song.src);
    // 会播放音乐
    // music.play(); 
})
// 进度条随歌曲变化
audio.ontimeupdate = function(){
  $('.container .progress-now').style.width = this.currentTime/this.duration * 100 + '%';
}
audio.onplay = function(){
    // setInterval保证数字变化频率一致
    clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60);
    var sec = Math.floor(audio.currentTime)%60 + '';
    sec = sec.length ===2 ? sec: '0' + sec; //2位不变1位前面加0
    $('.container .time').innerText =  min + ':' + sec;
},1000);
}
audio.onpause = function(){
    clearInterval(clock);
}
audio.onended = function(){
    currentIndex = (++currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex]);
}

$('.container .play').onclick = function(){
    if(audio.paused){
    audio.play();
    this.querySelector('.fa').classList.remove('fa-play');
    this.querySelector('.fa').classList.add('fa-pause');
}else{
    audio.pause();
    this.querySelector('.fa').classList.add('fa-play');
    this.querySelector('.fa').classList.remove('fa-pause');   
}
}

$('.container .forward').onclick = function(){
    currentIndex = (++currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex]);
}
$('.container .back').onclick = function(){
    currentIndex = (musicList.length + (--currentIndex)) % musicList.length ;
    loadMusic(musicList[currentIndex]);
}
$('.container .bar').onclick = function(e){
 var percent = e.offsetX / parseInt(getComputedStyle(this).width);
 audio.currentTime = audio.duration * percent;
}


function $(selector){
    return document.querySelector(selector);
}

//把ajax封装
function getMusicList(callback){
var xhr = new XMLHttpRequest();
xhr.open('GET','musicPlayer/music.json',true);
xhr.onload = function(){
    if((xhr.status >=200 && xhr.status < 300) || xhr.status == 304){
    callback(JSON.parse(xhr.responseText));
    // window.musicList = JSON.parse(this.responseText);
} else {
    console.log('获取数据失败');
}
}
xhr.onerror = function(){
    console.log('网络异常');
}
xhr.send();
}
//将歌曲列表和歌曲匹配
$('.container .list').onclick = function(e){
    if(e.target.tagName.toLowerCase() === 'li'){
      for(var i = 0; i < this.children.length; i++){
        if(this.children[i] === e.target){
            currentIndex = i;
        }
      }
      loadMusic(musicList[currentIndex]);
    }
  }
  // 创建歌曲列表
  function generateList(list){
    var cont = document.createDocumentFragment()
    list.forEach(function(musicObj){
      var node = document.createElement('li');
      node.innerText = musicObj.singer + '-' + musicObj.title;
      cont.appendChild(node);
    })
    $('.container .list').appendChild(cont);
  }
//获取歌曲信息
function loadMusic(musicObj) {
    console.log('begin play',musicObj); //musicObj是json对象
    $('.container .title').innerText = musicObj.title;
    $('.container .singer').innerText = musicObj.singer;
    $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')';
    audio.src = musicObj.src;
    
}

