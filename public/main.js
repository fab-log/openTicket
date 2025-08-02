tickets = [];
currentUser = {};
let currentTicket = {};
currentSubId = -1;
searchSortingOrFiltersActive = false;
let version = "0.5.0 (beta)";

let config = {
    mode: "dark",
    listType: "bubbles",
    language: 1
};

const main = document.querySelector(".main");
const popUp = document.querySelector(".pop-up");
const header = document.querySelector(".header");
const modals = document.querySelectorAll(".modal");
const modalSettings = document.querySelector(".modalSettings");
const mdBtn = document.querySelectorAll(".mdBtn");
const divAlert = document.querySelector("#alert");

const doQuSe = (target) => {
    const [targetString] = Object.keys({ target })
    varName = document.querySelector(targetString);
};

const getTickets = async (userID) => {
    console.log(`=> fn getTickets(${userID}) triggered`);
    console.time("getTickets");
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
    try {
        const response = await fetch("/openTicket.getTickets", options);
        let serverResponse = await response.json();
        let status = serverResponse.status;
        console.log("=> status getTickets:");
        console.log({ status });
        if (status != "OK") {
            showAlert(lang(`Error!<br>${status}<br>Please try again`, `Fehler!<br>${status}<br>Bitte erneut versuchen`));
            return;
        } else {
            tickets = serverResponse.tickets;
            console.log({ tickets });
            // sortedTickets = tickets.filter((element) => element);
            renderTickets();;
        }        
    } catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;         
    } finally {
        stopLoader();
        console.timeEnd("getTickets");
    }
}

const priority = [
    [0, "none", "keine"],
    [-1, "done", "erledigt"],
    [1, "on hold", "pausiert"],
    [2, "urgent", "dringend"],
    [3, "critical", "kritisch"],
];
const priorityIndexes = [];
priority.forEach((e) => {
    priorityIndexes.push(e[0]);
});
const priorityValues = [];
priority.forEach((e) => {
    priorityValues.push(e[config.language + 1]);
});

// Order and content of typeMap and of typeMapTranslations must correspond!
const typeMap = [
    ["task", "assets/check_large.webp"],
    ["checklist", "assets/checklist.webp"],
    ["note", "assets/pin.webp"]
]

const typeMapTranslations = [
    ["task", "Aufgabe"],
    ["checklist", "Checkliste"],
    ["note", "Notiz"]
]

const modalTicketBorderWidth = "18px";

const lang = (english, german) => {
	let languages = [english, german];
	return languages[config.language]
}

const showAlert = (text, duration) => {
    console.log("=> fn showAlert triggered saying: '" + text + "'");
    let delay = !duration ? 3000 : duration
    divAlert.style.display = "block";
    divAlert.innerHTML = `<p>${text}</p>`;
    setTimeout(() => {
        divAlert.innerHTML = "";
        divAlert.style.display = "none";
    }, delay);
};

const showPopUp = () => {
    popUp.style.display = "block";
}

const closePopUp = () => {
    popUp.innerHTML = "";
    popUp.style.display = "none";
}

const showWelcomeScreen = () => {
    /* if (modalWelcome.style.display === "block") {
        modalSettings.style.display = "none";
        return;
    } */
    closePopUp();
    hideAllModals();
    renderWelcome();
    // modalWelcome.style.display = "block";
    // welcomeName.innerHTML = currentUser.firstName.at(-1)[2];
}

let accentColorBrightness = "60%";
const toggleMode = (mode, triggerSource) => {
    console.log("=> fn toggleMode(" + mode + ") triggered");
	if (mode === "dark") {
		config.mode = "dark";
        accentColorBrightness = "60%";
		document.body.classList.remove("light-mode");
	}
	if (mode === "light") {
		config.mode = "light";
        accentColorBrightness = "40%";
		document.body.classList.add("light-mode");
	}
    if (tickets.length > 0) {
        renderTickets();
        toggleSettings();
    }
	if (currentUser.id && currentUser.config.mode != config.mode) {
	    currentUser.config.mode = config.mode;
		updateUserSilent();
	}
}

const toggleLanguage = (code, triggerSource) => {
    console.log("=> fn toggleLanguage(" + code + ") triggered");
    config.language = code;
    if (!triggerSource && currentUser.id) {
        currentUser.config.language = code;
        updateUserSilent();
        showHome();
        toggleSettings();
    }
}

