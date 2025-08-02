const sortTickets = (criterion, direction) => {
    let sortedTickets = structuredClone(tickets);
    searchSortingOrFiltersActive = true;
    console.log("=> fn sortTickets triggered");
    sortedTickets.sort((a, b) => {
        let index = 1;
        if (direction === "down") { index = -1 };
        if (a[criterion].at(-1)[2].toString().toLowerCase() < b[criterion].at(-1)[2].toString().toLowerCase()) {
            return -1 * index;
        }
        if (a[criterion].at(-1)[2].toString().toLowerCase() > b[criterion].at(-1)[2].toString().toLowerCase()) {
            return 1 * index;
        }
        return 0;
    });
    renderTable(sortedTickets);
    searchSortingOrFiltersActive = false;
};

const resetSortAndFilterButtons = () => {
    console.log("=> fn resetSortAndFilterButtons triggered");
    const btnSort = document.querySelectorAll(".btnSort");
    btnSort.forEach(element => {
        element.style.display = "block";
        element.style.background = "transparent";
    });
    const btnSortUp = document.querySelectorAll(".btnSortUp");
    btnSortUp.forEach(element => {
        element.style.background = "transparent";
        element.style.display = "none";
    });
    const btnSortDown = document.querySelectorAll(".btnSortDown");
    btnSortDown.forEach(element => {
        element.style.background = "transparent";
        element.style.display = "none";
    });
    const btnFilter = document.querySelectorAll(".btnFilter");
    btnFilter.forEach(element => {
        element.style.display = "block";
        element.style.background = "transparent";
    });
    const btnUndoFilter = document.querySelectorAll(".btnUndoFilter");
    btnUndoFilter.forEach(element => {
        element.style.background = "transparent";
        element.style.display = "none";
    });
};

// ### SORT BY DATE ###

const sortUpByDate = () => {
    console.log("=> fn sortUpByDate triggered");
    resetSortAndFilterButtons();
    sortTickets("date", "up");
    document.querySelector("#btnSortByDate").style.display = "none";
    document.querySelector("#btnSortUpByDate").style.display = "block";
    document.querySelector("#btnSortUpByDate").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};

const sortDownByDate = () => {
    console.log("=> fn sortDownByDate triggered");
    resetSortAndFilterButtons();
    sortTickets("date", "down");
    document.querySelector("#btnSortByDate").style.display = "none";
    document.querySelector("#btnSortDownByDate").style.display = "block";
    document.querySelector("#btnSortDownByDate").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};

// ### SORT BY TITLE ###

const sortUpByTitle = () => {
    console.log("=> fn sortUpByTitle triggered");
    resetSortAndFilterButtons();
    sortTickets("title", "up");
    document.querySelector("#btnSortByTitle").style.display = "none";
    document.querySelector("#btnSortUpByTitle").style.display = "block";
    document.querySelector("#btnSortUpByTitle").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
}

const sortDownByTitle = () => {
    console.log("=> fn sortDownByTitle triggered");
    resetSortAndFilterButtons();
    sortTickets("title", "down");
    document.querySelector("#btnSortByTitle").style.display = "none";
    document.querySelector("#btnSortDownByTitle").style.display = "block";
    document.querySelector("#btnSortDownByTitle").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};

// ### SORT BY DESCRIPTION ###

const sortUpByDescription = () => {
    console.log("=> fn sortUpByDescription triggered");
    resetSortAndFilterButtons();
    sortTickets("description", "up");
    document.querySelector("#btnSortByDescription").style.display = "none";
    document.querySelector("#btnSortUpByDescription").style.display = "block";
    document.querySelector("#btnSortUpByDescription").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
}

const sortDownByDescription = () => {
    console.log("=> fn sortDownByDescription triggered");
    resetSortAndFilterButtons();
    sortTickets("description", "down");
    document.querySelector("#btnSortByDescription").style.display = "none";
    document.querySelector("#btnSortDownByDescription").style.display = "block";
    document.querySelector("#btnSortDownByDescription").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};

// ### SORT BY DUEDATE ###

const sortUpByDueDate = () => {
    console.log("=> fn sortUpByDueDate triggered");
    resetSortAndFilterButtons();
    sortTickets("dueDate", "up");
    document.querySelector("#btnSortByDueDate").style.display = "none";
    document.querySelector("#btnSortUpByDueDate").style.display = "block";
    document.querySelector("#btnSortUpByDueDate").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
}

const sortDownByDueDate = () => {
    console.log("=> fn sortDownByDueDate triggered");
    resetSortAndFilterButtons();
    sortTickets("dueDate", "down");
    document.querySelector("#btnSortByDueDate").style.display = "none";
    document.querySelector("#btnSortDownByDueDate").style.display = "block";
    document.querySelector("#btnSortDownByDueDate").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};

// ### SORT BY OWNER ###

const sortUpByType = () => {
    console.log("=> fn sortUpByType triggered");
    resetSortAndFilterButtons();
    sortTickets("type", "up");
    document.querySelector("#btnSortByType").style.display = "none";
    document.querySelector("#btnSortUpByType").style.display = "block";
    document.querySelector("#btnSortUpByType").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
}

const sortDownByType = () => {
    console.log("=> fn sortDownByType triggered");
    resetSortAndFilterButtons();
    sortTickets("type", "down");
    document.querySelector("#btnSortByType").style.display = "none";
    document.querySelector("#btnSortDownByType").style.display = "block";
    document.querySelector("#btnSortDownByType").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};

// ### SORT BY PRIORITY ###

const sortUpByPriority = () => {
    console.log("=> fn sortUpByPriority triggered");
    resetSortAndFilterButtons();
    sortTickets("prio", "up");
    document.querySelector("#btnSortByPriority").style.display = "none";
    document.querySelector("#btnSortUpByPriority").style.display = "block";
    document.querySelector("#btnSortUpByPriority").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
}

const sortDownByPriority = () => {
    console.log("=> fn sortDownByPriority triggered");
    resetSortAndFilterButtons();
    sortTickets("prio", "down");
    document.querySelector("#btnSortByPriority").style.display = "none";
    document.querySelector("#btnSortDownByPriority").style.display = "block";
    document.querySelector("#btnSortDownByPriority").style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    btnSearch.style.display = "none";
    btnResetSearch.style.display = "block";
};