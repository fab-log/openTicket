const insertTableString = (element) => {
    console.log("=> fn insertTableString triggered");
    let randomTime = Math.random() * 4 + 6;
    let correctedHue = element.bubbleHue.at(-1)[2] - 30;
    let title = element.title.at(-1)[2];
    // if (title.length > 18) title = title.substring(0, 18) + "...";
    let description = element.description.at(-1)[2];
    // if (description.length > 20) description = description.substring(0, 20) + "...";
    let dueDateString = element.dueDate.at(-1)[2] !== "" ? htmlDateToLocalString(element.dueDate.at(-1)[2]) : "";
    let index = typeMap.findIndex(e => e[0] === element.type.at(-1)[2]);
    let typeString = `<div class="tdType iconMini" title="${typeMapTranslations[index][config.language]}"><img src="${typeMap[index][1]}" alt="task" style="opacity: 0.5;"></div>`;
    let tdWarnPrioString = "";
    let tdWarnDueString = "";
    if (element.prio.at(-1)[2] > 1) {
        tdWarnPrioString = `<img src="assets/warning.webp" title="${lang('high priority', 'Hohe Dringlichkeit')}" style="animation: flash ${randomTime}s 150ms ease-in infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);">`;
    }
    if (element.dueDate.at(-1)[2] <= dateToHtmlString(Date.now()) && element.dueDate.at(-1)[2] != "") {
        tdWarnDueString = `<img src="assets/alarmClock.webp" title="${lang('due', 'überfällig')}" style="animation: flash ${randomTime}s ease-in infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);">`;
    }
    let prioIndex = priority.findIndex(e => e[0] === element.prio.at(-1)[2]);
    let priorityString = priority[prioIndex][config.language + 1];
    ticketList.insertAdjacentHTML(
        "beforeend",
        `
		<tr class="listItem" id="${element.id}">
			<td>${dateToString(element.date.at(-1)[2])}</td>
			<td style="border-left: 9px solid hsl(${element.bubbleHue.at(-1)[2]}, 20%, 50%" title="${element.title.at(-1)[2]}">
                <div class="titleColumn">
                    ${typeString}
                    <div class="titleGridElement">${title}</div>
                    <div class="tdWarnPrio">${tdWarnDueString === "" ? "" : tdWarnPrioString}</div>
                    <div class="tdWarnDue">${tdWarnDueString === "" ? tdWarnPrioString : tdWarnDueString}</div>
                </div>
			</td>
			<td title="${element.description.at(-1)[2]}">${description}</td>
			<td>${dueDateString}</td>
			<td>${typeMapTranslations[index][config.language]}</td>
			<td>${priorityString}</td>
		</tr>`);
    document.querySelector(`#${element.id}`).addEventListener("click", () => {
        displayTicket(element.id);
    });
};

