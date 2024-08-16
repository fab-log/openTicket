tickets = [];

async function getTickets() {
    const response = await fetch("/api.tickets");
    tickets = await response.json();
    // console.log(JSON.stringify(tickets, null, 2));
    sortedTickets = tickets.filter((element) => element);
    renderTickets();
}

const priority = [
    [0, "none"],
    [-1, "done"],
    [1, "pending"],
    [2, "urgent"],
    [3, "critical"],
];
const priorityIndexes = [];
priority.forEach((e) => {
    priorityIndexes.push(e[0]);
});
const priorityValues = [];
priority.forEach((e) => {
    priorityValues.push(e[1]);
});

const subtasksType = [
    [0, "not defined"],
    [1, "face to face"],
    [2, "phone call"],
    [3, "e-mail"],
    [4, "text message"],
    [5, "information"],
    [6, "other"],
];
const subtasksTypeIndexes = [];
subtasksType.forEach((e) => {
    subtasksTypeIndexes.push(e[0]);
});
const subtasksTypeValues = [];
subtasksType.forEach((e) => {
    subtasksTypeValues.push(e[1]);
});

const subtasksState = [
    [0, "not defined"],
    [-1, "done"],
    [1, "waiting for response"],
    [2, "to be done"],
    [3, "other"],
];
const subtasksStateIndexes = [];
subtasksState.forEach((e) => {
    subtasksStateIndexes.push(e[0]);
});
const subtasksStateValues = [];
subtasksState.forEach((e) => {
    subtasksStateValues.push(e[1]);
});

const currentUser = "fabian";

currentTicketId = -1;
currentSubId = -1;
listType = "table";

const modalTicketBorderWidth = "18px";

const showAlert = (text) => {
    document.querySelector("#alert").style.display = "block";
    document.querySelector("#alert").innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
        document.querySelector("#alert").innerHTML = "";
        document.querySelector("#alert").style.display = "none";
    }, 3000);
};

let imgInvert = 1;

btnLightMode.onclick = () => {
    document.body.classList.add("light-mode");
    document.querySelectorAll("img").forEach((e) => {
        e.classList.remove("imgInvert");
    });
    // imgInvert = 0;
    modalSettings.style.display = "none";
};

btnDarkMode.onclick = () => {
    document.body.classList.remove("light-mode");
    document.querySelectorAll("img").forEach((e) => {
        e.classList.add("imgInvert");
    });
    logo.classList.remove("imgInvert");
    logoStacked.classList.remove("imgInvert");
    // imgInvert = 1;
    modalSettings.style.display = "none";
};

const dateToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return "";
    } else {
        let year = new Date(jsTimestamp).getFullYear();
        let month = new Date(jsTimestamp).getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = new Date(jsTimestamp).getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    }
};

const dateAndTimeToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return "";
    } else {
        let year = new Date(jsTimestamp).getFullYear();
        let month = new Date(jsTimestamp).getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = new Date(jsTimestamp).getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hour = new Date(jsTimestamp).getHours();
        if (hour < 10) {
            hour = `0${hour}`;
        }
        let minute = new Date(jsTimestamp).getMinutes();
        if (minute < 10) {
            minute = `0${minute}`;
        }
        return `${year}-${month}-${day} | ${hour}:${minute}`;
    }
};

