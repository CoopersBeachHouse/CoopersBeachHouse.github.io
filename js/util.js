document.addEventListener("DOMContentLoaded", load);

function load() {
    document.querySelector("#infoList").addEventListener("click", function () {
        this.innerHTML = "<li>Steffen Steudle</li><li>Lena-Christ-Str. 11</li><li>86529 Schrobenhausen</li><li>Germany/Deutschland</li><li>+49 8252 8839595</li><li>steffen.steudle@web.de</li>";
    });
}
