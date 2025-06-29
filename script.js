const btn = document.querySelector('.talk');
const speakBtn = document.getElementById('speakBtn');
const content = document.querySelector('.content');

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

function greetUser() {
  const hour = new Date().getHours();
  if (hour < 12) {
    speak("Good morning!");
  } else if (hour < 17) {
    speak("Good afternoon!");
  } else {
    speak("Good evening!");
  }
}

window.onload = () => {
  speak("Hello, I am Oracle, your virtual assistant.");
  greetUser();
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    btn.classList.add('active');
    content.textContent = "Listening...";
  };

  recognition.onend = () => {
    btn.classList.remove('active');
  };

  recognition.onerror = (event) => {
    speak("Sorry, I couldn't hear that. Please try again.");
    content.textContent = "Error: " + event.error;
    btn.classList.remove('active');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
  };

  // Start recognition from either button
  btn.addEventListener('click', () => recognition.start());
  speakBtn.addEventListener('click', () => recognition.start());

  function takeCommand(message) {
    if (message.includes('hello') || message.includes('hi')) {
      speak("Hello! How can I help you?");
    } else if (message.includes("open google")) {
      window.open("https://google.com", "_blank");
      speak("Opening Google.");
    } else if (message.includes("open youtube")) {
      window.open("https://youtube.com", "_blank");
      speak("Opening YouTube.");
    } else if (message.includes("open facebook")) {
      window.open("https://facebook.com", "_blank");
      speak("Opening Facebook.");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
      window.open(`https://www.google.com/search?q=${message.replace(/\s/g, "+")}`, "_blank");
      speak("Here is what I found.");
    } else if (message.includes('wikipedia')) {
      const term = message.replace("wikipedia", "").trim();
      window.open(`https://en.wikipedia.org/wiki/${term}`, "_blank");
      speak("Here's what I found on Wikipedia.");
    } else if (message.includes('time')) {
      const time = new Date().toLocaleTimeString();
      speak("The current time is " + time);
    } else if (message.includes('date')) {
      const date = new Date().toLocaleDateString();
      speak("Today's date is " + date);
    } else if (message.includes('calculator')) {
      window.open("https://www.google.com/search?q=calculator", "_blank");
      speak("Opening calculator.");
    } else {
      window.open(`https://www.google.com/search?q=${message.replace(/\s/g, "+")}`, "_blank");
      speak("I searched this for you.");
    }
  }
} else {
  content.textContent = "Speech Recognition is not supported in this browser.";
  speak("Sorry, your browser does not support speech recognition.");
}
