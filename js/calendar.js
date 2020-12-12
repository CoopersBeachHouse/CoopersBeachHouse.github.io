document.addEventListener("DOMContentLoaded", load);

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// const blockedMonths = [4, 5, 6, 7, 8];
const blockedMonths = [];

const blocked = [];

const nextMonths = [];

const maxPreviewMonths = 15;

let calendarParents, select, prev, next, selectedMonth, selectedYear;

function load() {
    calendarParents = document.querySelectorAll(".calendar-wrapper");
    select = document.querySelector("#chooseMonth");
    prev = document.querySelector("#calendarPrev");
    next = document.querySelector("#calendarNext");

    generateNextMonths();

    //Fill dropdown menu
    for (let i = 0; i < nextMonths.length; i++) {
        let month = nextMonths[i].month;
        let year = nextMonths[i].year;
        let option = document.createElement("option");
        option.value = month + " " + year;
        option.innerHTML = months[month] + " " + year;
        select.appendChild(option);

        if (month === 11) {
            year++;
        }
    }

    generateCalendars();
}

function generateCalendars() {
    for (let date of blockedDates) {
        blocked.push(dateFns.parse(date));
    }
    setCalendar(nextMonths[0].month, nextMonths[0].year);

    addListener();
    checkButtonVisibility();
}

//generate the options for the select tag
function generateNextMonths() {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    let skipped = 0;

    for (let i = 0; i < maxPreviewMonths; i++) {
        nextMonths.push({month: month, year: year});
        month++;
        if (month === 12) {
            year++;
            month = 0;
        }
    }
}

//generate a calendar
function generateCalendar(parent, month, year) {
    //generate the title
    let title = document.createElement("div");
    title.classList.add("calendar-title");
    title.innerHTML = months[month] + " " + year;

    //the calendar div
    let calendar = document.createElement("div");
    calendar.classList.add("calendar");

    //the table
    let table = document.createElement("table");

    //calendar titlebar
    table.innerHTML = "<thead><tr class='calendar-titlebar'>" +
        "<th>Mo</th>" +
        "<th>Tu</th>" +
        "<th>We</th>" +
        "<th>Th</th>" +
        "<th>Fr</th>" +
        "<th>Sa</th>" +
        "<th>Su</th>" +
        "</tr></thead>";

    let tbody = document.createElement("tbody");

    let tr = document.createElement("tr");

    //generate the days
    for (let day = 0; day < dateFns.getDaysInMonth(new Date(year, month)); day++) {
        let date = new Date(year, month, day);
        let weekday = date.getDay();

        date = new Date(year, month, day + 1);

        //fill the first empty space if there are any
        if (day === 0) {
            for (let i = 0; i < weekday; i++) {
                let td = document.createElement("td");
                td.classList.add("unselectable");
                tr.appendChild(td);
            }
        }

        let td = document.createElement("td");
        td.classList.add("selectable");

        //keep the selection
        for (let select of selected) {
            if (dateFns.isEqual(date, select)) {
                td.classList.add("selected");
            }
        }

        //block the already bocked days
        for (let block of blocked) {
            if (dateFns.isEqual(block, date)) {
                td.classList.add("blocked");
                td.setAttribute("title", "This date is booked");
                td.classList.remove("selectable");
            }
        }

        for (let month of blockedMonths) {
            if (date.getMonth() === month) {
                td.classList.add("blocked");
                td.setAttribute("title", "This date is unavailable");
                td.classList.remove("selectable");
            }
        }

        td.setAttribute("data-day", day.toString());
        td.setAttribute("data-month", month.toString());
        td.setAttribute("data-year", year.toString());

        let span = document.createElement("span");
        span.innerHTML = day + 1;
        td.appendChild(span);

        td.addEventListener("click", function (event) {
            let element = event.srcElement.parentElement;
            click(element);
        });

        tr.appendChild(td);

        //create a new row if the current is full
        if (new Date(year, month, day).getDay() === 6) {
            tbody.appendChild(tr);
            tr = document.createElement("tr");
        }
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);
    calendar.appendChild(table);
    parent.appendChild(title);
    parent.appendChild(calendar);
}

