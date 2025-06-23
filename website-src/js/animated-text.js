let people = ["privacy enthusiasts", "the detail-oriented", "outdoor adventurers", "the health-conscious",
    "open-source lovers", "customization fans", "desktop + mobile", "travelers", "the weather-aware", "everyone"];
let index = Math.floor(Math.random() * people.length);

let typeTextIn = () => {
    document.getElementById("slideshow-photo").setAttribute("src", "website-src/img/screenshot-slide-" + String(index) + ".png");
    let text = people[index];
    document.getElementById("animated-text").innerText = text[0];


    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            document.getElementById("animated-text").innerText = text.slice(0, i + 1);
        }, 50 * i);
    }

    setTimeout(typeTextOut, (50*text.length) + 20*1000);
}

let typeTextOut = () => {
    let text  = document.getElementById("animated-text").innerText;
    for (let i = text.length - 1; i >= 1; i--) {
        setTimeout(() => {
            document.getElementById("animated-text").innerText = text.slice(0, i);
        }, 50 * (text.length - i));
    }

    index++;
    if (index >= people.length) {
        index = 0;
    }

    setTimeout(typeTextIn, (50*text.length) + 100);
}

typeTextIn();