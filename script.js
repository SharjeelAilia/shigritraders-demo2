
// Typing animation for hero section
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroButton = document.querySelector('.hero .btn-primary');

const titleText = "Empowering Communities with Solar Energy";
const subtitleText = "Join us in creating a sustainable future through advanced solar solutions that provide clean, reliable energy for all.";

let titleIndex = 0;
let subtitleIndex = 0;

function typeTitle() {
  if (titleIndex < titleText.length) {
    heroTitle.textContent = titleText.substring(0, titleIndex + 1);
    titleIndex++;
    setTimeout(typeTitle, 50);
  } else {
    // Start typing subtitle after title is complete
    setTimeout(typeSubtitle, 300);
  }
}

function typeSubtitle() {
  if (subtitleIndex < subtitleText.length) {
    heroSubtitle.textContent = subtitleText.substring(0, subtitleIndex + 1);
    subtitleIndex++;
    setTimeout(typeSubtitle, 30);
  } else {
    // Show button after subtitle is complete
    setTimeout(() => {
      heroButton.classList.add('show-btn');
    }, 300);
  }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
  setTimeout(typeTitle, 500);
});

// Logo click to scroll to top
document.getElementById('logo-btn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Sections fade in
const sections = document.querySelectorAll('section, .hero');
const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); }); }, { threshold: 0.2 });
sections.forEach(section => observer.observe(section));

// Smooth scroll + Call Us glove effect
document.querySelectorAll('nav ul li a, .btn-primary, .cta a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (link.classList.contains('call')) {
      const phone = document.getElementById('phone-number');
      phone.style.transition = 'all 0.3s ease';
      phone.style.color = '#34a853';
      phone.style.textShadow = '0 0 10px #34a853, 0 0 20px #34a853';
      setTimeout(() => { phone.style.color = ''; phone.style.textShadow = ''; }, 5000);
    }
  });
});

// Navbar shrink
window.addEventListener('scroll', () => { document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 50); });

// Hero image
const hero = document.querySelector('.hero');
hero.style.backgroundImage = `url(${hero.dataset.heroImg})`;

// --- PRODUCT SECTIONS (Always visible - no accordion) ---
// Products are now always displayed without toggle functionality
// const productHeaders = document.querySelectorAll('.product-category-title');
// productHeaders.forEach(header => {
//   header.addEventListener('click', () => {
//     header.classList.toggle('active');
//     const content = header.nextElementSibling;
//     if (content.classList.contains('open')) {
//       content.style.maxHeight = null;
//       content.classList.remove('open');
//     } else {
//       content.classList.add('open');
//       content.style.maxHeight = content.scrollHeight + "px";
//     }
//   });
// });

// --- FAQ ACCORDION ANIMATION LOGIC (EXCLUSIVE: Only one can be open) ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(clickedItem => {
  const header = clickedItem.querySelector('h4');
  const content = clickedItem.querySelector('p');

  header.addEventListener('click', () => {
    const wasActive = clickedItem.classList.contains('faq-active'); // Check current state

    // 1. Close all other open items
    faqItems.forEach(otherItem => {
      if (otherItem !== clickedItem && otherItem.classList.contains('faq-active')) {
        otherItem.classList.remove('faq-active');
        otherItem.querySelector('p').style.maxHeight = null;
      }
    });

    // 2. Toggle the clicked item (open if it was closed, close if it was open)
    if (wasActive) {
      // If it was active, close it
      clickedItem.classList.remove('faq-active');
      content.style.maxHeight = null;
    } else {
      // If it was closed, open it
      clickedItem.classList.add('faq-active');
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// --- MOBILE MENU TOGGLE ---
const navElement = document.querySelector('nav');
const navLinks = document.getElementById('nav-links');

// Create and append the menu toggle button dynamically
const menuToggle = document.createElement('div');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
menuToggle.id = 'menu-toggle';

const ctaSection = navElement.querySelector('.cta');
navElement.insertBefore(menuToggle, ctaSection);

// Add click listener
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  // Change icon for better UX
  const icon = menuToggle.querySelector('i');
  if (navLinks.classList.contains('show')) {
    icon.classList.replace('fa-bars', 'fa-times');
  } else {
    icon.classList.replace('fa-times', 'fa-bars');
  }
});

// Close menu when a link is clicked
document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('show');
      document.getElementById('menu-toggle').querySelector('i').classList.replace('fa-times', 'fa-bars');
    }
  });
});

// ***** START CHAT WIDGET JAVASCRIPT LOGIC (NEW, RESTRUCTURED) *****

// --- 1. DEFINITIONS ---
const chatBox = document.getElementById('chat-box');
const chatButton = document.getElementById('chat-icon-button');
const messagesContainer = document.getElementById('chat-messages');
const inputField = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const quickQuestionsDiv = document.getElementById('quick-questions');

let currentContext = null; // Stores the current level in the menu hierarchy

