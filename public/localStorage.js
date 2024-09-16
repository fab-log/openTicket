const checkLocalStorage = async () => {
    console.log("=> fn checkLocalStorage triggered");
    if (localStorage.getItem("openTicketConfig") === null || localStorage.getItem("openTicketConfig") === undefined || localStorage.getItem("openTicketConfig") === "{}") {     // if openTicketConfig does not exist
        // showHome();
        modalIndex.style.display = "block";
        config = {};
        config.listType = "bubbles";
        config.mode = "dark";
        localStorage.setItem("openTicketConfig", JSON.stringify(config));
        return;
    } else {                                        // if openTicketConfig exists
        tempConfig = JSON.parse(localStorage.getItem("openTicketConfig"));
        console.log({ tempConfig });
        if (tempConfig.status != "logged in") {     // if user is not logged in
            modalIndex.style.display = "block";
            return;
        }
        if (tempConfig.status === "logged in") {    // if user is logged in
            // await getTickets(tempConfig.id);
            await quickLogin(tempConfig.id);
            tempConfig.listType === "table" ? config.listType = "table" : config.listType = "bubbles";
            tempConfig.mode === "light" ? toggleMode("light") : toggleMode("dark");
            config = tempConfig;
            console.log({ config });
        }
    }    
}

hideAllModals();
checkLocalStorage();