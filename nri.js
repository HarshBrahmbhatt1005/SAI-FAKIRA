if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  // thoda delay taaki page render ho jaye
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, 200);
});

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     MEETING MODAL (MERGED & STABLE)
  ========================= */
  const openMeeting = document.getElementById("openMeeting");
  const meetingModal = document.getElementById("meetingModal");
  const closeMeeting = document.getElementById("closeMeeting");
  const meetingTopics = document.getElementById("meetingTopics");
  const meetingForm = document.getElementById("meetingForm");
  const startMeeting = document.getElementById("startMeeting");

  function resetMeetingSteps() {
    if (!meetingTopics || !meetingForm) return;
    meetingTopics.style.display = "block";
    meetingForm.style.display = "none";
    meetingForm.classList.remove("active");
  }

  function closeMeetingModal() {
    meetingModal?.classList.remove("active");
    resetMeetingSteps();
  }

  openMeeting?.addEventListener("click", () => {
    resetMeetingSteps();
    meetingModal?.classList.add("active");
  });

  startMeeting?.addEventListener("click", () => {
    meetingTopics.style.display = "none";
    meetingForm.style.display = "block";
    meetingForm.classList.add("active");
  });

  closeMeeting?.addEventListener("click", closeMeetingModal);

  meetingModal?.addEventListener("click", (e) => {
    if (e.target === meetingModal) closeMeetingModal();
  });

  /* =========================
     DRAG SLIDER
  ========================= */
  const slider = document.querySelector(".top-picks-cards");
  if (slider && window.innerWidth > 768) {
    let isDown = false, startX, scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    ["mouseup", "mouseleave"].forEach(evt =>
      slider.addEventListener(evt, () => isDown = false)
    );

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      slider.scrollLeft = scrollLeft - (e.pageX - slider.offsetLeft - startX) * 2;
    });
  }

  /* =========================
     MOBILE MENU
  ========================= */


  /* =========================
     STATS COUNTER
  ========================= */
  const statsBlock = document.querySelector(".stats-block");
  const counters = document.querySelectorAll(".counter");

  if (statsBlock && counters.length) {
    const startCounter = (counter) => {
      const target = +counter.dataset.target;
      let current = 0;

      const update = () => {
        current += target / 120;
        if (current < target) {
          counter.innerText = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };
      update();
    };

    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        counters.forEach(startCounter);
        obs.disconnect();
      }
    }, { rootMargin: "0px 0px -150px 0px" }).observe(statsBlock);
  }

  /* =========================
     FAQ
  ========================= */
  const faqs = document.querySelectorAll(".faq-item");
  faqs.forEach(faq => {
    faq.querySelector(".faq-question")?.addEventListener("click", () => {
      faqs.forEach(f => f.classList.remove("active"));
      faq.classList.add("active");
    });
  });
  faqs[0]?.classList.add("active");

/* =========================
   JOURNEY ANIMATION (EVERY VISIT)
========================= */
const track = document.querySelector(".journey-track");
const steps = document.querySelectorAll(".journey-card");
let current = 0;
let isPlaying = false;

function resetJourney() {
  current = 0;
  isPlaying = false;

  steps.forEach(step => step.classList.remove("active"));
  track?.style.setProperty("--progress", "0%");
}

function animateJourney() {
  if (!track || !steps.length || current >= steps.length) {
    isPlaying = false;
    return;
  }

  steps[current].classList.add("active");

  if (window.innerWidth > 768) {
    track.style.setProperty(
      "--progress",
      ((current + 1) / (steps.length - 1)) * 100 + "%"
    );
  }

  current++;
  setTimeout(animateJourney, 700);
}

/* 🔥 Intersection Observer */
const journeyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isPlaying) {
        resetJourney();      // 🔁 fresh start every time
        isPlaying = true;
        animateJourney();
      }
    });
  },
  {
    threshold: 0.4
  }
);

track && journeyObserver.observe(track);


  /* =========================
   BLOG DRAWER – STABLE VERSION
========================= */

const blogDrawer = document.getElementById("blogDrawer");
const blogOverlay = document.getElementById("drawerOverlay");
const drawerTitle = document.getElementById("drawerTitle");
const drawerImage = document.getElementById("drawerImage");
const drawerContent = document.getElementById("drawerContent");

/* EVENT DELEGATION */
document.addEventListener("click", (e) => {
  const card = e.target.closest(".wa-card");
  if (!card) return;

  // SAFETY CHECK
  if (!blogDrawer || !blogOverlay) return;

  drawerTitle.textContent = card.dataset.title || "";
  drawerImage.src = card.dataset.image || "";
  drawerContent.textContent = card.dataset.content || "";

  blogDrawer.classList.add("active");
  blogOverlay.classList.add("active");

  document.body.style.overflow = "hidden"; // prevent bg scroll
});