const rank = (listArray) => {
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
            e.prio.at(-1)[2] > 1 &&
            e.dueDate.at(-1)[2] <= dateToString(Date.now()) &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 5;
        } else if (e.prio.at(-1)[2] > 2) {
            e.ranking = 4;
        } else if (e.prio.at(-1)[2] > 1) {
            e.ranking = 3;
        } else if (
            e.dueDate.at(-1)[2] <= dateToString(Date.now()) &&
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

const renderBubbles = (listArray) => {
    modals.forEach((e) => {
        e.style.display = "none";
    });
    modalBubbles.style.display = "block";
    const offsetWidth = modalBubbles.offsetWidth;

    rank(listArray);

    modalBubbles.innerHTML = "";
    for (i = 0; i < listArray.length; i++) {
        let ticketId = listArray[i].id;
        if (listArray[i].prio.at(-1)[2] != -1) {
            let factor = 1;
            if (offsetWidth >= 1502) {
                factor = 3;
            } else if (offsetWidth >= 876) {
                factor = 2;
            } else if (offsetWidth < 876) {
                factor = 1;
            }
            let marginLeft = Math.floor(
                Math.random() * (offsetWidth / factor - 360)
            );
            let marginTop = Math.floor(Math.random() * 50);

            let title = listArray[i].title.at(-1)[2];
            if (title.length > 20) {
                title = title.substring(0, 30) + " ...";
            }
            let description = listArray[i].description.at(-1)[2];
            if (description.length > 30) {
                description = description.substring(0, 25) + " ...";
            }

            let warningPrio = "";
            let randomTime = Math.random() * 4 + 6;
            if (listArray[i].prio.at(-1)[2] > 1) {
                warningPrio = `<span class="iconMini"><img src="pix/warning.webp" title="high priority" style="animation: flash ${randomTime}s ease-in infinite;"></span>`;
            }

            let warningDue = "";
            if (
                listArray[i].dueDate.at(-1)[2] <= dateToString(Date.now()) &&
                listArray[i].dueDate.at(-1)[2] != ""
            ) {
                warningDue = `<img src="pix/alarmClock.webp" title="due"  style="animation: flash ${randomTime}s ease-out infinite;">`;
            }
            let infoString = `<p class="small">due ${listArray[i].dueDate.at(-1)[2]
                }<br>
            <span class="iconMini">${warningDue} </span> ${warningPrio}</p>`;
            if (listArray[i].dueDate.at(-1)[2] === "") {
                infoString = `${warningPrio}`;
            }

            modalBubbles.insertAdjacentHTML(
                "beforeend",
                `
            <div class="grid-element">
                <div class="bubble" id="bubble_${ticketId}" style="margin-top: ${marginTop}px; margin-left: ${marginLeft}px; border: 6px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%); border-left: 24px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%); border-right: 24px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%);">
                    <p class="small">${listArray[i].owner.at(-1)[2]}</p>
                    <p class="small">${dateAndTimeToString(listArray[i].date.at(-1)[2])}</p>
                    <h3 style="color: hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%);">${title}</h3>
                    <p>${description}</p>
                    ${infoString}
                </div>
            </div>
            `
            );
            let currentBubble = document.querySelector(
                `#bubble_${listArray[i].id}`
            );
            currentBubble.addEventListener("click", () => {
                displayTicket(ticketId);
            });
        }
    }

    let modalBubblesImg = document.querySelectorAll(".modalBubbles img");
    if (document.body.classList.contains("light-mode")) {
        modalBubblesImg.forEach((e) => {
            e.classList.remove("imgInvert");
        });
    } else {
        modalBubblesImg.forEach((e) => {
            e.classList.add("imgInvert");
        });
    }

    window.scroll(0, 0);
};

const insertTableString = (element) => {
    let title = element.title.at(-1)[2];
    /* if (title.length > 20) {
        title = title.substring(0, 18) + "...";
    } */
    let description = element.description.at(-1)[2];
    let tdWarnPrioString = "";
    let tdWarnDueString = "";
    if (element.prio.at(-1)[2] > 1) {
        tdWarnPrioString = `<img src="pix/warning.webp" title="high priority">`;
    }
    if (
        element.dueDate.at(-1)[2] < dateToString(Date.now()) &&
        element.dueDate.at(-1)[2] != ""
    ) {
        tdWarnDueString = `<img src="pix/alarmClock.webp" title="due">`;
    }
    ticketList.insertAdjacentHTML(
        "beforeend",
        `
    <tr class="listItem" id="${element.id}">
    <td>${dateToString(element.date.at(-1)[2])}</td>
    <td style="border-left: 6px solid hsl(${element.bubbleHue.at(-1)[2]}, 20%, 50%" title="${element.title.at(-1)[2]}">${title}<div class="tdWarnPrio">${tdWarnPrioString}</div><div class="tdWarnDue">${tdWarnDueString}</div></td>
    <td title="${element.description.at(-1)[2]}">${description}</td><td>${element.dueDate.at(-1)[2]}</td>
    <td>${element.owner.at(-1)[2]}</td>
    <td>${priorityValues[priorityIndexes.indexOf(element.prio.at(-1)[2])]}</td>
    </tr>
    `
    );
    document.querySelector(`#${element.id}`).addEventListener("click", () => {
        displayTicket(element.id);
    });
};

const renderList = (listArray) => {
    for (i = ticketList.rows.length - 1; i > 0; i--) {
        ticketList.rows[i].remove();
        ticketList.tBodies[i].remove();
    }

    listArray.forEach((element) => {
        if (element.prio.at(-1)[2] != -1) {
            insertTableString(element);
        }
    });
    if (document.body.classList.contains("light-mode") === false) {
        document.querySelectorAll(".list img").forEach((e) => {
            e.classList.add("imgInvert");
        });
    }
    window.scroll(0, 0);
};

const displayTicketList = () => {
    listType = "table";
    modals.forEach((element) => {
        element.style.display = "none";
    });
    list.style.display = "block";
    btnStartBubbles.style.display = "block";
    btnStartTable.style.display = "none";
    window.scroll(0, 0);
};

const displayBubbleList = () => {
    listType = "bubbles";
    modals.forEach((element) => {
        element.style.display = "none";
    });
    modalBubbles.style.display = "grid";
    btnStartBubbles.style.display = "none";
    btnStartTable.style.display = "block";
    window.scroll(0, 0);
};

const editSubtask = (ticketId, subId) => {
    console.log({ ticketId });
    console.log({ subId });
    currentSubId = subId;
    ticketId = getIndex(ticketId);
    modalEditSubticket.style.display = "block";
    modalEditSubticket.style.border = `6px solid hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 25%, 50%)`;
    mdBtnSaveEditedSubtask.style.display = "block";
    mdBtnDismissEditedSubtask.style.display = "block";

    mdEditSubtaskDate.innerHTML = dateAndTimeToString(
        tickets[ticketId].subtasks[subId].date.at(-1)[2]
    );
    mdEditSubtaskEditor.innerHTML = tickets[ticketId].subtasks[subId].editor.at(-1)[2];
    mdSelEditSubtaskType.innerHTML = "";
    subtasksType.forEach((e) => {
        mdSelEditSubtaskType.insertAdjacentHTML(
            "beforeend",
            `
        <option value=${e[0]}>${e[1]}</option>
        `
        );
    });
    mdSelEditSubtaskType.value =
        tickets[ticketId].subtasks[subId].type.at(-1)[2];
    mdSelEditSubtaskState.innerHTML = "";
    subtasksState.forEach((e) => {
        mdSelEditSubtaskState.insertAdjacentHTML(
            "beforeend",
            `
        <option value=${e[0]}>${e[1]}</option>
        `
        );
    });
    mdSelEditSubtaskState.value =
        tickets[ticketId].subtasks[subId].state.at(-1)[2];
    mdTaEditSubtaskNote.value =
        tickets[ticketId].subtasks[subId].note.at(-1)[2];
};

const dismissEditSubtask = () => {
    modalEditSubticket.style.display = "none";
    frmEditSubtask.reset();
};

const displayModalTicket = () => {
    if (listType === "bubbles") {
        btnStartBubbles.style.display = "block";
        btnStartTable.style.display = "none";
    }
    if (listType === "table") {
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "block";
    }
    modals.forEach((element) => {
        element.style.display = "none";
    });
    modalTicket.style.display = "block";
    frmTicket.reset();
    mdBtn.forEach((e) => {
        e.style.display = "none";
    });
    entry.style.display = "none";
    window.scroll(0, 0);
};

const getIndex = (ticketId) => {
    return tickets.findIndex((e) => e.id === ticketId);
};

const displayTicket = (ticketId) => {
    currentTicketId = ticketId;
    ticketId = getIndex(ticketId);
    displayModalTicket();
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 25%, 50%)`;
    mdDivDisplay.style.display = "block";
    mdDivEdit.style.display = "none";
    entry.style.display = "none";
    mdBtnEdit.style.display = "block";
    mdBtnAddEntry.style.display = "block";
    mdBtnDone.style.display = "block";
    mdDate.innerHTML = dateAndTimeToString(tickets[ticketId].date.at(-1)[2]);
    mdOwner.innerHTML = tickets[ticketId].owner.at(-1)[2];
    mdTitle.innerHTML = tickets[ticketId].title.at(-1)[2];
    mdTitle.style.color = `hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdTdDueDate.innerHTML = tickets[ticketId].dueDate.at(-1)[2];
    mdTdDueDate.style.color = `hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdTdPrio.innerHTML =
        priorityValues[
        priorityIndexes.indexOf(tickets[ticketId].prio.at(-1)[2])
        ]; // tickets[ticketId].prio.at(-1)[2];
    mdTdPrio.style.color = `hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdSpanDescription.innerHTML = tickets[ticketId].description.at(-1)[2];
    mdSpanDescription.style.color = `hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdHr.style.borderBottom = `6px solid hsl(${tickets[ticketId].bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdDivDisplaySubtasks.innerHTML = "";
    if (tickets[ticketId].subtasks.length > 0) {
        tickets[ticketId].subtasks.forEach((e) => {
            mdDivDisplaySubtasks.insertAdjacentHTML(
                "beforeend",
                `
            <p class="dimmedFont small">${dateAndTimeToString(e.date.at(-1)[2])} | ${e.editor.at(-1)[2]}</p>
            <figure class="mdBtn" onclick="editSubtask('${tickets[ticketId].id}', ${e.subId})">
                <img src="pix/pencil.webp" alt="edit" title="edit entry" id="${tickets[ticketId].id}_${e.subId}" style="width: 36px;">
                <figcaption>edit</figcaption>
            </figure>
            <p style="color: hsl(${tickets[ticketId].bubbleHue.at(-1)[2]}, 20%, 50%)"><span class="dimmedFont">note</span><br><b>${e.note.at(-1)[2]}</b></p>
            <table class="small">
                <tr>
                    <td class="dimmedFont">type</td>
                    <td style="color: hsl(${tickets[ticketId].bubbleHue.at(-1)[2]}, 20%, 50%)">${subtasksTypeValues[subtasksTypeIndexes.indexOf(e.type.at(-1)[2])]}</td>
                </tr>
                <tr>
                    <td class="dimmedFont">state</td>
                    <td style="color: hsl(${tickets[ticketId].bubbleHue.at(-1)[2]}, 20%, 50%)">${subtasksStateValues[subtasksStateIndexes.indexOf(e.state.at(-1)[2])]}</td>
                </tr>
            </table>
            <hr>
            `
            );
            if (!document.body.classList.contains("light-mode")) {
                document.querySelector(`#${tickets[ticketId].id}_${e.subId}`).classList.add("imgInvert");
            }
        });
    }
};

const displayNewTicket = () => {
    displayModalTicket();
    let hue = (Math.random() * 12).toFixed(0) * 30;
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
    mdInpColor.value = hue;
    mdDivDisplay.style.display = "none";
    mdDivEdit.style.display = "block";
    mdBtnSaveTicket.style.display = "block";
    mdBtnAddEntry.style.display = "block";
    mdBtnDismiss.style.display = "block";
    mdDate.innerHTML = `${dateToString(Date.now())}`;
    mdOwner.innerHTML = currentUser;
    mdSelPrio.innerHTML = "";
    priority.forEach((e) => {
        mdSelPrio.insertAdjacentHTML(
            "beforeend",
            `
        <option value=${e[0]}>${e[1]}</option>
        `
        );
    });
    mdInpTitle.focus();
};

const displayNewSubtask = () => {
    entry.style.display = "block";
    frmEntry.reset();
    mdBtnAddEntry.style.display = "none";
    mdBtnDismiss.style.display = "block";
    if (mdDivEdit.style.display === "block") {
        // new ticket
        mdBtnSaveTicket.style.display = "block";
        mdBtnSaveEntry.style.display = "none";
        mdBtnSaveEditedTicket.style.display = "none";
        /* } else if () {                                                  // edit ticket
            mdBtnSaveTicket.style.display = "none";
            mdBtnSaveEntry.style.display = "none";
            mdBtnSaveEditedTicket.style.display = "block"; */
    } else {
        // existing ticket
        mdBtnSaveTicket.style.display = "none";
        mdBtnSaveEntry.style.display = "block";
        mdBtnSaveEditedTicket.style.display = "none";
    }
    mdSubtaskDate.innerHTML = dateToString(Date.now());
    mdSubtaskEditor.innerHTML = currentUser;
    mdSelSubtaskType.innerHTML = "";
    subtasksType.forEach((e) => {
        mdSelSubtaskType.insertAdjacentHTML(
            "beforeend",
            `
        <option value=${e[0]}>${e[1]}</option>
        `
        );
    });
    mdSelSubtaskState.innerHTML = "";
    subtasksState.forEach((e) => {
        mdSelSubtaskState.insertAdjacentHTML(
            "beforeend",
            `
        <option value=${e[0]}>${e[1]}</option>
        `
        );
    });
    mdBtnSaveEntry.scrollIntoView();
    mdTaNote.focus();
};

const renderTickets = () => {
    let visibleTickets = [];
    sortedTickets.forEach((e) => {
        if (e.prio.at(-1)[2] >= 0) {
            visibleTickets.push(e);
        }
    });
    if (visibleTickets.length === 0) {
        modals.forEach((e) => {
            e.style.display = "none";
        });
        modalWelcome.style.display = "block";
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "none";
    } else {
        rank(sortedTickets);
        renderList(sortedTickets);
        renderBubbles(sortedTickets);
        if (listType === "bubbles") {
            displayBubbleList();
        } else if (listType === "table") {
            displayTicketList();
        }
    }
};

getTickets();

// renderTickets();
