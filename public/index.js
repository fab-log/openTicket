const renderIndex = () => {
	console.log("=> fn renderIndex triggered");
    hideAllModals();
	main.innerHTML = `
		<div class="modalIndex modal">
            <p class="small toggleLanguageOnIndex" onclick="${lang('toggleLanguage(1); renderIndex()', 'toggleLanguage(0); renderIndex()')}">${lang("deutsch", "english")}</p>
            <img src="assets/logo_transp_bg.webp" alt="open ticket logo" class="otLogo"
                style="width: 200px; margin-left: calc(50% - 100px);">
            <hr>
            <div style="max-width: 300px; margin: auto; padding: 15px 0 20px 0;">
                <table style="margin: auto;">
                    <tr>
                        <td>
                            <figure>
                                <img src="assets/createAccount.webp" alt="create account" onclick="renderModalCreateAccount()">
                                <figcaption>${lang("create account", "Account anlegen")}</figcaption>
                            </figure>
                        </td>
                        <td>
                            <figure>
                                <img src="assets/logIn.webp" alt="log in" onclick="renderModalLogin()">
                                <figcaption>${lang("log in", "anmelden")}</figcaption>
                            </figure>
                        </td>
                    </tr>
                </table>
            </div>

            <hr>

            <p><img src="assets/logo_transp_bg.webp" alt="open ticket logo" style="height: 1.7rem; margin: 0 0 -8px -4px;">${lang("helps you organize complex tasks or projects. <br>It's way more than just a todo app!", "hilft dir dabei, komplexe Aufgaben oder Projekte zu organisieren. <br>Viel mehr als nur eine To Do App!")}</p>

            <div class="bubble" style="margin: 48px auto; border: 6px solid hsl(300, 20%, 50%); border-left: 24px solid hsl(300, 20%, 50%); border-right: 24px solid hsl(300, 20%, 50%);" onclick="renderModalCreateAccount()">
                <span class="iconMini"><img src="assets/alarmClock.webp" title="due"  style="animation: flash 6s ease-out infinite; filter: sepia(100%) hue-rotate(270deg) saturate(125%);"> <img src="assets/warning.webp" title="high priority" style="animation: flash 6s ease-in infinite; filter: sepia(100%) hue-rotate(270deg) saturate(125%);"></span>
                <p class="small">${lang("now", "jetzt")}</p>
                <h3 style="color: hsl(300, 20%, 50%);">${lang("Get your own account", "Erstell' dir deinen Account")}</h3>
                <p>${lang("And ease your life!", "Mach's einfach!")}</p>
            </div>
            
            <p>${lang("Take quick notes, add checklists, edit tasks, change coloring, add subtasks, make them urgent. Search for topics, filter by anything, and get your to to lists in the order you need by chosing from numerous sorting options.", "Mach dir eine schnelle Notiz, Erstelle eine Checkliste, bearbeite Aufgaben, wähle Farben, füge Unteraufgaben hinzu oder ändere die Dringlichkeit. Suche nach Themen, filtere wonach du willst und sortiere deine To-Do-Listen nach deinen Bedürfnissen.")}</p>
            <p>${lang("Make it yours!", "Mache es zu deinem!")}</p>
            <p>
                ${lang("Its innovative design and intelligent sorting makes it easy to focus on what is important.", "Mit seinem innovativen Design und einer intelligenten Sortierung ist es ganz einfach, immer das Wichtigste im Blick zu haben.")}
            </p>

            <hr>
            <h3>${lang("Styles", "Styles")}</h3>
            <h4>${lang("Bubbles or table", "Bubbles oder Tabelle")}</h4>
            <p>
                ${lang("The default style displays tasks as bubbles providing a unique and intuitive user experience.", "In der Standardeinstellung werden Aufgaben als Bubbles dargestellt. Ein einzigartiges und intuitives Nutzererlebnis.")}
            </p>
            <img src="${lang("assets/screenshotBubblesEn.png", "assets/screenshotBubblesDe.png")}" alt="screenshot" style="width: 100%; filter: saturate(120%);">
            <p>
                ${lang("You can opt for an alternative style showing the tasks in a table offering sorting and filtering options.", "Du kannst Aufgaben aber auch als Tabelle anzeigen lassen, in der du sortieren und filtern kannst.")}
            </p>
            <img src="${lang("assets/screenshotTableEn.png", "assets/screenshotTableDe.png")}" alt="screenshot" style="width: 100%; filter: saturate(120%);">
            <p>
                ${lang("Pick from different colors to get an individual accent for each task", "Wähle aus verschiedenen Farben, um jeder Aufgabe eine individuelle Note zu verpassen.")}
            </p>
            <img src="assets/coloredBubbles.webp" alt="colored bubbles"
                style="width: 200px; margin-left: calc(50% - 100px); animation: float 6s ease-in-out infinite;">
            <h4>${lang("Dark or light", "Dunkel oder hell")}</h4>
            <p>${lang("Switch to a light mode if that is your favourite.", "Wechsle zum hellen Modus, wenn dir das mehr liegt.")}</p>
            <img src="assets/screenshotTicketLight.png" id="imgDarkLight" alt="screenshot" style="width: 100%;">
            <hr>
            <h3>${lang("In your pocket or at the desk", "In der Hosentasche oder im Büro.")}</h3>
            <p><img src="assets/logo_transp_bg.webp" alt="open ticket logo" style="height: 1.7rem; margin: 0 0 -8px -4px;">${lang("is a web application that runs in your browser. It's independent of the operating system and works on smart phones, tablets, laptops, and personal computers.", "ist eine Webanwendung, die du in deinem Browser aufrufen kannst. Egal in welchem Betriebssystem läuft sie auf Smartphones, Tablets oder am PC.")}</p>
            <p>${lang("A responsive design provides a maximum of functionality on any screen size. Yet, on large screens you get the full set of sorting and filtering options.", "Ihr anpasspassungsfähiges Design lässt sie auf jedem Bildschirm gut aussehen. Den vollen Umfang an Filter- und Sortierungsoptionen bekommst du jedoch auf größeren Bildschirmen.")}</p>
            <hr>
            <h3>${lang("Beta", "Beta-Stadium")}</h3>
            <p>${lang(`This software is in beta stage. There may be bugs or errors. If you encounter an error, feel free to report it on <a href="https://github.com/fab-log/openTicket/issues" target="_blank" rel="noopener noreferrer">github</a>. This helps us improve the app. Try to include as much information as possible, also mentioning the steps you executed before the error occured.`, `Diese Software befindet sich im Beta-Stadium. Fehler oder Unstimmigkeiten können also auftreten. Falls dir ein Fehler auffällt, bist du herzlich eingeladen, ihn auf <a href="https://github.com/fab-log/openTicket/issues" target="_blank" rel="noopener noreferrer">github</a> mitzuteilen. So trägst du zur Verbesserung der App bei. Versuche so viel an Informationen hinzuzufügen wie möglich und erwähne auch was du getan hast unmittelbar bevor der Fehler aufgetreten ist.`)}</p>
            <h3>${lang("Free software", "Freie Software")}</h3>
            <p>${lang(`The source code of this software is freely available on <a href="https://github.com/fab-log/openTicket/tree/main" target="_blank" rel="noopener noreferrer">github</a>. It is puplished under the MIT license which grants unrestricted download, modification, and sharing as long as you refer to the author.`, `Der Quellcode dieser App ist auf <a href="https://github.com/fab-log/openTicket/tree/main" target="_blank" rel="noopener noreferrer">github</a> frei verfügbar. Er wurde unter der MIT-Lizenz veröffentlicht, die es dir erlaubt den Code herunterzuladen, zu verändern und weiterzugeben so lange du den Autor erwähnst.`)}</p>

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
            <p>${lang("Data you provide will be stored in a database on the server. The connection to the server is secured using the HTTPS protocol. Sensitive data is additionally encrypted. No data is stored in another location, nor will any data be analysed or transferred to other parties.<br>To delete your data, you can use the corresponding built-in feature, which can be found in the settings menu of this application.", "Daten die du eingibst, werden in einer Datenbamk auf dem Server gespeichert. Die Verbindung zum Server ist über das https-Protokoll abgesichert. Sensible Daten sind zusätzlich verschlüsselt. Keine Daten werden an anderer Stelle gespeichert, noch werden Daten analysiert oder an andere weitergegeben.<br>Im Einstellungsmenü kannst du Teile oder alle deine Daten löschen.")}</p>

            <hr class="hrHighLight">

        </div>
	`;
    const modalIndex = document.querySelector(".modalIndex");
	modalIndex.style.display = "block";
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}

main.style.display = "block";
// renderIndex();