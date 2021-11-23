// ++++++++++++++++++++++++++++++ SPEECH ++++++++++++++++++++++++++++++++++ //
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var numbers = [ '1' , '2' , '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '45', '46', '47', '48'];
var grammar = '#JSGF V1.0; grammar numbers; public <color> = ' + numbers.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
// recognition.continuous = false;
recognition.lang = 'en-US';
//// recognition.lang = 'fr-FR';
//// use voice selected by menu
var voiceSelectMenu = document.getElementById('RVoices-select').innerHTML;
console.log(voiceSelectMenu);
var voiceSelectMenuDialect = voiceSelectMenu.substring(0,5);
recognition.lang = voiceSelectMenuDialect;
console.log(voiceSelectMenuDialect);
console.log(voiceSelectMenuDialect.length);

recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

var colorHTML= '';
numbers.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
hints.innerHTML = 'Please fill in the "Operator" and "Number" fields, then click "Listen".';

function recognitionStart() {
  recognition.start();
  console.log('Ready to receive a number.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var valueXstudent = event.results[0][0].transcript;
  diagnostic.textContent = valueXstudent;
  bg.style.backgroundColor = valueXstudent;
  console.log('Confidence: ' + event.results[0][0].confidence);

  // ++++++++++++++++++++++++++++++ Math ++++++++++++++++++++++++++++++++++ //
  document.getElementById("IDvalueXstudentBig").innerHTML = valueXstudent;
  var operatorZteacher1 = document.getElementById('IDoperatorZteacher1').value;
  var valueZteacher1 = parseFloat(validate(document.getElementById("IDvalueZteacher1").value.trim()));
  var resultYrobot1 = operate1(valueXstudent, valueZteacher1, operatorZteacher1);

  var operatorZteacher2 = document.getElementById('IDoperatorZteacher2').value;
  var valueZteacher2 = parseFloat(validate(document.getElementById("IDvalueZteacher2").value.trim()));
  var resultYrobot1and2 = operate2(resultYrobot1, valueZteacher2, operatorZteacher2);

  var resultYrobot1and2Round = parseFloat(resultYrobot1and2).toFixed(2);
  //// verwijder .00 en .?0
  //// var a=strng.replace(/.00\s*$/, "");
  var resultYrobot1and2Rounder = Math.round(((resultYrobot1and2Round * resultYrobot1and2Round) / resultYrobot1and2Round) * 100.) / 100.;
  document.getElementById("IDresultYrobotBig").innerHTML = resultYrobot1and2Rounder;
  document.getElementById("IDtextInput").innerHTML = resultYrobot1and2Rounder;

  //// console.log('line 51', valueXstudent);
  //// console.log('line 58', resultYrobot1and2Round);
  
  //// RESPONSIVE VOICE
  //// responsiveVoice.speak("hello world", "UK English Male", {pitch: 2, rate: 1.5, volume: 1, onstart: StartCallback, onend: EndCallback});
setTimeout(responsiveVoice.speak(resultYrobot1and2Rounder),1500);
//// if(responsiveVoice.voiceSupport()) {
////  responsiveVoice.speak("Yiha world");
  //// responsiveVoice.speak(resultYrobot1and2Rounder, "UK English Male", {volume: 1});
////  }
  //// RESPONSIVE VOICE
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that number.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}

// ++++++++++++++++++++++++++++++ Math ++++++++++++++++++++++++++++++++++ //
// + before value is a way to convert a string to a number https://stackoverflow.com/questions/8377410/addition-is-not-working-in-javascript //
function operate1(valueXstudent, valueZteacher1, operatorZteacher1) {
  if (operatorZteacher1 == 'choose1') {
    alert("You must choose a first operator!");
  } else if (operatorZteacher1 == 'addition1') {
    return +valueXstudent + +valueZteacher1;
  } else if (operatorZteacher1 == 'subtraction1') {
    return +valueXstudent - +valueZteacher1;
  } else if (operatorZteacher1 == 'division1') {
    return +valueXstudent / +valueZteacher1;
  } else if (operatorZteacher1 == 'multiplication1') {
    return +valueXstudent * +valueZteacher1;
  }
}
////
function operate2(resultYrobot1, valueZteacher2, operatorZteacher2) {
  if (operatorZteacher2 == 'choose2') {
    alert("You must choose a second operator!");
  } else if (operatorZteacher2 == 'addition2') {
    return +resultYrobot1 + +valueZteacher2;
  } else if (operatorZteacher2 == 'subtraction2') {
    return +resultYrobot1 - +valueZteacher2;
  }
}

function validate(value) {
  if (value == null || value == "") {
    alert("Required Field");
    return 0;
  } else if (isNaN(value)) {
    alert("Must be a Number");
    return 0;
  } else return value;
}

//// RESPONSIVE VOICE
  // 1. initialize new SpeechSynthesisUtterance object
  let tts = new SpeechSynthesisUtterance();

  // 2. Setting the Speech Language
  tts.lang = "en";

  // 3. Populating the select dropdown with the list of available voices on Web Speech API
  // 3.1 global array of available voices
  let speechvoices = [];
  window.speechSynthesis.onvoiceschanged = () => {
  // 3.2 To get the list of voices using getVoices() function
  speechvoices = window.speechSynthesis.getVoices();
  // 3.3 We need to populate the section and set the first voice
  tts.voice = speechvoices[0];

  let select_voice = document.getElementById("RVoices-select");
  speechvoices.forEach((voice, i) => (select_voice.options[i] = new Option(voice.name, i)));
  // 3.4 This changes the voice of the speaker or utterance to the selected voice
  document.getDocumentById("RVoices-select").addEventListener("change", () => {
  tts.voice = voices[document.getDocumentById("RVoices-select").value];
  });
};

// 4. set Default Rate & Pitch example
responsiveVoice.setDefaultRate(0.8);
//// responsiveVoice.setDefaultPitch(1.0);


// 5. BEGIN TEST SENTENCE
if(responsiveVoice.voiceSupport()) {
  responsiveVoice.speak("Hello, i am Nautilius, the first iteration from Robot Math");
  responsiveVoice.clickEvent();
}

//SETTING THE CONTROLS - SPEAK, PLAY, PAUSE AND RESUME
//SPEAK
//first we get the value of the textarea or document
//// document.getElementById("ButtonSpeak").addEventListener("click", () => {
////   tts.text = document.getElementById("IDtextInput").value;
//then we implement the speechsynthesis instance
////   window.speechSynthesis.speak(tts);
//// });
//// document.getElementById("IDresultYrobotBig").addEventListener("change", () => {
////   tts.text = document.getElementById("IDresultYrobotBig").value;
//then we implement the speechsynthesis instance
////   window.speechSynthesis.speak(tts);
//// });
//// setTimeout(function(){
////  speak();
////  }, 4000); // Wait x seconds
document.getElementById("ButtonSpeak").onclick = function () {
  responsiveVoice.speak(document.getElementById("IDtextInput").textContent);
};
//PAUSE
//// document.getElementById("pause").addEventListener("click", () => {
// Pause the speechSynthesis instance
////   window.speechSynthesis.pause();
//// });

//RESUME
//// document.getElementById("resume").addEventListener("click", () => {
// Resume the paused speechSynthesis instance
////   window.speechSynthesis.resume();
//// });

//CANCEL
//// document.querySelector("ButtonStop").addEventListener("click", () => {
document.getElementById("ButtonStop").addEventListener("click", () => {
  // Cancel the speechSynthesis instance
  window.speechSynthesis.cancel();
});

//TO SET THE VOLUME, PITCH, AND RATE
//Volume
//We get the volume value from the input
document.getDocumentById("volume").addEventListener("input", () => {
  const vol = document.getDocumentById("volume").value;
  // Set volume property of the SpeechSynthesisUtterance instance
  tts.volume = vol;
  // Updating the volume label
  document.querySelector("#vol-label").innerHTML = vol;
});

//RATE
// We get the rate Value from the input
document.getDocumentById("rate").addEventListener("input", () => {
  const rate = document.getDocumentById("rate").value;
  // Set rate property of the SpeechSynthesisUtterance instance
  tts.rate = rate;
  // Updating the rate label
  document.getDocumentById("rate-lab").innerHTML = rate;
});

//PITCH
// We get the pitch Value from the input
document.getElementById("pitch").addEventListener("input", () => {
  const pitch = document.getElementById("pitch").value;
  // Setting thepitch property of the SpeechSynthesisUtterance instance
  tts.pitch = pitch;
  // Updating the pitch label
  document.getDocumentById("pitch-lab").innerHTML = pitch;
});

//// RESPONSIVE VOICE