const sanitize = (string) => {
    return string.replace(/[&<>"'\/{}[\]()]/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '{':
                return '&#x7b;';
            case '}':
                return '&#x7d;';
            case '[':
                return '&#x5b;';
            case ']':
                return '&#x5d;';
            case '(':
                return '&#x28;';
            case ')':
                return '&#x29;';
            case '"':
                return '&quot;';
            case "'":
                return '&#39;';
            case '/':
                return '&#x2F;';
            default:
                return char;
        }
    });
}

const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
const phoneRegex = /^(?:\+?\d{1,3})?\d{5,}$/;
const twoDotsRegex = /\..*\..*/;

const format = (string) => {
    string = string.replace(/(?:\r\n|\r|\n)/g, " <br> ");
	let wordsArray = string.split (" ");
    let output = "";

	// 	CHECK FOR LINKS
    wordsArray.forEach(e => {
        if (emailRegex.test(e) === true) {
            output += `<a href="mailto:${e}">${e}</a> `;
            return;
        }
        if (e.toLowerCase().startsWith("https:")) {
            output += `<a href="${e}" target="_blank" rel="noopener noreferrer">${e.length > 60 ? e.substring(18, 60) + '...': e.substring(18)}</a> `;
            return;
        }
        if (e.toLowerCase().startsWith("http:")) {
            output += `<a href="${e}" target="_blank" rel="noopener noreferrer">${e.length > 59 ? e.substring(17, 59) + '...': e.substring(17)}</a> `;
            return;
        }
        if (e.toLowerCase().startsWith("www.")) {
            output += `<a href="${e}" target="_blank" rel="noopener noreferrer">${e.length > 46 ? e.substring(4, 46) + '...': e.substring(4)}</a> `;
            return;
        }
        if (phoneRegex.test(e) === true) {
            output += `<a href="tel:${e}">${e}</a> `;
            return;
        }
        output += `${e} `;
    });
	output = output.replaceAll(" <br> ", " <br>");		// remove unnecssary whitespace

	// NEW VARIANT FOR HEADING, BOLD, AND ITALIC
	// output = output.replace(/^# (.+)$/gm, '<h3>$1</h3>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
	
	// FORMAT UNORDERED LIST
	const lines = output.split("<br>");		// output.split(/<br>|<\/h3>/);
	output = "";
	let inList = false;
	let ulStart = "<ul>";
	let ulEnd = "";
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith("- ")) {
			inList = true;
			lines[i] = `${ulStart}<li>${lines[i].substring(2)}</li>`;
			ulStart = "";
		} else {
			if (inList === true) {
				inList = false;
				ulEnd = "</ul>";
				ulStart = "<ul>";
			}
			lines[i] = ulEnd + lines[i] + "<br>";
		}
		output += lines[i];
	}

	// FORMAT HEADING, BOLD, AND ITALIC
    output = output
		.replace(/# (.+?)<br>/g, '<h3>$1</h3>')
		// .replace(/^# (.*$)/gim, '<h3>$1</h3>')
		.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
		.replace(/\*(.*)\*/gim, '<i>$1</i>') + '\n';

    return output;
}

const dateToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return;
    }
    let year = new Date(jsTimestamp).getFullYear();
    let month = new Date(jsTimestamp).getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = new Date(jsTimestamp).getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    if (config.language === 0) {
        return `${year} / ${month} / ${day}`;
    } 
    if (config.language === 1) {
        return `${day}.${month}.${year}`;
    }
};

const dateAndTimeToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return;
    }
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
    let euHour = hour;
    let usHour = hour;
    if (euHour < 10) {
        euHour = `0${euHour}`;
    }
    let ampm = "am";
    if (usHour >= 12) {ampm = "pm"}
    if (usHour > 12) {usHour -= 12}
    /* if (usHour < 10) {usHour = `0${usHour}`} */
    let minute = new Date(jsTimestamp).getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }
    if (config.language === 0) {
        return `${year} / ${month} / ${day} · ${usHour}:${minute} ${ampm}`;
    }
    if (config.language === 1) {
        return `${day}.${month}.${year} · ${euHour}:${minute}`
    }
}

const dateToHtmlString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return;
    }
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

