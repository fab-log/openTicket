btnSettings.addEventListener("click", () => {
	if (modalSettings.style.display === "none") {
			modalSettings.style.display = "block";
			// window.scroll(0, 0);
	} else {
			modalSettings.style.display = "none"
	}
});

btnFilterByDate.addEventListener("click", () => {
	prepareSelFilter("date");
	selFilter.addEventListener("change", fnFilterByDate);
});

btnFilterByTitle.addEventListener("click", () => {
	prepareSelFilter("title");
	selFilter.addEventListener("change", fnFilterByTitle);
});

btnFilterByDescription.addEventListener("click", () => {
	prepareSelFilter("description");
	selFilter.addEventListener("change", fnFilterByDescription);
});

btnFilterByDueDate.addEventListener("click", () => {
	prepareSelFilter("dueDate");
	selFilter.addEventListener("change", fnFilterByDueDate);
})

btnFilterByOwner.addEventListener("click", () => {
	prepareSelFilter("owner");
	selFilter.addEventListener("change", fnFilterByOwner);
});

btnFilterByPriority.addEventListener("click", () => {
	prepareSelFilter("prio");
	selFilter.addEventListener("change", fnFilterByPriority);
});


mdInpColor.addEventListener("change", () => {
	hue = mdInpColor.value;
	modalTicket.style.borderTop = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
	modalTicket.style.borderBottom = `${modalTicketBorderWidth} solid hsl(${hue}, 25%, 50%)`;
});

// ####################
// ### UNDO FILTERS ###
// ####################

const removeFilterListeners = () => {
	selFilter.removeEventListener("change", fnFilterByDate);
	selFilter.removeEventListener("change", fnFilterByTitle);
	selFilter.removeEventListener("change", fnFilterByDescription);
	selFilter.removeEventListener("change", fnFilterByDueDate);
	selFilter.removeEventListener("change", fnFilterByOwner);
	selFilter.removeEventListener("change", fnFilterByPriority);
}

btnUndoFilterByDate.addEventListener("click", () => {
	resetSortAndFilterButtons();
	selFilter.removeEventListener("change", fnFilterByDate);
	rank(sortedTickets);
	renderList(sortedTickets);
});

btnUndoFilterByTitle.addEventListener("click", () => {
	resetSortAndFilterButtons();
	selFilter.removeEventListener("change", fnFilterByTitle);
	rank(sortedTickets);
	renderList(sortedTickets);
});

btnUndoFilterByDescription.addEventListener("click", () => {
	resetSortAndFilterButtons();
	selFilter.removeEventListener("change", fnFilterByDescription);
	rank(sortedTickets);
	renderList(sortedTickets);
});

btnUndoFilterByDueDate.addEventListener("click", () => {
	resetSortAndFilterButtons();
	selFilter.removeEventListener("change", fnFilterByDueDate);
	rank(sortedTickets);
	renderList(sortedTickets);
});

btnUndoFilterByOwner.addEventListener("click", () => {
	resetSortAndFilterButtons();
	selFilter.removeEventListener("change", fnFilterByOwner);
	rank(sortedTickets);
	renderList(sortedTickets);
});

btnUndoFilterByPriority.addEventListener("click", () => {
	resetSortAndFilterButtons();
	selFilter.removeEventListener("change", fnFilterByPriority);
	rank(sortedTickets);
	renderList(sortedTickets);
});

btnSearch.addEventListener("click", () => {
	if (modalSearch.style.display === "block") {
			inpSearch.value = "";
			modalSearch.style.display = "none";
	} else {
			modalSearch.style.display = "block";
			inpSearch.focus();
	}
});

btnDismissSearch.addEventListener("click", () => {
	inpSearch.value = "";
	modalSearch.style.display = "none";
});

btnStartSearch.addEventListener("click", search);
inpSearch.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
			event.preventDefault();
			search();
	}
});

btnResetSearch.addEventListener("click", () => {
	btnResetSearch.style.display = "none";
	btnSearch.style.display = "block";
	resetSortAndFilterButtons();
	sortedTickets = tickets.filter(element => element);
	renderTickets();
	/* renderBubbles(sortedTickets);
	rank(sortedTickets);
	renderList(sortedTickets);
	if (listType === "bubbles") {
			displayBubbleList();
	} else if (listType === "table") {
			displayTicketList();
	} */
});

mdBtnSaveTicket.addEventListener("click", saveNewTicket);

mdBtnSaveEntry.addEventListener("click", saveEntry);

mdBtnDismiss.addEventListener("click", () => {
	if (listType === "bubbles") {
			displayBubbleList();
	} else if (listType === "table") {
			displayTicketList();
	}
});

mdBtnAddEntry.addEventListener("click", displayNewSubtask);

mdBtnDone.addEventListener("click", () => {
	modalConfirmDone.style.display = "block";
});

btnConfirmDone.addEventListener("click", confirmDone);

btnDismissDone.addEventListener("click", () => {
	modalConfirmDone.style.display = "none";
});

mdBtnEdit.addEventListener("click", () => {
	editTicket(currentTicketId);
});

mdBtnSaveEditedTicket.addEventListener("click", saveEditedTicket);

document.querySelectorAll("img").forEach(e => {
	e.classList.add("imgInvert");
});
logo.classList.remove("imgInvert");
logoStacked.classList.remove("imgInvert");