/* CLOSE HANDLERS */
function closeBlogDrawer() {
  blogDrawer.classList.remove("active");
  blogOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

document.querySelector(".drawer-close")
  ?.addEventListener("click", closeBlogDrawer);

blogOverlay?.addEventListener("click", closeBlogDrawer);


/* =========================
   BEFORE / AFTER SECTION
========================= */
const section = document.getElementById("beforeAfterSection");
const beforeGrid = document.getElementById("beforeGrid");
const afterGrid = document.getElementById("afterGrid");
// const cancelLine = document.getElementById("cancelLine");
const label = document.getElementById("baLabel");

function resetAnimation() {
  beforeGrid.classList.remove("active");
  afterGrid.classList.remove("active");
  // cancelLine.classList.remove("show");
  label.classList.remove("show", "after");

  document.querySelectorAll(".ba-card").forEach(card => {
    card.classList.remove("show");
  });
}

function revealCards(container, delay = 300) {
  container.querySelectorAll(".ba-card").forEach((card, i) => {
    setTimeout(() => card.classList.add("show"), i * delay);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {

        resetAnimation(); // 🔁 har baar fresh start

        /* BEFORE */
        // label.innerText = "Before";
        label.classList.add("show");
        beforeGrid.classList.add("active");
        revealCards(beforeGrid);

        // setTimeout(() => cancelLine.classList.add("show"), 3600);

        setTimeout(() => {
          beforeGrid.classList.remove("active");
          cancelLine.classList.remove("show");
          label.classList.remove("show");
        }, 4400);

        /* AFTER */
        setTimeout(() => {
          // label.innerText = "What Sai Fakira Offers You";
          label.classList.add("show", "after");
          afterGrid.classList.add("active");
          revealCards(afterGrid);
        }, 5000);
      }
    });
  },
  {
    threshold: 0.4
  }
);

observer.observe(section);


  /* =========================
     LOAN POPUP
  ========================= */
  const loanCard = document.querySelector("[data-loan-popup]");
  const loanOverlay = document.getElementById("loanDocOverlay");
  const loanPopup = document.getElementById("loanDocPopup");
  const loanClose = document.querySelector(".loan-doc-close");

  function closeLoanPopup() {
    loanOverlay?.classList.remove("active");
    loanPopup?.classList.remove("active");
  }

  loanCard?.addEventListener("click", () => {
    loanOverlay?.classList.add("active");
    loanPopup?.classList.add("active");
  });

  loanClose?.addEventListener("click", closeLoanPopup);
  loanOverlay?.addEventListener("click", closeLoanPopup);

});

/* =========================
   JOURNEY CARD REDIRECT
========================= */
document.querySelectorAll(".journey-card").forEach(card => {
  const title = card.querySelector("h4");
  if (title && title.innerText.includes("Property Identification")) {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = "index.html#propertySection";
    });
  }
});

/* =========================
   SCROLL PROGRESS + UP/DOWN
========================= */
const progressCircle = document.querySelector(".progress-ring-fill");
const scrollUp = document.getElementById("scrollUp");
const scrollDown = document.getElementById("scrollDown");

if (progressCircle) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = circumference;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollTop / docHeight;
    progressCircle.style.strokeDashoffset =
      circumference - progress * circumference;
  });
}

scrollUp?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

scrollDown?.addEventListener("click", () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});
document.addEventListener("DOMContentLoaded", () => {
  const openMeetingCard = document.querySelector(".open-meeting");
  const meetingModal = document.getElementById("meetingModal");
  const meetingTopics = document.getElementById("meetingTopics");
  const meetingForm = document.getElementById("meetingForm");
  const startMeetingBtn = document.getElementById("startMeeting");
  const closeMeeting = document.getElementById("closeMeeting");

  // Open modal from journey card
  openMeetingCard.addEventListener("click", () => {
    meetingModal.classList.add("active");

    // STEP 1 show, STEP 2 hide
    meetingTopics.style.display = "block";
    meetingForm.style.display = "none";
  });

  // Go to STEP 2
  startMeetingBtn.addEventListener("click", () => {
    meetingTopics.style.display = "none";
    meetingForm.style.display = "block";
  });

  // Close modal
  closeMeeting.addEventListener("click", () => {
    meetingModal.classList.remove("active");
  });
});
/* =========================
   FEEDBACK FORM (GAS SAFE + MAIL WORKING)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackMessage = document.getElementById("formMessage");
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("ratingValue");

  const feedbackPopup = document.getElementById("feedbackPopup");
  const feedbackOverlay = document.getElementById("feedbackOverlay");
  const closeFeedback = document.getElementById("closeFeedback");

  const doneCard = document
    .querySelector(".journey-card .finish-icon")
    ?.closest(".journey-card");

  /* ⭐ STAR RATING */
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      ratingInput.value = index + 1;
      stars.forEach((s, i) =>
        s.classList.toggle("active", i <= index)
      );
    });
  });

  /* 📂 OPEN FEEDBACK POPUP */
  doneCard?.addEventListener("click", () => {
    feedbackPopup.classList.add("active");
    feedbackOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  /* ❌ CLOSE POPUP */
  function closeFeedbackPopup() {
    feedbackPopup.classList.remove("active");
    feedbackOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeFeedback?.addEventListener("click", closeFeedbackPopup);
  feedbackOverlay?.addEventListener("click", closeFeedbackPopup);

  /* 📤 FORM SUBMIT (SAFE GAS WAY) */
  feedbackForm.addEventListener("submit", () => {
    if (!ratingInput.value) {
      feedbackMessage.textContent = "⚠ Please select a rating";
      feedbackMessage.className = "error";
      event.preventDefault();
      return;
    }

    feedbackMessage.textContent = "⏳ Submitting your feedback...";
    feedbackMessage.className = "";

    setTimeout(() => {
      feedbackMessage.textContent =
        "✅ Thank you! Your feedback has been submitted.";
      feedbackMessage.className = "success";

      feedbackForm.reset();
      ratingInput.value = "";
      stars.forEach((s) => s.classList.remove("active"));

      setTimeout(closeFeedbackPopup, 2000);
    }, 1200);
  });
});
