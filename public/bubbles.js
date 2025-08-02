// const bubble = document.querySelectorAll(".bubble");

const renderBubbles = (listArray) => {
	console.log("=> fn renderBubbles triggered");
    if (listArray.length === 0) {
        showAlert(lang("You don't have a list yet.<br>Click on the plus icon to get started.", "Du hast noch keine Liste.<br>Klicke auf das Plus-Zeichen, um zu starten."))
        renderWelcome();
        return;
    }
	main.innerHTML = `<div class="modalBubbles modal"></div>`;
	const modalBubbles = document.querySelector(".modalBubbles");
    const offsetWidth = modalBubbles.offsetWidth;
    // currentTicket = {};
	hideAllModals();
    document.querySelector("#btnStartBubbles").style.display = "none";
    document.querySelector("#btnStartTable").style.display = "block";
    if (config.listType != "bubbles") {
        currentUser.config.listType = "bubbles";
        updateUserSilent();
    }
    config.listType = "bubbles";

    modalBubbles.style.display = "grid";
    modalBubbles.innerHTML = "";
    for (let i = 0; i < listArray.length; i++) {
        let ticketId = listArray[i].id;
        if (listArray[i].prio.at(-1)[2] != -1) {
            let factor = 1;
            if (offsetWidth >= 1502) {
                factor = 3;
            } else if (offsetWidth >= 876) {
                factor = 2;
            } else if (offsetWidth < 876) {
                factor = 1;
            }
            let marginLeft = Math.floor(Math.random() * (offsetWidth / factor - 360));
            let marginTop = Math.floor(Math.random() * 50);

            let title = listArray[i].title.at(-1)[2];
            if (title.length > 20) {
                title = title.substring(0, 20) + " ...";
            }
            let description = listArray[i].description.at(-1)[2];
            if (description.length > 30) {
                description = description.substring(0, 22) + " ...";
            }
            let index = typeMap.findIndex(e => e[0] === listArray[i].type.at(-1)[2]);

            let warningPrio = "";
            let randomTime = Math.random() * 4 + 6;
            let correctedHue = listArray[i].bubbleHue.at(-1)[2] - 30;
            if (listArray[i].prio.at(-1)[2] > 1) {
                warningPrio = `<span class="iconMini"><img src="assets/warning.webp" title="${lang('high priority', 'Hohe Dringlichkeit')}" style="animation: flash ${randomTime}s ease-in infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);"></span>`;
            }

            let warningDue = "";
            if (
                listArray[i].dueDate.at(-1)[2] <= dateToHtmlString(Date.now()) &&
                listArray[i].dueDate.at(-1)[2] != ""
            ) {
                warningDue = `<img src="assets/alarmClock.webp" title="${lang('due', 'überfällig')}"  style="animation: flash ${randomTime}s ease-out infinite; filter: sepia(100%) hue-rotate(${correctedHue}deg) saturate(125%);">`;
            }
            let infoString = "";
            if (listArray[i].dueDate.at(-1)[2] != "") {
                infoString = `<p class="small">${lang("due ", "fällig ")}${htmlDateToLocalString(listArray[i].dueDate.at(-1)[2])}`
            }

            modalBubbles.insertAdjacentHTML("beforeend",
                `
                    <div class="grid-element">
                        <div class="bubble" id="bubble_${ticketId}" style="margin-top: ${marginTop}px; margin-left: ${marginLeft}px; border: 6px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness}); border-left: 24px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness}); border-right: 24px solid hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness});">
                            <span class="iconMini"><img src="${typeMap[index][1]}" alt="task" title="${typeMapTranslations[index][config.language]}" style="opacity: 0.5;"></span>
                            <span class="iconMini">${warningDue} </span> ${warningPrio}
                            <h3 style="color: hsl(${listArray[i].bubbleHue.at(-1)[2]}, 20%, ${accentColorBrightness});">${title}</h3>
                            <p>${description}</p>
                        </div>
                    </div>
                `
            );
            // formerly included (after border styling): 
            // <p class="small">${dateAndTimeToString(listArray[i].date.at(-1)[2])}</p>
            // and after 'description': ${infoString}
            
            let currentBubble = document.querySelector(`#bubble_${listArray[i].id}`);
            currentBubble.addEventListener("click", () => {
                displayTicket(ticketId);
            });
        }
    }
    setTimeout(() => {
        window.scroll(0, 0);
        document.querySelector("#btnMoveTop").style.display = 'none';
    }, 150);
}