const checkLocalStorage = async () => {
    console.log("=> fn checkLocalStorage triggered");
    if (!config.status) {
        console.log("cLS: config.status is undefined");
        modalIndex.style.display = "block";
        header.style.display = "none";
        localStorage.setItem("openTicketConfig", JSON.stringify(config));
        return;
    }
    if (config.status === "logged out") {
        console.log("config.status: " + config.status);
        showHome();
        return;
    }
    if (config.status === "logged in") {
        console.log("config.status: " + config.status);
        console.log("cLS: openTicketConfig exists and user is logged in");
        await quickLogin(config.id);
    }
    config.mode === "light" && toggleMode("light");
}

hideAllModals();
checkLocalStorage();