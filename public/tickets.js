const cyphers = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","^","!","§","$","%","&","/", "(", ")","=","?","*","+","#","{","}","[","]","<",">",",",".","-",";",":"];

const randomCyphers = () => {
	let randomString = "";
	for (i = 0; i < 10; i++) {
		randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
	}
	return randomString;
}

const resetModalTicketInputs = () => {
    mdInpTitle.value = "";
    mdInpDueDate.value = "";
    mdSelPrio.innerHTML = "";
    mdTaDescription.value = "";
    mdSelSubtaskState.innerHTML = "";
    mdSelSubtaskType.innerHTML = "";
    mdTaNote.value = "";
};

const updateKey = async (index, key, body) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            index: index,
            key: key,
        },
        body: JSON.stringify(body),
    };
    try {
        const response = await fetch("/api.updateKey", options);
        const json = await response.json();
        getTickets();
        // console.log(JSON.stringify(json, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
};

const saveNewTicket = async () => {
    if (mdInpTitle.value === "") {
        showAlert("Please enter at least a title");
        return;
    }
    if (
        mdInpDueDate.value < dateToString(Date.now()) &&
        mdInpDueDate.value != ""
    ) {
        showAlert("Due date is in the past");
        return;
    }
    let newTicket = {
        id: `ticket_${Date.now()}_${randomCyphers()}`,
        bubbleHue: [[Date.now(), currentUser, Number(mdInpColor.value)]],
        date: [[Date.now(), currentUser, Date.now()]],
        state: [[Date.now(), currentUser, 0]],
        title: [[Date.now(), currentUser, mdInpTitle.value]],
        description: [[Date.now(), currentUser, mdTaDescription.value]],
        dueDate: [[Date.now(), currentUser, mdInpDueDate.value]],
        owner: [[Date.now(), currentUser, currentUser]],
        prio: [[Date.now(), currentUser, Number(mdSelPrio.value)]],
        subtasks: [],
    };
    if (mdTaNote.value != "") {
        newTicket.subtasks.push({
            subId: 0,
            date: [[Date.now(), currentUser, Date.now()]],
            editor: [[Date.now(), currentUser, currentUser]],
            type: [[Date.now(), currentUser, Number(mdSelSubtaskType.value)]],
            state: [[Date.now(), currentUser, Number(mdSelSubtaskState.value)]],
            note: [[Date.now(), currentUser, mdTaNote.value]]
        });
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
    };
    const response = await fetch("/api.tickets", options);
    const json = await response.json();
    // console.log(JSON.stringify(json, null, 2));
    getTickets();

    modalTicket.style.display = "none";
    btnResetSearch.style.display = "none";
    btnSearch.style.display = "block";
    resetModalTicketInputs();
    // renderTickets();
};

const saveEntry = async () => {
    let index = getIndex(currentTicketId);
    if (mdTaNote.value === "") {
        showAlert("Please enter a note");
        return;
    }
    let newEntry = {
        subId: tickets[index].subtasks.length,
        date: [[Date.now(), currentUser, Date.now()]],
        editor: [[Date.now(), currentUser, currentUser]],
        type: [[Date.now(), currentUser, Number(mdSelSubtaskType.value)]],
        state: [[Date.now(), currentUser, Number(mdSelSubtaskState.value)]],
        note: [[Date.now(), currentUser, mdTaNote.value]],
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            index: index,
        },
        body: JSON.stringify(newEntry),
    };
    const response = await fetch("/api.saveEntry", options);
    const json = await response.json();
    console.log(JSON.stringify(json, null, 2));
    getTickets();

    // tickets[index].subtasks.push(newEntry);
    displayTicket(currentTicketId);
};

const confirmDone = () => {
    let index = getIndex(currentTicketId);
    let key = "prio";
    let body = [Date.now(), currentUser, -1];
    updateKey(index, key, body);
    // getTickets();
    modalConfirmDone.style.display = "none";
    modals.forEach((e) => {
        e.style.display = "none";
    });
    sortedTickets = tickets.filter((element) => element);
    // renderTickets();
    /* renderList(sortedTickets);
    renderBubbles(sortedTickets);
    if (listType === "bubbles") {
            displayBubbleList();
    } else if (listType === "table") {
            displayTicketList();
    }; */
};

