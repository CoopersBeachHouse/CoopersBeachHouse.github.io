document.addEventListener("DOMContentLoaded", load);

let items = [];
let current = 0;

let nextButton, prevButton, slideshowPrevNext;

let touchStartX = 0;
let touchEndX = 0;

function load() {
    items = document.querySelectorAll(".slideshow-item");

    for(let i = 0; i < items.length; i++) {
        if(items[i].classList.contains("current")) {
            current = i;
        }
        items[i].addEventListener("animationend", function () {
            items[i].classList.remove("slide-out-to-right", "slide-out-to-left", "slide-in-from-left", "slide-in-from-right");
        });
    }

    prevButton = document.querySelector("#slideshowPrev");
    nextButton = document.querySelector("#slideshowNext");
    slideshowPrevNext = document.querySelector("#slideshowPrevNext");

    addSwipeListener();
}

//go to the next slide
function nextSlide() {
    if(current < items.length - 1) {
        setSlide(current + 1);
    }
}

//go to the previous slide
function prevSlide() {
    if(current > 0) {
        setSlide(current - 1);
    }
}

//go to a specific slide by index
function setSlide(slide) {
    if(items.length <= slide || slide < 0) {
        console.log("Invalid Slide!");
        return;
    }

    //Set new current image
    items[current].classList.remove("current");
    let prev = current;
    current = slide;
    items[current].classList.add("current");

    //Slide the images
    if(prev > current) {
        items[prev].classList.add("slide-out-to-right");
        items[current].classList.add("slide-in-from-left");
    } else if(prev < current) {
        items[prev].classList.add("slide-out-to-left");
        items[current].classList.add("slide-in-from-right");
    }

    //Fading in and out the next and prev buttons
    if(current === 0) {
        prevButton.style.opacity = "0";
        prevButton.style.cursor = "default";
    } else if(current === items.length - 1) {
        nextButton.style.opacity = "0";
        nextButton.style.cursor = "default";
    }

    if(0 < current) {
        prevButton.style.opacity = "1";
        prevButton.style.cursor = "pointer";
    }

    if(current < items.length - 1) {
        nextButton.style.opacity = "1";
        nextButton.style.cursor = "pointer";
    }

    //Updating the selection panel
    let selector = document.querySelector("#slideshowSelector");
    for(let element of selector.children) {
        element.classList.remove("selected");
    }
    selector.children[current].classList.add("selected");
}

//Used to add swipe on mobile
function addSwipeListener() {
    slideshowPrevNext.addEventListener("touchstart", function (event) {
         touchStartX = event.changedTouches[0].screenX;
    }, {
        capture: true,
        passive: true,
    });

    slideshowPrevNext.addEventListener("touchend", function (event) {
        touchEndX = event.changedTouches[0].screenX;

        //Min 50px swipe
        if(Math.abs(touchStartX - touchEndX) < 50) return;

        if(touchEndX > touchStartX) {
            prevSlide();
        }

        if(touchEndX < touchStartX) {
            nextSlide();
        }
    }, {
        capture: true,
        passive: true
    });
}