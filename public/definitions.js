const main = document.querySelector(".main");
const header = document.querySelector(".header");
const modalIndex = document.querySelector(".modalIndex");
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
const modalRestore = document.querySelector(".modalRestore");
const modalEditPersonalData = document.querySelector(".modalEditPersonalData");
const modalFilter = document.querySelector(".modalFilter");
const modalSearch = document.querySelector(".modalSearch");
const grpArrows = document.querySelectorAll(".grpArrows");
const entry = document.querySelector(".entry");
const mdBtn = document.querySelectorAll(".mdBtn");
const mdDivDisplaySubtasks = document.querySelector(".mdDivDisplaySubtasks");
const modalConfirmDone = document.querySelector(".modalConfirmDone");
const modalSubtaskConfirmDone = document.querySelector(".modalSubtaskConfirmDone");
const modalWarningDeleteAccount = document.querySelector(".modalWarningDeleteAccount");
const modalEditSubticket = document.querySelector(".modalEditSubticket");
const modalCreateAccount = document.querySelector(".modalCreateAccount");
const modalLogin = document.querySelector(".modalLogin");
const modalConfirmLogout = document.querySelector(".modalConfirmLogout");
const modalConfirmDeleteOldTickets = document.querySelector(".modalConfirmDeleteOldTickets");

const doQuSe = (target) => {
    const [targetString] = Object.keys({ target })
    varName = document.querySelector(targetString);
};

doQuSe(logo);
doQuSe(logoStacked);
doQuSe(btnNewTicket);
doQuSe(btnSettings);
doQuSe(btnLightMode);
doQuSe(btnTicketList);
doQuSe(btnBubbleList);
doQuSe(btnStartTable);
doQuSe(btnStartBubbles);
doQuSe(btnSearch);
doQuSe(inpSearch);
doQuSe(btnStartSearch);
doQuSe(btnDismissSearch);
doQuSe(btnResetSearch);
doQuSe(btnLogOut);

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
// doQuSe(mdOwner);
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
// doQuSe(mdSubtaskEditor);
/* doQuSe(mdSelSubtaskType);
doQuSe(mdSelSubtaskState); */
doQuSe(mdTaNote);

doQuSe(mdTdDueDate);
doQuSe(mdTdPrio);
doQuSe(mdSpanDescription);
doQuSe(mdPDescription);
doQuSe(mdDivDisplay);
doQuSe(mdDivEdit);
// doQuSe(mdDivDisplaySubtasks);
doQuSe(mdHr);
doQuSe(mdInpColor)
doQuSe(frmTicket);
doQuSe(frmEntry);

doQuSe(btnConfirmDone);

doQuSe(frmEditSubtask);
doQuSe(mdEditSubtaskDate);
doQuSe(mdEditSubtaskEditor);
// doQuSe(mdSelEditSubtaskType);
// doQuSe(mdSelEditSubtaskState);
doQuSe(mdTaEditSubtaskNote);
doQuSe(inpCreateAccountFirstName);
doQuSe(inpCreateAccountLastName);
doQuSe(inpCreateAccountEmail);
doQuSe(inpCreateAccountPassword);
doQuSe(inpCreateAccountConfirmPassword);
doQuSe(inpLoginEmail);
doQuSe(inpLoginPassword);
// doQuSe(loginButtons);
doQuSe(inpCreateAccountRememberMe);
doQuSe(inpLoginRememberMe);
doQuSe(frmCreateAccount);
doQuSe(frmLogin);
doQuSe(loggedInInfo);
doQuSe(divSafetyCode);
doQuSe(h4SafetyCode);
doQuSe(inpSafetyCode1);
doQuSe(inpSafetyCode2);
doQuSe(inpSafetyCode3);
doQuSe(inpSafetyCode4);
doQuSe(inpSafetyCode5);
doQuSe(inpSafetyCode6);
doQuSe(versionInfo);
doQuSe(mdPDId);
doQuSe(inpPDFirstName);
doQuSe(inpPDLastName);
doQuSe(inpPDEmail);
doQuSe(inpPDOldPassword);
doQuSe(inpPDNewPassword);
doQuSe(inpPDConfirmPassword);
doQuSe(divRestore);
doQuSe(mdDeleteAccountPassword);
doQuSe(inpDeleteAccountPassword);
doQuSe(welcomeName);
doQuSe(btnMoveTop);
doQuSe(loader);
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();
// doQuSe();