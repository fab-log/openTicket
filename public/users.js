const modalCreateAccount = document.querySelector(".modalCreateAccount");
const modalLogin = document.querySelector(".modalLogin");
const modalConfirmLogout = document.querySelector(".modalConfirmLogout");
const modalConfirmDeleteOldTickets = document.querySelector(".modalConfirmDeleteOldTickets");
const modalWarningDeleteAccount = document.querySelector(".modalWarningDeleteAccount");

const termsEn = `
    <h2 id="terms">Terms of Use</h2>
    <p>This software comes 'as is' without any guarantees regarding its functionality.</p>
    <p>The purpose of the application is for private use to store tasks, checklists, and notes.</p>
    <h3>Privacy</h3>
    <p><b>Very simple.</b></p>
    <ul>
        <li>No advertising.</li>
        <li>No trackers.</li>
        <li>No preconnect. <small>(download of third party content)</small></li>
    </ul>    
    <p>Data you provide will be stored in a database on the server. The connection to the server is secured using the HTTPS protocol. Sensitive data is additionally protected by encryption. No data is stored in another location, nor will any data be analysed or transferred to other parties.<br>
    To delete your data, you can use the corresponding built-in feature, which can be found in the settings menu of this application.</p>
    <h3>Imprint</h3>
    <p>Responsible person for this site:<br>
    Fabian Ruin</p>    
    <p>contact:<br>
    info[æ]fablog.eu</p>
`;

const termsDe = `
    <h2 id="terms">Nutzungsbedingungen</h2>
    <p>Diese Software wird in ihrem derzeitigen Zustand ohne jegliche Garantien bezüglich der Funktionalität bereitgestellt.</p>
    <p>Zweck der Applikation ist die private Nutzung zum Speichern von Aufgaben, Checklisten und Notizen.</p>
    <h3>Datenschutz</h3>
    <p><b>Ganz einfach.</b></p>
    <ul>
        <li>Keine Werbung.</li>
        <li>Keine Tracker.</li>
        <li>Kein preconnect. <small>(Download von Drittanbieter-Inhalten)</small></li>
    </ul>    
    <p>Daten, die Sie angeben, werden in einer Datenbank auf dem Server gespeichert. Die Verbindung zum Server ist mithilfe des https-Protokolls abgesichert. Sensible Daten werden zusätzlich verschlüsselt. Es werden keine Daten an anderer Stelle gespeichert, weitergegeben oder analysiert.<br>
    Um Ihre Daten zu löschen, nutzen Sie die entsprechende Funktionalität innerhalb der App, die Sie in den Einstellunge finden.</p>
    <h3>Impressum</h3>
    <p>Verantwortliche Person:<br>
    Fabian Ruin</p>    
    <p>Kontakt:<br>
    info[æ]fablog.eu</p>
`;

let connectedUsers = [];

