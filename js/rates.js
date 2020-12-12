document.addEventListener("DOMContentLoaded", load);

let selected = [];

let totalElement, calcSteps;

//Get the html elements
function load() {
    calcSteps = document.querySelector("#calcSteps");
    totalElement = document.querySelector("#calculation #total");

    convertRates();
}

function convertRates() {
    let today = dateFns.startOfToday();

    let todayYear = today.getFullYear();

    //Set the year to the current year for all rates
    for(let rate of rates) {
        rate.from = dateFns.parse(rate.from);
        rate.from = dateFns.setYear(rate.from, todayYear);
        rate.to = dateFns.parse(rate.to);
        rate.to = dateFns.setYear(rate.to, todayYear);
    }

    //Check the current rate to set all previous rates to the next year
    for(let rate of rates) {
        if(dateFns.compareAsc(today, rate.from) === 1 && dateFns.compareAsc(today, rate.to) === 1) {
            rate.from = dateFns.addYears(rate.from, 1);
            rate.to = dateFns.addYears(rate.to, 1);
        }
    }
}



function getInfoForDay(date) {
    for(let rate of rates) {
        if(dateFns.isWithinRange(date, rate.from, rate.to)) {
            return rate;
        }
    }
}

function clearSelected() {
    selected = [];
    for(let selected of document.querySelectorAll(".selected")) {
        selected.classList.remove("selected");
    }

    calcSteps.innerHTML = "";
    totalElement.innerHTML = "Total: ";
}

function getTotalPrice() {
    let price = 0;
    for(let select of selected) {
        let info = getInfoForDay(select);
        if(info.price > 0) {
            price += info.price;
        }
    }
    return price;
}

function calculateTotal() {
    //Clear the previous stuff
    calcSteps.innerHTML = "";
    totalElement.innerHTML = "Total: ";

    let days = [];

    //Create an entry in the days array for every rate
    for(let period of rates) {
        days.push({rate: period, days: []});
    }

    //Add the selected days to the correct entry
    for(let select of selected) {
        let rate = getInfoForDay(select);

        for(let season of days) {
            if(season.rate === rate) {
                season.days.push(select);
            }
        }
    }

    //Create calculation
    for(let season of days) {
        if(season.days.length > 0) {
            /*let div = document.createElement("div");
            div.classList.add("calcStep");
            div.innerHTML = dateFns.format(season.days[0], "DD/MM") + " - " + dateFns.format(season.days[season.days.length - 1], "DD/MM") + ": " + season.days.length + " x " + season.rate.price + "$";
            calcSteps.append(div);*/

            let div = document.createElement("div");
            div.classList.add("calc-step");
            div.innerHTML = season.days.length + (season.days.length === 1 ? " night" : " nights") + " x " + season.rate.price + "$";
            calcSteps.append(div);
        }
        /*for(let day of season.days) {
            let div = document.createElement("div");
            let displayDay = parseInt(day.getDate());
            let displayMonth = parseInt(day.getMonth()) + 1;
            div.innerHTML = displayDay + "." + displayMonth + ": " + getInfoForDay(day).price;
            calcSteps.append(div);
        }*/
    }

    if(calcSteps.children.length > 0) {
        calcSteps.classList.remove("empty");
    } else {
        calcSteps.classList.add("empty");
    }

    totalElement.innerHTML = totalElement.innerHTML + getTotalPrice() + "$";
}

