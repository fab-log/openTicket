const search = () => {
	console.log("=> fn search triggered");
	let string = inpSearch.value.toLowerCase();
	let result = [];
	if (string === "") {
		showAlert("please enter search phrase");
		return;
	};
	searchSortingOrFiltersActive = true;
	tickets.forEach(e => {
		let matches = 0;
		if (dateToString(e.date.at(-1)[2]).search(string) >= 0) { matches += 1 };
		if (e.title.at(-1)[2].toLowerCase().search(string) >= 0) { matches += 1 };
		if (e.description.at(-1)[2].toLowerCase().search(string) >= 0) { matches += 1 };
		if (e.dueDate.at(-1)[2].search(string) >= 0) { matches += 1 };
		// if (e.owner.at(-1)[2].toLowerCase().search(string) >= 0) { matches += 1 };
		// if ((e.prio.at(-1)[2]).toString().search(string) >= 0) { matches += 1 };
		e.subtasks.forEach(el => {
			// if (dateToString(el.date.at(-1)[2]).search(string) >= 0) { matches += 1 };
			if (el.note.at(-1)[2].toLowerCase().search(string) >= 0) { matches += 1 };
		});
		if (matches > 0) {result.push(e)}
	});
	if (result.length === 0) {
		console.log("result.length: " + result.length);
		showAlert("no matches");
	} else {
		let filteredResult = result.filter((element, index) => {
			return result.indexOf(element) === index;
		});
		console.log("result.length: " + result.length);
		for (i = ticketList.rows.length - 1; i > 0; i--) {
			ticketList.rows[i].remove();
			ticketList.tBodies[i].remove();
		};
		grpArrows.forEach(e => {
			e.style.display = "none";
		});
		filteredResult.forEach(element => {
			insertTableString(element);
		});
		inpSearch.value = "";
		modals.forEach(e => {
			e.style.display = "none";
		});
		/* if (document.body.classList.contains("light-mode") === false) {
			document.querySelectorAll(".list img").forEach(e => {
				e.classList.add("imgInvert")
			});
		}; */
		setTimeout(() => {
			window.scroll(0, 0);
	}, 150);
		renderBubbles(filteredResult);
		if (config.listType === "bubbles") {
			displayBubbleList();
		} else if (config.listType === "table") {
			displayTicketList();
		}
		// list.style.display = "block";
		modalSearch.style.display = "none";
		btnSearch.style.display = "none";
		btnResetSearch.style.display = "block";
		searchSortingOrFiltersActive = false;
	};
};