const confirmAccount = async (email, input, config) => {
    console.log("=> fn confirmAccount triggered");
    startLoader();
    const data = {
        email,
        input,
        config
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.confirmEmail", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
        console.log("=> status confirmAccount:");
		console.log({ status });
		if (status != "OK") {
			showAlert(status);
			return;
		}
		currentUser = serverResponse.data;
		closePopUp();
		applyConfig();
	} catch (error) {
		showAlert(lang("An error occurred during login", "Bei der Anmeldung ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
	}
}

const verifyEmail = (email) => {
    console.log("=> fn verifyEmail triggered");
    /* <p>
        <input type="checkbox" id="inpVerifyAllowFullscreen">
        <label for="inpVerifyAllowFullscreen">${lang('Allow fullscreen mode (recommended for smartphones)', 'Vollbild-Modus erlauben (empfohlen für Smartphones)')}</label>
    </p> */
    showPopUp();
    popUp.innerHTML = `
        <form>
            <div style="text-align: left;">
                <h3>${lang('Confirm Email', 'E-Mail-Adresse bestätigen')}</h3>
                <h4>${lang("Please do not close this tab until the registration is confirmed!", "Bitte schließe diesen Tab nicht bis die Registrierung abgeschlossen ist!")}</h4>
                <hr>
                <p>
                    <input type="checkbox" id="inpVerifyEmailRememberMe">
                    <label for="inpVerifyEmailRememberMe">${lang('Remember me in this browser on this device', 'In diesem Browser auf diesem Gerät angemeldet bleiben')}</label>
                </p>
                <p>
                    <input type="checkbox" id="inpVerifyEmailAgreeTerms">
                    <label for="inpVerifyEmailAgreeTerms">${lang('Agree with the terms of service and privacy (mandatory)', 'Den Nutzungs- und Datenschutzrichtlinien zustimmen (notwendig)')}</label>
                </p>
                <button type="button" id="btnToggleTerms">${lang('show/hide terms', 'AGB ein-/ausblenden')}</button>
            </div>
            <div id="divTerms" style="text-align: left;"></div>
            <hr>
            <p>${lang('Please enter the verification code that has been sent to your email address.', 'Bitte gib den Prüfcode ein, der an deine E-Mail-Adresse geschickt wurde.')}</p>
            <input type="number" placeholder="${lang('verfication code', 'Prüfcode')}" id="inpEmailVerificationCode" max="1000000">
            <hr>
            <button type="button" onclick="closePopUp()">${lang('dismiss', 'abbrechen')}</button>
            <button type="submit" id="btnSubmitEmailVerificationCode">${lang('confirm account', 'Konto bestätigen')}</button>
        </form>
        <div class="camouflage"></div>
    `;
    const inpVerifyEmailRememberMe = document.querySelector("#inpVerifyEmailRememberMe");
    const inpVerifyEmailAgreeTerms = document.querySelector("#inpVerifyEmailAgreeTerms");
    const btnSubmitEmailVerificationCode = document.querySelector("#btnSubmitEmailVerificationCode");
    const btnToggleTerms = document.querySelector("#btnToggleTerms");
    const divTerms = document.querySelector("#divTerms");
    divTerms.classList.remove("slide-open");
    btnToggleTerms.addEventListener("click", () => {
        if (divTerms.style.display === "block") {
            divTerms.style.display = "none";
        } else {
            divTerms.style.display = "block";
            divTerms.innerHTML = lang(termsEn, termsDe);
        }
    });
    btnSubmitEmailVerificationCode.addEventListener("click", async (event) => {
        event.preventDefault();
        const input = document.querySelector("#inpEmailVerificationCode").value.trim();
        if (input === "") {
            showAlert(lang('no input', 'Eingabe fehlt'));
            return;
        }
        if (input.length < 6) {
            showAlert(lang('input not complete<br>(6 digits required)', 'Eingabe zu kurz<br>(6 Ziffern benötigt)'));
            return;
        }
        if (input.length > 6) {
            showAlert(lang('input too long<br>(6 digits required)', 'Eingabe zu lang<br>(6 Ziffern benötigt)'));
            return;
        }
        if (!inpVerifyEmailAgreeTerms.checked) {
            showAlert(lang('You need to agree to the terms of service to continue', 'Zustimmung zu den Nutzungs- und Datenschutzrichtlinien fehlt.'));
            return;
        }
        inpVerifyEmailRememberMe.checked ? config.rememberMe = true : config.rememberMe = false;
        confirmAccount(email, input, config);
    });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createAccount = async (event) => {
    console.log("=> fn createAccount triggered");
    event.preventDefault();
	const inpCreateAccountFirstName = document.querySelector("#inpCreateAccountFirstName");
	const inpCreateAccountLastName = document.querySelector("#inpCreateAccountLastName");
	const inpCreateAccountEmail = document.querySelector("#inpCreateAccountEmail");
	const inpCreateAccountPassword = document.querySelector("#inpCreateAccountPassword");
	const inpCreateAccountConfirmPassword = document.querySelector("#inpCreateAccountConfirmPassword");
	
    if (inpCreateAccountFirstName.value === "" || inpCreateAccountLastName.value === "" || inpCreateAccountEmail.value === "" || inpCreateAccountConfirmPassword.value === "") {
        showAlert(lang("please fill all mandatory fields", "Bitte alle Pflichtfelder ausfüllen"));
        return;
    }
    if (emailRegex.test(inpCreateAccountEmail.value) === false) {
        showAlert(lang("email has invalid format!", "E-Mail-Adresse hat kein gültiges Format"));
        return;
    }
    if (inpCreateAccountPassword.value.length < 8) {
        inpCreateAccountPassword.value = "";
        showAlert(lang("password must have a minimum length of 8 characters", "Das Passwort muss aus mindestens 8 Zeichen bestehen"));
        return;
    }
    if (inpCreateAccountPassword.value.includes(" ")) {
        inpCreateAccountPassword.value = "";
        showAlert(lang("password must not contain spaces", "Das Passwort darf keine Leerzeichen enthalten"));
        return;
    }
    if (inpCreateAccountPassword.value.length > 100) {
        inpCreateAccountPassword.value = "";
        showAlert(lang("password too long", "Passwort zu lang"));
        return;
    }
    if (inpCreateAccountPassword.value != inpCreateAccountConfirmPassword.value) {
        inpCreateAccountPassword.value = "";
        inpCreateAccountConfirmPassword.value = "";
        showAlert(lang("passwords do not match!", "Die Passwörter stimmen nicht überein"));
        return;
    }
    startLoader();
    const id = `user_${Date.now()}_${randomCyphers(10)}`;
    const data = {
        id,
        password: inpCreateAccountPassword.value,
        config: {
            mode: "dark",
            listType: "bubbles",
            language: config.language
        },
        active: [[Date.now(), id, true]],
        firstName: [[Date.now(), id, sanitize(inpCreateAccountFirstName.value.trim().substring(0, 100))]],
        lastName: [[Date.now(), id, sanitize(inpCreateAccountLastName.value.trim().substring(0, 100))]],
        email: [[Date.now(), id, inpCreateAccountEmail.value.trim().substring(0, 100)]]
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.createAccount", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
        console.log("=> status createAccount:");
		console.log({ status });
		if (status != "OK") {
			showAlert(status);
			return;
		}
		verifyEmail(data.email.at(-1)[2]);
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
	}
}

const renderModalCreateAccount = () => {
    console.log("=> fn renderModalCreateAccount triggered");
    showPopUp();
    popUp.innerHTML = `
        <div class="text-align-center">
            <img src="assets/createAccount.webp" alt="icon person" class="logo-wide">
            <h3>${lang("Create Account", "Benutzerkonto anlegen")}</h3>
            <hr>
            <form id="frmCreateAccount">
                <input type="text" id="inpCreateAccountFirstName" placeholder="${lang("first name *", "Vorname *")}" maxlength="100"><br>
                <input type="text" id="inpCreateAccountLastName" placeholder="${lang("last name *", "Nachname *")}" maxlength="100"><br>
                <input type="email" id="inpCreateAccountEmail" placeholder="${lang("email *", "E-Mail-Adresse *")}" maxlength="100"><br>
                <input type="password" id="inpCreateAccountPassword" placeholder="${lang("password *", "Passwort *")}" maxlength="100"><br>
                <input type="password" id="inpCreateAccountConfirmPassword" placeholder="${lang("confirm password *", "Passwort wiederholen *")}" maxlength="100"><br>
                <p class="small">${lang("* mandatory", "* Pflichtfelder")}
                <hr>
                <button type="button" onclick="closePopUp()">${lang("dismiss", "abbrechen")}</button>
                <button type="submit" onclick="createAccount(event)">${lang("create account", "Konto anlegen")}</button>
            </form>
            <div class="camouflage"></div>
        </div>
    `;
    document.querySelector("#inpCreateAccountFirstName").focus();
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}

/* const homeItems = document.querySelectorAll(".home-item");
const closeHome = () => {
    homeItems.forEach(e => {
        e.style.display = "none";
    });
} */

const login = async (event) => {
    console.log("=> fn login triggered");
    console.time("login");
    event.preventDefault();
    const frmLogin = document.querySelector("#frmLogin");
    const inpLoginEmail = document.querySelector("#inpLoginEmail");
    const inpLoginPassword = document.querySelector("#inpLoginPassword");
    const inpLoginRememberMe = document.querySelector("#inpLoginRememberMe");
    inpLoginRememberMe.checked ? config.rememberMe = true : config.rememberMe = false;
    if (emailRegex.test(inpLoginEmail.value) === false) {
        showAlert(lang("email format is not correct", "E-Mail-Format ist nicht korrekt"));
        return;
    }
    if (inpLoginEmail.value === "" || inpLoginPassword.value === "") {
        showAlert(lang("please fill all fields", "Bitte alle Felder ausfüllen"));
        return;
    }
    startLoader();
    const data = {
        email: inpLoginEmail.value,
        password: inpLoginPassword.value,
        rememberMe : config.rememberMe
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.login", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
        console.log("=> status login:");
		console.log({ status });
		if (status !== "OK") {
			showAlert(status);
			frmLogin.reset();
			return;
		}
		currentUser = serverResponse.data;
		console.log({ currentUser });
		if (inpLoginRememberMe.checked) {
			localStorageObject = {
				id: currentUser.id,
				rememberMe: true
			}
			localStorage.setItem("openTicketConfig", JSON.stringify(localStorageObject));
		}
		frmLogin.reset();
		closePopUp();
		applyConfig();
        getTickets(currentUser.id);
		
	} catch (error) {
		showAlert(lang("An error occurred during login", "Ein Fehler ist beim Anmelden aufgetreten"));
		console.error("Fetch error:", error);
		return;
	} finally {
		stopLoader();
        console.timeEnd("login");
	}
}

const forgotPassword = async (event) => {
    event.preventDefault();
    console.log("=> fn forgotPassword triggered");
    console.time("forgotPassword");
    const inpLoginEmail = document.querySelector("#inpLoginEmail");
    if (inpLoginEmail.value === "") {
        showAlert(lang("Please fill the email field", "Gib bitte eine E-Mail-Adresse an"));
        return;
    }
    startLoader();
    const data = {
        email: inpLoginEmail.value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.forgotPassword", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
        console.log("=> status forgotPassword:");
		console.log({ status });
		if (serverResponse.status != "OK") {
			showAlert(status);
			frmLogin.reset();
			return;
		}
		showAlert(lang("Your password has been reset.<br>Please check your emails.", "Dein Passwort wurde zurückgesetzt.<br>Bitte überprüfe deine E-Mails."), 10000);
		frmLogin.reset();
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
		console.timeEnd("forgotPassword");
	}
}

const renderModalLogin = () => {
    console.log("=> fn renderModalLogin triggered");
    showPopUp();
    popUp.innerHTML = `
    <div class="text-align-center">
        <img src="assets/logIn.webp" alt="icon person" class="logo-wide">
        <h3>${lang("Log in", "Anmelden")}</h3>
        <hr>
        <form id="frmLogin">
            <input type="email" id="inpLoginEmail" placeholder="${lang("email *", "E-Mail-Adresse *")}" maxlength="100"><br>
            <input type="password" id="inpLoginPassword" placeholder="${lang("password *", "Passwort *")}" maxlength="100">
            <p><input type="checkbox" id="inpLoginRememberMe"><label for="inpLoginRememberMe">${lang('Remember me in this browser on this device', 'In diesem Browser auf diesem Gerät angemeldet bleiben')}</p>
            <hr>
            <button type="button" onclick="closePopUp()">${lang("dismiss", "abbrechen")}</button>
            <button type="submit" onclick="login(event)">${lang("log in", "anmelden")}</button><br><br>
            <p class="small"><a href="" onclick="forgotPassword(event)">${lang("I forgot my password", "Ich habe mein Passwort vergessen")}</a></p>
        </form>
        <div class="camouflage"></div>
    </div>
    `;
    const inpLoginEmail = document.querySelector("#inpLoginEmail");
    inpLoginEmail.focus();
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}

const quickLogin = async (id) => {
    console.log("=> fn quickLogin triggered");
    console.time("quickLogin");
    startLoader();
    const data = {
        id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.quickLogin", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
		if (status != "OK") {
			showAlert(status);
			return;
		}
        console.log("=> status quickLogin:");
		console.log({ status });
		currentUser = serverResponse.data;
		console.log({ currentUser });
		applyConfig();
        getTickets(currentUser.id);
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
        console.timeEnd("quickLogin");
	}
}

/* const getUser = async () => {
    console.log("=> fn getUser triggered");
    console.time("getUser");
    const data = {
        id: currentUser.id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.getUser", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
        console.log("=> getUser");
		console.log({ status });
		// stopLoader();
		if (status != "OK") {
			showAlert(status);
			console.timeEnd("getUser");
			return;
		}
		currentUser = serverResponse.data;
		console.log({ currentUser });
		console.timeEnd("getUser");		
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	}
} */

const logout = () => {
    console.log("=> fn logout triggered");
    localStorageObject = {};
    localStorage.setItem("openTicketConfig", JSON.stringify(localStorageObject));
    currentUser = {};
    window.location.reload();
}

const editPersonalData = async (event) => {
    console.log("=> fn editPersonalData triggered");
    console.time("editPersonalData");
    event.preventDefault();

    const inpEditPersonalDataFirstName = document.querySelector("#inpEditPersonalDataFirstName");
    const inpEditPersonalDataLastName = document.querySelector("#inpEditPersonalDataLastName");
    const inpEditPersonalDataEmail = document.querySelector("#inpEditPersonalDataEmail");
    const inpEditPersonalDataOldPassword = document.querySelector("#inpEditPersonalDataOldPassword");
    const inpEditPersonalDataNewPassword = document.querySelector("#inpEditPersonalDataNewPassword");
    const inpEditPersonalDataConfirmPassword = document.querySelector("#inpEditPersonalDataConfirmPassword");
    const inpEditPersonalDataRememberMe = document.querySelector("#inpEditPersonalDataRememberMe");

    if (inpEditPersonalDataFirstName.value === currentUser.firstName.at(-1)[2] 
    && inpEditPersonalDataLastName.value === currentUser.lastName.at(-1)[2] 
    && inpEditPersonalDataEmail.value === currentUser.email.at(-1)[2] 
    && inpEditPersonalDataRememberMe.checked === currentUser.config.rememberMe 
    && inpEditPersonalDataNewPassword.value === "") {
        showAlert(lang("No changes made!", "Keine Änderungen vorgenommen!"));
        return;
    }
    if (emailRegex.test(inpEditPersonalDataEmail.value) === false) {
        showAlert(lang("email has invalid format!", "E-Mail-Adresse hat kein gültiges Format"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataNewPassword.value.length < 8) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("password must have a minimum length of 8 characters", "Das Passwort muss aus mindestens 8 Zeichen bestehen"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataNewPassword.value.includes(" ")) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("password must not contain spaces", "Das Passwort darf keine Leerzeichen enthalten"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataNewPassword.value.length > 100) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("password too long", "Passwort zu lang"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != inpEditPersonalDataConfirmPassword.value) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("passwords do not match!", "Die Passwörter stimmen nicht überein"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataOldPassword === "") {
        showAlert(lang("please fill the old password field", "Bitte auch das alte Passwort angeben"));
        inpEditPersonalDataOldPassword.focus();
        return;
    }

    startLoader();

    let data = {};
    let clonedCurrentUser = JSON.parse(JSON.stringify(currentUser));

    if (inpEditPersonalDataFirstName.value != clonedCurrentUser.firstName.at(-1)[2]) {
        clonedCurrentUser.firstName.push([Date.now(), clonedCurrentUser.id, sanitize(inpEditPersonalDataFirstName.value)])
    }
    if (inpEditPersonalDataLastName.value != clonedCurrentUser.lastName.at(-1)[2]) {
        clonedCurrentUser.lastName.push([Date.now(), clonedCurrentUser.id, sanitize(inpEditPersonalDataLastName.value)])
    }
    if (inpEditPersonalDataEmail.value != clonedCurrentUser.email.at(-1)[2]) {
        clonedCurrentUser.email.push([Date.now(), clonedCurrentUser.id, inpEditPersonalDataEmail.value])
    }
    clonedCurrentUser.config.rememberMe = inpEditPersonalDataRememberMe.checked;

    if (inpEditPersonalDataNewPassword.value != "") {
        data.oldPassword = inpEditPersonalDataOldPassword.value;
        data.newPassword = inpEditPersonalDataNewPassword.value
    }
    data.user = clonedCurrentUser;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.editPersonalData", options);
		const serverResponse = await response.json();
		if (serverResponse.status != "OK") {
			showAlert(serverResponse.status);
			inpEditPersonalDataOldPassword.value = "";
			inpEditPersonalDataNewPassword.value = "";
			inpEditPersonalDataConfirmPassword.value = "";
			return;
		}
		// if (serverResponse.alert) { showAlert(serverResponse.alert) };
		currentUser = serverResponse.data;
        showAlert(lang("changes applied", "Änderungen wurden gespeichert"));
		applyConfig();
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
		console.timeEnd("editPersonalData");
	}
}

const updateUserSilent = async () => {
    console.log("=> fn updateUserSilent triggered");
    console.time("updateUserSilent");
    const data = currentUser;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.updateUserSilent", options);
		const serverResponse = await response.json();
		if (serverResponse.status != "OK") {
			showAlert(serverResponse.status);
			return;
		}
		currentUser = serverResponse.data;
		// applyConfig();
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
		console.timeEnd("updateUserSilent");
	}
}

const renderModalEditPersonalData = () => {
    console.log("=> fn renderModalEditPersonalData triggered");
    showPopUp();
    // hideHeaderIcons();
    popUp.innerHTML = `
        <img src="assets/cancel.webp" alt="close" title="close" class="btnCloseModal" onclick="closePopUp()">
        <h3>${lang("Edit Personal Data", "Persönliche Daten ändern")}</h3>
        <hr class="hrHighLight">
        <form id="frmEditPersonalData">
            <input type="text" id="inpEditPersonalDataFirstName" placeholder="${lang("first name", "Vorname")}" maxlength="100"><br>
            <input type="text" id="inpEditPersonalDataLastName" placeholder="${lang("last name", "Nachname")}" maxlength="100"><br>
            <input type="email" id="inpEditPersonalDataEmail" placeholder="${lang("email", "E-Mail-Adresse")}" maxlength="100">*<br>
            <p class="small">${lang('* In case you change your email address here, you will need to use the new email address for logging in', '* Wenn du deine E-Mail-Adresse hier änderst, musst du dich ab jetzt mit der neuen E-Mail-Adresse anmelden.')}</p>
            <hr>
            <h4>${lang('Change Password', 'Passwort ändern')}</h4>
            <input type="password" id="inpEditPersonalDataOldPassword" placeholder="${lang("old password", "Altes Passwort")}" maxlength="100"><br><br>
            <input type="password" id="inpEditPersonalDataNewPassword" placeholder="${lang("new password", "Neues Passwort")}" maxlength="100"><br>
            <input type="password" id="inpEditPersonalDataConfirmPassword" placeholder="${lang("confirm new password", "Neues Passwort bestätigen")}" maxlength="100"><br>
            <hr>
            <h4>${lang("Permissions", "Berechtigungen")}</h4>
            <p>
                <input type="checkbox" id="inpEditPersonalDataRememberMe">
                <label for="inpEditPersonalDataRememberMe">${lang('Remember me in this browser', 'In diesem Browser angemeldet bleiben')}</label>
            </p>
            <hr>
            <button type="button" onclick="closePopUp()">${lang("dismiss", "abbrechen")}</button>
            <button type="submit" onclick="editPersonalData(event)">${lang("submit", "ändern")}</button>
        </form>
        <div class="camouflage"></div>
    `;
    document.querySelector("#inpEditPersonalDataFirstName").value = currentUser.firstName.at(-1)[2];
    document.querySelector("#inpEditPersonalDataLastName").value = currentUser.lastName.at(-1)[2];
    document.querySelector("#inpEditPersonalDataEmail").value = currentUser.email.at(-1)[2];
    document.querySelector("#inpEditPersonalDataRememberMe").checked = currentUser.config.rememberMe;
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}

const deleteAccount = async (event) => {
    console.log("=> fn deleteAccount triggered");
    event.preventDefault();
    const inpConfirmDeleteAccountPassword = document.querySelector("#inpConfirmDeleteAccountPassword");
    if (inpConfirmDeleteAccountPassword.value === "") {
        showAlert(lang("please enter your password", "Bitte gib dein Passwort ein"));
        return;
    }
    startLoader();
    const data = {
        id: currentUser.id,
        password: inpConfirmDeleteAccountPassword.value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.deleteAccount", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
		if (status != "OK") {
			inpConfirmDeleteAccountPassword.value = "";
			showAlert(status);
			return;
		}
		showAlert(lang("account successfully deleted", "Konto erfolgreich gelöscht"));
        console.log("=> status deleteAccount:");
        console.log({ status });
		console.log("account deleted: " + serverResponse.id);
		closePopUp();
		logout();
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	} finally {
		stopLoader();
	}
}

const renderModalConfirmDeleteAccount = () => {
    showPopUp();
    popUp.innerHTML = `
        <img src="assets/cancel.webp" alt="close" class="btnCloseModal" onclick="closePopUp()">
        <div class="menu-heading">
			<img src="assets/warning.webp" alt="warning">
            <h3 style="color: var(--accent-red); text-decoration: underline;">${lang('Warning!', 'Warnung!')}</h3>
        </div>
        <p>${lang('This will entirely and permanently delete your account without the possibility to restore it.', 'Das wird dein Nutzerkonto gänzlich und dauerhaft löschen ohne eine Möglichkeit es wiederherzustellen.')}</p>
        <form>
            <input type="password" id="inpConfirmDeleteAccountPassword" placeholder="${lang('password', 'Passwort')}" maxlength="100">
            <p>${lang('Please enter your password to confirm the deletion of your account.', 'Bitte gib dein Passwort ein, um die Löschung deines Kontos zu bestätigen.')}</p>
            <hr>
            <button type="button" onclick="closePopUp()">${lang("dismiss", "abbrechen")}</button>
            <button type="submit" onclick="deleteAccount(event)" style="background-color: var(--accent-red)">${lang("delete account", "Konto löschen")}</button>
        </form>
    `;
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}

/* const getConnectedUsers = async () => {
    console.log("=> fn getConnectedUsers triggered");
    console.time("getConnectedUsers");
    // let chatPartners = currentUser.chatPartners;
    // if (chatPartners.length === 0) return;
    const data = {
        id: currentUser.id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
	try {
		const response = await fetch("/openTicket.getConnectedUsers", options);
		const serverResponse = await response.json();
		const status = serverResponse.status;
		if (status != "OK") {
			showAlert(status);
			console.timeEnd("getConnectedUsers");
			return;
		}
		console.log({ status });
		connectedUsers = serverResponse.data;
		console.timeEnd("getConnectedUsers");
	} catch (error) {
		showAlert(lang("An error occurred", "Es ist ein Fehler aufgetreten"));
		console.error("Fetch error: ", error);
		return;
	}
} */

const checkLocalStorage = () => {
    console.log("=> fn checkLocalStorage triggered");
    const openTicketConfig = localStorage.getItem("openTicketConfig") ? JSON.parse(localStorage.getItem("openTicketConfig")) : {};
    if (openTicketConfig.id) {
        quickLogin(openTicketConfig.id)
    } else {
        showHome();
    }
}

const applyConfig = () => {
    console.log("=> fn applyConfig triggered");

    if (currentUser.config.mode != config.mode) {
        toggleMode(currentUser.config.mode, "applyConfig");
        config.mode = currentUser.config.mode;
    }

    if (currentUser.config.language != config.language) {
        toggleLanguage(currentUser.config.language, "applyConfig");
        config.language = currentUser.config.language;
    }

    if (currentUser.config.rememberMe === true) {
        localStorageObject = {
            id: currentUser.id,
            rememberMe: true
        };
        localStorage.setItem("openTicketConfig", JSON.stringify(localStorageObject));
    } else if (currentUser.config.rememberMe === false) {
        localStorageObject = {};
        localStorage.setItem("openTicketConfig", JSON.stringify(localStorageObject));
    }

    // showHome();
    
    config = { ...currentUser.config };    // must stay in last line!
}

checkLocalStorage();