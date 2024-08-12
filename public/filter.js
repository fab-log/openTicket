btnDismissFilter.addEventListener("click", () => {
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    removeFilterListeners();
    modalFilter.style.display = "none";
});

const prepareSelFilter = (type) => {
    modalFilter.style.display = "block";
    let selArray = [];
    tickets.forEach((e) => {
        selArray.push(e[type].at(-1)[2]);
    });
    let filteredSelArray = selArray.filter((element, index) => {
        return selArray.indexOf(element) === index;
    });
    filteredSelArray.sort((a, b) => {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    });
    filteredSelArray.forEach((e) => {
        if (e > 1690000000000) {
            selFilter.insertAdjacentHTML(
                "beforeend",
                `
							<option value="${dateToString(e)}">${dateToString(e)}</option>
					`
            );
        } else {
            selFilter.insertAdjacentHTML(
                "beforeend",
                `
							<option value="${e}">${e}</option>
					`
            );
        }
    });
};

// ######################
// ### FILTER BY TYPE ###
// ######################

const fnFilterByDate = () => {
    let filterValue = selFilter.value;
    filteredTickets = sortedTickets.filter((element) => {
        return dateToString(element.date.at(-1)[2]) === filterValue;
    });
    modalFilter.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByDate.style.display = "block";
    btnUndoFilterByDate.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    renderList(filteredTickets);
};

const fnFilterByTitle = () => {
    let filterValue = selFilter.value;
    filteredTickets = sortedTickets.filter((element) => {
        return element.title.at(-1)[2].toString() === filterValue;
    });
    modalFilter.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByTitle.style.display = "block";
    btnUndoFilterByTitle.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    renderList(filteredTickets);
};

const fnFilterByDescription = () => {
    let filterValue = selFilter.value;
    filteredTickets = sortedTickets.filter((element) => {
        return element.description.at(-1)[2].toString() === filterValue;
    });
    modalFilter.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByDescription.style.display = "block";
    btnUndoFilterByDescription.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    renderList(filteredTickets);
};

const fnFilterByDueDate = () => {
    let filterValue = selFilter.value;
    filteredTickets = sortedTickets.filter((element) => {
        return element.dueDate.at(-1)[2] === filterValue;
    });
    modalFilter.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByDueDate.style.display = "block";
    btnUndoFilterByDueDate.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    renderList(filteredTickets);
};

const fnFilterByOwner = () => {
    let filterValue = selFilter.value;
    filteredTickets = sortedTickets.filter((element) => {
        return element.owner.at(-1)[2].toString() === filterValue;
    });
    modalFilter.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByOwner.style.display = "block";
    btnUndoFilterByOwner.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    renderList(filteredTickets);
};

const fnFilterByPriority = () => {
    let filterValue = selFilter.value;
    filteredTickets = sortedTickets.filter((element) => {
        return element.prio.at(-1)[2].toString() === filterValue;
    });
    modalFilter.style.display = "none";
    resetSortAndFilterButtons();
    grpArrows.forEach((e) => {
        e.style.display = "none";
    });
    btnUndoFilterByPriority.style.display = "block";
    btnUndoFilterByPriority.style.background =
        "radial-gradient(circle at center, var(--accent-red) 0, var(--accent-red) 66%, transparent 67%)";
    selFilter.innerHTML = `<option value="" selected disabled>select filter value</option>`;
    renderList(filteredTickets);
};
