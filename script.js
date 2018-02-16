const mainEl = document.querySelector('main');
const videoElement = document.querySelector('video');
const progressEl = document.querySelector('progress');

document.querySelector('nav').addEventListener('click', navigate);
// Start with first a tag - home page
document.querySelector('a').click();

function navigate (e) {
  if (e.target.nodeName !== 'A') { return }
  let page = e.target.textContent.toLowerCase();
  fadeout();
  setVideo(page);
  setContent(page);
}

function setVideo (page) {
  videoElement.src = '';
  videoElement.poster = 'videos/' + page + '.png';
  progressEl.style.display = 'block';
  progressEl.value = 0;
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'videos/' + page + '.mp4', true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      let videoBlob = this.response;
      let vid = URL.createObjectURL(videoBlob);
      videoElement.src = vid;
      videoElement.onplaying = () => {
        URL.revokeObjectURL(vid);
        progressEl.style.display = 'none';
        progressEl.value = 0;
      }
    }
  };
  xhr.onprogress = (pe) => {
    if (pe.lengthComputable) {
      progressEl.max = Math.floor(pe.total);
      progressEl.value = Math.floor(pe.loaded);
    }
  };
  xhr.send();
}

function setContent (page) {
  page = (page === 'home') ? 'index' : page;
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let tempDiv = document.createElement('div');
      let content = document.getElementById('page-content');
      tempDiv.innerHTML = this.responseText;
      content.innerHTML = tempDiv.querySelector('#page-content').innerHTML;
      tempDiv = null;
      fadein();
    }
  };
  xhr.open("GET", page + ".html", true);
  xhr.send();
}

function fadeout () {
  mainEl.style.opacity = '1';
  var op;
  var tick = function () {
    op = +mainEl.style.opacity - 0.01;
    mainEl.style.opacity = ''+ op;
    if (op > 0) {
      setTimeout(tick, 15)
    }
  };
}

function fadein () {
  mainEl.style.opacity = '0';
  var op;
  console.log(op);
  var tick = function () {
    op = +mainEl.style.opacity + 0.01;
    mainEl.style.opacity = ''+ op;
    if (op < 1) {
      setTimeout(tick, 15)
    }
  };
  tick();
}