const renderTable = (listArray) => {
	console.log("=> fn renderTable triggered");
    if (listArray.length === 0) {
        showAlert(lang("You don't have a list yet.<br>Click on the plus icon to get started.", "Du hast noch keine Liste.<br>Klicke auf das Plus-Zeichen, um zu starten."))
        renderWelcome();
        return;
    }
    // currentTicket = {};
    hideAllModals();
	main.innerHTML = `
		<div class="list modal">
            <table class="ticketList">
                <tr>
                    <th>
                        ${lang("Created", "Erstellt")}
                        <img src="assets/arrowUp.webp" alt="sort descending" title="${lang("sort descending", "absteigend sortieren")}" id="btnSortUpByDate" class="btnSortUp grpArrows" onclick="sortDownByDate()"><img src="assets/arrowDown.webp" alt="sort ascending" title="${lang("sort ascending", "aufsteigend sortieren")}" id="btnSortDownByDate" class="btnSortDown grpArrows" onclick="sortUpByDate()"><img src="assets/arrows.webp" alt="sort" title="${lang("sort by date", "Nach Datum sortieren")}" id="btnSortByDate" class="btnSort grpArrows" onclick="sortUpByDate()"><img src="assets/filter.webp" alt="filter" title="${lang("filter by date", "Nach Datum filtern")}" id="btnFilterByDate" class="btnFilter grpArrows" onclick="prepareSelFilter('date')"><img src="assets/cancel.webp" alt="delete filter" title="delete filter" id="btnUndoFilterByDate" class="btnUndoFilter grpArrows" onclick="undoFilters()">
                    </th>
                    <th style="border-left: 9px solid var(--background-color2);">
                        ${lang("Title", "Titel")}
                        <img src="assets/arrowUp.webp" alt="sort descending" title="${lang("sort descending", "absteigend sortieren")}" id="btnSortUpByTitle" class="btnSortUp grpArrows" onclick="sortDownByTitle()"><img src="assets/arrowDown.webp" alt="sort ascending" title="${lang("sort ascending", "aufsteigend sortieren")}" id="btnSortDownByTitle" class="btnSortDown grpArrows" onclick="sortUpByTitle()"><img src="assets/arrows.webp" alt="sort" title="${lang("sort by title", "Nach Titel sortieren")}" id="btnSortByTitle" class="btnSort grpArrows" onclick="sortUpByTitle()"><img src="assets/filter.webp" alt="filter" title="${lang("filter by title", "Nach Titel filtern")}" id="btnFilterByTitle" class="btnFilter grpArrows" onclick="prepareSelFilter('title')"><img src="assets/cancel.webp" alt="delete filter" title="delete filter" id="btnUndoFilterByTitle" class="btnUndoFilter grpArrows" onclick="undoFilters()">
                    </th>
                    <th>
                        ${lang("Description", "Beschreibung")}
                        <img src="assets/arrowUp.webp" alt="sort descending" title="${lang("sort descending", "absteigend sortieren")}" id="btnSortUpByDescription" class="btnSortUp grpArrows" onclick="sortDownByDescription()"><img src="assets/arrowDown.webp" alt="sort ascending" title="${lang("sort ascending", "aufsteigend sortieren")}" id="btnSortDownByDescription" class="btnSortDown grpArrows" onclick="sortUpByDescription()"><img src="assets/arrows.webp" alt="sort" title="${lang("sort by description", "Nach Beschreibung sortieren")}" id="btnSortByDescription" class="btnSort grpArrows" onclick="sortUpByDescription()"><img src="assets/filter.webp" alt="filter" title="${lang("filter by description", "Nach Beschreibung filtern")}" id="btnFilterByDescription" class="btnFilter grpArrows" onclick="prepareSelFilter('description')"><img src="assets/cancel.webp" alt="delete filter" title="delete filter" id="btnUndoFilterByDescription" class="btnUndoFilter grpArrows" onclick="undoFilters()">
                    </th>
                    <th>
                        ${lang("Due Date", "Fällig")}
                        <img src="assets/arrowUp.webp" alt="sort descending" title="${lang("sort descending", "absteigend sortieren")}" id="btnSortUpByDueDate" class="btnSortUp grpArrows" onclick="sortDownByDueDate()"><img src="assets/arrowDown.webp" alt="sort ascending" title="${lang("sort ascending", "aufsteigend sortieren")}" id="btnSortDownByDueDate" class="btnSortDown grpArrows" onclick="sortUpByDueDate()"><img src="assets/arrows.webp" alt="sort" title="${lang("sort by due date", "Nach Falligkeit sortieren")}" id="btnSortByDueDate" class="btnSort grpArrows" onclick="sortUpByDueDate()"><img src="assets/filter.webp" alt="filter" title="${lang("filter by due date", "Nach Falligkeit filtern")}" id="btnFilterByDueDate" class="btnFilter grpArrows" onclick="prepareSelFilter('dueDate')"><img src="assets/cancel.webp" alt="delete filter" title="delete filter" id="btnUndoFilterByDueDate" class="btnUndoFilter grpArrows" onclick="undoFilters()">
                    </th>
                    <th>
                        ${lang("Type", "Typ")}
                        <img src="assets/arrowUp.webp" alt="sort descending" title="${lang("sort descending", "absteigend sortieren")}" id="btnSortUpByType" class="btnSortUp grpArrows" onclick="sortDownByType()"><img src="assets/arrowDown.webp" alt="sort ascending" title="${lang("sort ascending", "aufsteigend sortieren")}" id="btnSortDownByType" class="btnSortDown grpArrows" onclick="sortUpByType()"><img src="assets/arrows.webp" alt="sort" title="${lang("sort by type", "Nach Typ sortieren")}" id="btnSortByType" class="btnSort grpArrows" onclick="sortUpByType()"><img src="assets/filter.webp" alt="filter" title="${lang("filter by type", "Nach Typ filtern")}" id="btnFilterByType" class="btnFilter grpArrows" onclick="prepareSelFilter('type')"><img src="assets/cancel.webp" alt="delete filter" title="delete filter" id="btnUndoFilterByType" class="btnUndoFilter grpArrows" onclick="undoFilters()">
                    </th>
                    <th>
                        ${lang("Priority", "Dringlichkeit")}
                        <img src="assets/arrowUp.webp" alt="sort descending" title="${lang("sort descending", "absteigend sortieren")}" id="btnSortUpByPriority" class="btnSortUp grpArrows" onclick="sortUpDownPriority()"><img src="assets/arrowDown.webp" alt="sort ascending" title="${lang("sort ascending", "aufsteigend sortieren")}" id="btnSortDownByPriority" class="btnSortDown grpArrows" onclick="sortUpByPriority()"><img src="assets/arrows.webp" alt="sort" title="${lang("sort by priority", "Nach Dringlichkeit sortieren")}" id="btnSortByPriority" class="btnSort grpArrows" onclick="sortUpByPriority()"><img src="assets/filter.webp" alt="filter" title="${lang("filter by priority", "Nach Dringlichkeit filtern")}" id="btnFilterByPriority" class="btnFilter grpArrows" onclick="prepareSelFilter('prio')"><img src="assets/cancel.webp" alt="delete filter" title="delete filter" id="btnUndoFilterByPriority" class="btnUndoFilter grpArrows" onclick="undoFilters()">
                    </th>
                </tr>
            </table>
        </div>
	`;
	grpArrows = document.querySelectorAll(".grpArrows");

	btnSortUpByDate = document.querySelector("#btnSortUpByDate");
	btnSortDownByDate = document.querySelector("#btnSortDownByDate");
	btnSortByDate = document.querySelector("#btnSortByDate");
	btnFilterByDate = document.querySelector("#btnFilterByDate");
	btnUndoFilterByDate = document.querySelector("#btnUndoFilterByDate");

	btnSortUpByTitle = document.querySelector("#btnSortUpByTitle");
	btnSortDownByTitle = document.querySelector("#btnSortDownByTitle");
	btnSortByTitle = document.querySelector("#btnSortByTitle");
	btnFilterByTitle = document.querySelector("#btnFilterByTitle");
	btnUndoFilterByTitle = document.querySelector("#btnUndoFilterByTitle");
	
	btnSortUpByDescription = document.querySelector("#btnSortUpByDescription");
	btnSortDownByDescription = document.querySelector("#btnSortDownByDescription");
	btnSortByDescription = document.querySelector("#btnSortByDescription");
	btnFilterByDescription = document.querySelector("#btnFilterByDescription");
	btnUndoFilterByDescription = document.querySelector("#btnUndoFilterByDescription");
	
	btnSortUpByDueDate = document.querySelector("#btnSortUpByDueDate");
	btnSortDownByDueDate = document.querySelector("#btnSortDownByDueDate");
	btnSortByDueDate = document.querySelector("#btnSortByDueDate");
	btnFilterByDueDate = document.querySelector("#btnFilterByDueDate");
	btnUndoFilterByDueDate = document.querySelector("#btnUndoFilterByDueDate");
	
	btnSortUpByType = document.querySelector("#btnSortUpByType");
	btnSortDownByType = document.querySelector("#btnSortDownByType");
	btnSortByType = document.querySelector("#btnSortByType");
	btnFilterByType = document.querySelector("#btnFilterByType");
	btnUndoFilterByType = document.querySelector("#btnUndoFilterByType");
	
	btnSortUpByPriority = document.querySelector("#btnSortUpByPriority");
	btnSortDownByPriority = document.querySelector("#btnSortDownByPriority");
	btnSortByPriority = document.querySelector("#btnSortByPriority");
	btnFilterByPriority = document.querySelector("#btnFilterByPriority");
	btnUndoFilterByPriority = document.querySelector("#btnUndoFilterByPriority");
	// modal.style.display = "block";
	// hideAllModals();
	list = document.querySelector(".list");
	ticketList = document.querySelector(".ticketList");
    list.style.display = "block";

	// ### CLEAN UP ###
    for (let i = ticketList.rows.length - 1; i > 0; i--) {
        ticketList.rows[i].remove();
        ticketList.tBodies[i].remove();
    }
    if (searchSortingOrFiltersActive === false) {
        resetSortAndFilterButtons();
    }

    btnStartBubbles.style.display = "block";
    btnStartTable.style.display = "none";
    if (config.listType != "table") {
        currentUser.config.listType = "table";
        updateUserSilent();
    }
    config.listType = "table";

    // Make sure priority value are translated
    const priorityValues = [];
    priority.forEach((e) => {
        priorityValues.push(e[config.language + 1]);
    });

    listArray.forEach((element) => {
        if (element.prio.at(-1)[2] != -1) {
            insertTableString(element);
        }
    });
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}

// renderTable();