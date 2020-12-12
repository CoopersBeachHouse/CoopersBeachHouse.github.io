document.addEventListener("DOMContentLoaded", load);

let modals;

let langSelects;

function load() {
    modals = document.querySelectorAll(".modal-container");
    for(let modal of modals) {
        modal.querySelector(".modal-close").addEventListener("click", function (event) {
            let modalContainer = event.srcElement.parentElement.parentElement.parentElement;
            closeModal(modalContainer);
        });

        modal.addEventListener("click", function () {
            if(event.target === modal) {
                closeModal(modal);
            }
        });
    }

    langSelects = document.querySelectorAll(".language-select");
    for(let select of langSelects) {
        select.addEventListener("change", function (event) {
            console.log("change " + event.srcElement.value);
            setLanguage(event.srcElement.value);

            for(let select of langSelects) {
                select.selectedIndex = event.srcElement.selectedIndex;
            }
        });
    }

    setLanguage("en");
}

function openModal(query) {
    let modal = document.querySelector(query);
    closeAllModals();
    if(modal) {
        modal.style.display = "block";
    } else {
        console.log("no modal was found");
    }
}

function closeModal(modal) {
    modal.style.display = "none";
}

function closeAllModals() {
    for(let modal of modals) {
        closeModal(modal);
    }
}

function setLanguage(lang) {
    let elements = document.querySelectorAll(".de,.en");

    for(let element of elements) {
        element.style.display = "none";
    }

    if(lang === "de") {
        elements = document.querySelectorAll(".de");
    } else if(lang === "en") {
        elements = document.querySelectorAll(".en");
    }

    for(let element of elements) {
        element.style.display = "block";
    }
}