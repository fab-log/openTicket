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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createAccount = async (event) => {
    console.log("=> fn createAccount triggered");
    event.preventDefault();
    if (inpCreateAccountFirstName.value === "" || inpCreateAccountEmail.value === "" || inpCreateAccountConfirmPassword.value === "") {
        showAlert("please fill all fields");
        return;
    }
    if (emailRegex.test(inpCreateAccountEmail.value) === false) {
        showAlert("email is not correct!");
        return;
    }
    if (inpCreateAccountPassword.value.length < 8) {
        inpCreateAccountPassword.value = "";
        showAlert("password must have a minimum length of 8 characters");
        return;
    }
    if (inpCreateAccountPassword.value != inpCreateAccountConfirmPassword.value) {
        inpCreateAccountPassword.value = "";
        inpCreateAccountConfirmPassword.value = "";
        showAlert("passwords do not match!");
        return;
    }
    let inpSafetyCode = inpSafetyCode1.value + inpSafetyCode2.value + inpSafetyCode3.value + inpSafetyCode4.value + inpSafetyCode5.value + inpSafetyCode6.value
    if (inpSafetyCode != safetyCode) {
        showAlert("verification code is not correct!");
        inpSafetyCode1.value = "";
        inpSafetyCode2.value = "";
        inpSafetyCode3.value = "";
        inpSafetyCode4.value = "";
        inpSafetyCode5.value = "";
        inpSafetyCode6.value = "";
        inpSafetyCode1.focus();
        return;
    }
    let id = `user_${Date.now()}_${randomCyphers(10)}`;
    let data = {
        id,
        firstName: [[Date.now(), id, inpCreateAccountFirstName.value]],
        lastName: [[Date.now(), id, inpCreateAccountLastName.value]],
        email: [[Date.now(), id, inpCreateAccountEmail.value]],
        password: [[Date.now(), id, inpCreateAccountPassword.value]]
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch("/api.createAccount", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    currentUser = serverResponse.data;
    console.log({ status });
    console.log({ currentUser });
    if (serverResponse.data === undefined) {
        showAlert(status);
        return;
    } else {
        if (inpCreateAccountRememberMe.checked) {
            config.id = currentUser.id;
            config.status = "logged in";
            if (localStorage.getItem("openTicketConfig") === null) {
                localStorage.setItem("openTicketConfig", JSON.stringify(config));
                console.log({ config });
            } else {
                tempConfig = JSON.parse(localStorage.getItem("openTicketConfig"));
                if (tempConfig.id === currentUser.id) {
                    tempConfig.status = "logged in";
                    localStorage.setItem("openTicketConfig", JSON.stringify(tempConfig));
                    console.log({ config });
                } else {
                    localStorage.setItem("openTicketConfig", JSON.stringify(config));
                    console.log({ config });
                }
            }
        }
        frmCreateAccount.reset();
        inpSafetyCode1.value = "";
        inpSafetyCode2.value = "";
        inpSafetyCode3.value = "";
        inpSafetyCode4.value = "";
        inpSafetyCode5.value = "";
        inpSafetyCode6.value = "";
        showAlert(status);
        hideAllModals();
        btnSearch.style.display = "none";
        btnStartBubbles.style.display = "none";
        btnStartTable.style.display = "none";
        header.style.display = "block";
        modalWelcome.style.display = "block";
        // loginButtons.style.display = "none";
        loggedInInfo.innerHTML = currentUser.email.at(-1)[2];
    }
}

const login = async (event) => {
    console.log("=> fn login triggered");
    event.preventDefault();
    if (emailRegex.test(inpLoginEmail.value) === false) {
        showAlert("email is not correct!");
        return;
    }
    if (inpLoginEmail.value === "" || inpLoginPassword.value === "") {
        showAlert("please fill all fields");
        return;
    }
    let data = {
        email: inpLoginEmail.value,
        password: inpLoginPassword.value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch("/api.login", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    currentUser = serverResponse.data;
    console.log({ status });
    console.log({ currentUser });
    if (serverResponse.data === undefined) {
        inpLoginEmail.value = "";
        inpLoginPassword.value = "";
        showAlert(status);
        return;
    } else {
        if (inpLoginRememberMe.checked) {
            config.id = currentUser.id;
            config.status = "logged in";
            if (localStorage.getItem("openTicketConfig") === null) {
                localStorage.setItem("openTicketConfig", JSON.stringify(config));
                console.log({ config });
            } else {
                tempConfig = JSON.parse(localStorage.getItem("openTicketConfig"));
                if (tempConfig.id === currentUser.id) {
                    config = tempConfig;
                    config.status = "logged in";
                    localStorage.setItem("openTicketConfig", JSON.stringify(config));
                    console.log({ config });
                } else {
                    config.id = currentUser.id;
                    config.status = "logged in";
                    config.mode = "dark";
                    config.listType = "bubbles";
                    localStorage.setItem("openTicketConfig", JSON.stringify(config));
                    console.log({ config });
                }
            }
        }
        frmLogin.reset();
        hideAllModals();
        header.style.display = "block";
        // loginButtons.style.display = "none";
        loggedInInfo.innerHTML = currentUser.email.at(-1)[2];
        await getTickets(currentUser.id);
        // renderTickets();
    }
}

const quickLogin = async (id) => {
    console.log("=> fn quickLogin triggered");
    let data = {
        id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    const response = await fetch("/api.quickLogin", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    currentUser = serverResponse.data;
    console.log({ status });
    console.log({ currentUser });
    if (serverResponse.data === undefined) {
        showAlert(status);
        return;
    } else {
        hideAllModals();
        header.style.display = "block";
        // loginButtons.style.display = "none";
        loggedInInfo.innerHTML = currentUser.email.at(-1)[2];
        await getTickets(currentUser.id);
        // renderTickets();
    }
}

const confirmLogOut = () => {
    if (modalConfirmLogout.style.display === "none") {
        modalConfirmLogout.style.display = "block";
    } else {
        modalConfirmLogout.style.display = "none"
    }

}

const dismissLogout = () => {
    modalConfirmLogout.style.display = "none";
}

const logout = () => {
    console.log("=> fn logout triggered");
    if (localStorage.getItem("openTicketConfig") === null) {
        console.log("Log out. No local storage file")
    } else {
        tempConfig = JSON.parse(localStorage.getItem("openTicketConfig"));
        if (tempConfig.id === currentUser.id) {
            config.status = "logged out";
            localStorage.setItem("openTicketConfig", JSON.stringify(config));
            console.log({ config });
        } else {
            config = {};
            localStorage.setItem("openTicketConfig", JSON.stringify(config));
            console.log({ config });
        }
    }
    currentUser = {};
    hideAllModals();
    header.style.display = "none";
    showHome();
}

const deleteAccount = async () => {
    console.log("=> fn deleteAccount triggered");
    if (inpDeleteAccountPassword.value === "") {
        showAlert("please enter your password");
        return;
    }
    let data = {
        id: currentUser.id,
        password: inpDeleteAccountPassword.value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            id: currentTicket.id
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/api.deleteAccount", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    if (status != "OK") {
        inpDeleteAccountPassword.value = "";
        showAlert(status + "<br />Please try again");
        return;
    }
    showAlert("account successfully deleted");
    console.log("delete acoount " + serverResponse.id + status);
    currentUser = {};
    currentTicket = {};
    config = {};
    localStorage.setItem("openTicketConfig", JSON.stringify(config));
    // loginButtons.style.display = "block";
    btnSearch.style.display = "none";
    btnStartBubbles.style.display = "none";
    btnStartTable.style.display = "none";
    header.style.display = "none";
    // modalIndex.style.display = "block";
    showHome();
}

const updateTicket = async () => {
    console.log("=> fn updateTicket triggered");
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
    const response = await fetch("/api.updateTicket", options);
    const serverResponse = await response.json();
    console.log("Update ticket. Status: " + serverResponse.status);
    tickets = serverResponse.tickets;
    sortedTickets = tickets.filter((element) => element);
    renderTickets();
}

const saveNewTicket = async () => {
    console.log("=> fn saveNewTicket triggered");
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
        id: `ticket_${Date.now()}_${randomCyphers(10)}`,
        bubbleHue: [[Date.now(), currentUser.id, Number(mdInpColor.value)]],
        date: [[Date.now(), currentUser.id, Date.now()]],
        state: [[Date.now(), currentUser.id, 0]],
        title: [[Date.now(), currentUser.id, mdInpTitle.value]],
        description: [[Date.now(), currentUser.id, mdTaDescription.value]],
        dueDate: [[Date.now(), currentUser.id, mdInpDueDate.value]],
        owner: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
        prio: [[Date.now(), currentUser.id, Number(mdSelPrio.value)]],
        subtasks: [],
    };
    if (mdTaNote.value != "") {
        newTicket.subtasks.push({
            subId: 0,
            date: [[Date.now(), currentUser.id, Date.now()]],
            editor: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
            state: [[Date.now(), currentUser.id, 0]],
            note: [[Date.now(), currentUser.id, mdTaNote.value]]
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
    const response = await fetch("/api.newTicket", options);
    const serverResponse = await response.json();
    console.log("Save new ticket. Status: " + serverResponse.status);
    tickets = serverResponse.tickets;
    modalTicket.style.display = "none";
    btnResetSearch.style.display = "none";
    btnSearch.style.display = "block";
    resetModalTicketInputs();
    sortedTickets = tickets.filter((element) => element);
    renderTickets();
};

const saveSubtask = async () => {
    console.log("=> fn saveSubtask triggered");
    if (mdTaNote.value === "") {
        showAlert("Please enter a note");
        return;
    }
    let newSubtask = {
        subId: currentTicket.subtasks.length,
        date: [[Date.now(), currentUser.id, Date.now()]],
        editor: [[Date.now(), currentUser.id, currentUser.firstName.at(-1)[2]]],
        // type: [[Date.now(), currentUser.id, Number(mdSelSubtaskType.value)]],
        state: [[Date.now(), currentUser.id, 0]],
        note: [[Date.now(), currentUser.id, mdTaNote.value]],
    };
    currentTicket.subtasks.push(newSubtask);
    await updateTicket();
    // await getTickets(currentUser.id);
    displayTicket(currentTicket.id);
};

const confirmDone = async () => {
    console.log("=> fn confirmDone triggered");
    let newPrio = [Date.now(), currentUser.id, -1];
    currentTicket.prio.push(newPrio);
    hideAllModals();
    await updateTicket();
    currentTicket = {};
    // await getTickets(currentUser.id);
    // sortedTickets = tickets.filter((element) => element);
    // renderTickets();
}

const editTicket = () => {
    console.log("=> fn editTicket triggered");
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
    mdInpTitle.value = currentTicket.title.at(-1)[2];
    mdInpDueDate.value = currentTicket.dueDate.at(-1)[2];
    mdSelPrio.value = currentTicket.prio.at(-1)[2];
    mdInpColor.value = currentTicket.bubbleHue.at(-1)[2];
    mdTaDescription.value = currentTicket.description.at(-1)[2];
};

const saveEditedTicket = async () => {
    console.log("=> fn saveEditedTicket triggered");
    let numberOfChanges = 0;
    if (mdInpTitle.value != currentTicket.title.at(-1)[2]) {
        currentTicket.title.push([Date.now(), currentUser.id, mdInpTitle.value]);
        numberOfChanges += 1;
    }
    if (mdInpDueDate.value != currentTicket.dueDate.at(-1)[2]) {
        if (
            mdInpDueDate.value < dateToString(Date.now()) &&
            mdInpDueDate.value != ""
        ) {
            showAlert("Due date is in the past");
            return;
        }
        currentTicket.dueDate.push([Date.now(), currentUser.id, mdInpDueDate.value]);
        numberOfChanges += 1;
    }
    if (Number(mdSelPrio.value) === -1) {
        modalConfirmDone.style.display = "block";
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
    hideAllModals();
    btnResetSearch.style.display = "none";
    btnSearch.style.display = "block";
    await updateTicket();
    // await getTickets(currentUser.id);
    currentTicket = {};
    // renderTickets();
    // sortedTickets = tickets.filter((element) => element);
};

const saveEditedSubtask = async () => {
    console.log("=> fn saveEditedSubtask triggered");
    let index = currentTicket.subtasks.findIndex((e) => e.subId === currentSubId);
    if (
        mdTaEditSubtaskNote.value === currentTicket.subtasks[index].note.at(-1)[2]
    ) {
        showAlert("No changes made!");
        return;
    }
    let subtaskNote = [Date.now(), currentUser.id, mdTaEditSubtaskNote.value];
    currentTicket.subtasks[index].note.push(subtaskNote);
    await updateTicket();
    // await getTickets(currentUser.id);
    modalEditSubticket.style.display = "none";
    frmEditSubtask.reset();
    displayTicket(currentTicket.id);
};

const markDoneSubtask = (subId) => {
    console.log("=> fn markDoneSubtask triggered");
    currentSubId = subId;
    modalSubtaskConfirmDone.style.display = "block";
    console.log({ currentSubId });
}

const subtaskConfirmDone = async () => {
    console.log("=> fn subtaskConfirmDone triggered");
    let index = currentTicket.subtasks.findIndex((e) => e.subId === currentSubId);
    let subtaskState = [Date.now(), currentUser.id, -1];
    currentTicket.subtasks[index].state.push(subtaskState);
    await updateTicket();
    // await getTickets(currentUser.id);
    // hideAllModals();
    displayTicket(currentTicket.id);
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
    // renderTickets();
    currentTicket = {};
}

const dismissDone = () => {
    console.log("=> fn dismissDone triggered");
    modalConfirmDone.style.display = "none";
    modalSubtaskConfirmDone.style.display = "none";
    modalWarningDeleteAccount.style.display = "none";
    modalConfirmDeleteOldTickets.style.display = "none";
}

const deleteOldTickets = async () => {
    console.log("=> fn deleteOldTickets triggered");
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
    const response = await fetch("/api.deleteOldTickets", options);
    const serverResponse = await response.json();
    console.log("Delete old tickets. Status: " + serverResponse.status);
    if (serverResponse.status != "OK") {
        showAlert(serverResponse.status);
        return;
    }
    showAlert("Old tasks have been sucessfully deleted")
    tickets = serverResponse.tickets;
    hideAllModals();
    renderTickets();
}