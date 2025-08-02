const loader = document.querySelector("#loader");
loader.innerHTML = `
    <p id="loader-text">${lang("loading ...", "lädt ...")}</p>
    <img src="assets/loaderBubble.webp" alt="loading">
`;

const startLoader = () => {
    console.log("=> fn startLoader triggered");
    loader.style.display = "block";
}

const stopLoader = () => {
    console.log("=> fn stopLoader triggered");
    loader.style.display = "none";
}