// --- 2. HIERARCHICAL Q&A DATA STRUCTURE ---
const chatData = {
  // ROOT LEVEL
  welcome: {
    message: "Hello! I'm your virtual assistant. How can I assist you today? Please choose a topic below.",
    options: [
      { text: "Products Info", target: "products" },
      { text: "Services & Installation", target: "services" },
      { text: "General FAQs", target: "faq" },
      { text: "Contact & Location", target: "contact" }
    ]
  },

  // LEVEL 1: TOPICS
  products: {
    message: "Which brand are you interested in?",
    options: [
      { text: "FOXESS Products", target: "foxess" },
      { text: "Volttra Products", target: "volttra" }
    ],
    parent: "welcome"
  },
  services: {
    message: "What kind of service information do you need?",
    options: [
      { text: "Installation Process", target: "install_process" },
      { text: "Maintenance & Warranty", target: "warranty" },
      { text: "System Design Consultation", target: "consultation" }
    ],
    parent: "welcome"
  },
  faq: {
    message: "Here are some common questions:",
    options: [
      { text: "What is Net Metering?", answer: "Net metering is an agreement that allows customers to get credit for the electricity they generate in excess of what they use. It significantly lowers your electricity bill." },
      { text: "How long does installation take?", answer: "A typical residential solar system installation takes 3 to 5 days, depending on the system size and site complexity, once all equipment is onsite." },
      { text: "Why choose Shigri Traders?", answer: "We are the exclusive distributors for FOXESS in Pakistan, offering premium quality, certified expertise, and comprehensive after-sales support." }
    ],
    parent: "welcome"
  },
  contact: {
    message: "How would you like to get in touch?",
    options: [
      { text: "Show Address", answer: "Our address is: 3 Commercial Area KB Colony, New Airport Rd, Cantt, 54000 Lahore. You can view it on the map in the Contact section." },
      { text: "Get Phone Number", answer: "You can call us directly at: +92 340 5173065 (Monday - Saturday, 9:00 AM - 6:00 PM)." },
      { text: "Email Inquiry", answer: "Please send your detailed inquiry to: info@shigritraders.com" }
    ],
    parent: "welcome"
  },

  // LEVEL 2: PRODUCTS
  foxess: {
    message: "What FOXESS product category interests you?",
    options: [
      { text: "Inverters (Hybrid/AC)", target: "foxess_inverters" },
      { text: "Energy Storage Batteries", target: "foxess_batteries" }
    ],
    parent: "products"
  },
  volttra: {
    message: "What Volttra product category interests you?",
    options: [
      { text: "Inverters (FALCON Series)", target: "volttra_inverters" },
      { text: "Energy Storage Batteries", target: "volttra_batteries" }
    ],
    parent: "products"
  },

  // LEVEL 3: PRODUCT DETAILS (FOXESS)
  foxess_inverters: {
    message: "FOXESS offers Hybrid and AC Inverters from 3kW up to 136kW for residential and commercial projects. Do you need details on single-phase or three-phase?",
    options: [
      { text: "H1-AC1 (Single-Phase)", answer: "The H1-AC1 is a high-efficiency single-phase hybrid/AC inverter, ideal for residential systems. It supports high-voltage battery connection." },
      { text: "H3-Pro (Three-Phase)", answer: "The H3-Pro is a powerful three-phase hybrid inverter (10-30kW) perfect for larger homes and commercial sites, offering parallel operation and large storage capacity." }
    ],
    parent: "foxess"
  },
  foxess_batteries: {
    message: "FOXESS high-voltage modular batteries are safe and scalable:",
    options: [
      { text: "EP 5 / EP 11 Series", answer: "Modular, high-performance battery systems with storage capacities up to 41.6 kWh, allowing for maximum flexibility." },
      { text: "HV2600 Module", answer: "A scalable high-voltage battery module for easy plug-and-play installation, supporting up to 20.48 kWh total capacity." }
    ],
    parent: "foxess"
  },

  // LEVEL 3: PRODUCT DETAILS (VOLTTRA)
  volttra_inverters: {
    message: "Volttra's FALCON series offers robust power solutions:",
    options: [
      { text: "FALCON 10 kW", answer: "The FALCON 10kW is a high-efficiency hybrid inverter supporting AC coupling, three-phase, and multi-machine parallel operation for industrial and large home use." },
      { text: "FALCON 8 kW", answer: "The FALCON 8kW is an advanced power conversion system with similar capabilities, known for its reliability and smart load management features." }
    ],
    parent: "volttra"
  },
  volttra_batteries: {
    message: "Volttra batteries are engineered for long life and superior performance. They are compatible with the FALCON series inverters for a complete energy storage solution.",
    options: [], // No further submenu, just an answer
    parent: "volttra"
  },

  // LEVEL 3: SERVICE DETAILS
  install_process: {
    message: "Our installation process is fully certified and includes site assessment, system design, physical installation, and final grid synchronization.",
    options: [],
    parent: "services"
  },
  warranty: {
    message: "FOXESS products typically come with a 10-year warranty for inverters and batteries. We also offer annual maintenance plans to protect your investment.",
    options: [],
    parent: "services"
  },
  consultation: {
    message: "We offer free custom energy consultation, including bill analysis and a 3D system design, to ensure you get the maximum ROI from your solar system.",
    options: [],
    parent: "services"
  }

};

