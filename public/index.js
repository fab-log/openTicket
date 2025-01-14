tickets = [];
currentUser = {};
currentTicket = {};
currentSubId = -1;
searchSortingOrFiltersActive = false;
let version = "1.0.1 (beta)";
versionInfo.innerHTML = version;

let config = {
    mode: "dark",
    listType: "bubbles"
};
if (localStorage.getItem("openTicketConfig")) {
    config = JSON.parse(localStorage.getItem("openTicketConfig"));
}

const getTickets = async (userID) => {
    console.log(`=> fn getTickets(${userID}) triggered`);
    startLoader();
    let data = {
        id: userID
    };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch("/api.getTickets", options);
    let serverResponse = await response.json();
    stopLoader();
    if (serverResponse.status != "OK") {
        showAlert(serverResponse.status);
        return;
    } else {
        tickets = serverResponse.tickets;
        console.log({ tickets });
        sortedTickets = tickets.filter((element) => element);
        renderTickets();
    }
}

const priority = [
    [0, "none"],
    [-1, "done"],
    [1, "wait"],
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

/* const subtasksType = [
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
}); */


const modalTicketBorderWidth = "18px";

const showAlert = (text) => {
    document.querySelector("#alert").style.display = "block";
    document.querySelector("#alert").innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
        document.querySelector("#alert").innerHTML = "";
        document.querySelector("#alert").style.display = "none";
    }, 3000);
};

const showWelcomeScreen = () => {
    if (modalWelcome.style.display === "block") {
        modalSettings.style.display = "none";
        return;
    }
    hideAllModals();
    modalWelcome.style.display = "block";
    welcomeName.innerHTML = currentUser.firstName.at(-1)[2];
    if (config.listType === "bubbles") {
        btnStartBubbles.style.display = "block";
        btnStartTable.style.display = "none";
    }
    if (config.listType === "table") {
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "block";
    }
}

const toggleMode = (value) => {
    console.log("=> fn toggleMode triggered");
    if (value === "dark") {
        document.body.classList.remove("light-mode");
        modalSettings.style.display = "none";
    }
    if (value === "light") {
        document.body.classList.add("light-mode");
        modalSettings.style.display = "none";
    }
    config.mode = value;
    localStorage.setItem("openTicketConfig", JSON.stringify(config));
    console.log({ config });
}

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

 const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
// const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s.]*[^\s]$|^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
// const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^.\s]*[^\s]$/i;
// const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^.\s]*[^.\s]$/;
// const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\.([a-z]{1,3})[^.\s]*[^.\s]$/i;
// const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\.([a-z]+)[^\s]*[^.\s]$/i;

const phoneRegex = /^(?:\+?\d{1,3})?\d{5,}$/;
const twoDotsRegex = /\..*\..*/;

const checkForLinks = (string) => {
    string = string.replace(/(?:\r\n|\r|\n)/g, " <br>");
    let wordsArray = string.split(" ");
    let output = "";
    wordsArray.forEach(e => {
        if (emailRegex.test(e) === true) {
            output += `<a href="mailto:${e}">${e}</a> `;
            return;
        }
        if ((twoDotsRegex.test(e) === false && e.includes(".") && isNaN(e) && !e.endsWith(".")) || (e.substring(0, 4) === "http") || (e.substring(0, 4) === "www.")) {
            let link = e;
            if (e.substring(0, 4) != "http") {
                link = "https://" + e;
            }
            output += `<a href="${link}" target="_blank" rel="noopener noreferrer">${e}</a> `;
            return;
        }
        if (phoneRegex.test(e) === true) {
            output += `<a href="tel:${e}">${e}</a> `;
            return;
        }
        output += `${e} `;
    });
    output = output.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>')
    return output;
}

