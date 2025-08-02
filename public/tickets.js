const modalTicket = document.querySelector(".modalTicket");
const modalRestore = document.querySelector(".modalRestore");
const modalEditPersonalData = document.querySelector(".modalEditPersonalData");
const modalFilter = document.querySelector(".modalFilter");
const modalSearch = document.querySelector(".modalSearch");
const entry = document.querySelector(".entry");
const newElementPopUp = document.querySelector(".new-element-pop-up");
const mdDivDisplaySubtasks = document.querySelector(".mdDivDisplaySubtasks");
const mdDivDisplayCompletedSubtasks = document.querySelector(".mdDivDisplayCompletedSubtasks");
const modalConfirmDone = document.querySelector(".modalConfirmDone");
const modalSubtaskConfirmDone = document.querySelector(".modalSubtaskConfirmDone");
const modalEditSubticket = document.querySelector(".modalEditSubticket");

const cyphers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const randomCyphers = (length) => {
    let randomString = "";
    for (i = 0; i < length; i++) {
        randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
    }
    return randomString;
}

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const randomNumbers = (length) => {
    let randomString = "";
    for (i = 0; i < length; i++) {
        randomString += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return randomString;
}

let currentTicketType = "";

const renderNewElementPicker = () => {
    console.log("=> fn renderNewElementPicker triggered");
    if (newElementPopUp.style.display === "block") {
        newElementPopUp.style.display = "none";
    } else {
        newElementPopUp.innerHTML = `
            <h3>${lang("Choose an element", "Wähle ein Element")}</h3>
            <figure>
                <img src="assets/check_large.webp" alt="task" onclick="displayNewTicket()">
                <figcaption>${lang("new task", "Neue Aufgabe")}</figcaption>
            </figure>
            <figure>
                <img src="assets/checklist.webp" alt="checklist" onclick="displayNewChecklist()">
                <figcaption>${lang("new checklist", "Neue Checkliste")}</figcaption>
            </figure>
            <figure>
                <img src="assets/pin.webp" alt="task" onclick="displayNewNote()">
                <figcaption>${lang("new note", "Neue Notiz")}</figcaption>
            </figure>
            
        `;
        newElementPopUp.style.display = "block";
    }
}

const resetModalTicketInputs = () => {
    console.log("=> fn resetModalInputs triggered");
    mdInpTitle.value = "";
    mdInpDueDate.value = "";
    mdSelPrio.innerHTML = "";
    mdTaDescription.value = "";
    /* mdSelSubtaskState.innerHTML = "";
    mdSelSubtaskType.innerHTML = ""; */
    mdTaNote.value = "";
};

const rank = (listArray) => {
    console.log("=> fn rank triggered");
    listArray.sort((a, b) => {
        if (a.dueDate.at(-1)[2] > b.dueDate.at(-1)[2]) {
            return 1;
        }
        if (a.dueDate.at(-1)[2] < b.dueDate.at(-1)[2]) {
            return -1;
        }
        return 0;
    });
    listArray.forEach((e) => {
        if (
            e.prio.at(-1)[2] > 2 &&
            e.dueDate.at(-1)[2] <= dateToHtmlString(Date.now()) &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 8;
        }
        else if (
            e.prio.at(-1)[2] > 1 &&
            e.dueDate.at(-1)[2] <= dateToHtmlString(Date.now()) &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 7;
        } else if (
            e.prio.at(-1)[2] > 2 &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 6;
        } else if (
            e.prio.at(-1)[2] > 2
        ) {
            e.ranking = 5;
        } else if (
            e.prio.at(-1)[2] > 1 &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 4;
        } else if (e.prio.at(-1)[2] > 1) {
            e.ranking = 3;
        } else if (
            e.dueDate.at(-1)[2] <= dateToHtmlString(Date.now()) &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 2;
        } else if (e.dueDate.at(-1)[2] != "") {
            e.ranking = 1;
        } else if (e.dueDate.at(-1)[2] === "") {
            e.ranking = 0;
        }
    });
    listArray.sort((a, b) => {
        if (a.ranking < b.ranking) {
            return 1;
        }
        if (a.ranking > b.ranking) {
            return -1;
        }
        return 0;
    });
    return listArray;
};

const displayTicketList = () => {
    console.log("=> fn displayTicketList triggered");
    hideAllModals();
    list.style.display = "block";
    btnStartBubbles.style.display = "block";
    btnStartTable.style.display = "none";
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
    config.listType = "table";
    localStorage.setItem("openTicketConfig", JSON.stringify(config));
    console.log({ config });
};

const editSubtask = (subId) => {
    console.log("=> fn editSubtask triggered");
    currentSubId = subId;
    let index = currentTicket.subtasks.findIndex((e) => e.subId === currentSubId);
    popUp.innerHTML = `
        <h3>Edit subtask</h3>
        <form id="frmEditSubtask">
            <p class="dimmedFont small">
                <span id="mdEditSubtaskDate"></span> |
                <span id="mdEditSubtaskEditor"></span>
            </p>
            <p class="dimmedFont">
                ${lang("subtask", "Unteraufgabe")}<br>
                <textarea id="mdTaEditSubtaskNote"></textarea>
            </p>

            <figure id="mdBtnDismissEditedSubtask" class="mdBtn">
                <img src="assets/cancel.webp" title="dismiss changes" onclick="dismissEditSubtask()">
                <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
            </figure>

            <figure id="mdBtnSaveEditedSubtask" class="mdBtn">
                <img src="assets/save.webp" title="save changes" onclick="saveEditedSubtask()">
                <figcaption>${lang("save", "speichern")}</figcaption>
            </figure>
            
        </form>
    `;
    popUp.style.display = "block";
    // modalEditSubticket.style.border = `6px solid hsl(${currentTicket.bubbleHue.at(-1)[2]}, 25%, 50%)`;
    document.querySelector("#mdBtnSaveEditedSubtask").style.display = "inline-block";
    document.querySelector("#mdBtnDismissEditedSubtask").style.display = "inline-block";

    document.querySelector("#mdEditSubtaskDate").innerHTML = dateAndTimeToString(currentTicket.subtasks[index].date.at(-1)[2]);
    document.querySelector("#mdEditSubtaskEditor").innerHTML = currentTicket.subtasks[index].editor.at(-1)[2];
    const mdTaEditSubtaskNote = document.querySelector("#mdTaEditSubtaskNote");
    mdTaEditSubtaskNote.value = currentTicket.subtasks[index].note.at(-1)[2];
    mdTaEditSubtaskNote.focus();
};

const dismissEditSubtask = () => {
    console.log("=> fn dismissEditTask triggered");
    popUp.style.display = "none";
    document.querySelector("#frmEditSubtask").reset();
};

const closeModalTicket = () => {
	if (config.listType === "bubbles") {
		renderBubbles(tickets);
	} else if (config.listType === "table") {
		renderTable(tickets);
	}
}

const convertTicket = async (type) => {
    popUp.innerHTML = "";
    popUp.style.display = "none";
    if (type === "note" && currentTicket.subtasks.length > 0) {
        let description = currentTicket.description.at(-1)[2];
        currentTicket.subtasks.forEach(e => {
            if (e.state.at(-1)[2] != -1) description += "\n" + e.note.at(-1)[2];
        });
        currentTicket.description.push([Date.now(), currentUser.id, description]);
    }
    if (type === "note") {
        currentTicket.prio.push([Date.now(), currentUser.id, 0]);
        currentTicket.dueDate.push([Date.now(), currentUser.id, ""]);
    }
    currentTicket.type.push([Date.now(), currentUser.id, type]);
    await updateTicket();
    displayTicket(currentTicket.id);
}

const displayTicketSettings = () => {
    if (popUp.style.display = "none") {
        let type = currentTicket.type.at(-1)[2];
        let taskString = type === "task" ? "" : `
            <button type="button" onclick="convertTicket('task')">${lang("Convert to task", "In Aufgabe umwandeln")}</button><br>
        `;
        let checklistString = type === "checklist" ? "" : `
            <button type="button" onclick="convertTicket('checklist')">${lang("Convert to checklist", "In Checkliste umwandeln")}</button><br>
        `;
        let noteString = type === "note" ? "" : `
            <button type="button" onclick="convertTicket('note')">${lang("Convert to note", "In Notiz umwandeln")}</button>
        `;
        popUp.innerHTML = `
            <img src="assets/cancel.webp" alt="close" title="${lang("close", "schließen")}" onclick="closePopUp()" style="width: 24px; float: right;">
            <h3>${lang("Convert Type", "Typ ändern")}</h3>
            <p>${lang("You can convert the current element to another type by clicking one of the buttons below.", "Du kannst den Typ des aktuellen Elements ändern, indem du auf einen der unteren Buttons klickst.")}</p>
            ${taskString}
            ${checklistString}
            ${noteString}
        `;
        popUp.style.display = "block";
    } else {
        popUp.style.display = "none";
    }
}

const renderConfirmDone = () => {
    popUp.innerHTML = `
        <img src="assets/warning.webp" alt="warning" class="warning"><br>
        <hr class="hrHighLight">
        <p>${lang("Marking an element as completed will remove it from the list.<br>You find a restoring option in the settings, if needed.", "Wenn du ein Element als erledigt markierst, verschwindet es aus der Liste<br>In den Einstellungen findest du eine Wiederherstellungs-Option, falls nötig.")}</p>
        <figure onclick="closePopUp()">
            <img src="assets/cancel.webp">
            <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
        </figure>
        <figure id="btnConfirmDone" onclick="confirmDone()">
            <img src="assets/check.webp">
            <figcaption>${lang("done", "erledigt")}</figcaption>
        </figure>
    `;
    popUp.style.display = "block";
};

const displayModalTicket = () => {
    console.log("=> fn displayModalTicket triggered");
    doQuSe(btnStartTable);
    doQuSe(btnStartBubbles);
    if (config.listType === "bubbles") {
        btnStartBubbles.style.display = "block";
        btnStartTable.style.display = "none";
    }
    if (config.listType === "table") {
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "block";
    }
    hideAllModals();
    main.innerHTML = `
    <div class="modalTicket modal">
        <img src="assets/cancel.webp" alt="close" title="${lang("close", "schließen")}" class="btnCloseModal" onclick="closeModalTicket()">
        <img src="assets/three_dots.webp" alt="settings menu" title="${lang("settings menu", "Einstellungen")}" class="btnTicketSettings" onclick="displayTicketSettings()">
        <h3 class="align-center" id="mdTicketHeading"></h3>
        <p class="dimmedFont small">
            <br><span id="mdDate"></span><!--  | <span id="mdOwner"></span> -->
        </p>

        <div id="mdDivDisplay">

            <div class="mdTopGrid">

                <div class="mdTopGridItem">
                    <h2 class="green" id="mdTitle">Title</h2>

                    <p id="mdPDescription">
                        <span class="dimmedFont small">${lang("description", "Beschreibung")}</span><br>
                        <span class="green" id="mdSpanDescription"></span>
                    </p>

                    <table class="small topGridTable">
                        <tr>
                            <td class="dimmedFont" id="mdTdDueDateCaption">${lang("due date", "fällig am")}</td>
                            <td class="green" id="mdTdDueDate"></td>
                        </tr>
                        <tr>
                            <td class="dimmedFont" id="mdTdPrioCaption">${lang("priority", "Dringlichkeit")}</td>
                            <td class="green" id="mdTdPrio"></td>
                        </tr>
                    </table>
                </div>

                <div id="mdMainButtons" class="mdTopGridItem">
                    <figure id="mdBtnDone" class="mdBtn" onclick="renderConfirmDone()">
                        <img src="assets/check.webp" alt="mark as done" title="mark ticket as done">
                        <figcaption>${lang("done", "erledigt")}</figcaption>
                    </figure>
                    <figure id="mdBtnEdit" class="mdBtn" onclick="editTicket(currentTicket.id)">
                        <img src="assets/pencil.webp" alt="edit" title="edit task">
                        <figcaption>${lang("edit", "bearbeiten")}</figcaption>
                    </figure>
                    <figure id="mdBtnAddEntry" class="mdBtn" onclick="displayNewSubtask()">
                        <img src="assets/smallPlus.webp" title="add subtask">
                        <figcaption>${lang("subtask", "Unteraufgabe")}</figcaption>
                    </figure>
                    <figure id="mdBtnSaveEntry" class="mdBtn" onclick="saveSubtask(event)">
                        <img src="assets/save.webp" title="save entry">
                        <figcaption>${lang("save", "speichern")}</figcaption>
                    </figure>
                    <figure id="mdBtnDismiss" class="mdBtn" onclick="closeModalTicket()">
                        <img src="assets/cancel.webp" title="dismiss changes">
                        <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
                    </figure>
                </div>

            </div>

            <div class="entry">
                <form id="frmEntry">
                    <p class="dimmedFont small">
                        <span id="mdSubtaskDate"></span>
                    </p>
                    <p class="dimmedFont">
                        ${lang("subtask", "Unteraufgabe")}<br>
                        <textarea id="mdTaNote"></textarea>
                    </p>
                </form>
            </div>

            <div>
                <div class="mdDivDisplaySubtasks"></div>
                <div class="btnSubtasksContainer">
                    <button type="button" onclick="showCompletedSubtasks()" class="btnSubtasks" id="btnShowCompletedSubtasks">${lang("show completed elements", "Erledigte Elemente anzeigen")}</button>
                    <button type="button" onclick="hideCompletedSubtasks()" class="btnSubtasks" id="btnHideCompletedSubtasks">${lang("hide completed elements", "Erledigte Elemente ausblenden")}</button>
                    <button type="button" onclick="swapSubtaskOrder()" class="btnSubtasks" id="btnSwapSubtaskOrder">${lang("swap order", "Reihenfolge umkehren")}</button>
                </div>
                <div class="mdDivDisplayCompletedSubtasks"></div>
            </div>

        </div>

        <div id="mdDivEdit">

            <div class="mdTopGrid">

                <form id="frmTicket" class="mdTopGridItem">
                    <table class="topGridTable">
                        <tr>
                            <td class="dimmedFont">${lang("title *", "Titel *")}</td>
                            <td><input type="text" id="mdInpTitle"></td>
                        </tr>
                        <tr id="mdTrDueDate">
                            <td class="dimmedFont">${lang("due date", "fällig am")}</td>
                            <td><input type="date" id="mdInpDueDate"></td>
                        </tr>
                        <tr id="mdTrPrio">
                            <td class="dimmedFont">${lang("priority", "Dringlichkeit")}</td>
                            <td>
                                <select id="mdSelPrio">
                                    <option value="" selected disabled>${lang("select", "auswählen")}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="dimmedFont">${lang("color", "Farbe")}</td>
                            <td class="green">
                                <input type="range" id="mdInpColor" min="0" max="330" step="30">
                            </td>
                        </tr>
                    </table>
                    <p class="dimmedFont" id="mdPDescription2">${lang("description", "Beschreibung")}<br><textarea id="mdTaDescription"></textarea></p>
                </form>

                <div id="mainButtons" class="mdTopGridItem">
                    <figure id="mdBtnSaveEditedTicket" class="mdBtn" onclick="saveEditedTicket()">
                        <img src="assets/save.webp" title="save changes">
                        <figcaption>${lang("save", "speichern")}</figcaption>
                    </figure>
                    <figure id="mdBtnSaveEntry" class="mdBtn" onclick="saveSubtask(event)">
                        <img src="assets/save.webp" title="save entry">
                        <figcaption>${lang("save", "speichern")}</figcaption>
                    </figure>
                    <figure id="mdBtnSaveTicket" class="mdBtn" onclick="saveNewTicket()">
                        <img src="assets/save.webp" title="save ticket">
                        <figcaption>${lang("save", "speichern")}</figcaption>
                    </figure>
                    <figure id="mdBtnAddEntry2" class="mdBtn" onclick="displayNewSubtask()">
                        <img src="assets/smallPlus.webp" title="add subtask">
                        <figcaption>${lang("subtask", "Unteraufgabe")}</figcaption>
                    </figure>
                    <figure id="mdBtnDismiss2" class="mdBtn" onclick="closeModalTicket()">
                        <img src="assets/cancel.webp" title="dismiss changes">
                        <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
                    </figure>
                </div>

            </div>

        </div>
        
        <div class="mdDivChecklist"></div>

        <div class="align-center">
        </div>
    </div>
    `;
    //  onclick="addNewChecklistItem()"
    document.querySelector(".modalTicket").style.display = "block";
    document.querySelector("#frmTicket").reset();
    document.querySelectorAll(".mdBtn").forEach((e) => {
        e.style.display = "none";
    });
    document.querySelector(".entry").style.display = "none";
    // document.querySelector("#mdBtnAddNewChecklistItem").style.display = "none";
};

const swapSubtaskOrder = async () => {
    let arr = currentTicket.subtasks;
    let position = arr.length;
    for (let i = 0; i < arr.length ; i++) {
        arr[i].position = position;
        position -= 1;
    }
    arr.sort ((a, b) => a.position - b.position);
    await updateTicket();
    displayTicket(currentTicket.id);
}

const displayTicket = (ticketId) => {
    console.log("=> fn displayTicket triggered");
    let index = getIndex(ticketId);
    currentTicket = tickets[index];
    console.log({ currentTicket });
    displayModalTicket();
    const modalTicket = document.querySelector(".modalTicket");
    let typeIndex = typeMapTranslations.findIndex(e => e[0] === currentTicket.type.at(-1)[2]);
    let activeSubtasks = [];
    currentTicket.subtasks.forEach(e => {
        if (e.state.at(-1)[2] != -1) activeSubtasks.push(e);
    });
    let typeString = typeMapTranslations[typeIndex][currentUser.config.language];
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${currentTicket.bubbleHue.at(-1)[2]}, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${currentTicket.bubbleHue.at(-1)[2]}, 25%, 50%)`;
    document.querySelector("#mdDivDisplay").style.display = "block";
    document.querySelector(".btnTicketSettings").style.display = "block";
    document.querySelector("#mdDivEdit").style.display = "none";
    document.querySelector(".entry").style.display = "none";
    document.querySelector("#mdBtnEdit").style.display = "block";
    document.querySelector("#mdBtnAddEntry").style.display = "block";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector("#mdBtnDone").style.display = "block";
    document.querySelector("#btnShowCompletedSubtasks").style.display = "none";
    document.querySelector("#btnHideCompletedSubtasks").style.display = "none";
    document.querySelector("#btnSwapSubtaskOrder").style.display = "none";
    document.querySelector("#mdDate").innerHTML = `${dateAndTimeToString(currentTicket.date.at(-1)[2])} (${typeString})`;
    document.querySelector("#mdTitle").innerHTML = currentTicket.title.at(-1)[2];
    document.querySelector("#mdTitle").style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;
    if (currentTicket.dueDate.at(-1)[2] === "") {
        document.querySelector("#mdTdDueDateCaption").textContent = "";
    } else {
        document.querySelector("#mdTdDueDate").innerHTML = htmlDateToLocalString(currentTicket.dueDate.at(-1)[2]);
        document.querySelector("#mdTdDueDate").style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;
    }
    if (currentTicket.prio.at(-1)[2] === 0) {
        document.querySelector("#mdTdPrioCaption").textContent = "";
    } else {
        document.querySelector("#mdTdPrio").innerHTML = priorityValues[priorityIndexes.indexOf(currentTicket.prio.at(-1)[2])];
        document.querySelector("#mdTdPrio").style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;

    }
    if (currentTicket.description.at(-1)[2] === "") {
        document.querySelector("#mdPDescription").style.display = "none";
    } else {
        document.querySelector("#mdPDescription").style.display = "block";
        document.querySelector("#mdSpanDescription").innerHTML = format(currentTicket.description.at(-1)[2]);
        document.querySelector("#mdSpanDescription").style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;
    }

    const mdDivDisplaySubtasks = document.querySelector(".mdDivDisplaySubtasks");
    const mdDivDisplayCompletedSubtasks = document.querySelector(".mdDivDisplayCompletedSubtasks");
    mdDivDisplayCompletedSubtasks.innerHTML = "";
    if (currentTicket.subtasks.length > 0 && currentTicket.type.at(-1)[2] === "task") {
        // currentTicket.subtasks.sort((a, b) => a.subId - b.subId);
        // currentTicket.subtasks.sort((a, b) => b.state.at(-1)[2] - a.state.at(-1)[2]);
        currentTicket.subtasks.forEach((e) => {
            let color = `color: hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;
            let textDecoration = "";
            let dateString = `<p class="dimmedFont small">${dateAndTimeToString(e.note.at(-1)[0])}</p>`;

            if (e.state.at(-1)[2] != -1) {
                mdDivDisplaySubtasks.insertAdjacentHTML("afterbegin",`
                    <div class="divSubtask">

                        <div>
                            <p class="dimmedFont small">${lang("subtask n° ", "Unteraufgabe Nr. ")}${e.subId + 1}</p>
                            ${dateString}
                            <p style="${color} ${textDecoration}">${format(e.note.at(-1)[2])}</p>
                        </div>

                        <div>
                            <figure class="mdBtn" onclick="markDoneSubtask(${e.subId})">
                                <img src="assets/check.webp" alt="edit" class="subtaskMdBtn" title="mark subtask as done" style="width: 36px;">
                                <figcaption>${lang("done", "erledigt")}</figcaption>
                            </figure>
                            <figure class="mdBtn" onclick="editSubtask(${e.subId})">
                                <img src="assets/pencil.webp" alt="edit" class="subtaskMdBtn" title="edit subtask" style="width: 36px;">
                                <figcaption>${lang("edit", "bearbeiten")}</figcaption>
                            </figure>
                        </div>

                    </div>
                        
                    <hr>
                `);
            } else if (e.state.at(-1)[2] === -1) {
                color = "color: hsl(0, 0%, 50%)";
                textDecoration = `; text-decoration: line-through;`;
                dateString = `<p class="dimmedFont small">${lang("completed", "erledigt am")}: ${dateAndTimeToString(e.state.at(-1)[0])}</p>`;
                mdDivDisplayCompletedSubtasks.insertAdjacentHTML("afterbegin",`
                    <div class="divSubtask">

                        <div>
                            <p class="dimmedFont small">${lang("subtask n° ", "Unteraufgabe Nr. ")}${e.subId + 1}</p>
                            ${dateString}
                            <p style="${color} ${textDecoration}">${format(e.note.at(-1)[2])}</p>
                        </div>

                        <div>
                            <figure class="mdBtn" onclick="restoreSubtask(${e.subId})">
                                <img src="assets/restore.webp" alt="restore" class="subtaskMdBtn" title="restore subtask" style="width: 36px;">
                                <figcaption>${lang("restore", "wiederherstellen")}</figcaption>
                            </figure>
                        </div>

                    </div>

                    <hr>
                `);
        }
        if (activeSubtasks.length > 1) {
            document.querySelector("#btnSwapSubtaskOrder").style.display = "inline-block";
        }
        if (mdDivDisplayCompletedSubtasks.innerHTML != "") {
            document.querySelector("#btnShowCompletedSubtasks").style.display = "inline-block";
        }
        });
        mdDivDisplaySubtasks.insertAdjacentHTML("afterbegin", `<hr id="mdHr">`);
        document.querySelector("#mdHr").style.borderBottom = `6px solid hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;
    }

    if (currentTicket.type.at(-1)[2] === "checklist") {     // formerly included: currentTicket.subtasks.length > 0 && 
        mdDivDisplaySubtasks.innerHTML = `<table class="mdTableChecklistItems" id="mdActiveChecklistItems"></table>`;
        mdDivDisplayCompletedSubtasks.innerHTML = `<table class="mdTableChecklistItems" id="mdCompletedChecklistItems"></table>`;
        const mdActiveChecklistItems = document.querySelector("#mdActiveChecklistItems");
        const mdCompletedChecklistItems = document.querySelector("#mdCompletedChecklistItems");
        currentTicket.subtasks.forEach((e) => {
            let moveUpString = activeSubtasks.indexOf(e) === activeSubtasks.length - 1 ? "" : `<img src="assets/checklist_up.webp" class="checklistItemIcon" style="width: 24px;" alt="move up" title="${lang("move one up", "nach oben")}" onclick="moveChecklistItemUp(${e.subId})">`;
            let moveDownString = activeSubtasks.indexOf(e) === 0 ? "" : `<img src="assets/checklist_down.webp" class="checklistItemIcon" style="width: 24px;" alt="move down" title="${lang("move one down", "nach unten")}" onclick="moveChecklistItemDown(${e.subId})">`
            if (e.state.at(-1)[2] != -1) {
                mdActiveChecklistItems.insertAdjacentHTML("afterbegin",`
                    <tr>
                        <td title="${e.note.at(-1)[2]}">${e.note.at(-1)[2]}</td>
                        <td>${moveUpString}</td>
                        <td>${moveDownString}</td>
                        <td>
                            <img src="assets/check.webp" class="checklistItemIcon" style="width: 30px;" alt="mark done" title="${lang("mark as done", "als erledigt markieren")}" onclick="markDoneSubtask(${e.subId})">
                        </td>
                    <tr>
                `)
            } else if (e.state.at(-1)[2] === -1) {
                mdCompletedChecklistItems.insertAdjacentHTML("afterbegin",`
                    <tr>
                        <td title="${e.note.at(-1)[2]}" style="text-decoration: line-through;">${e.note.at(-1)[2]}</td>
                        <td><img src="assets/restore.webp" alt="restore" class="checklistItemIcon" title="${lang("restore element", "wiederherstellen")}" style="width: 30px;" onclick="restoreSubtask(${e.subId})"></td>
                        <td></td>
                        <td></td>
                    </tr>
                `);
            }
        });
        document.querySelector("#mdActiveChecklistItems").insertAdjacentHTML("afterbegin", `
            <tr>
                <td>
                    <form>
                        <input type="text" placeholder="${lang("new item", "Neuer Eintrag")}" class="itemInput" id="newChecklistItem">
                        <button type="submit" class="invisible" onclick="saveSubtask(event)">Ö</button>
                    </form>
                </td>
                <td></td>
                <td></td>
                <td>
                    <img src="assets/save.webp" style="width: 30px;" id="btnSaveNewChecklistItem" alt="save" title="${lang("save", "speichern")}" onclick="saveSubtask(event)">
                </td>
            </tr>
        `);
        // document.querySelector("#newChecklistItem").focus();
        if (activeSubtasks.length > 1) {
            document.querySelector("#btnSwapSubtaskOrder").style.display = "inline-block";
        }
        if (currentTicket.subtasks.some(e => e.state.at(-1)[2] === -1)) {
            document.querySelector("#btnShowCompletedSubtasks").style.display = "inline-block";
        }
        mdDivDisplaySubtasks.insertAdjacentHTML("afterbegin", `<hr id="mdHr2">`);
        document.querySelector("#mdHr2").style.borderBottom = `6px solid hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness})`;
        document.querySelector("#mdBtnAddEntry").style.display = "none";
    }

    if (currentTicket.type.at(-1)[2] === "note") {
        document.querySelector("#mdBtnAddEntry").style.display = "none";
        document.querySelector("#mdTdDueDateCaption").textContent = "";
        document.querySelector("#mdTdDueDate").innerHTML = "";
        document.querySelector("#mdTdPrioCaption").textContent = "";
        document.querySelector("#mdTdPrio").innerHTML = "";
    }
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
};

const showCompletedSubtasks = () => {
    const mdDivDisplayCompletedSubtasks = document.querySelector(".mdDivDisplayCompletedSubtasks");
    mdDivDisplayCompletedSubtasks.style.display = "block";
    document.querySelector("#mdBtnAddEntry").style.display = "none";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector("#btnShowCompletedSubtasks").style.display = "none";
    document.querySelector("#btnHideCompletedSubtasks").style.display = "inline-block";
    // mdDivDisplayCompletedSubtasks.scrollIntoView();
    const elementRect = mdDivDisplayCompletedSubtasks.getBoundingClientRect();
    const offsetPosition = elementRect.top + window.scrollY - 120;
    window.scrollTo({
        top: offsetPosition
    });
}

const hideCompletedSubtasks = () => {
    const mdDivDisplayCompletedSubtasks = document.querySelector(".mdDivDisplayCompletedSubtasks");
    mdDivDisplayCompletedSubtasks.style.display = "none";
    if (currentTicket.type.at(-1)[2] === "task") {
        document.querySelector("#mdBtnAddEntry").style.display = "block";
        document.querySelector("#mdBtnAddEntry2").style.display = "block";
    }
    document.querySelector("#btnShowCompletedSubtasks").style.display = "inline-block";
    document.querySelector("#btnHideCompletedSubtasks").style.display = "none";
    /* setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150); */
}

const displayNewTicket = () => {
    console.log("=> fn displayNewTicket triggered");
    displayModalTicket();
    let hue = (Math.random() * 12).toFixed(0) * 30;
    const modalTicket = document.querySelector(".modalTicket");
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    document.querySelector("#mdTicketHeading").innerHTML = lang("New task", "Neue Aufgabe");
    // document.querySelector("#mdInpColor").value = hue;
    document.querySelector("#mdDivDisplay").style.display = "none";
    document.querySelector("#mdDivEdit").style.display = "block";
    document.querySelector("#mdBtnSaveTicket").style.display = "block";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector("#mdBtnDismiss2").style.display = "block";
    document.querySelector("#mdDate").innerHTML = `${dateToString(Date.now())}`;
    document.querySelector("#mdSelPrio").innerHTML = "";
    const mdInpColor = document.querySelector("#mdInpColor");
    mdInpColor.value = hue;
    mdInpColor.addEventListener("input", () => {
        hue = mdInpColor.value;
        modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
        modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    });
    priority.forEach((e) => {
        document.querySelector("#mdSelPrio").insertAdjacentHTML("beforeend",`
            <option value=${e[0]}>${e[config.language + 1]}</option>`
        );
    });
    currentTicketType = "task";
    document.querySelector("#mdInpTitle").focus();
}

const moveChecklistItemUp = async (id) => {
    let arr = currentTicket.subtasks;
    for(let i = 0; i < arr.length; i++) {
        if (!arr[i].position) arr[i].position = i + 1;
    }
    let index = arr.findIndex(e => e.subId === id);
    arr[index].position += 1;
    arr[index + 1].position -= 1;
    arr.sort((a, b) => a.position - b.position);
    await updateTicket();
    displayTicket(currentTicket.id);
}

const moveChecklistItemDown = async (id) => {
    let arr = currentTicket.subtasks;
    for(let i = 0; i < arr.length; i++) {
        if (!arr[i].position) arr[i].position = i + 1;
    }
    let index = arr.findIndex(e => e.subId === id);
    arr[index].position -= 1;
    arr[index - 1].position += 1;
    arr.sort((a, b) => a.position - b.position);
    await updateTicket();
    displayTicket(currentTicket.id);
}

const addNewChecklistItem = () => {
    console.log("=> fn addNewChecklistItem triggered");
    document.querySelector("#mdBtnDismiss").style.display = "block";
    document.querySelector("#mdBtnEdit").style.display = "none";
    document.querySelector("#mdBtnDone").style.display = "none";
    // document.querySelector("#mdBtnAddNewChecklistItem").style.display = "none";
    document.querySelectorAll(".checklistItemIcon").forEach(e => e.style.display = "none");
    document.querySelector(".mdTableChecklistItems").insertAdjacentHTML("afterbegin", `
        <tr>
            <td>
                <input type="text" placeholder="${lang("new item", "Neuer Eintrag")}" class="itemInput" id="newChecklistItem">
            </td>
            <td>
                <img src="assets/save.webp" style="width: 30px;" id="btnSaveNewChecklistItem" alt="save" title="${lang("save", "speichern")}" onclick="saveSubtask(event)">
            </td>
            <td></td>
            <td></td>
        </tr>
    `);
    document.querySelector("#newChecklistItem").focus();
}

const displayNewChecklist = () => {
    console.log("=> fn displayNewChecklist triggered");
    displayModalTicket();
    currentTicket = {};
    let hue = (Math.random() * 12).toFixed(0) * 30;
    const modalTicket = document.querySelector(".modalTicket");
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    document.querySelector("#mdTicketHeading").innerHTML = lang("New checklist", "Neue Checkliste");
    const mdInpColor = document.querySelector("#mdInpColor");
    mdInpColor.value = hue;
    mdInpColor.addEventListener("input", () => {
        hue = mdInpColor.value;
        modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
        modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    });
    document.querySelector("#mdDivDisplay").style.display = "none";
    document.querySelector("#mdDivEdit").style.display = "block";
    document.querySelector("#mdPDescription2").style.display = "none";
    // const mdBtnAddNewChecklistItem = document.querySelector("#mdBtnAddNewChecklistItem");
    // mdBtnAddNewChecklistItem.style.display = "none";
    document.querySelector("#mdBtnSaveTicket").style.display = "block";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector("#mdBtnDismiss2").style.display = "block";
    document.querySelector("#mdDate").innerHTML = `${dateToString(Date.now())}`;
    document.querySelector("#mdSelPrio").innerHTML = "";
    priority.forEach((e) => {
        document.querySelector("#mdSelPrio").insertAdjacentHTML("beforeend",`
            <option value=${e[0]}>${e[config.language + 1]}</option>`
        );
    });
    document.querySelector("#mdInpTitle").focus();
    currentTicketType = "checklist";
};

const displayNewNote = () => {
    console.log("=> fn displayNewNote triggered");
    displayModalTicket();
    currentTicket = {};
    let hue = (Math.random() * 12).toFixed(0) * 30;
    const modalTicket = document.querySelector(".modalTicket");
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    document.querySelector("#mdTicketHeading").innerHTML = lang("New note", "Neue Notiz");
    const mdInpColor = document.querySelector("#mdInpColor");
    mdInpColor.value = hue;
    mdInpColor.addEventListener("input", () => {
        hue = mdInpColor.value;
        modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
        modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    });
    document.querySelector("#mdDivDisplay").style.display = "none";
    document.querySelector("#mdDivEdit").style.display = "block";
    // document.querySelector("#mdPDescription2").style.display = "none";
    document.querySelector("#mdBtnSaveTicket").style.display = "block";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector("#mdBtnDismiss2").style.display = "block";
    document.querySelector("#mdDate").innerHTML = `${dateToString(Date.now())}`;
    document.querySelector("#mdTrDueDate").style.display = "none";
    document.querySelector("#mdTrPrio").style.display = "none";
    // document.querySelector("#mdSelPrio").innerHTML = "";
    document.querySelector("#mdInpTitle").focus();
    currentTicketType = "note";
};

const displayNewSubtask = () => {
    console.log("=> fn displayNewSubtask triggered");
    const entry = document.querySelector(".entry");
    entry.style.display = "block";
    document.querySelector("#frmEntry").reset();
    document.querySelector("#mdBtnAddEntry").style.display = "none";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector("#mdBtnDismiss").style.display = "none";
    const mdBtnSaveEntry = document.querySelector("#mdBtnSaveEntry");
    document.querySelector("#mdSubtaskDate").innerHTML = "<hr>" + dateToString(Date.now());
    // mdSubtaskEditor.innerHTML = currentUser.firstName.at(-1)[2];
    entry.insertAdjacentHTML("beforeend", `
        <div class="newSubtaskButtons">
            <div></div>
            <figure id="mdBtnDismiss" class="mdBtn" onclick="closeModalTicket()">
                <img src="assets/cancel.webp" title="dismiss changes">
                <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
            </figure>
            <figure id="mdBtnSaveEntry" class="mdBtn" onclick="saveSubtask(event)">
                <img src="assets/save.webp" title="save entry">
                <figcaption>${lang("save<br>subtask", "Unteraufgabe<br>speichern")}</figcaption>
            </figure>
        </div>
    `);
    document.querySelector("#mdTaNote").focus();
    mdBtnSaveEntry.scrollIntoView();
};

const displayRestorableTickets = () => {
    let restorable = tickets.findIndex((e) => e.prio.at(-1)[2] === -1);
    if (restorable === -1) {
        showAlert("No tickets to restore");
        return;
    }
    hideAllModals();
    const btnStartBubbles = document.querySelector("#btnStartBubbles");
    const btnStartTable = document.querySelector("#btnStartTable");
    if (config.listType === "bubbles") {
        btnStartBubbles.style.display = "block";
        btnStartTable.style.display = "none";
    }
    if (config.listType === "table") {
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "block";
    }
    main.innerHTML = `
            <h2 class="align-center">${lang("Restore elements", "Elemente wiederherstellen")}</h2>
            <hr class="hrHighLight"/>
            <div class="divRestore"></div>
    `;
    const divRestore = document.querySelector(".divRestore");
    divRestore.innerHTML = "";
    tickets.sort((a, b) => a.date.at(-1)[2] - b.date.at(-1)[2]);
    tickets.forEach(e => {
        if (e.prio.at(-1)[2] === -1) {
            divRestore.insertAdjacentHTML("beforeend", `
                <div class="restorable-ticket" style="border-top: solid 12px hsl(${e.bubbleHue.at(-1)[2]}, 13%, 50%); border-bottom: solid 12px hsl(${e.bubbleHue.at(-1)[2]}, 13%, 50%);">
                    <figure>
                        <img src="assets/restore.webp" alt="restore task" onclick="restoreTicket('${e.id}')" />
                        <figcaption>restore</figcaption>
                    </figure>
                    <p class="small">created: <br>${dateAndTimeToString(e.date.at(-1)[2])}</p>
                    <p class="small">completed: <br>${dateAndTimeToString(e.prio.at(-1)[0])}</p>
                    <h4 style="color: hsl(${e.bubbleHue.at(-1)[2]}, 13%, 50%)">${e.title.at(-1)[2]}</h4>
                    <p>${e.description.at(-1)[2]}</p>
                </div>
                `);
        }
    });
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
}

const renderTickets = (ticketsArray) => {
    console.log("=> fn renderTickets triggered");
    let visibleTickets = [];
    let listArray = !ticketsArray ? tickets : ticketsArray;
    listArray.forEach((e) => {
        if (e.prio.at(-1)[2] >= 0) visibleTickets.push(e);
    });
    const btnSearch = document.querySelector("#btnSearch");
    console.log("visibleTickets.length: " + visibleTickets.length);
    // rank(listArray);
    renderHeader();
    if (visibleTickets.length === 0) {
        hideAllModals();
        showHome();
        btnSearch.style.display = "none";
        document.querySelector("#btnStartBubbles").style.display = "none";
        document.querySelector("#btnStartTable").style.display = "none";
    } else {
        document.querySelector("#btnSearch").style.display = "block";
        document.querySelector("#btnResetSearch").style.display = "none";
        rank(listArray);
        // showHome();
        if (config.listType === "bubbles") {
            renderBubbles(listArray);
        } else if (config.listType === "table") {
            renderTable(listArray);
        }
    }
};

const updateTicket = async () => {
    console.log("=> fn updateTicket triggered");
    console.time("updateTicket");
    startLoader();
    let data = {
        userId: currentUser.id,
        ticketId: currentTicket.id,
        ticket: currentTicket
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch("/openTicket.updateTicket", options);
        const serverResponse = await response.json();
        let status = serverResponse.status;
        if (status != "OK") {
            showAlert(lang(`Error!<br>${status}<br>Please try again`, `Fehler!<br>${status}<br>Bitte erneut versuchen`));
            return;
        }
        console.log("=> status updateTicket:");
        console.log({ status });
        tickets = serverResponse.tickets;
        // sortedTickets = tickets.filter((element) => element);
        renderTickets();
        // displayTicket(currentTicket.id);
    } catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;        
    } finally {
        stopLoader();
        console.timeEnd("updateTicket");
    }
}

const saveNewTicket = async () => {
    console.log("=> fn saveNewTicket triggered");
    console.time("saveNewTicket");
    const modalTicket = document.querySelector(".modalTicket");
    const mdInpTitle = document.querySelector("#mdInpTitle");
    const mdInpDueDate = document.querySelector("#mdInpDueDate");
    const mdInpColor = document.querySelector("#mdInpColor");
    const mdTaDescription = document.querySelector("#mdTaDescription");
    const mdSelPrio = document.querySelector("#mdSelPrio");
    const mdTaNote = document.querySelector("#mdTaNote");
    if (mdInpTitle.value === "") {
        showAlert(lang("Please enter a title", "Bitte gib einen Titel an"));
        return;
    }
    if (
        mdInpDueDate.value < dateToHtmlString(Date.now()) &&
        mdInpDueDate.value != ""
    ) {
        showAlert(lang("Due date is in the past", "Das Fälligkeitsdatum liegt in der Vergangenheit"));
        return;
    }
    startLoader();

    let newTicket = {
        id: `ticket_${Date.now()}_${randomCyphers(10)}`,
        bubbleHue: [[Date.now(), currentUser.id, Number(mdInpColor.value)]],
        date: [[Date.now(), currentUser.id, Date.now()]],
        type: [[Date.now(), currentUser.id, currentTicketType]],
        title: [[Date.now(), currentUser.id, mdInpTitle.value]],
        description: [[Date.now(), currentUser.id, mdTaDescription.value]],
        dueDate: [[Date.now(), currentUser.id, mdInpDueDate.value]],
        owner: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
        prio: [[Date.now(), currentUser.id, Number(mdSelPrio.value)]],
        subtasks: [],
    };
    if (mdTaNote.value != "" && currentTicketType === "task") {
        newTicket.subtasks.push({
            subId: 0,
            date: [[Date.now(), currentUser.id, Date.now()]],
            editor: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
            state: [[Date.now(), currentUser.id, 0]],
            note: [[Date.now(), currentUser.id, mdTaNote.value]]
        });
    }
    if (currentTicketType === "checklist") {
        const itemInputs = document.querySelectorAll(".itemInput");
        const items = itemInputs.forEach(e => {
            let subId = Number(e.id.replace("subtaskId_", ""));
            newTicket.subtasks.push({
            subId,
            date: [[Date.now(), currentUser.id, Date.now()]],
            editor: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
            state: [[Date.now(), currentUser.id, 0]],
            note: [[Date.now(), currentUser.id, e.value]]
        });
        });
    }

    let data = {
        id: currentUser.id,
        ticket: newTicket
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch("/openTicket.newTicket", options);
        const serverResponse = await response.json();
        let status = serverResponse.status;
        console.log("=> status saveNewTicket:");
        console.log({ status });
        if (serverResponse.status != "OK") {
            showAlert(lang(`Error!<br>${status}<br>Please try again`, `Fehler!<br>${status}<br>Bitte erneut versuchen`));
            return;
        }
        tickets = serverResponse.tickets;
        modalTicket.style.display = "none";
        document.querySelector("#btnResetSearch").style.display = "none";
        document.querySelector("#btnSearch").style.display = "block";
        resetModalTicketInputs();
        if (currentTicketType === "checklist") {
            currentTicket = newTicket;
            displayTicket(newTicket.id);
        } else {
            renderTickets();
            currentTicket = {};
            currentTicketType = "";
        }
        // displayTicket(newTicket.id);
    } catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;        
    } finally {
        stopLoader();
        console.timeEnd("saveNewTicket");
    }
};

const saveSubtask = async (event) => {
    console.log("=> fn saveSubtask triggered");
    event.preventDefault();
    const mdTaNote = document.querySelector("#mdTaNote");
    const newChecklistItem = document.querySelector("#newChecklistItem");
    if (currentTicket.type.at(-1)[2] === "task" && mdTaNote.value === "") {
        showAlert(lang("Please enter a note", "Bitte gib eine Notiz ein"));
        mdTaNote.focus();
        return;
    } else if (currentTicket.type.at(-1)[2] === "checklist" && newChecklistItem.value === "") {
        showAlert(lang("Field is empty", "Das Feld ist leer"));
        document.querySelector("#newChecklistItem").focus();
        return;
    }
    let noteString;
    if (currentTicket.type.at(-1)[2] === "task") {
        noteString = mdTaNote.value;
    } else if (currentTicket.type.at(-1)[2] === "checklist") {
        noteString = newChecklistItem.value;
    }
    let newSubtask = {
        subId: currentTicket.subtasks.length,
        date: [[Date.now(), currentUser.id, Date.now()]],
        editor: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
        // type: [[Date.now(), currentUser.id, Number(mdSelSubtaskType.value)]],
        state: [[Date.now(), currentUser.id, 0]],
        note: [[Date.now(), currentUser.id, noteString]],
    };
    currentTicket.subtasks.push(newSubtask);
    await updateTicket();
    displayTicket(currentTicket.id);
};

const confirmDone = async () => {
    console.log("=> fn confirmDone triggered");
    let newPrio = [Date.now(), currentUser.id, -1];
    currentTicket.prio.push(newPrio);
    hideAllModals();
    resetSortAndFilterButtons();
    await updateTicket();
    currentTicket = {};
}

const editTicket = () => {
    console.log("=> fn editTicket triggered");
    document.querySelector("#mdDivDisplay").style.display = "none";
    document.querySelector(".btnTicketSettings").style.display = "none";
    document.querySelector("#mdBtnAddEntry").style.display = "none";
    document.querySelector("#mdBtnAddEntry2").style.display = "none";
    document.querySelector(".entry").style.display = "none";
    document.querySelector("#mdBtnSaveEntry").style.display = "none";
    document.querySelector("#mdDivEdit").style.display = "block";
    document.querySelectorAll(".mdBtn").forEach((e) => {
        e.style.display = "none";
    });
    const mdSelPrio = document.querySelector("#mdSelPrio");
    mdSelPrio.innerHTML = "";
    priority.forEach((e) => {
        mdSelPrio.insertAdjacentHTML("beforeend",`<option value=${e[0]}>${e[config.language + 1]}</option>`);
    });
    if (currentTicket.type.at(-1)[2] === "note") {
        document.querySelector("#mdTrDueDate").style.display = "none";
        document.querySelector("#mdTrPrio").style.display = "none";
    }
    document.querySelector("#mdBtnDismiss2").style.display = "block";
    document.querySelector("#mdBtnSaveEditedTicket").style.display = "block";
    document.querySelector("#mdInpTitle").value = currentTicket.title.at(-1)[2];
    document.querySelector("#mdInpDueDate").value = currentTicket.dueDate.at(-1)[2];
    document.querySelector("#mdSelPrio").value = currentTicket.prio.at(-1)[2];
    document.querySelector("#mdTaDescription").value = currentTicket.description.at(-1)[2];
    const modalTicket = document.querySelector(".modalTicket");
    const mdInpColor = document.querySelector("#mdInpColor");
    let hue = currentTicket.bubbleHue.at(-1)[2];
    mdInpColor.value = hue;
    mdInpColor.addEventListener("input", () => {
        hue = mdInpColor.value;
        modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
        modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    });
};

const saveEditedTicket = async () => {
    console.log("=> fn saveEditedTicket triggered");
    let numberOfChanges = 0;
    const mdInpTitle = document.querySelector("#mdInpTitle");
    const mdInpDueDate = document.querySelector("#mdInpDueDate");
    const mdSelPrio = document.querySelector("#mdSelPrio");
    const mdInpColor = document.querySelector("#mdInpColor");
    const mdTaDescription = document.querySelector("#mdTaDescription");
    if (mdInpTitle.value != currentTicket.title.at(-1)[2]) {
        currentTicket.title.push([Date.now(), currentUser.id, mdInpTitle.value]);
        numberOfChanges += 1;
    }
    if (mdInpDueDate.value != currentTicket.dueDate.at(-1)[2]) {
        if (
            mdInpDueDate.value < dateToHtmlString(Date.now()) &&
            mdInpDueDate.value != ""
        ) {
            showAlert(lang("Due date is in the past", "Das Fälligkeitsdatum liegt in der Vergangenheit"));
            return;
        }
        currentTicket.dueDate.push([Date.now(), currentUser.id, mdInpDueDate.value]);
        numberOfChanges += 1;
    }
    if (Number(mdSelPrio.value) === -1) {
        document.querySelector(".modalConfirmDone").style.display = "block";
        return;
    }
    if (Number(mdSelPrio.value) != currentTicket.prio.at(-1)[2]) {
        currentTicket.prio.push([Date.now(), currentUser.id, Number(mdSelPrio.value)]);
        numberOfChanges += 1;
    }
    if (Number(mdInpColor.value) != currentTicket.bubbleHue.at(-1)[2]) {
        currentTicket.bubbleHue.push([Date.now(), currentUser.id, Number(mdInpColor.value)]);
        numberOfChanges += 1;
    }
    if (mdTaDescription.value != currentTicket.description.at(-1)[2]) {
        currentTicket.description.push([Date.now(), currentUser.id, mdTaDescription.value]);
        numberOfChanges += 1;
    }
    if (numberOfChanges === 0) {
        showAlert("No changes made!");
        return;
    }
    resetModalTicketInputs();
    resetSortAndFilterButtons();
    hideAllModals();
    document.querySelector("#btnResetSearch").style.display = "none";
    document.querySelector("#btnSearch").style.display = "block";
    await updateTicket();
    currentTicket = {};
};

const saveEditedSubtask = async () => {
    console.log("=> fn saveEditedSubtask triggered");
    const mdTaEditSubtaskNote = document.querySelector("#mdTaEditSubtaskNote");
    let index = currentTicket.subtasks.findIndex((e) => e.subId === currentSubId);
    if (
        mdTaEditSubtaskNote.value === currentTicket.subtasks[index].note.at(-1)[2]
    ) {
        showAlert(lang("No changes made!", "Keine Änderungen!"));
        return;
    }
    let subtaskNote = [Date.now(), currentUser.id, mdTaEditSubtaskNote.value];
    currentTicket.subtasks[index].note.push(subtaskNote);
    await updateTicket();
    popUp.style.display = "none";
    document.querySelector("#frmEditSubtask").reset();
    displayTicket(currentTicket.id);
};

const restoreSubtask = async (subId) => {
    console.log("=> fn restoreSubtask triggered");
    let index = currentTicket.subtasks.findIndex((e) => e.subId === subId);
    let subtaskState = [Date.now(), currentUser.id, 0];
    currentTicket.subtasks[index].state.push(subtaskState);
    await updateTicket();
    // popUp.style.display = "none";
    // document.querySelector("#mdBtnAddEntry").style.display = "block";
    displayTicket(currentTicket.id);
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
};

const markDoneSubtask = async (subId) => {
    console.log("=> fn markDoneSubtask triggered");
    let index = currentTicket.subtasks.findIndex((e) => e.subId === subId);
    let subtaskState = [Date.now(), currentUser.id, -1];
    currentTicket.subtasks[index].state.push(subtaskState);
    await updateTicket();
    // showAlert(lang("subtask marked as completed", "Unteraufgabe als erledigt markiert"));
    displayTicket(currentTicket.id);
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
}

const restoreTicket = async (id) => {
    console.log("=> fn restoreTicket triggered");
    let index = tickets.findIndex(e => e.id === id);
    currentTicket = tickets[index];
    if (currentTicket.prio.length >= 2) {
        currentTicket.prio.push(currentTicket.prio.at(-2));
    } else {
        currentTicket.prio.push([Date.now(), currentUser.id, 0]);
    }
    await updateTicket();
    currentTicket = {};
}

const dismissDone = () => {
    console.log("=> fn dismissDone triggered");
    document.querySelector(".modalConfirmDone").style.display = "none";
    // modalSubtaskConfirmDone.style.display = "none";
    document.querySelector(".modalWarningDeleteAccount").style.display = "none";
    document.querySelector(".modalConfirmDeleteOldTickets").style.display = "none";
}

const displayConfirmDeleteOldTickets = () => {
	let restorable = tickets.findIndex((e) => e.prio.at(-1)[2] === -1);
    if (restorable === -1) {
        showAlert(lang("No tasks to delete", "Es gibt keine zu löschenden Aufgaben"));
        return;
	}
    popUp.innerHTML = `
        <h3>${lang("Delete old tasks", "Erledigte Aufgaben löschen")}</h3>
        <hr class="hrHighLight">
        <p>${lang("Deleting old tasks will free up disk space and make the app faster, especially if you have many completed tasks.", "Wenn du erledigte Aufgaben löschst, gibst du Speicherplatz frei und die App wird schneller, insbesondere wenn du viele erledigte Aufgaben hast.")}</p>
        <p>${lang("Note that your completed tasks will be permanently removed without the ability to restore them.", "Beachte jedoch, dass die Aufgaben dauerhaft gelöscht werden und nicht wiederergestellt werdn können.")}</p>
        <hr class="hrHighLight">
        <figure onclick="closePopUp()">
            <img src="assets/cancel.webp" title="dismiss">
            <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
        </figure>
        <figure onclick="deleteOldTickets()">
            <img src="assets/broom.webp" title="delete old tasks">
            <figcaption>${lang("delete", "löschen")}</figcaption>
        </figure>
    `;
	popUp.style.display = "block";
}

const deleteOldTickets = async () => {
    console.log("=> fn deleteOldTickets triggered");
    console.time("deleteOldTickets");
    startLoader();
    let data = {
        userId: currentUser.id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch("/openTicket.deleteOldTickets", options);
        const serverResponse = await response.json();
        let status = serverResponse.status;
        console.log("=> status deleteOldTickets:");
        console.log({ status });
        if (status != "OK") {
            showAlert(lang(`Error!<br>${status}<br>Please try again`, `Fehler!<br>${status}<br>Bitte erneut versuchen`));
            return;
        }
        showAlert("Old tasks have been sucessfully deleted")
        tickets = serverResponse.tickets;
        hideAllModals();
        renderTickets();        
    } catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;        
    } finally {
        stopLoader();
        console.timeEnd("deleteOldTickets");
    }
}
