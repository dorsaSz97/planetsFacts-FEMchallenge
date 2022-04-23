'use strict';

////////////////////////////////
// TWINKLE STARS + SHOOTING STARS
////////////////////////////////
const body = document.querySelector('body');
const sky = document.querySelector('.sky');
const shootingstars = document.querySelector('.shootingstars');
let stars = [];

//LESSON  we might have scrolling on the page, so we want the stars to be everywhere and not the part we are currently seeing -> Math.max()
//LESSON clientHeight/Width: without the scrollbars and for elements, innerHeight/Width: with scrollbars
//LESSON Math.random() creates random numbers between 0-1 (not including 1)
//LESSON circle is an SVG element so it needs to be created with the namespace specified createElementNS(namespace url, the name in html) otherwise it wouldnt get the cx cy and r
//LESSON getter setter instead of const or normal object

function getViewportWidth() {
  return Math.max(body.clientWidth, window.innerWidth);
}
function getViewportHeight() {
  return Math.max(body.clientHeight, window.innerHeight);
}

const randomRadius = () => {
  // they wouldnt change in size if the viewport's width wasnt considered
  // return Math.floor(Math.random() * 5 + 1);
  return Math.random() + getViewportWidth() / 800;
};
const randomX = () => {
  return Math.random() * getViewportWidth().toString();
};
const randomY = () => {
  return Math.random() * getViewportHeight().toString();
};

function createStar(number) {
  for (let i = 0; i < number; i++) {
    //<circle class='star' cx="" cy="" r=""/>
    let star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    star.setAttribute('cx', randomX());
    star.setAttribute('cy', randomY());
    star.setAttribute('r', randomRadius());
    // setting the initial color of the stars so that they dont appear black at first whilst being created
    star.style.fill = 'rgba(255, 255, 255, 0.2)';
    star.classList.add('star');

    stars.push(star);

    sky.appendChild(star);
  }
}
createStar(80);

function rearrangeStars() {
  stars.forEach(star => {
    star.setAttribute('cx', randomX());
    star.setAttribute('cy', randomY());
    star.setAttribute('r', randomRadius());
  });
}
window.addEventListener('resize', rearrangeStars);

function createShootingstar(number) {
  for (let i = 0; i < number; i++) {
    const shootingstar = document.createElement('div');
    shootingstar.style.left = `${randomX()}px`;
    shootingstar.style.top = `${randomY()}px`;
    shootingstar.classList.add('shootingstar');

    shootingstars.appendChild(shootingstar);
  }
}
createShootingstar(60);

anime({
  targets: ['.shootingstar'],
  easing: 'linear',
  loop: true,
  delay: (el, i) => 2000 * i,
  opacity: [
    {
      duration: 300,
      value: '1',
    },
  ],
  width: [
    {
      value: '100px',
    },
    {
      value: '0px',
    },
  ],
  translateX: 350,
});
