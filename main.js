// hiding
document.getElementById("to-type-container").style.display = 'none';
document.getElementById("keyboard").style.display = 'none';
document.querySelector("h1").style.display = 'none';

var inputType;
var curInput = '';
var curLine = 0;

var inputCount = 0;
var inputTimer;
var accuracy = 0;
var LPM = 0;
var accuracySum = 0;
var LPMSum = 0;

var displayInput = '';

const alphabetCapsLock = "QWERTYUIOPASDFGHJKLZXCVBNM";
const keyShift = {
	"`": "~",
	"1": "!",
	"2": "@",
	"3": "#",
	"4": "$",
	"5": "%",
	"6": "^",
	"7": "&",
	"8": "*",
	"9": "(",
	"0": ")",
	"-": "_",
	"=": "+",
	"[": "{",
	"]": "}",
	";": ":",
	"'": "\"",
	",": "<",
	".": ">",
	"/": "?"
}
var keyShiftRe = {}
for (let k of Object.keys(keyShift)) {
	keyShiftRe[keyShift[k]] = k;
}

const keyboardKeys = [
	["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
	["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "Enter1"],
	["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "\\1", "Enter2"],
	["LShift", "\\2", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "RShift"],
	["LCtrl", "LWin", "Alt", "Space-bar", "Alt Gr", "RWin", "Menu", "RCtrl"]
]
const pinky = "QAZP[;'/";
const ring = "WSXOL.";
const middle = "EDCIK,";
const lpointer = "FRVTBG";
const rpointer = "JUMHYN";

var isCapsLocked = true;
var keyboardDiv = document.getElementById("keyboard");
for (let keyline of keyboardKeys) {
	let line = document.createElement("div");
	line.className = "keys-line";
	for (let k of keyline) {
		let keySpan = document.createElement("span");
		keySpan.textContent = k;
		keySpan.setAttribute("id", k);
		if (k == "\\1" || k == "\\2") {
			keySpan.style.backgroundColor = "#f88";
		} else if (pinky.includes(k)) {
			keySpan.style.backgroundColor = "#f88";
		} else if (ring.includes(k)) {
			keySpan.style.backgroundColor = "#f8f";
		} else if (middle.includes(k)) {
			keySpan.style.backgroundColor = "lightgreen";
		} else if (lpointer.includes(k)) {
			keySpan.style.backgroundColor = "#88f";
		} else if (rpointer.includes(k)) {
			keySpan.style.backgroundColor = "cyan";
		}
		line.appendChild(keySpan);
	}
	keyboardDiv.appendChild(line);
}
document.getElementById("Backspace").innerHTML = `<img src="svg icons/backspace_black_24dp.svg">`;
document.getElementById("Space-bar").innerHTML = `<img src="svg icons/space_bar_black_24dp.svg">`;
document.getElementById("Menu").innerHTML = `<img src="svg icons/menu_black_24dp.svg">`;
document.getElementById("Enter1").innerHTML = `<img src="svg icons/keyboard_return_black_24dp.svg">`;
document.getElementById("Enter2").innerHTML = `<img src="svg icons/keyboard_return_black_24dp.svg">`;
document.getElementById("Tab").innerHTML = `<img src="svg icons/keyboard_tab_black_24dp.svg">`;
document.getElementById("CapsLock").innerHTML = `<img src="svg icons/keyboard_capslock_black_24dp.svg">`;
document.getElementById("LWin").innerHTML = `<img src="svg icons/window_black_24dp.svg">`;
document.getElementById("RWin").innerHTML = `<img src="svg icons/window_black_24dp.svg">`;
document.getElementById("Alt Gr").textContent = "";
document.getElementById("Alt").textContent = "";
document.getElementById("LShift").textContent = "Shift";
document.getElementById("RShift").textContent = "Shift";
document.getElementById("LCtrl").textContent = "Ctrl";
document.getElementById("RCtrl").textContent = "Ctrl";
document.getElementById("\\1").textContent = "\\";
document.getElementById("\\2").textContent = "\\";

isCapsLocked = false;
capsLock()

const pressKeys = "`1234567890-=qwertyuiop[]asdfghjkl;\'\\zxcvbnm,./";
const pressKeysShift = "~!@#$%^&*()_+{}:\"|<>?";

function startApp() {
	document.addEventListener("keydown", (e) => {
		if (pressKeys.includes(e.key.toLowerCase()) || pressKeysShift.includes(e.key.toLowerCase())) {
			if (e.shiftKey && !alphabetCapsLock.includes(e.key)) {
				document.getElementById(keyShiftRe[e.key]).classList.add("pressed");
			} else {
				if (e.key == '\\') {
					document.getElementById("\\1").classList.add("pressed");
					document.getElementById("\\2").classList.add("pressed");
				} else {
					document.getElementById(e.key.toUpperCase()).classList.add("pressed");
				}
			}

			if (isCapsLocked) {
				curInput += e.key;
			} else {
				curInput += e.key.toLowerCase();
			}
			updateInput()

		} else {
			switch (e.key) {
				case "CapsLock":
					document.getElementById("CapsLock").classList.add("pressed");
					break;
				case "Shift":
					document.getElementById("LShift").classList.add("pressed");
					document.getElementById("RShift").classList.add("pressed");
					isCapsLocked = true;
					shiftPressed()
					capsLock()
					break;
				case "Backspace":
					if (curInput.length > 0) {
						curInput = curInput.slice(0, curInput.length - 1);
						document.getElementById("Backspace").classList.add("pressed");
						updateInput();
					}
					break;
				case "Enter":
					document.getElementById("Enter1").classList.add("pressed");
					document.getElementById("Enter2").classList.add("pressed");
					readInputLine();
					break;
				case "Tab":
					e.preventDefault();
					document.getElementById("Tab").classList.add("pressed");
					curInput += "    ";
					updateInput()
					break;
				case " ":
					document.getElementById("Space-bar").classList.add("pressed");
					curInput += " ";
					updateInput()
					break;
			}
		}
	})

	document.addEventListener("keyup", (e) => {
		if (pressKeys.includes(e.key.toLowerCase()) || pressKeysShift.includes(e.key.toLowerCase())) {
			if (e.shiftKey && !alphabetCapsLock.includes(e.key)) {
				document.getElementById(keyShiftRe[e.key]).classList.remove("pressed");
			} else {
				if (e.key == '\\') {
					document.getElementById("\\1").classList.remove("pressed");
					document.getElementById("\\2").classList.remove("pressed");
				} else {
					document.getElementById(e.key.toUpperCase()).classList.remove("pressed");
				}
			}

		} else {
			switch (e.key) {
				case "CapsLock":
					isCapsLocked = !isCapsLocked;
					capsLock();
					document.getElementById("CapsLock").classList.remove("pressed");
					break;

				case "Shift":
					shiftPressed(false)
					isCapsLocked = false;
					capsLock()
					document.getElementById("LShift").classList.remove("pressed");
					document.getElementById("RShift").classList.remove("pressed");
					break;
				case "Backspace":
					document.getElementById("Backspace").classList.remove("pressed");
					break;
				case "Enter":
					document.getElementById("Enter1").classList.remove("pressed");
					document.getElementById("Enter2").classList.remove("pressed");
					break;
				case "Tab":
					document.getElementById("Tab").classList.remove("pressed");
					break;
				case " ":
					document.getElementById("Space-bar").classList.remove("pressed");
					break;
			}
		}
	})

	document.getElementById("config").style.display = 'none';
	document.querySelector("h1").style.display = '';
	document.getElementById("to-type-container").style.display = '';
	if (document.getElementById("show-keyboard").checked) {
		document.getElementById("keyboard").style.display = '';
	}
	correctInput = ' ';
	curLine = 999;
	inputTimer = Date.now();
	inputType = document.querySelector("select").value;
	readInputLine();
}

function shiftPressed(shiftDown = true) {
	if (shiftDown) {
		for (let k of Object.keys(keyShift)) {
			document.getElementById(k).textContent = keyShift[k];
		}

		document.getElementById("\\1").textContent = "|";
		document.getElementById("\\2").textContent = "|";
	} else {
		for (let k of Object.keys(keyShift)) {
			document.getElementById(k).textContent = k;
		}

		document.getElementById("\\1").textContent = "\\";
		document.getElementById("\\2").textContent = "\\";
	}

}

function capsLock() {
	if (!isCapsLocked) {
		for (let k of alphabetCapsLock) {
			document.getElementById(k).textContent = k.toLowerCase();
		}
	} else {
		for (let k of alphabetCapsLock) {
			document.getElementById(k).textContent = k;
		}
	}
}

function updateInput() {
	// UPDATE EACH PARAGRAPH
	if (curLine >= correctInput.split("\n").length) {
		readInputLine()
		return;
	}
	if (curInput.length >= correctInput.split("\n")[curLine].length) {
		readInputLine();
		return;
	}
	for (let i in document.getElementById("to-type").children) {
		let spanChild = document.getElementById("to-type").children[i];
		if (i >= curInput.length) {
			spanChild.className = '';
		} else if (spanChild.textContent == curInput[i]) {
			spanChild.className = "correct";
		} else {
			spanChild.className = "incorrect";
		}
		document.getElementById("to-type").children[i] = spanChild;
	}
	document.getElementById("to-type").children[curInput.length].className = "current";
}

async function readInputLine() {
	curLine++;
	if (curLine < correctInput.split("\n").length) {
		inputCount++;
		calculatePerformance()
		inputTimer = Date.now();
	} else {
		if (inputType == "Basic") {
			correctInput = generateParagraph();
		} else {
			correctInput = await generateSnippet()
		}
		curLine = 0;
	}
	curInput = '';
	console.log(correctInput);

	for (var curLineIndex = 0, lineIndex = 0; lineIndex < correctInput.split("\n").slice(0, curLine).length; curLineIndex++, lineIndex++) {
		curLineIndex += correctInput.split("\n")[lineIndex].length;
	};

	if (curLine + 2 >= correctInput.split("\n").length) {
		displayInput = correctInput.slice(curLineIndex, correctInput.length);
	} else {
		displayInput = correctInput.slice(curLineIndex, Math.min(
			curLineIndex +
			correctInput.split("\n")[curLine].length + 1 +
			correctInput.split("\n")[curLine + 1].length + 1 +
			correctInput.split("\n")[curLine + 2].length,
			correctInput.length));
	}

	document.getElementById("to-type").innerHTML = '';
	let newHTML = '';
	for (let c of displayInput) {
		if (c == '\n') {
			newHTML += "<br>"
			continue;
		}
		newHTML += `<span>${cleanHTML(c)}</span>`;
	}
	document.getElementById("to-type").innerHTML = newHTML;
	updateInput();
}

function cleanHTML(htmlcode) {
	let d = document.createElement("div");
	d.textContent = htmlcode;
	return d.innerHTML;
}

async function generateSnippet() {
	let snippet = 'cout << "Hello, world.";\nreturn 0;';
	await fetch('https://codebeautify.org/api/random')
		.then(response => response.json())
		.then(data => snippet = data.code)
		.catch(error => {
			console.error(error)
		});
	return snippet;
}

function generateParagraph() {
	let par = '';
	for (let i = 0; i < 6; i++) {
		par += generateSentence() + '\n';
	}
	return par.slice(0, par.length - 1);
}

function generateSentence() {
	let gen = '';
	const basicKeys = "asdfjkl;";
	for (let i = 0; i < 30; i++) {
		if (Math.random() > 0.5) {
			gen += alphabetCapsLock[parseInt(Math.random() * alphabetCapsLock.length)].toLowerCase();
		} else if (Math.random() < 0.4 && !["", " "].includes(gen[gen.length - 1]) && gen != '' && i + 1 < 30) {
			gen += ' ';
		} else {
			gen += basicKeys[parseInt(Math.random() * basicKeys.length)];
		}
	}
	return gen;
}

function calculatePerformance() {
	let passedMinutes = ((Date.now() - inputTimer) / 1000) / 60;
	accuracySum += document.querySelectorAll("span.correct").length / correctInput.split('\n')[curLine].length;
	accuracy = (accuracySum * 100) / inputCount;
	LPMSum += curInput.length / passedMinutes;
	LPM = LPMSum / inputCount;

	document.getElementById("speed").textContent = Math.floor(LPM);
	document.getElementById("accuracy").textContent = Math.floor(accuracy);
}