const htmlDateToLocalString = (htmlString) => {
    let year = htmlString.substring(0, 4);
    let month = htmlString.substring(5, 7);
    let day = htmlString.substring(8);
    if (config.language === 0) {
        return `${year} / ${month} / ${day}`;
    }
    if (config.language === 1) {
        return `${day}.${month}.${year}`;
    }
}

const hideAllModals = () => {
    console.log("=> fn hideAllModals triggered");
    document.querySelectorAll(".modal").forEach((element) => {
        element.style.display = "none";
    });
}

const showHome = () => {
    console.log("=> fn showHome triggered");
    hideAllModals();
    console.log("tickets.length from showHome: " + tickets.length);
    if (currentUser.id && tickets.length > 0) {
        renderHeader();
        renderTickets();
    } else if (currentUser.id && tickets.length === 0) {
        renderHeader();
        renderWelcome();
    } else {
        renderIndex();
    }
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150)
}

const renderModalSearch = () => {
	const modalSearch = document.querySelector(".modalSearch");
	if (popUp.style.display === "block") {
		document.querySelector("#inpSearch").value = "";
		popUp.style.display = "none";
	} else {
        if (tickets.length === 0) {
            showAlert(lang("You don't have a list yet.<br>Click on the plus icon to get started.", "Du hast noch keine Liste.<br>Klicke auf das Plus-Zeichen, um zu starten."))
            renderWelcome();
            return;
        }
		popUp.style.display = "block";
		popUp.innerHTML = `
			<p>${lang("Search", "Suche")}</p>
			<hr class="hrHighLight">
			<form>
				<input type="text" id="inpSearch" style="margin-right: 0px">
				<br>
				<figure class="inline-block">
					<img src="assets/cancel.webp" alt="dismiss" id="btnDismissSearch">
					<figcaption>${lang("dismiss", "abbrechen")}</figcaption>
				</figure>
				<figure class="inline-block">
					<img src="assets/search.webp" alt="search" id="btnStartSearch">
					<figcaption>${lang("search", "suchen")}</figcaption>
				</figure>
			</form>
			<hr class="hrHighLight" style="margin-top: 0;">
			<p class="small">${lang("Search includes completed tasks. <br>To search for a date, use this format: <i>2025-12-31</i>", "Es werden auch erledigte Aufgaben durchsucht. <br>Um nach einem Datum zu suchen, nutze bitte folgende Schreibweise: <i>2025-12-31</i>")}</p>
		`;
        const inpSearch = document.querySelector("#inpSearch");
		inpSearch.focus();
        document.querySelector("#btnStartSearch").addEventListener("click", search);
        inpSearch.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                    event.preventDefault();
                    search();
            }
        });
        document.querySelector("#btnDismissSearch").addEventListener("click", () => {
            inpSearch.value = "";
            popUp.innerHTML = "";
            popUp.style.display = "none";
        });
	}
};

const confirmLogOut = () => {
    if (popUp.style.display === "none") {
        popUp.style.display = "block";
        popUp.innerHTML = `
            <h3>${lang("Log out", "Abmelden")}</h3>
            <hr class="hrHighLight">
            <p>${lang("Are you sure you want to log out?", "Willst du dich wirklich abmelden?")}</p>
            <figure onclick="closePopUp()">
                <img src="assets/cancel.webp" title="dismiss">
                <figcaption>${lang("dismiss", "abbrechen")}</figcaption>
            </figure>
            <figure onclick="logout()">
                <img src="assets/power.webp" title="delete account">
                <figcaption>${lang("log out", "abmelden")}</figcaption>
            </figure>
        `;
    } else {
        popUp.innerHTML = "";
        popUp.style.display = "none";
    }
}

/* let safetyCode = "";

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
} */

/* const displayLogin = () => {
    console.log("=> fn displayLogin triggered");
    hideAllModals();
    modalLogin.style.display = "block";
    setTimeout(() => {
        window.scroll(0, 0);
    }, 150);
} */

const getIndex = (ticketId) => {
    console.log("=> fn getIndex triggered");
    return tickets.findIndex((e) => e.id === ticketId);
};

const closeModal = (target) => {
    target.style.display = "none";
}

const moveTop = () => {
    window.scroll(0, 0);
}

