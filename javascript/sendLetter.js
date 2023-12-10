let validateAndSend = true;

function addClass() {
    document.body.classList.add("sent");
}

const textAreas = document.getElementsByClassName("textArea");
const sendLetter = document.getElementById("sendLetter");

function handleLetter() {
    for (let i = 0; i < textAreas.length; i++) {
        if (textAreas[i].value.trim() === "") {
            validateAndSend = false;
            break;
        } else {
            validateAndSend = true;
        }
    }
}

sendLetter.addEventListener("click", function() {
    handleLetter();

    if (validateAndSend) {
        addClass();
    }
  })