const hideAllModals = () => {
    console.log("=> fn hideAllModals triggered");
    modals.forEach((element) => {
        element.style.display = "none";
    });
}

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
            e.dueDate.at(-1)[2] <= dateToString(Date.now()) &&
            e.dueDate.at(-1)[2] != ""
        ) {
            e.ranking = 8;
        }
        else if (
            e.prio.at(-1)[2] > 1 &&
            e.dueDate.at(-1)[2] <= dateToString(Date.now()) &&
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
    console.log("=> fn renderBubbles triggered");
    hideAllModals();
    modalBubbles.style.display = "block";
    const offsetWidth = modalBubbles.offsetWidth;

    // rank(listArray);

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
                description = description.substring(0, 20) + " ...";
            }

            let warningPrio = "";
            let randomTime = Math.random() * 4 + 6;
            let correctedHue = listArray[i].bubbleHue.at(-1)[2] - 30;
            if (listArray[i].prio.at(-1)[2] > 1) {
                warningPrio = `<span class="iconMini"><img src="pix/warning.webp" title="high priority" style="animation: flash ${randomTime}s ease-in infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);"></span>`;
            }

            let warningDue = "";
            if (
                listArray[i].dueDate.at(-1)[2] <= dateToString(Date.now()) &&
                listArray[i].dueDate.at(-1)[2] != ""
            ) {
                warningDue = `<img src="pix/alarmClock.webp" title="due"  style="animation: flash ${randomTime}s ease-out infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);">`;
            }
            let infoString = "";
            if (listArray[i].dueDate.at(-1)[2] != "") {
                infoString = `<p class="small">due ${listArray[i].dueDate.at(-1)[2]}`
            }

            modalBubbles.insertAdjacentHTML(
                "beforeend",
                `
            <div class="grid-element">
                <div class="bubble" id="bubble_${ticketId}" style="margin-top: ${marginTop}px; margin-left: ${marginLeft}px; border: 6px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%); border-left: 24px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%); border-right: 24px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%);">
                    <span class="iconMini">${warningDue} </span> ${warningPrio}
                    <p class="small">${dateAndTimeToString(listArray[i].date.at(-1)[2])}</p>
                    <h3 style="color: hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, 50%);">${title}</h3>
                    <p>${description}</p>
                    ${infoString}
                </div>
            </div>
            `
            ); // formerly included (after border styling): <p class="small">${listArray[i].owner.at(-1)[2]}</p>
            let currentBubble = document.querySelector(
                `#bubble_${listArray[i].id}`
            );
            currentBubble.addEventListener("click", () => {
                displayTicket(ticketId);
            });
        }
    }

    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
};

