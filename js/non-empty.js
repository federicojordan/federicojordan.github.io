function formIsValid() {
    return formInputIsValid("name") && formInputIsValid("email") && formInputIsValid("message")
}

function formInputIsValid(inputName) {
    var input = document.forms["contact-form"][inputName];
    if(input.value == "") {
        input.style.borderColor = "red";
        return false;
    } else {
        input.style.borderColor = "lightgray";
        return true;
    }
}