//handle clicking on the calendar
function click(element) {
    //for now no clicking is possible
    return;

    if (!element.classList.contains("selectable")) return;

    let elementSelected = element.classList.contains("selected");
    elementSelected = !elementSelected;

    let day = parseInt(element.getAttribute("data-day")) + 1;
    let month = parseInt(element.getAttribute("data-month"));
    let year = parseInt(element.getAttribute("data-year"));

    let date = new Date(year, month, day);

    if (elementSelected) {
        if (selected.length === 0) {
            element.classList.add("selected");
            selected.push(date);
        }

        if (dateFns.isEqual(selected[selected.length - 1], dateFns.subDays(date, 1))) {
            element.classList.add("selected");
            selected.push(date);
        }

        if (dateFns.isEqual(selected[0], dateFns.addDays(date, 1))) {
            element.classList.add("selected");
            selected.unshift(date);
        }
    } else {
        if (selected.length === 1) {
            element.classList.remove("selected");
            selected.shift();
        }

        if (dateFns.isEqual(selected[0], date)) {
            element.classList.remove("selected");
            selected.shift();
        }

        if (dateFns.isEqual(selected[selected.length - 1], date)) {
            element.classList.remove("selected");
            selected.pop();
        }
    }
    calculateTotal();
}

//clears the calendar parent elements
function clearCalendar() {
    for (let i = 0; i < calendarParents.length; i++) {
        calendarParents[i].innerHTML = "";
    }
}

//go to a specific month
function setCalendar(month, year) {
    clearCalendar();

    selectedMonth = month;
    selectedYear = year;

    for (let parent of calendarParents) {
        generateCalendar(parent, month, year);

        month++;
        if (month === 12) {
            year++;
            month = 0;
        }

        /*for(let blockedMonth of blockedMonths) {
            if(month === blockedMonth) {
                month = blockedMonths[blockedMonths.length - 1] + 1;
            }
        }*/
    }
    checkButtonVisibility();
}

//go to the next month
function nextMonth() {
    if (select.selectedIndex < select.options.length - 1) {
        select.selectedIndex = select.selectedIndex + 1;
    }

    let month = parseInt(select.value.substr(0, 2));
    let year = parseInt(select.value.substr(2, 5));

    setCalendar(month, year);

    /*if (selectedMonth === 11) {
        setCalendar(0, selectedYear + 1);
    } else {
        setCalendar(selectedMonth + 1, selectedYear);
    }*/
}

//go to the previous month
function prevMonth() {
    if (select.selectedIndex > 0) {
        select.selectedIndex = select.selectedIndex - 1;
    }

    let month = parseInt(select.value.substr(0, 2));
    let year = parseInt(select.value.substr(2, 5));

    setCalendar(month, year);

    /*if (selectedMonth === 0) {
        setCalendar(11, selectedYear - 1);
    } else {
        setCalendar(selectedMonth - 1, selectedYear);
    }*/
}

//listeners for the controls
function addListener() {
    select.addEventListener("change", function (event) {
        let month = parseInt(event.srcElement.value.substr(0, 2));
        let year = parseInt(event.srcElement.value.substr(2, 5));
        setCalendar(month, year);
    });

    prev.addEventListener("click", function (event) {
        if (event.srcElement.style.opacity === "1") {
            prevMonth();
        }
    });

    next.addEventListener("click", function (event) {
        if (event.srcElement.style.opacity === "1") {
            nextMonth();
        }
    });
}

//show hide the next and previous button
function checkButtonVisibility() {
    if (select.value === select.options[0].value) {
        prev.style.opacity = "0";
        prev.style.cursor = "default";
    } else {
        prev.style.opacity = "1";
        prev.style.cursor = "pointer";
    }

    if (select.value === select.options[select.options.length - 1].value) {
        next.style.opacity = "0";
        next.style.cursor = "default";
    } else {
        next.style.opacity = "1";
        next.style.cursor = "pointer";
    }
}