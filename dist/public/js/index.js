var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;
words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}
function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length - 1 ? wordArray[0] : wordArray[currentWord + 1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }
  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }
  currentWord = (currentWord == wordArray.length - 1) ? 0 : currentWord + 1;
}

function animateLetterOut(cw, i) {
  setTimeout(function () {
    cw[i].className = 'letter out';
  }, i * 80);
}

function animateLetterIn(nw, i) {
  setTimeout(function () {
    nw[i].className = 'letter in';
  }, 340 + (i * 80));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    if (content.charAt(i) == " ") {
      letter.innerHTML = '&nbsp;';
    } else {
      letter.innerHTML = content.charAt(i);
    }
    word.appendChild(letter);
    letters.push(letter);
  }
  wordArray.push(letters);
}
changeWord();
setInterval(changeWord, 4000);
//kill any animations and set text back to its pre-split state
function kill() {
  splitTextTimeline.clear().time(0);
}
var winheight = $(window).height();
var startcount = 0;
window.addEventListener('scroll', function () {
  var y = window.scrollY;
  if (y > 2100) {
    startcount++;
  }
})

$(function () {
  var height_first = $('.first-column').height();
  var height_second = $('.second-column').height();
  var height_third = $('.third-column').height();

  var deltaheight_first = -height_first + 'px';
  var deltaheight_second = -height_second + 'px';
  var deltaheight_third = -height_third + 'px';

  function loop() {
    $('.first-column')
      .animate({ top: '0px' }, 1000, 'linear')
      .animate({ top: deltaheight_first }, 200000, 'linear', loop);
    $('.second-column')
      .animate({ top: '0px' }, 3000, 'linear')
      .animate({ top: deltaheight_second }, 60000, 'linear', loop);
    $('.third-column')
      .animate({ top: '0px' }, 5000, 'linear')
      .animate({ top: deltaheight_third }, 140000, 'linear', loop);
    $('.mobile')
      .animate({ top: '0px' }, 1000, 'linear')
      .animate({ top: '-5000px' }, 140000, 'linear', loop);

  }
  // loop();
  // $('.first-column').hover(function () {
  //   $(this).stop();
  // }, function () {
  //   $(this)
  //     .animate({ top: deltaheight_first }, 200000, 'linear', loop);
  // }
  // );
  // $('.second-column').hover(function () {
  //   $(this).stop();
  // }, function () {
  //   $(this)
  //     .animate({ top: deltaheight_second }, 60000, 'linear', loop);
  // }
  // );
  // $('.third-column').hover(function () {
  //   $(this).stop();
  // }, function () {
  //   $(this)
  //     .animate({ top: deltaheight_third }, 140000, 'linear', loop);
  // }
  // );
});


$('.icon-1').hover(function () {
  $('.list-icon-1').css('color', 'black');
  $('.list-icon-1').css('font-size', '25px');
  $('.list-icon-1').css('display', 'block');
}, function () {
  $('.list-icon-1').css('color', '#222');
  $('.list-icon-1').css('font-size', '24px');
  $('.list-icon-1').css('display', 'none');
});

$('.icon-2').hover(function () {
  $('.list-icon-2').css('color', 'black');
  $('.list-icon-2').css('font-size', '25px');
  $('.list-icon-2').css('display', 'block');
}, function () {
  $('.list-icon-2').css('color', '#222');
  $('.list-icon-2').css('font-size', '24px');
  $('.list-icon-2').css('display', 'none');
});

$('.icon-3').hover(function () {
  $('.list-icon-3').css('color', 'black');
  $('.list-icon-3').css('font-size', '25px');
  $('.list-icon-3').css('display', 'block');
}, function () {
  $('.list-icon-3').css('color', '#222');
  $('.list-icon-3').css('font-size', '24px');
  $('.list-icon-3').css('display', 'none');
});

$('.icon-4').hover(function () {
  $('.list-icon-4').css('color', 'black');
  $('.list-icon-4').css('font-size', '25px');
  $('.list-icon-4').css('display', 'block');
}, function () {
  $('.list-icon-4').css('color', '#222');
  $('.list-icon-4').css('font-size', '24px');
  $('.list-icon-4').css('display', 'none');
});

$('.icon-5').hover(function () {
  $('.list-icon-5').css('color', 'black');
  $('.list-icon-5').css('font-size', '25px');
  $('.list-icon-5').css('display', 'block');
}, function () {
  $('.list-icon-5').css('color', '#222');
  $('.list-icon-5').css('font-size', '24px');
  $('.list-icon-5').css('display', 'none');
});

$('.icon-6').hover(function () {
  $('.list-icon-6').css('color', 'black');
  $('.list-icon-6').css('font-size', '25px');
  $('.list-icon-6').css('display', 'block');
}, function () {
  $('.list-icon-6').css('color', '#222');
  $('.list-icon-6').css('font-size', '24px');
  $('.list-icon-6').css('display', 'none');
});

$('.icon-7').hover(function () {
  $('.list-icon-7').css('color', 'black');
  $('.list-icon-7').css('font-size', '25px');
  $('.list-icon-7').css('display', 'block');
}, function () {
  $('.list-icon-7').css('color', '#222');
  $('.list-icon-7').css('font-size', '24px');
  $('.list-icon-7').css('display', 'none');
});

$('.icon-8').hover(function () {
  $('.list-icon-8').css('color', 'black');
  $('.list-icon-8').css('font-size', '25px');
  $('.list-icon-8').css('display', 'block');
}, function () {
  $('.list-icon-8').css('color', '#222');
  $('.list-icon-8').css('font-size', '24px');
  $('.list-icon-8').css('display', 'none');
});

$('.icon-9').hover(function () {
  $('.list-icon-9').css('color', 'black');
  $('.list-icon-9').css('font-size', '25px');
  $('.list-icon-9').css('display', 'block');
}, function () {
  $('.list-icon-9').css('color', '#222');
  $('.list-icon-9').css('font-size', '24px');
  $('.list-icon-9').css('display', 'none');
});

$('.icon-10').hover(function () {
  $('.list-icon-10').css('color', 'black');
  $('.list-icon-10').css('font-size', '25px');
  $('.list-icon-10').css('display', 'block');
}, function () {
  $('.list-icon-10').css('color', '#222');
  $('.list-icon-10').css('font-size', '24px');
  $('.list-icon-10').css('display', 'none');
});

$('.section-1-left-first-img').click(function () {
  var url = $(this).attr('url');
  window.open(url);
});
function openNotification() {
  $('.notification').toggle();
}
$('.clear-notification').click(function () {
  $('.notification').hide();
});