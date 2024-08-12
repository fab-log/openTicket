const modalBubbles = document.querySelector(".modalBubbles");
const bubble = document.querySelectorAll(".bubble");
const ticketList = document.querySelector(".ticketList");
const list = document.querySelector(".list");
const btnSort = document.querySelectorAll(".btnSort");
const btnSortUp = document.querySelectorAll(".btnSortUp");
const btnSortDown = document.querySelectorAll(".btnSortDown");
const btnFilter = document.querySelectorAll(".btnFilter");
const btnUndoFilter = document.querySelectorAll(".btnUndoFilter");
const modals = document.querySelectorAll(".modal");
const modalWelcome = document.querySelector(".modalWelcome");
const modalTicket = document.querySelector(".modalTicket");
const modalSettings = document.querySelector(".modalSettings");
const modalFilter = document.querySelector(".modalFilter");
const modalSearch = document.querySelector(".modalSearch");
const grpArrows = document.querySelectorAll(".grpArrows");
const entry = document.querySelector(".entry");
const mdBtn = document.querySelectorAll(".mdBtn");
const mdDivDisplaySubtasks = document.querySelector(".mdDivDisplaySubtasks");
const modalConfirmDone = document.querySelector(".modalConfirmDone");
const modalEditSubticket = document.querySelector(".modalEditSubticket");

const doQuSe = (target) => {
    const [targetString] = Object.keys({ target })
    varName = document.querySelector(targetString);
};

/* const doQuSeAll = (target) => {
    const [targetString] = Object.keys({target})
    varName = document.querySelector(targetString);
}; */

doQuSe(logo);
doQuSe(logoStacked);
doQuSe(btnNewTicket);
doQuSe(btnSettings);
doQuSe(btnLightMode);
doQuSe(btnDarkMode);
doQuSe(btnTicketList);
doQuSe(btnBubbleList);
doQuSe(btnStartTable);
doQuSe(btnStartBubbles);
doQuSe(btnSearch);
doQuSe(inpSearch);
doQuSe(btnStartSearch);
doQuSe(btnDismissSearch);
doQuSe(btnResetSearch);

doQuSe(btnSortByDate);
doQuSe(btnFilterByDate);
doQuSe(btnSortByTitle);
doQuSe(btnFilterByTitle);
doQuSe(btnSortByDescription);
doQuSe(btnFilterByDescription);
doQuSe(btnSortByDueDate);
doQuSe(btnFilterByDueDate);
doQuSe(btnSortByOwner);
doQuSe(btnFilterByOwner);
doQuSe(btnSortByPriority);
doQuSe(btnFilterByPriority);
doQuSe(btnSortUpByDate);
doQuSe(btnSortDownByDate);
doQuSe(btnSortUpByTitle);
doQuSe(btnSortDownByTitle);
doQuSe(btnSortUpByDescription);
doQuSe(btnSortDownByDescription);
doQuSe(btnSortUpByDueDate);
doQuSe(btnSortDownByDueDate);
doQuSe(btnSortUpByOwner);
doQuSe(btnSortDownByOwner);
doQuSe(btnSortUpByPriority);
doQuSe(btnSortDownByPriority);
doQuSe(btnUndoFilterByDate);
doQuSe(btnUndoFilterByTitle);
doQuSe(btnUndoFilterByDescription);
doQuSe(btnUndoFilterByDueDate);
doQuSe(btnUndoFilterByOwner);
doQuSe(btnUndoFilterByPriority);

doQuSe(btnDismissFilter);

doQuSe(mdTitle);
doQuSe(mdInpTitle);
doQuSe(mdDate);
doQuSe(mdOwner);
doQuSe(mdInpDueDate);
doQuSe(mdSelPrio);
doQuSe(mdTaDescription);
doQuSe(mdBtnDone);
doQuSe(mdBtnEdit);
doQuSe(mdBtnSaveTicket);
doQuSe(mdBtnSaveEntry);
doQuSe(mdBtnSaveEditedTicket);
doQuSe(mdBtnDismiss);
doQuSe(mdBtnAddEntry);

doQuSe(selFilter);

doQuSe(mdSubtaskDate);
doQuSe(mdSubtaskEditor);
doQuSe(mdSelSubtaskType);
doQuSe(mdSelSubtaskState);
doQuSe(mdTaNote);

doQuSe(mdTdDueDate);
doQuSe(mdTdPrio);
doQuSe(mdSpanDescription);
doQuSe(mdDivDisplay);
doQuSe(mdDivEdit);
// doQuSe(mdDivDisplaySubtasks);
doQuSe(mdHr);
doQuSe(mdInpColor)
doQuSe(frmTicket);
doQuSe(frmEntry);

doQuSe(btnConfirmDone);
doQuSe(btnDismissDone);

doQuSe(frmEditSubtask);
doQuSe(mdEditSubtaskDate);
doQuSe(mdEditSubtaskEditor);
doQuSe(mdSelEditSubtaskType);
doQuSe(mdSelEditSubtaskState);
doQuSe(mdTaEditSubtaskNote);


// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();