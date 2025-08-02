const prepareSelFilter = (filterType) => {
    popUp.innerHTML = `
        <select id="selFilter" style="margin: auto; max-width: 450px">
            <option value="" selected disabled>${lang("select filter value", "Filter wählen")}</option>
        </select><br>
        <figure>
            <img src="assets/cancel.webp" alt="dismiss" id="btnDismissFilter">
            <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
        </figure>
    `;
    popUp.style.display = "block";
    let selArray = [];
    tickets.forEach((e) => {
        if (e.prio.at(-1)[2] > -1) {
            selArray.push(e[filterType].at(-1)[2]);
        }        
    });
    let filteredSelArray = selArray.filter((element, index) => {
        return selArray.indexOf(element) === index;
    });
    filteredSelArray.sort((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });
    filteredSelArray.forEach((e) => {
        if (e > 1690000000000) {
            selFilter.insertAdjacentHTML("beforeend", `<option value="${dateAndTimeToString(e)}">${dateAndTimeToString(e)}</option>`);
        } else if (filterType === "prio") {
            let index = priority.findIndex(el => el[0] === e);
            let priorityString = priority[index][currentUser.config.language + 1];
            selFilter.insertAdjacentHTML("beforeend", `<option value="${e}">${priorityString}</option>`);
        } else if (filterType === "type") {
            let index = typeMapTranslations.findIndex(el => el[0] === e);
            let typeString = typeMapTranslations[index][currentUser.config.language];
            selFilter.insertAdjacentHTML("beforeend", `<option value="${e}">${typeString}</option>`);
        } else {
            selFilter.insertAdjacentHTML("beforeend", `<option value="${e}">${e}</option>`);
        }
    });
    const filterMap = [
        ["date", fnFilterByDate],
        ["title", fnFilterByTitle],
        ["description", fnFilterByDescription],
        ["dueDate", fnFilterByDueDate],
        ["type", fnFilterByType],
        ["prio", fnFilterByPriority],
    ]
    let index = filterMap.findIndex(e => e[0] === filterType);
    selFilter.addEventListener("change", filterMap[index][1]);

    const btnDismissFilter = document.querySelector("#btnDismissFilter");
    btnDismissFilter.addEventListener("click", () => {
        selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
        selFilter.removeEventListener("change", filterMap[index][1]);
        popUp.style.display = "none";
    });
};

// ######################
// ### FILTER BY TYPE ###
// ######################

const fnFilterByDate = () => {
    console.log("=> fn fnFilterByDate triggered");
    let filterValue = selFilter.value;
    filteredTickets = tickets.filter((element) => {
        return dateAndTimeToString(element.date.at(-1)[2]) === filterValue;
    });
    renderTable(filteredTickets);
    popUp.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByDate.style.display = "block";
    btnUndoFilterByDate.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    searchSortingOrFiltersActive = true;
	selFilter.removeEventListener("change", fnFilterByDate);
};

const fnFilterByTitle = () => {
    console.log("=> fn fnFilterByTitle triggered");
    let filterValue = selFilter.value;
    filteredTickets = tickets.filter((element) => {
        return element.title.at(-1)[2].toString() === filterValue;
    });
    renderTable(filteredTickets);
    popUp.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByTitle.style.display = "block";
    btnUndoFilterByTitle.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    searchSortingOrFiltersActive = true;
	selFilter.removeEventListener("change", fnFilterByTitle);
};

const fnFilterByDescription = () => {
    console.log("=> fn fnFilterByDescription triggered");
    let filterValue = selFilter.value;
    filteredTickets = tickets.filter((element) => {
        return element.description.at(-1)[2].toString() === filterValue;
    });
    renderTable(filteredTickets);
    popUp.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByDescription.style.display = "block";
    btnUndoFilterByDescription.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    searchSortingOrFiltersActive = true;
	selFilter.removeEventListener("change", fnFilterByDescription);
};

const fnFilterByDueDate = () => {
    console.log("=> fn fnFilterByDueDate triggered");
    let filterValue = selFilter.value;
    filteredTickets = tickets.filter((element) => {
        return element.dueDate.at(-1)[2] === filterValue;
    });
    renderTable(filteredTickets);
    popUp.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByDueDate.style.display = "block";
    btnUndoFilterByDueDate.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    searchSortingOrFiltersActive = true;
	selFilter.removeEventListener("change", fnFilterByDueDate);
};

const fnFilterByType = () => {
    console.log("=> fn fnFilterByType triggered");
    let filterValue = selFilter.value;
    filteredTickets = tickets.filter((element) => {
        return element.type.at(-1)[2].toString() === filterValue;
    });
    renderTable(filteredTickets);
    popUp.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByType.style.display = "block";
    btnUndoFilterByType.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    searchSortingOrFiltersActive = true;
	selFilter.removeEventListener("change", fnFilterByType);
};

const fnFilterByPriority = () => {
    console.log("=> fn fnFilterByPriority triggered");
    let filterValue = selFilter.value;
    filteredTickets = tickets.filter((element) => {
        return element.prio.at(-1)[2].toString() === filterValue;
    });
    renderTable(filteredTickets);
    popUp.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByPriority.style.display = "block";
    btnUndoFilterByPriority.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    searchSortingOrFiltersActive = true;
	selFilter.removeEventListener("change", fnFilterByPriority);
};


const undoFilters = () => {
	resetSortAndFilterButtons();
	rank(tickets);
	renderTable(tickets);
}
