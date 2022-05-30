'use strict';
// A LOT OF INSPIRATION FROM seanred360 *****
const body = document.querySelector('body');
const sky = document.querySelector('.sky');
const shootingstars = document.querySelector('.shootingstars');
const toggle = document.querySelector('.header__toggle');
const hamburgerMenu = document.querySelector('.header__list');
const hamburgerMenuBg = document.querySelector('.mobile-menu__bg');
const planetSection = document.querySelector('.planet');
const planetImg = document.querySelector('.planet-img');
const planetGeoImg = document.querySelector('.geo-img');
const contentDiffs = document.querySelectorAll('.content-diff');
const contentLinks = document.querySelectorAll('.content-link');
const planetDiffs = document.querySelectorAll('.planet-diff');
const planetLinks = document.querySelectorAll('.planet-link');
const mainSection = document.querySelector('.main-section');
const wikipediaSource = document.querySelector('.source');

let stars = [];
let planetData;
let currPlanet = 'mercury';
let prevPlanet = '';
let currentIndex = 0;
let currContent = 'overview';
let prevContent = '';
let flyInAnimComplete = true;

////////////////////////////////
// PLANETS DATA FROM THE JSON FILE
////////////////////////////////

fetch('js/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    planetData = data;
  });

////////////////////////////////
// TWINKLE STARS + SHOOTING STARS
////////////////////////////////

//LESSON  we might have scrolling on the page, so we want the stars to be everywhere and not the part we are currently seeing -> Math.max()
//LESSON clientHeight/Width: without the scrollbars and for elements, innerHeight/Width: with scrollbars
//LESSON Math.random() creates random numbers between 0-1 (not including 1)
//LESSON circle is an SVG element so it needs to be created with the namespace specified createElementNS(namespace url, the name in html) otherwise it wouldnt get the cx cy and r
//LESSON getter setter instead of const or normal object (?)

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
  delay: (el, i) => 1000 * i,
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

////////////////////////////////
// HAMBURGER MENU
////////////////////////////////

toggle.querySelector('i').addEventListener('click', () => {
  toggle.classList.toggle('clicked');
  planetLinks.forEach(planetLink => planetLink.classList.remove('clicked'));
  if (!hamburgerMenu.classList.contains('showing')) {
    hamburgerMenu.classList.remove('hide');
    hamburgerMenu.classList.add('showing');
    mainSection.style.display = 'none';
    hamburgerMenuBg.classList.add('active');
    hamburgerMenuBg.classList.remove('deactive');
    anime({
      targets: '.toggle-item',
      translateX: [-800, 10],
      delay: anime.stagger(100),
    });
  } else {
    mainSection.style.display = 'block';
    hamburgerMenuBg.classList.remove('active');
    hamburgerMenuBg.classList.add('deactive');
    hamburgerMenu.classList.remove('showing');
    hamburgerMenu.classList.add('hide');

    anime({
      targets: '.toggle-item',
      translateX: -800,
      delay: anime.stagger(100),
    });
  }
});

////////////////////////////////
// PLANET CHANGE ON PLANET LINKS CLICK
////////////////////////////////

const activateCurrPlanetLink = () => {
  planetLinks.forEach(planetLink => {
    if (planetLink.dataset.planetname === planetSection.dataset.planetname) {
      planetLink.classList.add('active');
      planetLink.classList.add('active-tablet');
    } else {
      planetLink.classList.remove('active');
      planetLink.classList.remove('active-tablet');
    }
  });
};

function changePlanet(planetnumber, planetname) {
  // prevent anything from happening when clicking on the current planet's link
  planetGeoImg.classList.add('hide');
  if (planetname === currPlanet) return null;

  prevPlanet = currPlanet;
  currPlanet = planetname;
  currentIndex = planetnumber;

  changeContent('overview');

  // changing elements that differ between planets
  planetDiffs.forEach(planetDiff => {
    if (planetDiff.classList.contains('heading-secondary')) {
      planetDiff.innerHTML = planetData[currentIndex].name;
    }
    if (planetDiff.classList.contains('rotation')) {
      planetDiff.innerHTML = planetData[currentIndex].rotation;
    }
    if (planetDiff.classList.contains('revolution')) {
      planetDiff.innerHTML = planetData[currentIndex].revolution;
    }
    if (planetDiff.classList.contains('radius')) {
      planetDiff.innerHTML = planetData[currentIndex].radius;
    }
    if (planetDiff.classList.contains('temperature')) {
      planetDiff.innerHTML = planetData[currentIndex].temperature;
    }

    planetSection.dataset.planetname = currPlanet;
  });
}

