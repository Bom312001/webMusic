const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER';
const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progressBar = $('.progress-bar');
const songCurrentTime = $('.current-time');
const songDurationTime = $('.duration-time');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
let songPlayed = [0];

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
        name: 'Head In The Clouds',
        singer: 'Hayd',
        path: './music/1[ Vietsub + Lyric ] Hayd - Head In The Clouds.mp3',
        image:'./image/anh1.png',
    },
    {
        name: 'I Love 3000',
        singer: 'Stephanie Poetri',
        path: './music/2[Vietsub + Lyrics] I Love You 3000 - Stephanie Poetri.mp3',
        image:'./image/anh2.jpg',
    },
    {
        name: 'Double Take',
        singer: 'Dhruv',
        path: './music/3[Lyrics + Vietsub] double take - dhruv (slowed).mp3',
        image:'./image/anh3.jpg',
    },
    {
        name: 'Send It',
        singer: 'Shenga',
        path: './music/4Austin Mahone - Send It ft. Rich Homie Quan (Lyric Video).mp3',
        image:'./image/anh4.jpg',
    },
    {
        name: 'Love The Way You Like',
        singer: 'Rihanna',
        path: './music/5Eminem - Love The Way You Lie ft. Rihanna.mp3',
        image:'./image/anh5.jpg',
    },
    {
        name: 'Can We Kiss Forever',
        singer: 'Adriana',
        path: './music/6Kina - Can We Kiss Forever- (Lyrics) ft. Adriana Proenza.mp3',
        image:'./image/anh6.jpg',
    },
    {
        name: 'Perfect',
        singer: 'Sheeran',
        path: './music/7Perfect - Ed Sheeran (Lyrics).mp3',
        image:'./image/anh7.jpg',
    },
    {
        name: 'Umbrella',
        singer: 'Matte',
        path: './music/8Umbrella - Ember Island - Matte Remix (Lyrics + Vietsub) ???.mp3',
        image:'./image/anh8.jpg',
    },
    {
        name: 'Nevada',
        singer: 'Vicetone',
        path: './music/9Vicetone - Nevada (ft. Cozi Zuehlsdorff).mp3',
        image:'./image/anh9.png',
    },
],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? 'active' : ''
      }"  data-index='${index}'>
      <div class="thumb"
          style="background-image: url('${song.image}')">
      </div>
      <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
      </div>
      <div class="option">
          <i class="fas fa-ellipsis-h"></i>
      </div>
  </div>
      `;
    });
    $('.playlist').innerHTML = htmls.join('');
  },
  // define th??m thu???c t??nh c???a object app
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    // L???y c??i width hi???n t???i c???a cd
    // Tr??? ??i s??? px khi oncroll
    // check xem k???t qu??? c?? >0 kh??ng
    // ch?? ??: khi c?? k???t qu??? th?? g??n l???i cho cd.style.width ch??? kh??ng ph???i l?? cdWidth, vif offsetWidth ch??? l?? read-only
    //  ch?? ?? khi set k??ch th?????c cho width ph???i + 'px'
    const cdWidth = cd.offsetWidth;

    // X??? l?? CD quay
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    // X??? l?? ti???n ????? b??i h??t thay ?????i
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime * 100) / audio.duration
        );
        progressBar.value = progressPercent;
        progressBar.style.background = `linear-gradient(to right, #ff2a5f ${progressPercent}%, #ccc 0%)`;

        // X??? l?? ti???n ?????
        const minutesCurrent =
          Math.floor(audio.currentTime / 60) <= 9
            ? '0' + Math.floor(audio.currentTime / 60)
            : Math.floor(audio.currentTime / 60);
        const secondsCurrent =
          Math.floor(audio.currentTime - minutesCurrent * 60) <= 9
            ? '0' + Math.floor(audio.currentTime - minutesCurrent * 60)
            : Math.floor(audio.currentTime - minutesCurrent * 60);
        const minutesDuration =
          Math.floor(audio.duration / 60) <= 9
            ? '0' + Math.floor(audio.duration / 60)
            : Math.floor(audio.duration / 60);
        const secondsDuration =
          Math.floor(audio.duration - minutesDuration * 60) <= 9
            ? '0' + Math.floor(audio.duration - minutesDuration * 60)
            : Math.floor(audio.duration - minutesDuration * 60);
        songCurrentTime.innerText = minutesCurrent + ':' + secondsCurrent;
        songDurationTime.innerText = minutesDuration + ':' + secondsDuration;
      }
    };

    // X??? l?? khi tua song
    progressBar.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // X??? l?? scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = (newCdWidth > 0 ? newCdWidth : 0) / cdWidth;
    };

    // X??? l?? click play
    // khi ch???y l???n ?????u isplaying l?? false,
    // th?? l???t v??o audio.play v?? ch???y xu???ng onplay,
    // sau ???? onclick l???n n???a, n?? s??? ki???m tra l???i isplay l?? true, th?? n?? l???t v??o audio.pause
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // X??? l?? khi ???????c play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };

    // X??? l?? khi b??? pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    // X??? l?? khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      _this.activeSong();
      _this.scrollIntoView();
      audio.play();
    };

    // X??? l?? khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      _this.activeSong();
      _this.scrollIntoView();
      audio.play();
    };

    // X??? l?? khi random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      // console.log(_this.isRandom)
      _this.setConfig('isRandom', _this.isRandom);
      this.classList.toggle('active', _this.isRandom);
      // console.log(_this.isRandom)
    };

    // X??? l?? khi repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // X??? l?? next/repeat khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.loop = true;
        audio.play();
      } else {
        nextBtn.click();
      }
      // s??? t??? click v??o n??t nextBtn khi audio ended
    };

    // X??? l?? l???ng nghe onclick v??o playlist

    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      const optionNode = e.target.closest('.option');
      if (songNode || optionNode) {
        // X??? l?? khi click v??o song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.activeSong();
          audio.play();
        }
        if (optionNode) {
        }
      }
    };
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  randomSong: function () {
    let randomIndex;
    // ch??? n??y kh??ng khai b??o let trong h??m do, v?? khai b??o nh?? v???y th?? h??m while kh??ng th??? nh???n ???????c
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (songPlayed.includes(randomIndex) === true);
    this.currentIndex = randomIndex;
    songPlayed.push(randomIndex);

    // Khi m???ng c?? s??? l?????ng index = s??? l?????ng b??i h??t th?? clear m???ng
    if (songPlayed.length === this.songs.length) {
      songPlayed = [];
    }
    // logic ch??? do ..while, l?? random 1 s???, ?????n khi s??? ???? b???ng s??? hi???n t???i th?? d???ng
    // ch??? kh??ng ph???i l?? random 1 s??? ?????n khi n?? kh??c s??? tr?????c ???? th?? d???ng >>>hi???u sai

    this.loadCurrentSong();
  },

  nextSong: function () {
    if (this.isRandom) {
    }
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  activeSong: function () {
    const allSong = $$('.song');
    for (let i = 0; i < allSong.length; i++) {
      allSong[i].classList.remove('active');
      $(`[data-index='${this.currentIndex}']`).classList.add('active');
    }
  },
  scrollIntoView: function () {
    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  },

  loadCurrentSong: function () {
    if (this.currentSong) {
      heading.innerText = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    }
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  start: function () {
    // g??n c???u h??nh t??? config v??o ???ng d???ng
    this.loadConfig();
    // ?????nh ngh??a th??m thu???c t??nh cho object
    this.defineProperties();
    // x??? l?? s??? ki???n
    this.handleEvents();

    // load ba?? h??t hi???n t???i
    this.loadCurrentSong();
    // render ra DOM
    this.render();
    // Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();