const toggleSettings = () => {
	if (popUp.style.display === "block") {
		popUp.style.display = "none";
	} else {
        popUp.innerHTML = `
            <img src="assets/cancel.webp" alt="close settings menu" title="close settings menu" class="btnCloseModal" onclick="closePopUp()">
            <h3>${lang("Settings", "Einstellungen")}</h3>
            <hr class="hrHighLight"><br>
            <div class="settings-grid-container">

                <div class="grid-item">
                    <h4>${lang("Language", "Sprache")}</h4>
                    <figure>
                        <img src="assets/lang_en.webp" alt="English" id="btnEnglish" onclick="toggleLanguage(0)">
                        <figcaption>${lang("English", "englisch")}</figcaption>
                    </figure>
                    <figure>
                        <img src="assets/lang_de.webp" alt="german" id="btnGerman" onclick="toggleLanguage(1)">
                        <figcaption>${lang("German", "deutsch")}</figcaption>
                    </figure>
                </div>

                <div class="appearance grid-item">
                    <h4>${lang("Appearance", "Aussehen")}</h4>
                    <figure>
                        <img src="assets/sun.webp" alt="light mode" id="btnLightMode" onclick="toggleMode('light')">
                        <figcaption>${lang("light", "hell")}</figcaption>
                    </figure>
                    <figure>
                        <img src="assets/moon.webp" alt="dark mode" id="btnDarkMode" onclick="toggleMode('dark')">
                        <figcaption>${lang("dark", "dunkel")}</figcaption>
                    </figure>
                </div>

                <div class="list-type grid-item">
                    <h4>${lang("List type", "Listentyp")}</h4>
                    <figure>
                        <img src="assets/list.webp" alt="table" id="btnTicketList" onclick="renderTable(tickets); toggleSettings()">
                        <figcaption>${lang("table", "Tabelle")}</figcaption>
                    </figure>
                    <figure>
                        <img src="assets/bubbles.webp" alt="bubbles" id="btnBubbleList" onclick="renderBubbles(tickets); toggleSettings()">
                        <figcaption>${lang("bubbles", "Bubbles")}</figcaption>
                    </figure>
                </div>

                <div class="personal-data grid-item">
                    <h4>${lang("Personal data", "Persönliche Daten")}</h4>
                    <figure>
                        <img src="assets/pencil.webp" alt="edit" onclick="renderModalEditPersonalData()">
                        <figcaption>${lang("edit", "bearbeiten")}</figcaption>
                    </figure>
                    <figure>
                        <img src="assets/delete.webp" alt="delete account" onclick="renderModalConfirmDeleteAccount()">
                        <figcaption>${lang("delete", "löschen")}</figcaption>
                    </figure>
                </div>

                <div class="restore-tasks grid-item">
                    <h4>${lang("Completed tasks", "Erledigte Aufgaben")}</h4>
                    <figure>
                        <img src="assets/restore.webp" alt="restore" onclick="displayRestorableTickets()">
                        <figcaption>${lang("restore", "wiederherstellen")}</figcaption>
                    </figure>
                    <figure>
                        <img src="assets/broom.webp" alt="delete old tasks" onclick="displayConfirmDeleteOldTickets()">
                        <figcaption>${lang("delete", "löschen")}</figcaption>
                    </figure>
                </div>

            </div> <!-- settings-grid-container -->
            <br>
            <p class="small">${lang("welcome screen, terms, and imprint", "Willkommensbildschirm, AGB und Impressum")}<a href="#" onclick="showWelcomeScreen()"><br>${lang("show", "anzeigen")}</a></p>
            <hr class="hrHighLight">
            <p class="small">${lang("logged in as: ", "Eingeloggt als: ")}<span id="loggedInInfo"></span></p>
            <hr class="hrHighLight">
            <p class="small"><img src="assets/logo_transp_bg.webp" alt="open ticket logo" id="logo-settings">${lang("version ", "Version ")}<span id="versionInfo"></span></p>
        `;
        popUp.style.display = "block";
        document.querySelector("#loggedInInfo").innerHTML = currentUser.email.at(-1)[2];
        document.querySelector("#versionInfo").innerHTML = version;
        setTimeout(() => {
            window.scroll(0, 0);
        }, 150);
	}
}

const resetSearch = () => {
	document.querySelector("#btnResetSearch").style.display = "none";
	document.querySelector("#btnSearch").style.display = "block";
	resetSortAndFilterButtons();
	// sortedTickets = tickets.filter(element => element);
	renderTickets();
};

window.addEventListener("scroll", () => document.querySelector("#btnMoveTop").style.display = 'block');