planetLinks.forEach(planetLink => {
  planetLink.addEventListener('click', e => {
    // changing planets content

    if (
      changePlanet(
        e.target.closest('.planet-link').dataset.planetnumber,
        e.target.closest('.planet-link').dataset.planetname
      ) === null
    ) {
      return null;
    }

    // changing active links
    // if we are on mobile
    if (e.target.closest('li').classList.contains('toggle-item')) {
      e.target.closest('li').classList.add('clicked');

      toggle.classList.remove('clicked');
      setTimeout(() => {
        hamburgerMenu.classList.toggle('hide');
        hamburgerMenu.classList.remove('showing');
        mainSection.style.display = 'block';
        hamburgerMenuBg.classList.remove('active');
        hamburgerMenuBg.classList.add('deactive');
        anime({
          targets: '.toggle-item',
          translateX: -800,
          delay: anime.stagger(100),
        });
      }, 600);
      setTimeout(() => {
        flyOutAnim(planetImg);
      }, 1000);

      activateCurrPlanetLink();
    }

    // if we are on tablet+
    if (
      e.target
        .closest('li')
        .parentElement.parentElement.classList.contains('d-none')
    ) {
      flyOutAnim(planetImg);
      console.log('what');
      activateCurrPlanetLink();
    }
  });
});

////////////////////////////////
// CONTENT CHANGE ON CONTENT LINKS CLICK
////////////////////////////////

contentLinks.forEach(contentLink => {
  contentLink.addEventListener('click', e => {
    console.log(flyInAnimComplete);
    if (flyInAnimComplete) {
      if (!e.target.classList.contains('active')) {
        // prevent clicking on the contentLink that is already active
        changeContent(e.target.dataset.contentname);
      }

      console.log(e.target.dataset.contentname);
      contentLinks.forEach(contentLink => {
        contentLink.classList.remove('active');
        if (contentLink.dataset.contentname === e.target.dataset.contentname) {
          contentLink.classList.add('active');
        }
      });
    }
  });
});

function changeContent(content) {
  currContent = content;
  prevContent = currContent;
  wikipediaSource.href = planetData[currentIndex][currContent].source;
  contentDiffs.forEach(contentDiff => {
    switch (content) {
      case 'overview':
        // activating the overview link for when the planet changes
        contentLinks.forEach(contentLink => {
          if (contentLink.dataset.contentname === 'overview') {
            contentLink.classList.add('active');
          } else {
            contentLink.classList.remove('active');
          }
        });

        planetGeoImg.classList.add('hide');

        if (contentDiff.classList.contains('planet-img')) {
          contentDiff.src = planetData[currentIndex].images.planet;
        }
        if (contentDiff.classList.contains('planet__paragraph'))
          contentDiff.innerHTML = planetData[currentIndex].overview.content;
        if (contentDiff.classList.contains('source'))
          contentDiff.href = planetData[currentIndex].overview.source;
        break;

      case 'structure':
        planetGeoImg.classList.add('hide');
        if (contentDiff.classList.contains('planet-img')) {
          contentDiff.src = planetData[currentIndex].images.internal;
        }
        if (contentDiff.classList.contains('planet__paragraph'))
          contentDiff.innerHTML = planetData[currentIndex].structure.content;
        if (contentDiff.classList.contains('source'))
          contentDiff.href = planetData[currentIndex].structure.source;
        break;

      case 'geology':
        planetGeoImg.classList.remove('hide');
        planetGeoImg.src = planetData[currentIndex].images.geology;

        if (contentDiff.classList.contains('planet-img')) {
          contentDiff.src = planetData[currentIndex].images.planet;
        }
        if (contentDiff.classList.contains('planet__paragraph'))
          contentDiff.innerHTML = planetData[currentIndex].geology.content;
        if (contentDiff.classList.contains('source'))
          contentDiff.href = planetData[currentIndex].geology.source;
        break;
    }
  });
}

////////////////////////////////
// CHANGING PLANET ANIMATION
////////////////////////////////

function flyInAnim(target) {
  const planetImgcurrently = currPlanet;
  planetImg.src = `assets/img/planet-${planetImgcurrently}.svg`;
  planetImg.alt = `${planetImgcurrently}`;
  planetGeoImg.alt = `The inside of ${planetImgcurrently}`;
  flyInAnimComplete = false;
  anime({
    targets: target,
    translateX: [
      { value: -800, duration: 0, delay: 0 },
      { value: 0, duration: 1000, delay: 0 },
    ],
    translateY: [
      { value: 800, duration: 0, delay: 0 },
      { value: 0, duration: 1000, delay: 0 },
    ],
    scale: [
      { value: 1.4, duration: 200, delay: 0, easing: 'easeOutExpo' },
      { value: 1, duration: 1000 },
    ],
    opacity: '1',
    easing: 'easeOutElastic(1, .8)',
    loop: false,
    complete: () => {
      flyInAnimComplete = true;
    },
  });
}

function flyOutAnim(target) {
  flyInAnimComplete = false;
  anime({
    targets: target,
    // translateX: [
    //   // fly out
    //   { value: 0, duration: 0, delay: 0 },
    //   { value: 200, duration: 700, delay: 0 },
    // ],
    // translateY: [
    //   { value: 0, duration: 0, delay: 0 },
    //   { value: -200, duration: 700, delay: 0 },
    // ],
    opacity: [
      {
        duration: 500,
        value: '0',
      },
    ],
    scale: [{ value: 0, duration: 100, delay: 0, easing: 'easeOutExpo' }],
    easing: 'easeOutElastic(1, .8)',
    loop: false,
    complete: () => {
      flyInAnim(target);
    },
  });
}
