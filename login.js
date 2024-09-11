const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createAccount = async () => {
    if (emailRegex.test(inpCreateAccountEmail.value) === false) {
        showAlert("email is not correct!");
        return;
    }
    if (inpCreateAccountFirstPassword.value.length < 8) {
        showAlert("password must have a minimum length of 8 characters");
        return;
    }
    if (inpCreateAccountFirstPassword.value != inpCreateAccountFirstConfirmPassword.value) {
        sowAlert("passwords do not match!");
        return;
    }
    let data = {
        id: `user_${Date.now()}_${randomCypher()}`,
        firstName: inpCreateAccountFirstName.value,
        lastName: inpCreateAccountLastName.value,
        email: inpCreateAccountEmail.value,
        password: inpCreateAccountFirstPassword.value
    }
    const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
	const response = await fetch("/api.createAccount", options);
	let status = response.json().status;
  	loggedInUser = await response.json().data;
}
