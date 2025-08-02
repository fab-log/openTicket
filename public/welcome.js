const renderWelcome = () => {
	console.log("=> fn renderWelcome triggered");
	main.innerHTML = `
		<div class="modalWelcome modal">
            <h3 style="color: var(--color3)">
                <img src="assets/logo_transp_bg.webp" alt="open ticket logo" class="otLogo" style="box-shadow: none; width: 200px;">
            </h3>            
            <hr class="hrHighLight">
            <h3>${lang("Hello ", "Hallo ")}<span id="welcomeName">${currentUser.firstName.at(-1)[2]}</span></h3>
            <p>${lang("Start by adding your first task.", "Beginne, indem du deine erste Aufgabe hinzufügst.")}</p>
            <p>${lang("It's as easy as this.", "Ist ganz einfach!")}</p>
            ${lang(`<img src="assets/manual_en.webp" alt="short manual">`, `<img src="assets/manual_de.webp" alt="Kurzanleitung">`)}<br>

            <div class="text-align-left">
                <p>${lang("You won't see all these options at the same time. Unnecessary buttons are hidden when not needed.", "Du wirst diese Buttons nicht alle auf einmal sehen. Die unnötigen werden ausgeblendet.")}</p>
                <p>${lang(`To get back to this page, go to settings and pick <i>"welcome screen"</i>.`, `Um auf diese Seite zurückzukommen, klicke einfach in den Einstellungen auf <i>"Willkommensbildschirm"</i>.`)}</p>
                <hr>
                <h3>${lang("In app navigation", "In-App-Navigation")}</h3>
                <p>${lang("To navigate within the app, click or tap the menu buttons only. Don't use the browser's 'go back' function or any gestures to move back and forth, as they will make you leave the app.", "Um innerhalb der App zu navigieren, nutze nur die App-Buttons. Klicke nicht auf den Zurück-Button deines Browsers und nutze keine entsprechenden Gesten, da du sonst die App verlässt.")}</p>
                <p>${lang("Reloading the page triggers a logout unless you checked the 'remember me' checkbox.", "Wenn du die Seite neu lädtst, wirst du ausgeloggt, es sei denn du hast 'eingeloggt bleiben' gewählt.")}</p>
                <hr>
                <h3>${lang("Beta", "Beta-Stadium")}</h3>
                <p>${lang(`This software is in beta stage. There may be bugs or errors. If you encounter an error, feel free to report it on <a href="https://github.com/fab-log/openTicket/issues" target="_blank" rel="noopener noreferrer">github</a>. This helps us improve the app. Try to include as much information as possible, also mentioning the steps you executed before the error occured.`, `Diese Software befindet sich im Beta-Stadium. Fehler oder Unstimmigkeiten können also auftreten. Falls dir ein Fehler auffällt, bist du herzlich eingeladen, ihn auf <a href="https://github.com/fab-log/openTicket/issues" target="_blank" rel="noopener noreferrer">github</a> mitzuteilen. So trägst du zur Verbesserung der App bei. Versuche so viel an Informationen hinzuzufügen wie möglich und erwähne auch was du getan hast unmittelbar bevor der Fehler aufgetreten ist.`)}</p>
				<h3>${lang("Free software", "Freie Software")}</h3>
				<p>${lang(`The source code of this software is freely available on <a href="https://github.com/fab-log/openTicket/tree/main" target="_blank" rel="noopener noreferrer">github</a>. It is puplished under the MIT license which grants unrestricted download, modification, and sharing as long as you refer to the author.`, `Der Quellcode dieser App ist auf <a href="https://github.com/fab-log/openTicket/tree/main" target="_blank" rel="noopener noreferrer">github</a> frei verfügbar. Er wurde unter der MIT-Lizenz veröffentlicht, die es dir erlaubt den Code herunterzuladen, zu verändern und weiterzugeben so lange du den Autor erwähnst.`)}</p>

				<hr>

				<h3>${lang("Terms of Use", "Nutzungsbedingungen")}</h3>
				<p>${lang("This software comes 'as is' without any guarantees regarding its functionality.", "Diese Software wird in ihrem derzeitigen Zustand ohne jegliche Garantien bezüglich der Funktionalität bereitgestellt.")}</p>
				<p>${lang("The purpose of the application is for private use to store tasks, checklists, and notes.", "Zweck der Applikation ist die private Nutzung zum Speichern von Aufgaben, Checklisten und Notizen.")}</p>

				<hr>
				
				<h3>${lang("Imprint", "Impressum")}</h3>
				<p>${lang("Responsible person for this site:", "Verantwortliche Person:")}<br>
				Fabian Ruin</p>    
				<p>${lang("contact", "Kontakt")}:<br>
				info[æ]fablog.eu</p>    
				
				<hr>
				
				<h3>${lang("Privacy", "Datenschutz")}</h3>    
				<p><b>${lang("Very simple.", "Ganz einfach.")}</b></p>
				<ul>
					<li>${lang("No advertising.", "Keine Werbung.")}</li>
					<li>${lang("No trackers.", "Keine Tracker.")}</li>
					<li>${lang("No preconnect. <small>(download of third party content)</small>", "Kein Preconnect <small>(Herunterladen von Drittanbieterinhalten)</small>")}</li>
				</ul>    
				<p>${lang("Data you provide will be stored in a database on the server. The connection to the server is secured using the HTTPS protocol. Sensitive data is additionally encrypted. No data is stored in another location, nor will any data be transferred to other parties.<br>To delete your data, you can use the corresponding built-in feature, which can be found in the settings menu of this application.", "Daten die du eingibst, werden in einer Datenbamk auf dem Server gespeichert. Die Verbindung zum Server ist über das https-Protokoll abgesichert. Sensible Daten sind zusätzlich verschlüsselt. Keine Daten werden an anderer Stelle gespeichert, noch werden Daten an andere weitergegeben.<br>Im Einstellungsmenü kannst du Teile oder alle deine Daten löschen.")}</p>

				<hr class="hrHighLight">
            </div>
        </div>
	`;
	/* const modals = document.querySelectorAll(".modal");
	modals.forEach(e => e.style.display = "block"); */
	const modalWelcome = document.querySelector(".modalWelcome");
	modalWelcome.style.display = "block";
	const btnStartBubbles = document.querySelector("#btnStartBubbles");
	const btnStartTable = document.querySelector("#btnStartTable");
	if (currentUser.config.listType === "bubbles") {
		btnStartBubbles.style.display = "block";
		btnStartTable.style.display = "none";
	} else {
		btnStartBubbles.style.display = "none";
		btnStartTable.style.display = "block";
	}
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}