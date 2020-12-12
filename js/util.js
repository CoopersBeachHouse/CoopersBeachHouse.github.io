document.addEventListener("DOMContentLoaded", load);

function load() {
    document.querySelector("#phoneNr").addEventListener("click", function () {
        this.innerHTML = "+49 8252 8839595";
    });

    document.querySelector("#email").addEventListener("click", function () {
        this.innerHTML = "steffen.steudle@web.de";
    });
}