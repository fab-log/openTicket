btnNewTicket.addEventListener("click", displayNewTicket);

btnTicketList.addEventListener("click", () => {
    listType = "table";
    displayTicketList();
});
btnStartTable.addEventListener("click", displayTicketList);
btnBubbleList.addEventListener("click", () => {
    listType = "bubbles";
    displayBubbleList();
});
btnStartBubbles.addEventListener("click", displayBubbleList);

const sortTickets = (criterion, direction) => {
    sortedTickets.sort((a, b) => {
        let index = 1;
        if (direction === "down") { index = -1 };
        if (a[criterion].at(-1)[2] < b[criterion].at(-1)[2]) {
            return -1 * index;
        }
        if (a[criterion].at(-1)[2] > b[criterion].at(-1)[2]) {
            return 1 * index;
        }
        return 0;
    });
    renderList(sortedTickets);
};

const resetSortAndFilterButtons = () => {
    btnSort.forEach(element => {
        element.style.display = "block";
        element.style.background = "transparent";
    });
    btnSortUp.forEach(element => {
        element.style.background = "transparent";
        element.style.display = "none";
    });
    btnSortDown.forEach(element => {
        element.style.background = "transparent";
        element.style.display = "none";
    });
    btnFilter.forEach(element => {
        element.style.display = "block";
        element.style.background = "transparent";
    });
    btnUndoFilter.forEach(element => {
        element.style.background = "transparent";
        element.style.display = "none";
    });
};

// ### SORT BY DATE ###

const sortByDate = () => {
    resetSortAndFilterButtons();
    btnSortByDate.style.display = "none";
    btnSortUpByDate.style.display = "block";
    btnSortUpByDate.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("date", "up");
};

btnSortByDate.addEventListener("click", sortByDate);

btnSortUpByDate.addEventListener("click", () => {
    resetSortAndFilterButtons();
    btnSortByDate.style.display = "none";
    btnSortDownByDate.style.display = "block";
    btnSortDownByDate.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("date", "down");
});

btnSortDownByDate.addEventListener("click", sortByDate);

// ### SORT BY TITLE ###

const sortByTitle = () => {
    resetSortAndFilterButtons();
    btnSortByTitle.style.display = "none";
    btnSortUpByTitle.style.display = "block";
    btnSortUpByTitle.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("title", "up");
}

btnSortByTitle.addEventListener("click", sortByTitle);

btnSortUpByTitle.addEventListener("click", () => {
    resetSortAndFilterButtons();
    btnSortByTitle.style.display = "none";
    btnSortDownByTitle.style.display = "block";
    btnSortDownByTitle.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("title", "down");
});

btnSortDownByTitle.addEventListener("click", sortByTitle);

// ### SORT BY DESCRIPTION ###

const sortByDescription = () => {
    resetSortAndFilterButtons();
    btnSortByDescription.style.display = "none";
    btnSortUpByDescription.style.display = "block";
    btnSortUpByDescription.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("description", "up");
}

btnSortByDescription.addEventListener("click", sortByDescription);

btnSortUpByDescription.addEventListener("click", () => {
    resetSortAndFilterButtons();
    btnSortByDescription.style.display = "none";
    btnSortDownByDescription.style.display = "block";
    btnSortDownByDescription.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("description", "down");
});

btnSortDownByDescription.addEventListener("click", sortByDescription);

// ### SORT BY DUEDATE ###

const sortByDueDate = () => {
    resetSortAndFilterButtons();
    btnSortByDueDate.style.display = "none";
    btnSortUpByDueDate.style.display = "block";
    btnSortUpByDueDate.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("dueDate", "up");
}

btnSortByDueDate.addEventListener("click", sortByDueDate);

btnSortUpByDueDate.addEventListener("click", () => {
    resetSortAndFilterButtons();
    btnSortByDueDate.style.display = "none";
    btnSortDownByDueDate.style.display = "block";
    btnSortDownByDueDate.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("dueDate", "down");
});

btnSortDownByDueDate.addEventListener("click", sortByDueDate);

// ### SORT BY OWNER ###

const sortByOwner = () => {
    resetSortAndFilterButtons();
    btnSortByOwner.style.display = "none";
    btnSortUpByOwner.style.display = "block";
    btnSortUpByOwner.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("owner", "up");
}

btnSortByOwner.addEventListener("click", sortByOwner);

btnSortUpByOwner.addEventListener("click", () => {
    resetSortAndFilterButtons();
    btnSortByOwner.style.display = "none";
    btnSortDownByOwner.style.display = "block";
    btnSortDownByOwner.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("owner", "down");
});

btnSortDownByOwner.addEventListener("click", sortByOwner);

// ### SORT BY PRIORITY ###

const sortByPriority = () => {
    resetSortAndFilterButtons();
    btnSortByPriority.style.display = "none";
    btnSortUpByPriority.style.display = "block";
    btnSortUpByPriority.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("prio", "up");
}

btnSortByPriority.addEventListener("click", sortByPriority);

btnSortUpByPriority.addEventListener("click", () => {
    resetSortAndFilterButtons();
    btnSortByPriority.style.display = "none";
    btnSortDownByPriority.style.display = "block";
    btnSortDownByPriority.style.background = "radial-gradient(circle at center, var(--accent-turquois) 0, var(--accent-turquois) 66%, transparent 67%)";
    sortTickets("prio", "down");
});