const editTicket = (ticketId) => {
    let index = getIndex(currentTicketId);
    mdDivDisplay.style.display = "none";
    mdBtnAddEntry.style.display = "none";
    entry.style.display = "none";
    mdBtnSaveEntry.style.display = "none";
    mdDivEdit.style.display = "block";
    mdBtn.forEach((e) => {
        e.style.display = "none";
    });
    mdSelPrio.innerHTML = "";
    priority.forEach((e) => {
        mdSelPrio.insertAdjacentHTML(
            "beforeend",
            `
			<option value=${e[0]}>${e[1]}</option>
			`
        );
    });
    mdBtnDismiss.style.display = "block";
    mdBtnSaveEditedTicket.style.display = "block";
    mdInpTitle.value = tickets[index].title.at(-1)[2];
    mdInpDueDate.value = tickets[index].dueDate.at(-1)[2];
    mdSelPrio.value = tickets[index].prio.at(-1)[2];
    mdInpColor.value = tickets[index].bubbleHue.at(-1)[2];
    mdTaDescription.value = tickets[index].description.at(-1)[2];
};

const saveEditedTicket = async () => {
    let index = getIndex(currentTicketId);
    let data = {
        title: [],
        dueDate: [],
        prio: [],
        hue: [],
        description: []
    }
    if (mdInpTitle.value != tickets[index].title.at(-1)[2]) {
        data.title.push(Date.now(), currentUser, mdInpTitle.value);
    }
    if (mdInpDueDate.value != tickets[index].dueDate.at(-1)[2]) {
        if (
            mdInpDueDate.value < dateToString(Date.now()) &&
            mdInpDueDate.value != ""
        ) {
            showAlert("Due date is in the past");
            return;
        }
        data.dueDate.push(Date.now(), currentUser, mdInpDueDate.value);
    }
    if (Number(mdSelPrio.value) != tickets[index].prio.at(-1)[2]) {
        data.prio.push(Date.now(), currentUser, Number(mdSelPrio.value));
    }
    if (Number(mdInpColor.value) != tickets[index].bubbleHue.at(-1)[2]) {
        data.hue.push(Date.now(), currentUser, Number(mdInpColor.value));
    }
    if (mdTaDescription.value != tickets[index].description.at(-1)[2]) {
        data.description.push(Date.now(), currentUser, mdTaDescription.value);
    }
    if (data.title.length === 0 && data.dueDate.length === 0 && data.prio.length === 0 && data.hue.length === 0 && data.description.length === 0) {
        showAlert("No changes made!");
        return
    } else {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                index: getIndex(currentTicketId)
            },
            body: JSON.stringify(data),
        };
        const response = await fetch("/api.updateTicket", options);
        const json = await response.json();
        tickets = json;
    }

    modals.forEach((e) => {
        e.style.display = "none";
    });
    resetModalTicketInputs();
    btnResetSearch.style.display = "none";
    btnSearch.style.display = "block";
    sortedTickets = tickets.filter((element) => element);
    renderTickets();
};

const saveEditedSubtask = async () => {
    let ticketId = getIndex(currentTicketId);
    let subId = currentSubId;
    let data = {
        date: [],
        editor: [],
        type: [],
        state: [],
        note: [],
    };
    if (
        mdSelEditSubtaskType.value != tickets[ticketId].subtasks[subId].type.at(-1)[2]
    ) {
        data.type.push(Date.now(), currentUser, Number(mdSelEditSubtaskType.value));
    }
    if (
        mdSelEditSubtaskState.value != tickets[ticketId].subtasks[subId].state.at(-1)[2]
    ) {
        data.state.push(Date.now(), currentUser, Number(mdSelEditSubtaskState.value));
    }
    if (
        mdTaEditSubtaskNote.value != tickets[ticketId].subtasks[subId].note.at(-1)[2]
    ) {
        data.note.push(Date.now(), currentUser, mdTaEditSubtaskNote.value);
    }
    if (data.type.length === 0 && data.state.length === 0 && data.note.length === 0) {
        return;
    } else {
        data.date.push(Date.now(), currentUser, Date.now());
        data.editor.push(Date.now(), currentUser, currentUser);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                index: getIndex(currentTicketId),
                subid: currentSubId,
            },
            body: JSON.stringify(data),
        };
        const response = await fetch("/api.updateEntry", options);
        const json = await response.json();
        // console.log(JSON.stringify(json, null, 2));
        tickets = json;
        console.log(tickets);
    }
    modalEditSubticket.style.display = "none";
    frmEditSubtask.reset();
    displayTicket(currentTicketId);
};