const insertTableString = (element) => {
    console.log("=> fn insertTableString triggered");
    let randomTime = Math.random() * 4 + 6;
    let correctedHue = element.bubbleHue.at(-1)[2] - 30;
    let title = element.title.at(-1)[2];
    let description = element.description.at(-1)[2];
    let tdWarnPrioString = "";
    let tdWarnDueString = "";
    if (element.prio.at(-1)[2] > 1) {
        tdWarnPrioString = `<img src="pix/warning.webp" title="high priority" style="animation: flash ${randomTime}s 150ms ease-in infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);">`;
    }
    if (
        element.dueDate.at(-1)[2] <= dateToString(Date.now()) &&
        element.dueDate.at(-1)[2] != ""
    ) {
        tdWarnDueString = `<img src="pix/alarmClock.webp" title="due" style="animation: flash ${randomTime}s ease-in infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);">`;
    }
    ticketList.insertAdjacentHTML(
        "beforeend",
        `
    <tr class="listItem" id="${element.id}">
        <td>${dateToString(element.date.at(-1)[2])}</td>
        <td style="border-left: 9px solid hsl(${element.bubbleHue.at(-1)[2]}, 20%, 50%" title="${element.title.at(-1)[2]}">${title}
            <div class="tdWarnPrio">${tdWarnPrioString}</div>
            <div class="tdWarnDue">${tdWarnDueString}</div>
        </td>
        <td title="${element.description.at(-1)[2]}">${description}</td>
        <td>${element.dueDate.at(-1)[2]}</td>
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
    console.log("=> fn renderList triggered");
    for (i = ticketList.rows.length - 1; i > 0; i--) {
        ticketList.rows[i].remove();
        ticketList.tBodies[i].remove();
    }
    if (searchSortingOrFiltersActive === false) {
        resetSortAndFilterButtons();
    }
    listArray.forEach((element) => {
        if (element.prio.at(-1)[2] != -1) {
            insertTableString(element);
        }
    });
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
};

const showHome = () => {
    console.log("=> fn showHome triggered");
    hideAllModals();
    if (currentUser.id) {
        modalWelcome.style.display = "block";
        header.style.display = "block";
        welcomeName.innerHTML = currentUser.firstName.at(-1)[2];
    } else {
        modalIndex.style.display = "block";
        header.style.display = "none";
        document.body.classList.remove("light-mode");
    }
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150)
}

let safetyCode = "";

const displayCreateAccount = () => {
    console.log("=> fn displayCreateAccount triggered");
    hideAllModals();
    modalCreateAccount.style.display = "block";
    inpCreateAccountFirstName.focus();
    frmCreateAccount.addEventListener("input", () => {
        if (emailRegex.test(inpCreateAccountEmail.value) === true && inpCreateAccountPassword.value.length >= 8 && inpCreateAccountPassword.value === inpCreateAccountConfirmPassword.value) {
            safetyCode = randomNumbers(6);
            h4SafetyCode.innerHTML = safetyCode;
            frmCreateAccount.blur();
            divSafetyCode.style.maxHeight = "500px";
            divSafetyCode.style.visibility = "visible";
            divSafetyCode.style.opacity = "1";
            setTimeout(() => {
                inpSafetyCode1.focus();
                let bottomElement = modalCreateAccount.lastElementChild;
                bottomElement.scrollIntoView();
            }, 1000);
            inpSafetyCode1.addEventListener("input", () => {
                inpSafetyCode1.blur();
                inpSafetyCode2.focus();
            });
            inpSafetyCode2.addEventListener("input", () => {
                inpSafetyCode2.blur();
                inpSafetyCode3.focus();
            });
            inpSafetyCode3.addEventListener("input", () => {
                inpSafetyCode3.blur();
                inpSafetyCode4.focus();
            });
            inpSafetyCode4.addEventListener("input", () => {
                inpSafetyCode4.blur();
                inpSafetyCode5.focus();
            });
            inpSafetyCode5.addEventListener("input", () => {
                inpSafetyCode5.blur();
                inpSafetyCode6.focus();
            });
            inpSafetyCode6.addEventListener("input", () => {
                inpSafetyCode6.blur();
                inpCreateAccountRememberMe.scrollIntoView();
                inpCreateAccountRememberMe.focus();
            });
        }
    })
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
}

const displayLogin = () => {
    console.log("=> fn displayLogin triggered");
    hideAllModals();
    modalLogin.style.display = "block";
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
}

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

const displayBubbleList = () => {
    console.log("=> fn displayBubbleList triggered");
    hideAllModals();
    modalBubbles.style.display = "grid";
    btnStartBubbles.style.display = "none";
    btnStartTable.style.display = "block";
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
    config.listType = "bubbles";
    localStorage.setItem("openTicketConfig", JSON.stringify(config));
    console.log({ config });
};

const editSubtask = (subId) => {
    console.log("=> fn editSubtask triggered");
    currentSubId = subId;
    console.log({ currentSubId });
    let index = currentTicket.subtasks.findIndex((e) => e.subId === currentSubId);
    modalEditSubticket.style.display = "block";
    modalEditSubticket.style.border = `6px solid hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 25%, 50%)`;
    mdBtnSaveEditedSubtask.style.display = "block";
    mdBtnDismissEditedSubtask.style.display = "block";

    mdEditSubtaskDate.innerHTML = dateAndTimeToString(
        currentTicket.subtasks[index].date.at(-1)[2]
    );
    mdEditSubtaskEditor.innerHTML = currentTicket.subtasks[index].editor.at(-1)[2];
    mdTaEditSubtaskNote.value =
        currentTicket.subtasks[index].note.at(-1)[2];
    mdTaEditSubtaskNote.focus();
};

const dismissEditSubtask = () => {
    console.log("=> fn dismissEditTask triggered");
    modalEditSubticket.style.display = "none";
    frmEditSubtask.reset();
};

const displayModalTicket = () => {
    console.log("=> fn displayModalTicket triggered");
    if (config.listType === "bubbles") {
        btnStartBubbles.style.display = "block";
        btnStartTable.style.display = "none";
    }
    if (config.listType === "table") {
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "block";
    }
    hideAllModals();
    modalTicket.style.display = "block";
    frmTicket.reset();
    mdBtn.forEach((e) => {
        e.style.display = "none";
    });
    entry.style.display = "none";
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
};

const getIndex = (ticketId) => {
    console.log("=> fn getIndex triggered");
    return tickets.findIndex((e) => e.id === ticketId);
};

const displayTicket = (ticketId) => {
    console.log("=> fn displayTicket triggered");
    let index = getIndex(ticketId);
    currentTicket = tickets[index];
    console.log({ currentTicket });
    displayModalTicket();
    modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 25%, 50%)`;
    modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 25%, 50%)`;
    mdDivDisplay.style.display = "block";
    mdDivEdit.style.display = "none";
    entry.style.display = "none";
    mdBtnEdit.style.display = "block";
    mdBtnAddEntry.style.display = "block";
    mdBtnDone.style.display = "block";
    btnShowCompletedSubtasks.style.display = "none";
    btnHideCompletedSubtasks.style.display = "none";
    mdDate.innerHTML = dateAndTimeToString(currentTicket.date.at(-1)[2]);
    mdTitle.innerHTML = currentTicket.title.at(-1)[2];
    mdTitle.style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdTdDueDate.innerHTML = currentTicket.dueDate.at(-1)[2];
    mdTdDueDate.style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdTdPrio.innerHTML =
        priorityValues[
        priorityIndexes.indexOf(currentTicket.prio.at(-1)[2])
        ];
    mdTdPrio.style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    if (currentTicket.description.at(-1)[2] === "") {
        mdPDescription.style.display = "none";
    } else {
        mdPDescription.style.display = "block";
        mdSpanDescription.innerHTML = checkForLinks(currentTicket.description.at(-1)[2]);
        mdSpanDescription.style.color = `hsl(${currentTicket.bubbleHue.at(-1)[2]
            }, 20%, 50%)`;
    }
    mdHr.style.borderBottom = `6px solid hsl(${currentTicket.bubbleHue.at(-1)[2]
        }, 20%, 50%)`;
    mdDivDisplaySubtasks.innerHTML = "";
    mdDivDisplayCompletedSubtasks.innerHTML = "";
    if (currentTicket.subtasks.length > 0) {       
        currentTicket.subtasks.sort((a, b) => a.subId - b.subId);
        currentTicket.subtasks.sort((a, b) => b.state.at(-1)[2] - a.state.at(-1)[2]);
        currentTicket.subtasks.forEach((e) => {
            let color = `color: hsl(${currentTicket.bubbleHue.at(-1)[2]}, 20%, 50%)`;
            let textDecoration = "";
            let dateString = `<p class="dimmedFont small">${dateAndTimeToString(e.note.at(-1)[0])}</p>`;

            if (e.state.at(-1)[2] != -1) {
                mdDivDisplaySubtasks.insertAdjacentHTML(
                    "afterbegin",
                    `
                    <figure class="mdBtn" onclick="markDoneSubtask(${e.subId})">
                        <img src="pix/check.webp" alt="edit" class="subtaskMdBtn" title="mark subtask as done" style="width: 36px;">
                        <figcaption>done</figcaption>
                    </figure>
                    <figure class="mdBtn" onclick="editSubtask(${e.subId})">
                        <img src="pix/pencil.webp" alt="edit" class="subtaskMdBtn" title="edit subtask" style="width: 36px;">
                        <figcaption>edit</figcaption>
                    </figure>
                    <p class="dimmedFont small">subtask n° ${e.subId + 1}</p>
                    ${dateString}
                    <p style="${color} ${textDecoration}">${checkForLinks(e.note.at(-1)[2])}</p>
                    <hr>
                    `);
            } else if (e.state.at(-1)[2] === -1) {
                color = "color: hsl(0, 0%, 50%)";
                textDecoration = `; text-decoration: line-through;`;
                dateString = `<p class="dimmedFont small">completed: ${dateAndTimeToString(e.state.at(-1)[0])}</p>`;
                mdDivDisplayCompletedSubtasks.insertAdjacentHTML(
                "afterbegin",
                `
                <figure class="mdBtn" onclick="restoreSubtask(${e.subId})">
                    <img src="pix/restore.webp" alt="restore" class="subtaskMdBtn" title="restore subtask" style="width: 36px;">
                    <figcaption>restore</figcaption>
                </figure>
                <p class="dimmedFont small">subtask n° ${e.subId + 1}</p>
                ${dateString}
                <p style="${color} ${textDecoration}">${checkForLinks(e.note.at(-1)[2])}</p>
                <hr>
                `
            );
            }            
        if (mdDivDisplayCompletedSubtasks.innerHTML != "") {
            btnShowCompletedSubtasks.style.display = "block";
        } 
        });
    }
};

const showCompletedSubtasks = () => {
    mdDivDisplayCompletedSubtasks.style.display = "block";
    mdBtnAddEntry.style.display = "none";
    btnShowCompletedSubtasks.style.display = "none";
    btnHideCompletedSubtasks.style.display = "block";
    mdDivDisplayCompletedSubtasks.scrollIntoView();
}

const hideCompletedSubtasks = () => {
    mdDivDisplayCompletedSubtasks.style.display = "none";
    mdBtnAddEntry.style.display = "block";
    btnShowCompletedSubtasks.style.display = "block";
    btnHideCompletedSubtasks.style.display = "none";
    window.scroll(0, 0);
}

const displayNewTicket = () => {
    console.log("=> fn displayNewTicket triggered");
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
    console.log("=> fn displayNewSubtask triggered");
    entry.style.display = "block";
    frmEntry.reset();
    mdBtnAddEntry.style.display = "none";
    mdBtnDismiss.style.display = "block";
    if (mdDivEdit.style.display === "block") {
        mdBtnSaveTicket.style.display = "block";
        mdBtnSaveEntry.style.display = "none";
        mdBtnSaveEditedTicket.style.display = "none";
    } else {
        mdBtnSaveTicket.style.display = "none";
        mdBtnSaveEntry.style.display = "block";
        mdBtnSaveEditedTicket.style.display = "none";
    }
    mdSubtaskDate.innerHTML = dateToString(Date.now());
    // mdSubtaskEditor.innerHTML = currentUser.firstName.at(-1)[2];
    /* mdSelSubtaskType.innerHTML = "";
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
    }); */
    mdBtnSaveEntry.scrollIntoView();
    mdTaNote.focus();
};

const displayRestorableTickets = () => {
    let restorable = tickets.findIndex((e) => e.prio.at(-1)[2] === -1);
    if (restorable === -1) {
        showAlert("No tickets to restore");
        return;
    }
    hideAllModals();
    if (config.listType === "bubbles") {
        btnStartBubbles.style.display = "block";
        btnStartTable.style.display = "none";
    }
    if (config.listType === "table") {
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "block";
    }
    divRestore.innerHTML = "";
    modalRestore.style.display = "block";
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
    tickets.sort((a, b) => a.date.at(-1)[2] - b.date.at(-1)[2]);
    tickets.forEach(e => {
        if (e.prio.at(-1)[2] === -1) {
            divRestore.insertAdjacentHTML("beforeend", `
                <div class="restorable-ticket" style="border-top: solid 12px hsl(${e.bubbleHue.at(-1)[2]}, 13%, 50%); border-bottom: solid 12px hsl(${e.bubbleHue.at(-1)[2]}, 13%, 50%);">
                    <figure>
                        <img src="pix/restore.webp" alt="restore task" onclick="restoreTicket('${e.id}')" />
                        <figcaption>restore</figcaption>
                    </figure>
                    <p class="small">created: <br>${dateAndTimeToString(e.date.at(-1)[2])}</p>
                    <p class="small">completed: <br>${dateAndTimeToString(e.prio.at(-1)[0])}</p>
                    <h4 style="color: hsl(${e.bubbleHue.at(-1)[2]}, 13%, 50%)">${e.title.at(-1)[2]}</h4>
                    <p>${e.description.at(-1)[2]}</p>
                </div>
                `);
        }
    })
}

const renderTickets = () => {
    console.log("=> fn renderTickets triggered");
    let visibleTickets = [];
    tickets.forEach((e) => {
        if (e.prio.at(-1)[2] >= 0) {
            visibleTickets.push(e);
        }
    });
    if (visibleTickets.length === 0) {
        hideAllModals();
        showHome();
        btnSearch.style.display = "none";
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "none";
    } else {
        btnSearch.style.display = "block";
        btnResetSearch.style.display = "none";
        rank(tickets);
        renderList(tickets);
        renderBubbles(tickets);
        if (config.listType === "bubbles") {
            displayBubbleList();
            // btnStartBubbles.style.display = "none";
        } else if (config.listType === "table") {
            displayTicketList();
            // btnStartTable.style.display = "none";
        }
    }
};

const displayEditPersonalData = () => {
    console.log("=> fn displayEditPersonalData triggered");
    if (modalEditPersonalData.style.display === "none") {
        modalEditPersonalData.style.display = "block";
        mdPDId.innerHTML = currentUser.id;
        inpPDFirstName.value = currentUser.firstName.at(-1)[2];
        inpPDLastName.value = currentUser.lastName.at(-1)[2];
        inpPDEmail.value = currentUser.email.at(-1)[2];
    } else {
        modalEditPersonalData.style.display = "none";
    }
}

const closeModal = (target) => {
    target.style.display = "none";
}

const moveTop = () => {
    window.scroll(0, 0);
}

const toggleScrollToTopButton = () => {
    if (document.body.scrollHeight > window.innerHeight) {
        btnMoveTop.style.display = 'block'; // Show button
    } else {
        btnMoveTop.style.display = 'none'; // Hide button
    }
}
