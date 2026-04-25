/* ============================================
   ASSLAW PRIVATE SCHOOL - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================
  // DARK MODE TOGGLE
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check saved theme
  const savedTheme = localStorage.getItem('asslaw-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('asslaw-theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'light' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
    });
  }

  // ==========================================
  // ACTIVE NAV LINK
  // ==========================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ==========================================
  // TESTIMONIAL SLIDER
  // ==========================================
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  
  if (track) {
    let currentSlide = 0;
    const slides = track.children;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });

    // Auto-play
    setInterval(() => goToSlide(currentSlide + 1), 6000);
  }

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ==========================================
  // BACK TO TOP
  // ==========================================
  const backToTop = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // FORM HANDLING
  // ==========================================
  const forms = document.querySelectorAll('.asslaw-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e74c3c';
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const successMsg = form.querySelector('.form-success');
        if (successMsg) {
          successMsg.style.display = 'block';
          form.reset();
          
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 5000);
        }
      }
    });
  });

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  const counters = document.querySelectorAll('.counter');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 16);
        
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

});

/* ============================================
   ASSLAW CHATBOT - COMPLETE KNOWLEDGE BASE
   ============================================ */

(function() {
  'use strict';

  // ---- DOM Elements ----
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const container = document.getElementById('chatbot-container');
  const messagesEl = document.getElementById('chatbot-messages');
  const inputEl = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const suggestionsEl = document.getElementById('chatbot-suggestions');

  let isOpen = false;
  let context = { lastTopic: null };

  // ---- Knowledge Base ----
  const knowledge = {
    greetings: {
      patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'hiya', 'yo', 'sup', 'what\'s up'],
      responses: [
        "Hello there! Welcome to Asslaw Private School. I'm here to help you with anything about our home. What would you like to know? 😊",
        "Hey! Great to see you. I'm the Asslaw Assistant. Ask me about admissions, academics, vocational training, or anything else!",
        "Hi! Welcome. Asslaw isn't just a school—it's a home. How can I make you feel at home today?"
      ]
    },

    goodbye: {
      patterns: ['bye', 'goodbye', 'see you', 'later', 'cya', 'take care', 'peace'],
      responses: [
        "Goodbye! Remember, Asslaw is always here for you. Come back anytime! 🏫",
        "Take care! Once Asslaw, always Asslaw. See you soon! 💚",
        "Bye! Wishing you a wonderful day. Don't forget to check out our admissions page! 😊"
      ]
    },

    okay: {
      patterns: ['okay', 'ok', 'kk', 'yeah', 'yh', 'okayy', 'ok na', 'yeap'],
      responses: [
        "Yeah! 😉, Do you need help with anything else?",
        "Sure, Happy to help!",
        "Yeap! You should check out our Team page 🥲"
      ]
    },

    thanks: {
      patterns: ['thanks', 'thank you', 'appreciate', 'grateful', 'ty'],
      responses: [
        "You're very welcome! That's the Asslaw way—always happy to help. 💚",
        "No problem at all! Anything else you'd like to know about our school?",
        "My pleasure! Asslaw is all about supporting each other. 😊"
      ]
    },

    identity: {
      patterns: ['who are you', 'what are you', 'your name', 'are you human', 'are you a bot', 'what is this'],
      responses: [
        "I'm the Asslaw Assistant, your virtual guide to Asslaw Private School. I know everything about our school—from academics to vocational training to admissions. Ask me anything!",
        "I'm a friendly chatbot built just for Asslaw Private School. I can tell you about our programs, fees, clubs, and everything that makes Asslaw feel like home."
      ]
    },

    school_overview: {
      patterns: ['what is asslaw', 'tell me about asslaw', 'about asslaw', 'school overview', 'what makes asslaw special', 'why asslaw', 'about the school', 'asslaw private school'],
      responses: [
        "Asslaw Private School is more than a school—it's a home. From early childhood through secondary school, we treat every student like family. Our community is built on equality, morals, open-mindedness, and practical skills. We offer academics, vocational training, clubs, and lifelong alumni support—all at fully affordable fees.",
        "Asslaw is where sweepers, workers, and teachers treat everyone equally. We instill morals and dignity, welcome student suggestions, and correct with loving discipline. Our graduates leave with real-world skills and a family that stays in touch forever."
      ]
    },

    history: {
      patterns: ['history', 'when was asslaw founded', 'established', 'founder', 'who started', 'how old is asslaw', 'beginning'],
      responses: [
        "Asslaw has been a home to students from the very beginning of their lives through the last day of secondary school. While I don't have the exact founding year, what matters most is the legacy: generations of students who grew together in an environment of equal respect, moral discipline, and practical learning.",
        "Asslaw's history is written in the lives of its students. From early years to secondary graduation, it has remained a place where every voice matters and every child is family."
      ]
    },

    academics: {
      patterns: ['academics', 'curriculum', 'subjects', 'classes', 'what do you teach', 'courses', 'education', 'learning', 'study', 'jss', 'sss', 'nursery', 'primary', 'secondary'],
      responses: [
        "Asslaw offers a comprehensive curriculum from Nursery through Secondary School (SSS). We cover all core subjects—Mathematics, English, Sciences, Arts, and Social Studies—plus unique programs like Desktop Publishing and ICT. Our sports program is equally deep, with Interhouse Sports and year-round football training!",
        "Our academics go beyond textbooks. Yes, we teach all standard subjects, but we also have student-suggested programs like Desktop Publishing, a deep sports culture with Interhouse competitions, and a culture where students can propose new ideas and see them implemented."
      ]
    },

    interhouse_sports: {
      patterns: ['interhouse sports', 'sports day', 'football', 'soccer', 'track', 'relay', 'athletics', 'sports competition', 'tug of war', 'high jump', 'long jump'],
      responses: [
        "Interhouse Sports at Asslaw is electric! 🏆 Football is the heartbeat—our teams train all year and compete with real passion. But there's also track, relay races, high jump, long jump, tug-of-war, and novelty races. Every house fights for glory, but every student leaves with stronger character.",
        "Sports runs deep at Asslaw. Our Interhouse Sports competition isn't just one day of fun; it's the culmination of months of training, house pride, and discipline. From the football pitch to the running track, every student finds their moment to shine. ⚽🏃‍♂️"
      ]
    },

    desktop_publishing: {
      patterns: ['desktop publishing', 'dtp', 'computer class', 'ict', 'computer training', 'design', 'suggestion', 'student suggestion'],
      responses: [
        "Desktop Publishing at Asslaw is a beautiful example of our open-minded culture. A student suggested it, expecting rejection, but the school dedicated an entire day to make it happen! That's Asslaw—we listen, and your ideas become reality.",
        "Our ICT and Desktop Publishing program was born from a student's voice. We teach digital design, layout, and publishing tools that prepare students for the creative industry. If you have a passion, Asslaw makes room for it. 💻"
      ]
    },

    vocational: {
      patterns: ['vocational', 'skills', 'trade', 'barbing', 'hairdressing', 'hair dressing', 'practical skills', 'handwork', 'handicraft', 'workshop'],
      responses: [
        "Vocational training is at the heart of Asslaw. We offer Barbing, Hairdressing, Desktop Publishing, Fashion & Design, Catering, and ICT. Students learn hands-on skills they can use to earn immediately after graduation—or even while still in school!",
        "Our vocational programs use a unique peer-to-peer model where skilled students teach their peers. This builds leadership and reinforces learning. By the time you graduate from Asslaw, you're not just a student—you're a professional. ✂️💇"
      ]
    },

    barbing: {
      patterns: ['barbing', 'barber', 'hair cut', 'cut hair'],
      responses: [
        "Our Barbing program teaches professional hair cutting and styling. Students practice under guidance until they're confident enough to work on real clients. Many of our graduates start earning from this skill right after school! ✂️"
      ]
    },

    hairdressing: {
      patterns: ['hairdressing', 'hair dressing', 'braiding', 'salon', 'hair stylist'],
      responses: [
        "Hairdressing at Asslaw covers everything from braiding to hair treatment and styling. Students learn techniques they can turn into thriving businesses. It's one of our most popular vocational programs! 💇‍♀️"
      ]
    },

    clubs: {
      patterns: ['clubs', 'societies', 'extracurricular', 'activities', 'jets', 'press club', 'home maker', 'drama', 'sports', 'after school'],
      responses: [
        "Asslaw has vibrant clubs for every interest: 🚀 JETS (Junior Engineers, Technicians & Scientists), 📰 Press Club, 🏠 Home Maker Club, 🎭 Drama & Arts, ⚽ Sports & Athletics, and 🌱 Agriculture Club. There's truly a tribe for everyone!",
        "Our clubs aren't just hobbies—they're communities. JETS leads Science Fair Fridays, Press Club runs our newsletters, and Home Maker teaches practical life skills. Which club sounds interesting to you?"
      ]
    },

    jets_club: {
      patterns: ['jets', 'engineers', 'scientists', 'technology club', 'tech club'],
      responses: [
        "JETS (Junior Engineers, Technicians and Scientists) is for the innovators! Members lead our Science Fair Fridays, experimenting with circuits, code, and chemical reactions. If you love building and discovering, JETS is your home within Asslaw. 🚀"
      ]
    },

    press_club: {
      patterns: ['press', 'journalism', 'news', 'newspaper', 'writing', 'media'],
      responses: [
        "The Press Club is the voice of Asslaw. Student journalists cover events, publish newsletters, and learn the power of storytelling and responsible media. It's perfect for future writers, reporters, and communicators! 📰"
      ]
    },

    home_maker: {
      patterns: ['home maker', 'homemaker', 'cooking', 'catering', 'home management', 'nutrition'],
      responses: [
        "The Home Maker Club combines practical life skills with creativity. Students learn cooking, nutrition, meal preparation, and home management. It's about preparing for independent, organized living while having fun! 🏠🍳"
      ]
    },

    discipline: {
      patterns: ['discipline', 'punishment', 'rules', 'behavior', 'conduct', 'morals', 'correction', 'strict'],
      responses: [
        "At Asslaw, discipline is rooted in love, not fear. When a student does something wrong, they are immediately corrected through guidance and good discipline. We have no room for bad conduct, but we have endless room for growth. Every correction is a chance to build better character.",
        "Our discipline system is unique: we correct with dignity. Students don't fear authority—they respect it because they know it comes from genuine care. We maintain high moral standards while ensuring every child feels loved and understood. 🛡️❤️"
      ]
    },

    morals: {
      patterns: ['morals', 'values', 'character', 'dignity', 'respect', 'equality', 'equal treatment', 'sweepers', 'workers'],
      responses: [
        "Morals and dignity are the invisible foundation of Asslaw. Every sweeper, worker, and teacher treats every student with equal respect. This culture isn't taught in a classroom—it's lived every single day. We grow together as one family. 🤝",
        "Equality is real at Asslaw. Whether you're interacting with the head of school or a member of the cleaning staff, the respect is the same. This instills a deep sense of dignity and humility in our students that lasts a lifetime."
      ]
    },

    fees: {
      patterns: ['fees', 'tuition', 'cost', 'price', 'how much', 'payment', 'affordable', 'expensive', 'money', 'scholarship'],
      responses: [
        "Asslaw's fees are fully affordable and designed to leave no burden on parents. We believe quality education shouldn't break the bank. Every child deserves access to morals, skills, and care—regardless of financial background. 💰",
        "One of the things that makes Asslaw special is that despite everything we offer—academics, vocational training, clubs, and personal support—our fees remain accessible to all families. No child is left behind due to cost."
      ]
    },

    admissions: {
      patterns: ['admission', 'enroll', 'apply', 'registration', 'join', 'how to apply', 'intake', 'form', 'register', 'sign up'],
      responses: [
        "Joining Asslaw is simple! Our process: 1️⃣ Inquiry & Campus Visit, 2️⃣ Complete the Application Form, 3️⃣ Friendly Assessment, 4️⃣ Enrollment & Welcome. We accept students from Nursery through SSS. Would you like the direct link to our admissions page?",
        "To apply to Asslaw, visit our Admissions page or contact us directly. We accept students at all levels—Nursery, Primary, JSS, and SSS. The process includes a friendly assessment to place your child in the right class. We can't wait to welcome you home!"
      ]
    },

    admission_process: {
      patterns: ['admission process', 'how do i apply', 'steps', 'requirements', 'documents', 'what do i need'],
      responses: [
        "Here's how to join Asslaw:\n\n1️⃣ **Inquiry & Visit** – Contact us or visit campus\n2️⃣ **Application** – Fill the form with required documents\n3️⃣ **Assessment** – A friendly evaluation to understand your child's needs\n4️⃣ **Enrollment** – Complete registration and receive your welcome pack!\n\nWe accept Nursery through SSS students."
      ]
    },

    contact: {
      patterns: ['contact', 'phone', 'email', 'address', 'location', 'where is asslaw', 'how to reach', 'call', 'visit'],
      responses: [
        "You can reach Asslaw Private School at:\n\n📍 **[SCHOOL ADDRESS]**\n📞 **[PHONE NUMBER]**\n✉️ **[EMAIL ADDRESS]**\n\nOffice Hours: Monday–Friday 8AM–4PM, Saturday 9AM–12PM. We'd love to hear from you or welcome you for a visit!",
        "Want to visit us? Our doors are open! Call **[PHONE NUMBER]** or email **[EMAIL ADDRESS]** to schedule a tour. Seeing Asslaw in person is the best way to feel the warmth of our community. 📍"
      ]
    },

    alumni: {
      patterns: ['alumni', 'graduate', 'after graduation', 'university support', 'former student', 'old student', 'stay in touch'],
      responses: [
        "Asslaw doesn't say goodbye at graduation! We support our alumni until they find their universities and beyond. Our network offers career guidance, university application help, and opportunities to return as mentors. Once Asslaw, always Asslaw. 🎓",
        "Our alumni are family forever. We help with university placements, check in regularly, and welcome graduates back to teach vocational skills to current students. The relationship never ends at the gate."
      ]
    },

    teachers: {
      patterns: ['teachers', 'staff', 'faculty', 'who teaches', 'educators', 'principal', 'head teacher'],
      responses: [
        "Asslaw's teachers are more than educators—they're mentors, guides, and family members. They treat every student with equal respect, encourage innovation, and celebrate every small win. Our staff includes academic teachers and vocational instructors who are passionate about building futures.",
        "Our teaching staff embodies the Asslaw spirit: open-minded, caring, and dedicated. When a student suggests something new (like Desktop Publishing!), our teachers don't dismiss it—they champion it. That's the kind of educators we have."
      ]
    },

    facilities: {
      patterns: ['facilities', 'campus', 'building', 'classroom', 'lab', 'library', 'field', 'infrastructure'],
      responses: [
        "Asslaw provides well-equipped classrooms, science laboratories, vocational workshops, computer labs for ICT and Desktop Publishing, and spaces for sports and assembly. Our campus is designed for learning, creating, and growing together.",
        "Our facilities support everything we do: academic classrooms, science labs for Friday experiments, workshops for barbing and hairdressing, computer labs for digital skills, and open spaces for clubs and sports."
      ]
    },

    student_life: {
      patterns: ['student life', 'daily life', 'routine', 'what is it like', 'experience', 'boarding', 'day school', 'food', 'uniform'],
      responses: [
        "Life at Asslaw is a beautiful mix of learning, creating, and growing. Mornings start with academics, afternoons might include vocational training or club meetings, and Fridays are for Science Fair exhibitions. There's always something happening, and every student finds their place.",
        "A day at Asslaw feels like being at home. Students learn together, collaborate on projects, participate in clubs, and support each other. The atmosphere is warm, the discipline is loving, and the opportunities are endless."
      ]
    },

    religion: {
      patterns: ['religion', 'christian', 'muslim', 'prayer', 'church', 'mosque', 'faith', 'worship'],
      responses: [
        "Asslaw welcomes students from all backgrounds and fosters an environment of mutual respect. While I don't have specific details about religious programs, our core values of equality, dignity, and moral uprightness guide everything we do. For specific religious arrangements, please contact the school directly."
      ]
    },

    transport: {
      patterns: ['bus', 'transport', 'pick up', 'drop off', 'school bus', 'commute'],
      responses: [
        "For details about school transportation and bus services, please contact us directly at **[PHONE NUMBER]** or visit our admissions office. We'll be happy to arrange convenient transport options for your child."
      ]
    },

    age: {
      patterns: ['age', 'how old', 'minimum age', 'maximum age', 'years old', 'child age'],
      responses: [
        "Asslaw accepts students from early childhood (Nursery) through secondary school completion. For specific age requirements for each class level, please contact our admissions office at **[PHONE NUMBER]** and we'll guide you on the best placement for your child."
      ]
    },

    uniform: {
      patterns: ['uniform', 'dress code', 'what to wear', 'school wear', 'clothes'],
      responses: [
        "Asslaw students wear school uniforms that reflect our values of dignity and equality. For specific details about the uniform requirements and where to purchase them, please contact the school office or inquire during your campus visit."
      ]
    },

    holiday: {
      patterns: ['holiday', 'vacation', 'break', 'term dates', 'calendar', 'when does school close', 'resumption'],
      responses: [
        "For the current academic calendar, term dates, and holiday schedules, please contact the school administration at **[PHONE NUMBER]** or **[EMAIL ADDRESS]**. We'll provide you with the most up-to-date term dates."
      ]
    },

    exam: {
      patterns: ['exam', 'test', 'waec', 'neco', 'jamb', 'result', 'performance', 'grades', 'pass rate'],
      responses: [
        "Asslaw prepares students thoroughly for all national examinations including WAEC, NECO, and JAMB. Our comprehensive curriculum and dedicated teachers ensure students are well-equipped to excel. For specific performance statistics, please contact the school."
      ]
    },

    joke: {
      patterns: ['joke', 'funny', 'laugh', 'humor', 'tell me a joke', 'make me laugh'],
      responses: [
        "Why did the student bring a ladder to Asslaw? Because we told them the sky is the limit on Science Fair Fridays! 😂",
        "What do you call a barber who graduated from Asslaw? A cut above the rest! ✂️😄",
        "Why do Asslaw students never get lost? Because Asslaw is home, and home is where the heart is! 💚"
      ]
    },

    compliment: {
      patterns: ['you are great', 'you are good', 'nice', 'awesome', 'amazing', 'well done', 'good job', 'i love you', 'smart'],
      responses: [
        "Aww, thank you! That means a lot. But honestly, it's easy to be helpful when you're talking about a place as amazing as Asslaw. 💚",
        "You're too kind! I'm just reflecting the warmth of Asslaw. The real stars are the students, teachers, and staff who make this school a home."
      ]
    },

    abuse: {
      patterns: ['stupid', 'idiot', 'dumb', 'useless', 'hate you', 'shut up', 'bad', 'worst', 'terrible'],
      responses: [
        "I'm sorry you feel that way. Asslaw teaches us to communicate with respect and dignity. How can I better assist you today?",
        "At Asslaw, we believe in correcting with love. If something isn't right, please let me know how I can help. I'm here for you."
      ]
    },

    fallback: {
      responses: [
        "That's an interesting question! While I don't have a specific answer for that, I'd love to help. Could you rephrase it, or ask about our academics, vocational training, admissions, or clubs?",
        "Hmm, I'm not sure I caught that. I know a lot about Asslaw—our Science Fair Fridays, vocational programs, affordable fees, and warm community. What would you like to explore?",
        "I want to make sure I help you properly! I can tell you about admissions, academics, clubs, fees, or our unique culture of equality. What are you most curious about?",
        "Great question! For the most accurate answer, you might want to contact the school directly at **[PHONE NUMBER]**. But I can definitely help with general questions about programs, admissions, and student life!"
      ]
    }
  };

  // ---- Suggestion Chips ----
  const suggestionSets = {
    default: ['Tell me about Asslaw', 'Vocational training', 'How much are fees?', 'Admissions', 'Science Fair Fridays'],
    admissions: ['Admission requirements', 'How to apply', 'School fees', 'Contact school'],
    academics: ['Science Fair Fridays', 'Desktop Publishing', 'Clubs', 'Vocational training'],
    vocational: ['Barbing', 'Hairdressing', 'ICT skills', 'Fashion & Design'],
    about: ['Student life', 'Discipline', 'Teachers', 'Facilities']
  };

  // ---- Helper Functions ----
  function normalize(text) {
    return text.toLowerCase().trim().replace(/[?!.,]/g, '');
  }

  function findBestIntent(input) {
    const text = normalize(input);
    let bestIntent = null;
    let bestScore = 0;

    for (const [intent, data] of Object.entries(knowledge)) {
      if (intent === 'fallback') continue;
      let score = 0;
      for (const pattern of data.patterns || []) {
        const normPattern = normalize(pattern);
        if (text === normPattern) {
          score += 10;
        } else if (text.includes(normPattern)) {
          score += 5;
        } else {
          // Word-level matching
          const inputWords = text.split(' ');
          const patternWords = normPattern.split(' ');
          const matches = inputWords.filter(w => patternWords.includes(w)).length;
          score += matches * 2;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    return bestScore >= 3 ? bestIntent : 'fallback';
  }

  function getResponse(intent) {
    const data = knowledge[intent];
    if (!data || !data.responses) return getResponse('fallback');
    const resp = data.responses[Math.floor(Math.random() * data.responses.length)];
    return resp;
  }

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chatbot-message ${sender}`;
    // Convert **text** to bold
    div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.id = 'chatbot-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.remove();
  }

  function setSuggestions(setName) {
    const sets = suggestionSets[setName] || suggestionSets.default;
    suggestionsEl.innerHTML = '';
    sets.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'chatbot-chip';
      chip.textContent = text;
      chip.addEventListener('click', () => {
        inputEl.value = text;
        handleSend();
      });
      suggestionsEl.appendChild(chip);
    });
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputEl.value = '';
    showTyping();

    // Determine delay based on response length for realism
    const delay = 800 + Math.random() * 700;

    setTimeout(() => {
      hideTyping();
      const intent = findBestIntent(text);
      context.lastTopic = intent;
      let response = getResponse(intent);

      // Context-aware follow-ups
      if (intent === 'admissions') {
        response += "\n\nWould you like to know about the admission process or school fees?";
        setTimeout(() => setSuggestions('admissions'), 100);
      } else if (intent === 'academics') {
        setTimeout(() => setSuggestions('academics'), 100);
      } else if (intent === 'vocational') {
        setTimeout(() => setSuggestions('vocational'), 100);
      } else if (intent === 'school_overview' || intent === 'about') {
        setTimeout(() => setSuggestions('about'), 100);
      } else if (intent === 'greetings') {
        setSuggestions('default');
      }

      addMessage(response, 'bot');
    }, delay);
  }

  // ---- Event Listeners ----
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    container.classList.toggle('open', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '💬';
    if (isOpen && messagesEl.children.length === 0) {
      setTimeout(() => {
        addMessage("Hi there! Welcome to Asslaw Private School. 🏫 I'm here to answer anything about our academics, vocational training, admissions, clubs, or what makes Asslaw feel like home. How can I help you today?", 'bot');
        setSuggestions('default');
      }, 300);
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    container.classList.remove('open');
    toggleBtn.innerHTML = '💬';
  });

  sendBtn.addEventListener('click', handleSend);

  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !container.contains(e.target) && !toggleBtn.contains(e.target)) {
      isOpen = false;
      container.classList.remove('open');
      toggleBtn.innerHTML = '💬';
    }
  });

})();