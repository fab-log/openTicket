const renderHeader = () => {
    console.log("=> fn renderHeader triggered");
    header.style.display = "block";
	header.innerHTML = `
		<img src="assets/logoStacked.webp" alt="openTicket logo" id="logoStacked">
        <img src="assets/bubbles.webp" alt="start screen" id="btnStartBubbles" title="${lang("start screen", "Startbildschirm")}" onclick="renderBubbles(tickets)">
        <img src="assets/list.webp" alt="start screen" id="btnStartTable" title="${lang("start screen", "Startbildschirm")}" onclick="renderTable(tickets)">
        <img src="assets/cancel.webp" alt="reset search and sorting" id="btnResetSearch" title="${lang("reset search and sorting", "Suche und Filter zurücksetzen")}" onclick="resetSearch()">
        <img src="assets/search.webp" alt="search" id="btnSearch" title="${lang("search", "Suche")}" onclick="renderModalSearch()">
        <img src="assets/settings.webp" alt="settings" id="btnSettings" title="${lang("settings", "Einstellungen")}" onclick="toggleSettings()">
        <img src="assets/power.webp" alt="log out" id="btnLogOut" title="${lang("log out", "Ausloggen")}" onclick="confirmLogOut()">
        <img src="assets/plus.webp" alt="new ticket" id="btnNewTicket" title="${lang("new element", "Neues Element")}" onclick="renderNewElementPicker()">
        <img src="assets/logoStacked.webp" alt="openTicket logo" id="logo">
	`;
    logoStacked = document.querySelector("#logoStacked");
    btnStartBubbles = document.querySelector("#btnStartBubbles");
    btnStartTable = document.querySelector("#btnStartTable");
    btnResetSearch = document.querySelector("#btnResetSearch");
    btnSearch = document.querySelector("#btnSearch");
    btnSettings = document.querySelector("#btnSettings");
    btnLogOut = document.querySelector("#btnLogOut");
    btnNewTicket = document.querySelector("#btnNewTicket");
    logo = document.querySelector("#logo");
}