// --- 3. CORE CHAT FUNCTIONS ---

// Function to render the current set of options/buttons
function renderOptions(contextKey) {
  const data = chatData[contextKey];
  if (!data) return;

  // Set the current context key
  currentContext = contextKey;

  // 1. Clear existing buttons
  quickQuestionsDiv.innerHTML = '';

  // 2. Add the Bot's message (as the new topic introduction)
  if (contextKey !== "welcome") {
    addBotMessage(data.message);
  }

  // 3. Add Back button (unless we are at the root)
  if (data.parent) {
    const backBtn = document.createElement('button');
    backBtn.classList.add('back-btn');
    backBtn.textContent = '← Back to ' + chatData[data.parent].options.find(opt => opt.target === contextKey)?.text || 'Previous';
    backBtn.addEventListener('click', () => {
      // Scroll back to the latest message *before* adding user/bot messages
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      addMessage(backBtn.textContent, 'user');
      renderOptions(data.parent); // Move up one level
    });
    quickQuestionsDiv.appendChild(backBtn);
  }

  // 4. Create option buttons
  data.options.forEach(option => {
    const btn = document.createElement('button');
    btn.classList.add('question-btn');
    btn.textContent = option.text;

    btn.addEventListener('click', () => {
      // Show user message (the button text)
      addMessage(option.text, 'user');

      // If the option has a target (it's a category)
      if (option.target) {
        // Move to the next category
        renderOptions(option.target);
      }
      // If the option has a direct answer
      else if (option.answer) {
        // Show the bot's answer
        setTimeout(() => {
          addBotMessage(option.answer);
          // Re-render the current buttons so the user can go back or choose another answer at this level
          renderOptions(currentContext);
        }, 300);
      }
      // If the current context is Volttra batteries which has no options but a message
      else if (contextKey === "volttra_batteries" || contextKey === "install_process" || contextKey === "warranty" || contextKey === "consultation") {
        // This is an answer-only category, so it already displayed the message. Just re-render for back button.
        // The message was already added by the previous renderOptions call, so we do nothing here.
      }
    });
    quickQuestionsDiv.appendChild(btn);
  });

  // Scroll to the latest message to show new buttons
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to add a generic user message
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.textContent = text;

  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to add a bot message (with slight delay for realistic feel)
function addBotMessage(text) {
  setTimeout(() => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 300);
}


// --- 4. EVENT LISTENERS AND INITIALIZATION ---

// Toggle chat box open/close
chatButton.addEventListener('click', () => {
  chatBox.classList.toggle('open');
  const icon = chatButton.querySelector('i');
  if (chatBox.classList.contains('open')) {
    icon.classList.replace('fa-headset', 'fa-times');
    chatButton.setAttribute('aria-label', 'Close Chat Support');
    chatButton.setAttribute('title', 'Close Chat Support');
    // If opening, ensure the main menu is displayed
    if (!currentContext) {
      renderOptions('welcome');
    }
  } else {
    icon.classList.replace('fa-times', 'fa-headset');
    chatButton.setAttribute('aria-label', 'Open Chat Support');
    chatButton.setAttribute('title', 'Open Chat Support');
  }
});

// Handle custom user input
function handleCustomMessage() {
  const userText = inputField.value.trim();

  if (userText === "") return;

  addMessage(userText, 'user');
  inputField.value = '';

  const reply = "I only understand the menu options for now. Please use the buttons above to navigate our product and service information.";
  addBotMessage(reply);

  // Ensure current options are visible after bot reply
  renderOptions(currentContext || 'welcome');
}

// Handle send button click
sendButton.addEventListener('click', handleCustomMessage);

// Handle pressing Enter key in the input field
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCustomMessage();
  }
});

// Initial call to set up the welcome message and options on load
document.addEventListener('DOMContentLoaded', () => {
  // The initial bot message is already in the HTML.
  // We only need to render the buttons.
  renderOptions('welcome');
});

// ***** END CHAT WIDGET JAVASCRIPT LOGIC *****

// --- FORM SUBMISSION STATUS HANDLING ---
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const statusDiv = document.getElementById('form-status');

  if (status && statusDiv) {
    statusDiv.style.display = 'block';
    if (status === 'success') {
      statusDiv.style.backgroundColor = '#d4edda';
      statusDiv.style.color = '#155724';
      statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
    } else if (status === 'error') {
      statusDiv.style.backgroundColor = '#f8d7da';
      statusDiv.style.color = '#721c24';
      statusDiv.textContent = 'Sorry, there was an error sending your message. Please try again later.';
    } else if (status === 'validation_error') {
      statusDiv.style.backgroundColor = '#fff3cd';
      statusDiv.style.color = '#856404';
      statusDiv.textContent = 'Please fill in all required fields correctly.';
    }

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }
});