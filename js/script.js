window.addEventListener('DOMContentLoaded', function () {
    const playlist = document.getElementById('playlist');
    const audio = document.getElementById('audio');
    const playButton = document.getElementById('play');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const modeButton = document.getElementById('mode');
    const progressBar = document.querySelector('.progress-bar');
    const timeElapsed = document.getElementById('time-elapsed');
    const timeTotal = document.getElementById('time-total');
    const currentSong = document.getElementById('current-song');
    const channel1 = document.getElementById('channel1');
    const width = channel1.offsetWidth;
    const height = channel1.offsetHeight;
    const channel2 = document.getElementById('channel2');
    const width2 = channel2.offsetWidth;
    const height2 = channel2.offsetHeight;
    var intervalId;
    var intervalId2;
    var currentIndex = 0;
    var paused = true;
    var pausedTime = 0;
    var mode = 0;
    var shuffledSongs = [];

    const colors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#FFFF00',
        '#ff00ff',
        '#00ffff',
        '#E0FFFF',
        '#8a2be2',
        '#7fff00',
        '#8b008b',
        '#ffffff',
        '#ff4500',
        '#ffa500',
        '#FF1493'
    ];

    var randomColor = getRandomColor();

    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    function generateRandomAmplitude() {
        return Math.random() * (height / 4);
    }

    function planeLine() {
        const context2 = channel2.getContext('2d');
        context2.clearRect(0, 0, width2, height2);
        context2.beginPath();
        for (let x2 = 0; x2 <= width2; x2++) {
            const y2 = height / 2.5 + generateRandomAmplitude() * 0;
            context2.quadraticCurveTo((2) + 0.5, y2, x2 + 0.5, y2);

        }
        context2.strokeStyle = randomColor;
        context2.stroke();
    }

    function updateChannels() {
        const currentTime = Date.now();
        const duration = 10;
        const phaseOffset = (1 * Math.PI * currentTime) / duration;
        const context1 = channel1.getContext('2d');

        context1.clearRect(0, 0, width, height);
        context1.beginPath();
        for (let x = 0; x <= width; x++) {
            const y1 = height / 2.5 + generateRandomAmplitude() * Math.sin((phaseOffset * Math.PI * x) * (width) / (height));
            context1.quadraticCurveTo((x) + 0.5, y1, x + 0.5, y1);

        }
        context1.strokeStyle = randomColor;
        context1.stroke();
    }

    var songs = [
        'songs/Raimundos_Reggae_do_Manero.mp3',
        'songs/Still D.R.E.mp3',
        'songs/The Unforgiven Remastered.mp3',
    ];

    async function init() {
        await fetchSongs();
        for (var i = 0; i < songs.length; i++) {
            createPlaylistItem(songs[i], i);
        }

        if (songs.length > 0) {
            currentIndex = 0;
            playSong();
        }
    }

    init();

    function createPlaylistItem(song, index) {
        var li = document.createElement('li');
        var songName = song.split('/').pop();
        li.textContent = songName.replace(/^songs\/|\.mp3$/g, '').replace(/_/g, ' ').replace(/%20/g, ' ');
        li.setAttribute('data-song-index', index); // Adicione este atributo
    
        var deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = '&#128465;';
        deleteIcon.classList.add('delete-icon');
        deleteIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            deleteSong(li); // Passe o elemento li em vez do índice
        });
    
        li.appendChild(deleteIcon);
    
        li.addEventListener('click', function () {
            currentIndex = index;
            playSong();
        });
    
        playlist.appendChild(li);
    }
    

    function updateCurrentSong() {
        if (currentIndex >= 0 && currentIndex < songs.length) {
            var currentPlaing = songs[currentIndex].replace(/^songs\/|\.mp3$/g, '').replace(/_/g, ' ');
            if (currentPlaing) {
                currentSong.textContent = currentPlaing;
            } else {
                currentSong.textContent = ''
            }
        } else {
            currentSong.textContent = '';
        }
    }


    function deleteSong(li) {
        var index = li.getAttribute('data-song-index');
        var wasPlaying = false;

        if (index === currentIndex) {
            wasPlaying = !audio.paused;
            audio.pause();
            paused = true;
            pausedTime = 0;
            progressBar.style.width = '0%';
            timeElapsed.textContent = '00:00';
        }

        songs.splice(index, 1);
        playlist.removeChild(li);

        if (index < currentIndex) {
            currentIndex--;
        }

        if (currentIndex < 0 && songs.length > 0) {
            currentIndex = 0;
        }

        if (songs.length === 0) {
            audio.pause();
        } else if (wasPlaying) {
            playNext();
        }

        updatePlaylist();
        updateCurrentSong();
    }

    function playPrevious() {
        randomColor = getRandomColor();
        const context1 = channel1.getContext('2d');
        context1.clearRect(0, 0, width, height);
        context1.beginPath();
        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = songs.length - 1;
        }

        if (!audio.paused) {
            playSong();
        }
    }

    function playSong() {
        audio.src = songs[currentIndex];
        audio.load();
        audio.currentTime = pausedTime;

        if (!paused) {
            audio.play();
        }

        updateProgressBar();
        updatePlaylist();
        updateCurrentSong();
    }

    function updateProgressBar() {
        var progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = progress + '%';

        var elapsedMinutes = Math.floor(audio.currentTime / 60);
        var elapsedSeconds = Math.floor(audio.currentTime % 60);
        var totalMinutes = Math.floor(audio.duration / 60);
        var totalSeconds = Math.floor(audio.duration % 60);

        if (elapsedSeconds < 10) {
            elapsedSeconds = '0' + elapsedSeconds;
        }

        if (totalSeconds < 10) {
            totalSeconds = '0' + totalSeconds;
        }

        timeElapsed.textContent = elapsedMinutes + ':' + elapsedSeconds;
        if (!totalMinutes) {
            intervalId2 = setInterval(planeLine, 100);
            channel2.style.display = 'block';
            totalMinutes = "--"
            totalSeconds = "--"
            channel1.style.display = 'none';
        } else {
            clearInterval(intervalId2);
            channel2.style.display = 'none';
            channel1.style.display = 'block';
        }
        timeTotal.textContent = totalMinutes + ':' + totalSeconds;
    }

    function updatePlaylist() {
        var playlistItems = playlist.getElementsByTagName('li');

        for (var i = 0; i < playlistItems.length; i++) {
            if (i === currentIndex) {
                playlistItems[i].classList.add('current');
            } else {
                playlistItems[i].classList.remove('current');
            }
        }
    }

    function playNext() {
        console.log(mode)
        randomColor = getRandomColor();
        const context1 = channel1.getContext('2d');
        context1.clearRect(0, 0, width, height);
        context1.beginPath();
        if (mode === 2) {
            currentIndex = getRandomIndex();
        } else {
            currentIndex++;
            if (currentIndex >= songs.length) {
                currentIndex = 0;
                if (mode === 1) {
                    paused = true;
                    pausedTime = 0;
                    progressBar.style.width = '0%';
                    timeElapsed.textContent = '00:00';
                    audio.pause();
                    channel2.style.display = 'block';
                    channel1.style.display = 'none';
                    return;
                }
            }
        }
        playSong();
    }

    function getRandomIndex() {
        var index = Math.floor(Math.random() * songs.length);

        if (shuffledSongs.length === songs.length) {
            shuffledSongs = [];
        }

        while (shuffledSongs.includes(index)) {
            index = Math.floor(Math.random() * songs.length);
        }

        shuffledSongs.push(index);
        return index;
    }

    function toggleMode() {
        mode++;
        if (mode > 2) {
            mode = 0;
        }
        modeButton.innerHTML = getModeText();
    }

    function getModeText() {
        switch (mode) {
            case 0:
                return '&#9843;';
            case 1:
                return '&#9844;';
            case 2:
                return '&#9845;';
        }
    }

    playButton.addEventListener('click', function () {
        if (audio.paused) {
            playButton.innerHTML = '&#10074;&#10074;';
            audio.play();
            paused = false;
            intervalId = setInterval(updateChannels, 100);
        } else {
            playButton.innerHTML = '&#9658;';
            audio.pause();
            paused = true;
            pausedTime = audio.currentTime;
            clearInterval(intervalId);
        }
    });

    prevButton.addEventListener('click', playPrevious);

    nextButton.addEventListener('click', playNext);

    modeButton.addEventListener('click', toggleMode);

    progressBar.addEventListener('click', function (event) {
        var progressWidth = progressBar.offsetWidth;
        var clickedPosition = event.clientX - progressBar.getBoundingClientRect().left;
        var progress = (clickedPosition / progressWidth) * 100;
        progressBar.style.width = progress + '%';
        audio.currentTime = (progress / 100) * audio.duration;
    });

    audio.addEventListener('timeupdate', updateProgressBar);

    audio.addEventListener('ended', playNext);

    for (var i = 0; i < songs.length; i++) {
        createPlaylistItem(songs[i], i);
    }

    playSong();

});