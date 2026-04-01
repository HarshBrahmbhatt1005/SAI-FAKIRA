const phoneNumber = "919033784030";

function preloadImages() {
  const criticalImages = [];
  const backgroundImages = [];

  // Sort images into critical (first 5 cards) and background (rest)
  propertyCardsData.forEach((card, index) => {
    if (card.images && card.images.length > 0) {
      if (index < 5) {
        criticalImages.push(...card.images);
      } else {
        backgroundImages.push(...card.images);
      }
    }
  });

  // 1. Load critical images immediately
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // 2. Load the rest in background after page load
  // Using window.onload or a timeout to ensure main thread is free
  // Removed: Background loading of ALL images to save bandwidth.
  // Images will now load on demand via IntersectionObserver.
}

document.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  initializeHeroBox();
  renderPropertyCards();
  initializeSlider();
  initializeFilters();
  initializeMobileFilters();
  initializeMobileTopCards();
  initializeDragScroll();
  initializeNotification();
  initializeScrollArrow();
  initializeWhatsAppButtons();
  initializeFormLogic();
  initializeMenuToggle();
  initializeReferButton();
  initializeLightbox();
});

window.addEventListener("load", () => {
  initializeLogoRotation();
  checkOnlineStatus();
});

function initializeHeroBox() {
  const box = document.getElementById("myBox");
  setTimeout(() => {
    box.classList.add("active");
  }, 300);
}

function renderPropertyCards() {
  const container = document.querySelector(".property-container");
  if (!container) return;

  container.innerHTML = "";

  propertyCardsData.forEach((card) => {
    const cardElement = createPropertyCard(card);
    container.appendChild(cardElement);
  });

  setTimeout(() => {
    initializeSlideshow();
  }, 100);
}

function createPropertyCard(data) {
  const card = document.createElement("div");
  card.className = "Property-card";
  card.setAttribute("data-id", data.id);
  card.setAttribute("data-type", data.type);
  card.setAttribute("data-latest", data.latest);
  card.setAttribute("data-location", data.location);
  if (data.price) card.setAttribute("data-price", data.price);
  if (data.images) card.setAttribute("data-images", JSON.stringify(data.images));

  // Add a class to indicate if card has images
  const hasImages = data.images && data.images.length > 0;
  if (hasImages) {
    card.classList.add("has-images");
  }

  if (data.soldOut) {
    card.classList.add("sold-out");
  }

  let locationHTML = "";
  if (data.locationTag) {
    locationHTML = `
      <div class="location-tag">
        <span class="loc-name">${data.locationTag}</span>
      </div>
    `;
  } else if (data.propertyLocation) {
    locationHTML = `
      <div class="property-location">${data.propertyLocation}</div>
      ${data.locationImage ? `<div class="property-location-image">${data.locationImage}</div>` : ""}
      <div class="location-tag slideshow-img"></div>
    `;
  }

  const featuresHTML = data.features
    .map((feature) => `<li>${feature}</li>`)
    .join("");

  // Format price text with visual hierarchy
  function formatPriceText(priceText) {
    if (!priceText) return "";
    
    const supplementaryPatterns = [
      /(\s+onwards\*?)/gi,
      /(\s+onward\*?)/gi,
      /(\(box price\*?\))/gi,
      /(\(inc\.all\*?\))/gi,
      /(\(including.*?\))/gi,
      /(\s+per sq\.ft)/gi,
      /(\s+\*$)/g 
    ];
    
    let formattedPrice = priceText;
    supplementaryPatterns.forEach(pattern => {
      formattedPrice = formattedPrice.replace(pattern, '<span class="price-supplement">$1</span>');
    });
    
    return formattedPrice;
  }

  // Format sqft text with visual hierarchy
  function formatSqftText(sqft, sqftType) {
    if (!sqft) return "";
    
    let formattedSqft = sqft;
    formattedSqft = formattedSqft.replace(/(sq\.?ft\.?|sq\.?yd\.?|sq)/gi, '<span class="sqft-unit">$1</span>');
    
    const typeHTML = sqftType 
      ? `<span class="sqft-type-badge">${sqftType}</span>` 
      : "";
    
    return `
      <div class="sqft-wrapper">
        <i class="fa-solid fa-vector-square" style="color: #8c1843; font-size: 18px;"></i> 
        <span class="sqft-main-text">${formattedSqft}</span>
        ${typeHTML}
      </div>
    `;
  }

  let categoriesHTML = "";
  let initialCategoryDetails = "";
  
  if (data.categories && data.categories.length > 0) {
    if (data.categories.length > 1) {
      const toggles = data.categories.map((cat, idx) => {
        // Only show purely string part without repetition if possible, but keep simple for now
        let btnText = cat.bhk;
        return `<button class="bhk-toggle-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">${btnText}</button>`;
      }).join("");
      categoriesHTML = `<div class="bhk-toggles">${toggles}</div>`;
    } else {
      categoriesHTML = `<div class="bhk-toggles"><button class="bhk-toggle-btn single-btn active">${data.categories[0].bhk}</button></div>`;
    }

    const cat = data.categories[0];
    initialCategoryDetails = `
      <div class="dynamic-category-details">
        <div class="price-wrapper">
          <i class="fa-solid fa-indian-rupee-sign" style="font-size:16px;"></i> 
          <span class="price-text">${formatPriceText(cat.price)}</span>
        </div>
        ${formatSqftText(cat.sqft, cat.sqftType)}
      </div>
    `;
  } else {
    categoriesHTML = `<div class="bhk-toggles"><button class="bhk-toggle-btn single-btn active">${data.title || 'Details'}</button></div>`;
    initialCategoryDetails = `
      <div class="dynamic-category-details">
        <div class="price-wrapper">
          <i class="fa-solid fa-indian-rupee-sign" style="font-size:16px;"></i> 
          <span class="price-text">${formatPriceText(data.priceText || '')}</span>
        </div>
        ${formatSqftText(data.sqft || '', data.sqftType || '')}
      </div>
    `;
  }

  card.innerHTML = `
    ${data.soldOut ? '<div class="sold-out-overlay"><img src="images/sold graphic png.png" alt="sold img not shown"></div>' : ""}
    <div class="loan-ready-badge">
      <i class="fa-solid fa-circle-check"></i> Loan Ready
    </div>
    ${locationHTML}
    <div class="Property-details">
      ${data.schemeName ? `<div class="scheme-name">${data.schemeName}</div>` : ""}
      
      <div class="category-section">
        ${categoriesHTML}
        ${initialCategoryDetails}
      </div>

      <ul class="star-list" style="margin-top: 10px;">
        ${featuresHTML}
      </ul>
    </div>
    <a href="#" class="whatsappBtn" data-type="${data.location}">
      <i class="wp-icon fa-brands fa-whatsapp"></i>
    </a>
  `;

  if (data.categories && data.categories.length > 1) {
    const toggleBtns = card.querySelectorAll('.bhk-toggle-btn');
    const detailsContainer = card.querySelector('.dynamic-category-details');
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const idx = btn.getAttribute('data-index');
        const cat = data.categories[idx];
        
        detailsContainer.innerHTML = `
          <div class="price-wrapper">
            <i class="fa-solid fa-indian-rupee-sign" style="font-size:16px;"></i> 
            <span class="price-text">${formatPriceText(cat.price)}</span>
          </div>
          ${formatSqftText(cat.sqft, cat.sqftType)}
        `;
      });
    });
  }

  return card;
}

function initializeSlideshow() {
  const observerOptions = {
    root: null,
    rootMargin: '100px', // Preload slightly before element comes into view
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        setupSlideshowForCard(card);
        observer.unobserve(card);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".Property-card").forEach((card) => {
    // Only observe if it has images
    if (card.dataset.images) {
      observer.observe(card);
    }
  });
}

function setupSlideshowForCard(card) {
  const container = card.querySelector(".slideshow-img");
  if (!container || !card.dataset.images) return;

  let images = [];
  try {
    images = JSON.parse(card.dataset.images);
  } catch { }

  images = images.filter((i) => i.trim());
  if (!images.length) return;

  container.innerHTML = '';

  const sliderTrack = document.createElement("div");
  sliderTrack.className = "slider-track";

  images.forEach((img, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url('${img}')`;
    sliderTrack.appendChild(slide);
  });

  container.appendChild(sliderTrack);

  let currentSlide = 0;

  function moveToSlide(slideIndex) {
    sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
  }

  // Start auto-scroll only after images are set up
  setInterval(() => {
    currentSlide = (currentSlide + 1) % images.length;
    moveToSlide(currentSlide);
  }, 3000);

  moveToSlide(0);
}

function initializeSlider() {
  const container = document.querySelector(".property-container");
  const nextBtn = document.querySelector(".slider-btn.next");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const sliderWindow = document.querySelector(".slider-window");

  if (!container || !nextBtn || !prevBtn) return;

  let index = 0;
  let autoScrollInterval = null;
  let userInteracted = false;
  let resumeTimeout = null;

  function isMobile() {
    return window.innerWidth <= 600;
  }

  function getVisibleCards() {
    return [...document.querySelectorAll(".Property-card")].filter(
      card => card.style.display !== "none"
    );
  }

  // =============================================
  // JS-DRIVEN MOBILE SLIDER (pixel-perfect, no drift)
  // =============================================
  // On mobile, JS sets exact pixel widths. No CSS percentages.
  // W = sliderWindow.clientWidth (always a whole integer)
  // GAP = 16px fixed
  // cardWidth = W - GAP (whole integer)
  // Slot = cardWidth + GAP = W
  // Scroll = index * W (integer × integer = integer, zero drift)
  const MOBILE_GAP = 16;
  let mobileSlotPx = 0; // cached, refreshed on init and resize

  function applyMobileCardSizes() {
    if (!isMobile() || !sliderWindow) return;

    const W = Math.round(sliderWindow.clientWidth);
    mobileSlotPx = W;
    const halfGap = MOBILE_GAP / 2; // 8px each side
    const cardWidth = W - MOBILE_GAP; // card = slot - gap

    // No container gap — use margin on cards to center them in each slot
    container.style.gap = "0px";

    // Set each card's width and margin explicitly
    const allCards = document.querySelectorAll(".Property-card");
    allCards.forEach(card => {
      card.style.flex = "0 0 " + cardWidth + "px";
      card.style.minWidth = cardWidth + "px";
      card.style.maxWidth = cardWidth + "px";
      card.style.width = cardWidth + "px";
      card.style.margin = "0 " + halfGap + "px";
    });
  }

  function clearMobileCardSizes() {
    // On desktop, remove inline styles so CSS takes over
    container.style.gap = "";
    const allCards = document.querySelectorAll(".Property-card");
    allCards.forEach(card => {
      card.style.flex = "";
      card.style.minWidth = "";
      card.style.maxWidth = "";
      card.style.width = "";
      card.style.margin = "";
    });
  }

  function getScrollDistance() {
    if (isMobile()) {
      return mobileSlotPx; // whole pixel, no drift
    }
    // Desktop: first visible card width + computed gap
    const visibleCards = getVisibleCards();
    const firstCard = visibleCards.length > 0 ? visibleCards[0] : container.querySelector(".Property-card");
    if (!firstCard) return 370;
    const cardWidth = firstCard.offsetWidth || 350;
    const computedGap = parseInt(window.getComputedStyle(container).gap) || 20;
    return cardWidth + computedGap;
  }

  function moveSlider() {
    const dist = getScrollDistance();
    container.style.transform = `translateX(-${index * dist}px)`;
  }

  // Apply sizes on init
  if (isMobile()) {
    applyMobileCardSizes();
  }

  function goToNext() {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const maxIndex = isMobile() ? visibleCards.length - 1 : Math.max(0, visibleCards.length - 3);

    if (index < maxIndex) {
      index++;
    } else {
      index = 0;
    }
    moveSlider();
  }

  function goToPrev() {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    const maxIndex = isMobile() ? visibleCards.length - 1 : Math.max(0, visibleCards.length - 3);

    if (index > 0) {
      index--;
    } else {
      index = maxIndex;
    }
    moveSlider();
  }

  function startAutoScroll() {
    if (userInteracted) return;

    stopAutoScroll();

    autoScrollInterval = setInterval(() => {
      if (!userInteracted) {
        goToNext();
      } else {
        stopAutoScroll();
      }
    }, 4000);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  function handleUserInteraction() {
    userInteracted = true;
    stopAutoScroll();

    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }

    resumeTimeout = setTimeout(() => {
      userInteracted = false;
      startAutoScroll();
    }, 45000);
  }

  nextBtn.addEventListener("click", () => {
    handleUserInteraction();
    goToNext();
  });

  prevBtn.addEventListener("click", () => {
    handleUserInteraction();
    goToPrev();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const visibleCards = getVisibleCards();
      if (visibleCards.length === 0) return;

      // Recalculate card sizes (mobile: set pixel widths, desktop: clear inline styles)
      if (isMobile()) {
        applyMobileCardSizes();
      } else {
        clearMobileCardSizes();
      }

      const maxIndex = isMobile() ? visibleCards.length - 1 : Math.max(0, visibleCards.length - 3);
      if (index > maxIndex) {
        index = 0;
      }
      moveSlider();

      if (!userInteracted) {
        startAutoScroll();
      }
    }, 250);
  });

  const observer = new MutationObserver(() => {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    // Re-apply card sizes after filter changes (new cards may be visible)
    if (isMobile()) {
      applyMobileCardSizes();
    }

    const maxIndex = isMobile() ? visibleCards.length - 1 : Math.max(0, visibleCards.length - 3);
    if (index > maxIndex) {
      index = 0;
    }
    // Always re-apply position after filter changes cards
    moveSlider();
  });

  observer.observe(container, {
    attributes: true,
    attributeFilter: ['style'],
    subtree: true
  });

  startAutoScroll();
}

function initializeFilters() {
  const priceSlider = document.getElementById("propPriceSlider");
  const priceText = document.getElementById("propPriceText");
  const nameSearch = document.getElementById("propSearch");
  const cards = [...document.querySelectorAll(".Property-card")];
  const noResult = document.querySelector(".no-result");
  const locChips = document.querySelectorAll(".prop-chip");

  // Multi-select location elements
  const locationDisplay = document.getElementById("locationDisplay");
  const locationDropdown = document.getElementById("locationDropdown");
  const locationOptions = document.getElementById("locationOptions");
  const selectAllLocationsBtn = document.getElementById("selectAllLocations");
  const deselectAllLocationsBtn = document.getElementById("deselectAllLocations");
  const locationSearchInput = document.getElementById("locationSearchInput");
  const locationHiddenInput = document.getElementById("propLocation");

  // Multi-select type elements
  const typeDisplay = document.getElementById("typeDisplay");
  const typeDropdown = document.getElementById("typeDropdown");
  const typeOptions = document.getElementById("typeOptions");
  const selectAllTypesBtn = document.getElementById("selectAllTypes");
  const deselectAllTypesBtn = document.getElementById("deselectAllTypes");
  const typeHiddenInput = document.getElementById("propType");

  // Active filters
  const activeFiltersSection = document.getElementById("activeFiltersSection");
  const activeFiltersContainer = document.getElementById("activeFiltersContainer");

  if (!priceSlider || !nameSearch) return;

  let selectedLocations = [];
  let selectedTypes = [];

  // ===== LOCATION MULTI-SELECT =====

  // Toggle location dropdown
  if (locationDisplay && locationDropdown) {
    locationDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      const opening = !locationDropdown.classList.contains("active");
      locationDisplay.classList.toggle("active");
      locationDropdown.classList.toggle("active");

      // Close type dropdown if open
      if (typeDisplay && typeDropdown) {
        typeDisplay.classList.remove("active");
        typeDropdown.classList.remove("active");
      }

      // Auto-focus search when opening, clear & blur when closing
      if (locationSearchInput) {
        if (opening) {
          setTimeout(() => locationSearchInput.focus(), 50);
        } else {
          locationSearchInput.value = "";
          locationSearchInput.dispatchEvent(new Event("input"));
          locationSearchInput.blur();
        }
      }
    });
  }

  // Update location display text
  function updateLocationDisplay() {
    const placeholder = locationDisplay.querySelector(".multiselect-placeholder");

    const existingBadge = locationDisplay.querySelector(".multiselect-count-badge");
    if (existingBadge) existingBadge.remove();

    if (selectedLocations.length === 0) {
      placeholder.textContent = "All Locations";
      locationHiddenInput.value = "";
    } else if (selectedLocations.length === 1) {
      const checkbox = locationOptions.querySelector(`input[value="${selectedLocations[0]}"]`);
      placeholder.textContent = checkbox.dataset.label;
      locationHiddenInput.value = selectedLocations[0];
    } else {
      placeholder.textContent = "Multiple Locations";
      locationHiddenInput.value = selectedLocations.join(",");

      const badge = document.createElement("span");
      badge.className = "multiselect-count-badge";
      badge.textContent = selectedLocations.length;
      locationDisplay.appendChild(badge);
    }
  }

  // Handle location checkbox changes
  if (locationOptions) {
    locationOptions.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        const value = e.target.value;
        if (e.target.checked) {
          if (!selectedLocations.includes(value)) {
            selectedLocations.push(value);
          }
        } else {
          selectedLocations = selectedLocations.filter(loc => loc !== value);
        }
        updateLocationDisplay();
        updateActiveFilters();
        filterCards();
      }
    });
  }

  // Select All locations
  if (selectAllLocationsBtn && locationOptions) {
    selectAllLocationsBtn.addEventListener("click", () => {
      const checkboxes = locationOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        if (!cb.checked) {
          cb.checked = true;
          selectedLocations.push(cb.value);
        }
      });
      selectedLocations = [...new Set(selectedLocations)];
      updateLocationDisplay();
      updateActiveFilters();
      filterCards();
    });
  }

  // Deselect All locations
  if (deselectAllLocationsBtn && locationOptions) {
    deselectAllLocationsBtn.addEventListener("click", () => {
      const checkboxes = locationOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      selectedLocations = [];
      updateLocationDisplay();
      updateActiveFilters();
      filterCards();
    });
  }

  // Search within locations
  if (locationSearchInput && locationOptions) {
    locationSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const options = locationOptions.querySelectorAll(".multiselect-option");

      options.forEach(option => {
        const text = option.querySelector("span").textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          option.style.display = "flex";
        } else {
          option.style.display = "none";
        }
      });
    });
  }

  // ===== TYPE MULTI-SELECT =====

  // Toggle type dropdown
  if (typeDisplay && typeDropdown) {
    typeDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      typeDisplay.classList.toggle("active");
      typeDropdown.classList.toggle("active");

      // Close location dropdown if open (and clear its search)
      if (locationDisplay && locationDropdown) {
        locationDisplay.classList.remove("active");
        locationDropdown.classList.remove("active");
        if (locationSearchInput) {
          locationSearchInput.value = "";
          locationSearchInput.dispatchEvent(new Event("input"));
        }
      }
    });
  }

  // Update type display text
  function updateTypeDisplay() {
    const placeholder = typeDisplay.querySelector(".multiselect-placeholder");

    const existingBadge = typeDisplay.querySelector(".multiselect-count-badge");
    if (existingBadge) existingBadge.remove();

    if (selectedTypes.length === 0) {
      placeholder.textContent = "All Types";
      typeHiddenInput.value = "";
    } else if (selectedTypes.length === 1) {
      const checkbox = typeOptions.querySelector(`input[value="${selectedTypes[0]}"]`);
      placeholder.textContent = checkbox.dataset.label;
      typeHiddenInput.value = selectedTypes[0];
    } else {
      placeholder.textContent = "Multiple Types";
      typeHiddenInput.value = selectedTypes.join(",");

      const badge = document.createElement("span");
      badge.className = "multiselect-count-badge";
      badge.textContent = selectedTypes.length;
      typeDisplay.appendChild(badge);
    }
  }

  // Handle type checkbox changes
  if (typeOptions) {
    typeOptions.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        const value = e.target.value;
        if (e.target.checked) {
          if (!selectedTypes.includes(value)) {
            selectedTypes.push(value);
          }
        } else {
          selectedTypes = selectedTypes.filter(type => type !== value);
        }
        updateTypeDisplay();
        updateActiveFilters();
        filterCards();
      }
    });
  }

  // Select All types
  if (selectAllTypesBtn && typeOptions) {
    selectAllTypesBtn.addEventListener("click", () => {
      const checkboxes = typeOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => {
        if (!cb.checked) {
          cb.checked = true;
          selectedTypes.push(cb.value);
        }
      });
      selectedTypes = [...new Set(selectedTypes)];
      updateTypeDisplay();
      updateActiveFilters();
      filterCards();
    });
  }

  // Deselect All types
  if (deselectAllTypesBtn && typeOptions) {
    deselectAllTypesBtn.addEventListener("click", () => {
      const checkboxes = typeOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      selectedTypes = [];
      updateTypeDisplay();
      updateActiveFilters();
      filterCards();
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-multiselect-wrapper")) {
      if (locationDisplay && locationDropdown) {
        locationDisplay.classList.remove("active");
        locationDropdown.classList.remove("active");
        if (locationSearchInput) {
          locationSearchInput.value = "";
          locationSearchInput.dispatchEvent(new Event("input"));
        }
      }
      if (typeDisplay && typeDropdown) {
        typeDisplay.classList.remove("active");
        typeDropdown.classList.remove("active");
      }
    }
  });

  // ===== TYPE-TO-SEARCH: pipe keystrokes into the active dropdown search =====
  // Works for both location dropdown (has a search input) and type dropdown (no search, so nothing to do).
  document.addEventListener("keydown", (e) => {
    // Only act when the location dropdown is open
    if (!locationDropdown || !locationDropdown.classList.contains("active")) return;
    if (!locationSearchInput) return;

    // Ignore modifier-only, navigation, or special keys
    const ignore = ["Tab", "Enter", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "Shift", "Control", "Alt", "Meta", "CapsLock", "F1", "F2", "F3", "F4",
      "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
    if (ignore.includes(e.key)) return;

    // If the user is already focused on the search input, let it handle naturally
    if (document.activeElement === locationSearchInput) return;

    // Otherwise redirect focus + the keystroke
    locationSearchInput.focus();
  });

  // ===== ACTIVE FILTERS DISPLAY =====

  function updateActiveFilters() {
    if (!activeFiltersContainer || !activeFiltersSection) return;

    activeFiltersContainer.innerHTML = "";

    const allFilters = [];

    // Add search filter
    if (nameSearch && nameSearch.value.trim()) {
      allFilters.push({
        type: "search",
        label: `Search: "${nameSearch.value}"`,
        icon: "fa-magnifying-glass",
        value: nameSearch.value
      });
    }

    // Add location filters
    selectedLocations.forEach(loc => {
      const checkbox = locationOptions.querySelector(`input[value="${loc}"]`);
      allFilters.push({
        type: "location",
        label: checkbox.dataset.label,
        icon: "fa-location-dot",
        value: loc
      });
    });

    // Add type filters
    selectedTypes.forEach(type => {
      allFilters.push({
        type: "type",
        label: type,
        icon: "fa-building",
        value: type
      });
    });

    // Add price filter
    if (priceSlider && priceSlider.value !== "0") {
      const labels = ["All", "<1Cr", "1Cr–2Cr", "2Cr–3Cr", "3Cr+"];
      allFilters.push({
        type: "price",
        label: labels[priceSlider.value],
        icon: "fa-indian-rupee-sign",
        value: priceSlider.value
      });
    }

    // Show/hide section
    if (allFilters.length > 0) {
      activeFiltersSection.classList.add("visible");
    } else {
      activeFiltersSection.classList.remove("visible");
    }

    // Create pills
    allFilters.forEach(filter => {
      const pill = document.createElement("div");
      pill.className = "filter-pill";
      pill.innerHTML = `
        <i class="fa-solid ${filter.icon} filter-pill-icon"></i>
        <span>${filter.label}</span>
        <div class="filter-pill-remove" data-type="${filter.type}" data-value="${filter.value}">
          <i class="fa-solid fa-xmark"></i>
        </div>
      `;

      // Add remove handler
      pill.querySelector(".filter-pill-remove").addEventListener("click", () => {
        removeFilter(filter.type, filter.value);
      });

      activeFiltersContainer.appendChild(pill);
    });
  }

  function removeFilter(type, value) {
    if (type === "search") {
      nameSearch.value = "";
    } else if (type === "location") {
      const checkbox = locationOptions.querySelector(`input[value="${value}"]`);
      if (checkbox) {
        checkbox.checked = false;
        selectedLocations = selectedLocations.filter(loc => loc !== value);
        updateLocationDisplay();

        // Update chip active state
        locChips.forEach(chip => {
          if (chip.dataset.location === value) {
            chip.classList.remove("active");
          }
        });
      }
    } else if (type === "type") {
      const checkbox = typeOptions.querySelector(`input[value="${value}"]`);
      if (checkbox) {
        checkbox.checked = false;
        selectedTypes = selectedTypes.filter(t => t !== value);
        updateTypeDisplay();
      }
    } else if (type === "price") {
      priceSlider.value = "0";
      priceText.innerText = "All";
    }

    updateActiveFilters();
    filterCards();
  }

  // ===== FILTER LOGIC =====

  function normalize(val = "") {
    return val.toLowerCase().replace(/-/g, " ").trim();
  }

  function getPriceRange(step) {
    switch (step) {
      case "1":
        return { min: 0, max: 100, label: "<1Cr" };
      case "2":
        return { min: 100, max: 200, label: "1Cr–2Cr" };
      case "3":
        return { min: 200, max: 300, label: "2Cr–3Cr" };
      case "4":
        return { min: 300, max: Infinity, label: "3Cr+" };
      default:
        return { min: 0, max: Infinity, label: "All" };
    }
  }

  function filterCards() {
    const searchValue = normalize(nameSearch.value);
    const priceStep = priceSlider.value;
    const priceRange = getPriceRange(priceStep);

    priceText.innerText = priceRange.label;

    let visible = 0;

    cards.forEach((card) => {
      const cardLocation = normalize(card.dataset.latest);
      const cardType = card.dataset.type;
      const price = parseInt(card.dataset.price || 0);
      const schemeName = normalize(card.querySelector(".scheme-name")?.innerText || "");

      let show = true;

      // Multi-location filter
      if (selectedLocations.length > 0) {
        const matchesLocation = selectedLocations.some(loc =>
          normalize(loc) === cardLocation
        );
        if (!matchesLocation) show = false;
      }

      // Multi-type filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(cardType)) show = false;
      }

      if (searchValue && !schemeName.includes(searchValue)) show = false;
      if (price < priceRange.min || price > priceRange.max) show = false;

      card.style.display = show ? "block" : "none";
      if (show) visible++;
    });

    if (noResult) {
      noResult.style.display = visible === 0 ? "flex" : "none";
    }
  }

  // ===== POPULAR LOCALITY CHIPS =====

  locChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const location = chip.dataset.location;
      const checkbox = locationOptions.querySelector(`input[value="${location}"]`);

      if (checkbox) {
        // Toggle checkbox
        checkbox.checked = !checkbox.checked;

        // Toggle chip active state
        chip.classList.toggle("active");

        // Update selected locations
        if (checkbox.checked) {
          if (!selectedLocations.includes(location)) {
            selectedLocations.push(location);
          }
        } else {
          selectedLocations = selectedLocations.filter(loc => loc !== location);
        }

        updateLocationDisplay();
        updateActiveFilters();
        filterCards();
      }
    });
  });

  // ===== EVENT LISTENERS =====

  priceSlider.addEventListener("input", () => {
    updateActiveFilters();
    filterCards();
  });

  nameSearch.addEventListener("input", () => {
    updateActiveFilters();
    filterCards();
  });

  // Clear Filters Button
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      // Reset search
      nameSearch.value = "";

      // Reset price
      priceSlider.value = "0";
      priceText.innerText = "All";

      // Clear location selections
      const locationCheckboxes = locationOptions.querySelectorAll('input[type="checkbox"]');
      locationCheckboxes.forEach(cb => cb.checked = false);
      selectedLocations = [];
      updateLocationDisplay();

      // Clear type selections
      const typeCheckboxes = typeOptions.querySelectorAll('input[type="checkbox"]');
      typeCheckboxes.forEach(cb => cb.checked = false);
      selectedTypes = [];
      updateTypeDisplay();

      // Clear chip active states
      locChips.forEach(chip => chip.classList.remove("active"));

      // Update display
      updateActiveFilters();
      filterCards();
    });
  }
}

// ==================== MOBILE TOP CARDS ====================
function initializeMobileTopCards() {
  document.querySelectorAll(".mobile-top-card").forEach((card) => {
    const data = JSON.parse(card.dataset.projects);
    const title = card.querySelector(".m-title");
    const sub = card.querySelector(".m-sub");

    let i = 0;

    title.textContent = data[0].name;
    sub.textContent = data[0].sub;
    card.style.backgroundImage = `url('${data[0].image}')`;

    function loadNextProject() {
      i = (i + 1) % data.length;
      title.classList.add("fade");
      sub.classList.add("fade");

      setTimeout(() => {
        title.textContent = data[i].name;
        sub.textContent = data[i].sub;
        card.style.backgroundImage = `url('${data[i].image}')`;
        title.classList.remove("fade");
        sub.classList.remove("fade");
      }, 300);
    }

    setInterval(loadNextProject, 4000);
  });
}

// ==================== DRAG TO SCROLL ====================
function initializeDragScroll() {
  if (window.innerWidth <= 768) return;

  const slider = document.querySelector(".top-picks-cards");
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    slider.style.userSelect = "none";
    slider.style.webkitUserSelect = "none";
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
    slider.style.userSelect = "";
    slider.style.webkitUserSelect = "";
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
    slider.style.userSelect = "";
    slider.style.webkitUserSelect = "";
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}

// ==================== NOTIFICATION ====================
function initializeNotification() {
  const bell = document.querySelector(".notification-icon");
  const box = document.querySelector(".notification-box");
  const closeBtn = document.querySelector(".close-btn");

  if (!bell || !box || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    box.classList.remove("active");
    box.classList.add("closing");
    box.addEventListener(
      "transitionend",
      () => box.classList.remove("closing"),
      { once: true }
    );
  });

  bell.addEventListener("click", () => {
    if (box.classList.contains("active")) {
      box.classList.remove("active");
      box.classList.add("closing");
      box.addEventListener(
        "animationend",
        () => {
          box.classList.remove("closing");
        },
        { once: true }
      );
    } else {
      box.classList.add("active");
    }
  });
}

// ==================== SCROLL ARROW ====================
function initializeScrollArrow() {
  const arrow = document.getElementById("scrollArrow");
  if (!arrow) return;

  const getPageHeight = () => document.documentElement.scrollHeight;
  const getViewport = () =>
    window.innerHeight || document.documentElement.clientHeight;
  let isHidden = false;

  arrow.classList.add("attention");

  function scrollDown() {
    const distance = Math.round(getViewport() * 0.9);
    window.scrollBy({ top: distance, left: 0, behavior: "smooth" });
  }

  function checkVisibility() {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    const viewport = getViewport();
    const pageHeight = getPageHeight();

    if (scrollTop + viewport >= pageHeight - 10) {
      arrow.classList.add("hidden");
      arrow.classList.remove("attention");
      isHidden = true;
      return;
    }

    const showWhenAbove = 120;
    if (scrollTop > showWhenAbove) {
    }

    arrow.classList.remove("hidden");
    if (!isHidden) arrow.classList.add("attention");
    isHidden = false;
  }

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    arrow.classList.remove("attention");
    scrollDown();
    setTimeout(() => {
      if (!arrow.classList.contains("hidden"))
        arrow.classList.add("attention");
    }, 3000);
  });

  arrow.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      arrow.click();
    }
  });

  window.addEventListener("scroll", checkVisibility, { passive: true });
  window.addEventListener("resize", checkVisibility);

  setTimeout(checkVisibility, 300);
}

// ==================== WHATSAPP BUTTONS ====================
function initializeWhatsAppButtons() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".whatsappBtn")) {
      e.preventDefault();
      const btn = e.target.closest(".whatsappBtn");
      const propertyCard = btn.closest(".Property-card");
      const propertyLocation = propertyCard.getAttribute("data-location");
      const message = `Hi, I am interested in ${propertyLocation}. Please share more details.`;
      const encodedMsg = encodeURIComponent(message);
      const waLink = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waLink, "_blank");
    }

    if (e.target.closest(".whatsappMobileBtn")) {
      const btn = e.target.closest(".whatsappMobileBtn");
      const card = btn.closest(".mobile-top-card");
      const title = card.querySelector(".m-title")?.textContent.trim() || "Property";
      const message = `Hi, I am interested in ${title}. Please share more details.`;
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMsg}`, "_blank");
    }
  });
}

// ==================== FORM LOGIC ====================
function initializeFormLogic() {
  const formOverlay = document.getElementById("formOverlay");
  const closeForm = document.getElementById("closeForm");

  if (!formOverlay || !closeForm) return;

  closeForm.addEventListener("click", () =>
    formOverlay.classList.remove("active")
  );

  document.querySelectorAll(".enquireBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const interest = btn.dataset.interest;
      const type = btn.dataset.type;

      formOverlay.classList.add("active");

      document.getElementById("interest").value = interest;
      toggleSubOptions();

      if (interest === "Residential") {
        document.getElementById("residentialOptions").value = type;
      } else if (interest === "Commercial") {
        document.getElementById("commercialOptions").value = type;
      }
    });
  });
}

function toggleSubOptions() {
  const interest = document.getElementById("interest").value;
  const residentialOptions = document.getElementById("residentialOptions");
  const commercialOptions = document.getElementById("commercialOptions");

  if (interest === "Residential") {
    residentialOptions.style.display = "block";
    residentialOptions.required = true;
    commercialOptions.style.display = "none";
    commercialOptions.required = false;
    commercialOptions.value = "";
  } else if (interest === "Commercial") {
    commercialOptions.style.display = "block";
    commercialOptions.required = true;
    residentialOptions.style.display = "none";
    residentialOptions.required = false;
    residentialOptions.value = "";
  } else {
    residentialOptions.style.display = "none";
    residentialOptions.required = false;
    residentialOptions.value = "";
    commercialOptions.style.display = "none";
    commercialOptions.required = false;
    commercialOptions.value = "";
  }
}

async function sendEmail(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const interest = document.getElementById("interest").value;
  const residentialType =
    interest === "Residential"
      ? document.getElementById("residentialOptions").value
      : "";
  const commercialType =
    interest === "Commercial"
      ? document.getElementById("commercialOptions").value
      : "";

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwdoQqSsuedYO3-LBvEQtoPLTnVayViO3J0voGgClcu2WVR5iLWc4X34Cq1YNbj3w19tQ/exec";

  const params = new URLSearchParams({
    name,
    phone,
    interest,
    residentialType,
    commercialType,
  });

  try {
    await fetch(`${scriptURL}?${params.toString()}`, {
      method: "GET",
    });
    alert("✅ Your inquiry has been submitted!");

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("interest").value = "";
    document.getElementById("residentialOptions").value = "";
    document.getElementById("commercialOptions").value = "";
    toggleSubOptions();

    document.getElementById("formOverlay").classList.remove("active");
  } catch (error) {
    alert("❌ Something went wrong, please try again.");
  }
}

// ==================== LOGO ROTATION ====================
function initializeLogoRotation() {
  const logo = document.getElementById("logo");
  if (!logo) return;

  const firstLogo = new Image();
  const secondLogo = new Image();
  firstLogo.src = "images/ESEFF REAL ESTATE LOGO (3).png";
  secondLogo.src = "images/ESEFF REAL ESTATE LOGO (6).png";

  Promise.all([
    new Promise((res) => (firstLogo.onload = res)),
    new Promise((res) => (secondLogo.onload = res)),
  ]).then(() => {
    setTimeout(() => {
      logo.classList.add("rotate");

      setTimeout(() => {
        logo.src = secondLogo.src;
        logo.classList.remove("rotate");
        logo.style.transform = "rotateY(360deg)";
      }, 750);
    }, 1500);
  });
}

// ==================== ONLINE STATUS ====================
function checkOnlineStatus() {
  const offlinePage = document.getElementById("offlinePage");
  if (!offlinePage) return;

  // Hide loading screen once page is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      offlinePage.style.display = "none";
    }, 100);
  });

  function updateOnlineStatus() {
    if (!navigator.onLine) {
      offlinePage.style.display = "flex";
    } else {
      offlinePage.style.display = "none";
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();

  // Only show loading screen for actual network errors, not resource loading errors
  window.addEventListener("error", (event) => {
    // Ignore resource loading errors (images, stylesheets, etc.)
    if (event.target !== window) {
      return;
    }
    // Only show for actual JavaScript errors
    offlinePage.style.display = "flex";

    // Auto-hide after 3 seconds if page recovers
    setTimeout(() => {
      if (navigator.onLine) {
        offlinePage.style.display = "none";
      }
    }, 3000);
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    // Only show for network-related rejections
    if (event.reason && event.reason.message &&
      (event.reason.message.includes("Failed to fetch") ||
        event.reason.message.includes("Network"))) {
      offlinePage.style.display = "flex";

      // Auto-hide after 3 seconds if page recovers
      setTimeout(() => {
        if (navigator.onLine) {
          offlinePage.style.display = "none";
        }
      }, 3000);
    }
  });
}

// ==================== MENU TOGGLE ====================
function initializeMenuToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");
  const overlay = document.getElementById("overlay");

  if (!menuToggle || !mobileMenu || !closeMenu || !overlay) return;

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    overlay.classList.add("show");
  });

  const closeNow = () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("show");
  };

  closeMenu.addEventListener("click", closeNow);
  overlay.addEventListener("click", closeNow);
}

// ==================== REFER BUTTON ====================
function initializeReferButton() {
  const btn = document.getElementById("referBtn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.preventDefault();

    btn.classList.remove("play");
    void btn.offsetWidth;
    btn.classList.add("play");

    setTimeout(() => {
      window.location.href = btn.href;
    }, 2000);
  });
}

// ==================== NO RESULT FUNCTIONS ====================
function showComingSoon() {
  const noResult = document.querySelector(".no-result");
  if (noResult) noResult.style.display = "flex";
}

function hideComingSoon() {
  const noResult = document.querySelector(".no-result");
  if (noResult) noResult.style.display = "none";
}

// ==================== MOBILE FILTERS ====================
function initializeMobileFilters() {
  const modal = document.getElementById("mobileFilterModal");
  const openBtn = document.getElementById("mobileAllFiltersBtn");
  const closeBtn = document.getElementById("closeFilterModal");
  const applyBtn = document.getElementById("mobileApplyFilters");
  const clearBtn = document.getElementById("mobileClearAll");

  const mobileSearch = document.getElementById("mobileSearch");
  const mobileBudgetSlider = document.getElementById("mobileBudgetSlider");
  const mobileBudgetText = document.getElementById("mobileBudgetText");

  // Mobile multi-select elements
  const mobileLocationOptions = document.getElementById("mobileLocationOptions");
  const mobileTypeOptions = document.getElementById("mobileTypeOptions");
  const mobileSelectAllLocationsBtn = document.getElementById("mobileSelectAllLocations");
  const mobileDeselectAllLocationsBtn = document.getElementById("mobileDeselectAllLocations");
  const mobileSelectAllTypesBtn = document.getElementById("mobileSelectAllTypes");
  const mobileDeselectAllTypesBtn = document.getElementById("mobileDeselectAllTypes");
  const mobileLocationSearch = document.getElementById("mobileLocationSearch");

  // Collapsible triggers
  const mobileLocationTrigger = document.getElementById("mobileLocationTrigger");
  const mobileTypeTrigger = document.getElementById("mobileTypeTrigger");
  const mobileLocationDropdown = document.getElementById("mobileLocationDropdown");
  const mobileTypeDropdown = document.getElementById("mobileTypeDropdown");
  const mobileLocationSelected = document.getElementById("mobileLocationSelected");
  const mobileTypeSelected = document.getElementById("mobileTypeSelected");

  // Desktop filter elements (for syncing)
  const desktopSearch = document.getElementById("propSearch");
  const desktopLocationOptions = document.getElementById("locationOptions");
  const desktopTypeOptions = document.getElementById("typeOptions");
  const desktopPrice = document.getElementById("propPriceSlider");

  // Mobile active filters (outside modal)
  const mobileActiveFilters = document.getElementById("mobileActiveFilters");

  // Mobile popular chips
  const mobilePopularChips = document.querySelectorAll(".mobile-popular-chip");

  if (!modal || !openBtn) return;

  // Budget slider update
  if (mobileBudgetSlider && mobileBudgetText) {
    mobileBudgetSlider.addEventListener("input", () => {
      const labels = ["All", "<1Cr", "1Cr–2Cr", "2Cr–3Cr", "3Cr+"];
      mobileBudgetText.textContent = labels[mobileBudgetSlider.value];
    });
  }

  // Real-time mobile search — sync to desktop input and trigger filterCards immediately
  if (mobileSearch && desktopSearch) {
    mobileSearch.addEventListener("input", () => {
      desktopSearch.value = mobileSearch.value;
      desktopSearch.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  // Collapsible sections
  if (mobileLocationTrigger && mobileLocationDropdown) {
    mobileLocationTrigger.addEventListener("click", () => {
      const isExpanded = mobileLocationDropdown.classList.contains("expanded");

      // Close other dropdowns
      if (mobileTypeDropdown) {
        mobileTypeDropdown.classList.remove("expanded");
        mobileTypeTrigger.classList.remove("expanded");
      }

      // Toggle this dropdown
      if (isExpanded) {
        mobileLocationDropdown.classList.remove("expanded");
        mobileLocationTrigger.classList.remove("expanded");
        // Clear search when closing
        if (mobileLocationSearch) {
          mobileLocationSearch.value = "";
          mobileLocationSearch.dispatchEvent(new Event("input"));
        }
      } else {
        mobileLocationDropdown.classList.add("expanded");
        mobileLocationTrigger.classList.add("expanded");
        // Auto-focus search when opening
        if (mobileLocationSearch) {
          setTimeout(() => mobileLocationSearch.focus(), 100);
        }
      }
    });
  }

  if (mobileTypeTrigger && mobileTypeDropdown) {
    mobileTypeTrigger.addEventListener("click", () => {
      const isExpanded = mobileTypeDropdown.classList.contains("expanded");

      // Close other dropdowns (and clear their search)
      if (mobileLocationDropdown) {
        mobileLocationDropdown.classList.remove("expanded");
        mobileLocationTrigger.classList.remove("expanded");
        if (mobileLocationSearch) {
          mobileLocationSearch.value = "";
          mobileLocationSearch.dispatchEvent(new Event("input"));
        }
      }

      // Toggle this dropdown
      if (isExpanded) {
        mobileTypeDropdown.classList.remove("expanded");
        mobileTypeTrigger.classList.remove("expanded");
      } else {
        mobileTypeDropdown.classList.add("expanded");
        mobileTypeTrigger.classList.add("expanded");
      }
    });
  }

  // ===== TYPE-TO-SEARCH in mobile modal: pipe keystrokes into location search =====
  if (modal) {
    modal.addEventListener("keydown", (e) => {
      // Only when location dropdown is expanded (it's the only one with a search input)
      if (!mobileLocationDropdown || !mobileLocationDropdown.classList.contains("expanded")) return;
      if (!mobileLocationSearch) return;

      const ignore = ["Tab", "Enter", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "Shift", "Control", "Alt", "Meta", "CapsLock", "F1", "F2", "F3", "F4",
        "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
      if (ignore.includes(e.key)) return;

      // If already focused on the search input, let it handle naturally
      if (document.activeElement === mobileLocationSearch) return;

      // Redirect focus to the search input (the keystroke will land there naturally)
      mobileLocationSearch.focus();
    });
  }

  // Update selected text for locations
  function updateLocationSelectedText() {
    if (!mobileLocationOptions || !mobileLocationSelected) return;

    const checkedBoxes = mobileLocationOptions.querySelectorAll('input[type="checkbox"]:checked');
    const count = checkedBoxes.length;

    if (count === 0) {
      mobileLocationSelected.textContent = "All Locations";
    } else if (count === 1) {
      mobileLocationSelected.textContent = checkedBoxes[0].dataset.label;
    } else {
      mobileLocationSelected.textContent = `${count} Locations Selected`;
    }
  }

  // Update selected text for types
  function updateTypeSelectedText() {
    if (!mobileTypeOptions || !mobileTypeSelected) return;

    const checkedBoxes = mobileTypeOptions.querySelectorAll('input[type="checkbox"]:checked');
    const count = checkedBoxes.length;

    if (count === 0) {
      mobileTypeSelected.textContent = "All Types";
    } else if (count === 1) {
      mobileTypeSelected.textContent = checkedBoxes[0].dataset.label;
    } else {
      mobileTypeSelected.textContent = `${count} Types Selected`;
    }
  }

  // Listen to checkbox changes
  if (mobileLocationOptions) {
    mobileLocationOptions.addEventListener("change", updateLocationSelectedText);
  }
  if (mobileTypeOptions) {
    mobileTypeOptions.addEventListener("change", updateTypeSelectedText);
  }

  // Open modal
  openBtn.addEventListener("click", () => {
    // Sync desktop selections to mobile before opening
    syncDesktopToMobile();
    updateLocationSelectedText();
    updateTypeSelectedText();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Quick filter buttons - Location, Type, Budget
  const mobileLocationBtn = document.getElementById("mobileLocationBtn");
  const mobileTypeBtn = document.getElementById("mobileTypeBtn");
  const mobileBudgetBtn = document.getElementById("mobileBudgetBtn");

  if (mobileLocationBtn) {
    mobileLocationBtn.addEventListener("click", () => {
      // Sync desktop selections to mobile before opening
      syncDesktopToMobile();
      updateLocationSelectedText();
      updateTypeSelectedText();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Auto-expand location section
      setTimeout(() => {
        if (mobileLocationDropdown && mobileLocationTrigger) {
          mobileLocationDropdown.classList.add("expanded");
          mobileLocationTrigger.classList.add("expanded");
        }
      }, 100);
    });
  }

  if (mobileTypeBtn) {
    mobileTypeBtn.addEventListener("click", () => {
      // Sync desktop selections to mobile before opening
      syncDesktopToMobile();
      updateLocationSelectedText();
      updateTypeSelectedText();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Auto-expand type section
      setTimeout(() => {
        if (mobileTypeDropdown && mobileTypeTrigger) {
          mobileTypeDropdown.classList.add("expanded");
          mobileTypeTrigger.classList.add("expanded");
        }
      }, 100);
    });
  }

  if (mobileBudgetBtn) {
    mobileBudgetBtn.addEventListener("click", () => {
      // Sync desktop selections to mobile before opening
      syncDesktopToMobile();
      updateLocationSelectedText();
      updateTypeSelectedText();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Scroll to budget section
      setTimeout(() => {
        const budgetSection = document.querySelector('.mobile-filter-section:has(#mobileBudgetSlider)');
        if (budgetSection) {
          budgetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    });
  }

  // Close modal
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";

    // Collapse all dropdowns when closing
    if (mobileLocationDropdown) {
      mobileLocationDropdown.classList.remove("expanded");
      mobileLocationTrigger.classList.remove("expanded");
    }
    if (mobileTypeDropdown) {
      mobileTypeDropdown.classList.remove("expanded");
      mobileTypeTrigger.classList.remove("expanded");
    }

    // Update active filters outside modal
    updateMobileActiveFilters();
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Sync desktop to mobile
  function syncDesktopToMobile() {
    // Sync search
    if (mobileSearch && desktopSearch) {
      mobileSearch.value = desktopSearch.value;
    }

    // Sync locations — match by value, not by index (lists may differ in length/order)
    if (mobileLocationOptions && desktopLocationOptions) {
      const desktopCheckboxes = desktopLocationOptions.querySelectorAll('input[type="checkbox"]');

      desktopCheckboxes.forEach((desktopCb) => {
        const mobileCb = mobileLocationOptions.querySelector(`input[value="${desktopCb.value}"]`);
        if (mobileCb) {
          mobileCb.checked = desktopCb.checked;
        }
      });
    }

    // Sync types — match by value, not by index
    if (mobileTypeOptions && desktopTypeOptions) {
      const desktopCheckboxes = desktopTypeOptions.querySelectorAll('input[type="checkbox"]');

      desktopCheckboxes.forEach((desktopCb) => {
        const mobileCb = mobileTypeOptions.querySelector(`input[value="${desktopCb.value}"]`);
        if (mobileCb) {
          mobileCb.checked = desktopCb.checked;
        }
      });
    }

    // Sync price
    if (mobileBudgetSlider && desktopPrice) {
      mobileBudgetSlider.value = desktopPrice.value;
      const labels = ["All", "<1Cr", "1Cr–2Cr", "2Cr–3Cr", "3Cr+"];
      mobileBudgetText.textContent = labels[mobileBudgetSlider.value];
    }

    // Sync popular chips
    syncPopularChips();
  }

  // Sync mobile to desktop
  function syncMobileToDesktop() {
    // Sync search
    if (mobileSearch && desktopSearch) {
      desktopSearch.value = mobileSearch.value;
    }

    // Sync locations — match by value, dispatch change events so selectedLocations array updates
    if (mobileLocationOptions && desktopLocationOptions) {
      const mobileCheckboxes = mobileLocationOptions.querySelectorAll('input[type="checkbox"]');

      mobileCheckboxes.forEach((mobileCb) => {
        const desktopCb = desktopLocationOptions.querySelector(`input[value="${mobileCb.value}"]`);
        if (desktopCb) {
          const wasChecked = desktopCb.checked;
          desktopCb.checked = mobileCb.checked;
          // Only dispatch if state actually changed, to trigger the change listener
          // which updates selectedLocations and calls filterCards()
          if (wasChecked !== mobileCb.checked) {
            desktopCb.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
      });
    }

    // Sync types — match by value, dispatch change events so selectedTypes array updates
    if (mobileTypeOptions && desktopTypeOptions) {
      const mobileCheckboxes = mobileTypeOptions.querySelectorAll('input[type="checkbox"]');

      mobileCheckboxes.forEach((mobileCb) => {
        const desktopCb = desktopTypeOptions.querySelector(`input[value="${mobileCb.value}"]`);
        if (desktopCb) {
          const wasChecked = desktopCb.checked;
          desktopCb.checked = mobileCb.checked;
          if (wasChecked !== mobileCb.checked) {
            desktopCb.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
      });
    }

    // Sync price — dispatch input event so filterCards() picks up the new value
    if (mobileBudgetSlider && desktopPrice) {
      desktopPrice.value = mobileBudgetSlider.value;
      desktopPrice.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // Sync popular chips
    syncPopularChips();
  }

  // Sync popular chips based on location checkboxes
  function syncPopularChips() {
    if (!mobileLocationOptions) return;

    mobilePopularChips.forEach(chip => {
      const location = chip.dataset.location;
      const checkbox = mobileLocationOptions.querySelector(`input[value="${location}"]`);

      if (checkbox && checkbox.checked) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }

  // Mobile location search
  if (mobileLocationSearch && mobileLocationOptions) {
    mobileLocationSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const options = mobileLocationOptions.querySelectorAll(".mobile-multiselect-option");

      options.forEach(option => {
        const text = option.querySelector("span").textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          option.style.display = "flex";
        } else {
          option.style.display = "none";
        }
      });
    });
  }

  // Select All Locations
  if (mobileSelectAllLocationsBtn && mobileLocationOptions) {
    mobileSelectAllLocationsBtn.addEventListener("click", () => {
      const checkboxes = mobileLocationOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = true);
      updateLocationSelectedText();
    });
  }

  // Deselect All Locations
  if (mobileDeselectAllLocationsBtn && mobileLocationOptions) {
    mobileDeselectAllLocationsBtn.addEventListener("click", () => {
      const checkboxes = mobileLocationOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      updateLocationSelectedText();
    });
  }

  // Select All Types
  if (mobileSelectAllTypesBtn && mobileTypeOptions) {
    mobileSelectAllTypesBtn.addEventListener("click", () => {
      const checkboxes = mobileTypeOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = true);
      updateTypeSelectedText();
    });
  }

  // Deselect All Types
  if (mobileDeselectAllTypesBtn && mobileTypeOptions) {
    mobileDeselectAllTypesBtn.addEventListener("click", () => {
      const checkboxes = mobileTypeOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      updateTypeSelectedText();
    });
  }

  // Update active filters outside modal
  function updateMobileActiveFilters() {
    if (!mobileActiveFilters) return;

    mobileActiveFilters.innerHTML = "";
    const filters = [];

    // Add location filters
    if (mobileLocationOptions) {
      const checkedBoxes = mobileLocationOptions.querySelectorAll('input[type="checkbox"]:checked');
      checkedBoxes.forEach(cb => {
        filters.push({
          type: "location",
          label: cb.dataset.label,
          value: cb.value
        });
      });
    }

    // Add type filters
    if (mobileTypeOptions) {
      const checkedBoxes = mobileTypeOptions.querySelectorAll('input[type="checkbox"]:checked');
      checkedBoxes.forEach(cb => {
        filters.push({
          type: "type",
          label: cb.dataset.label,
          value: cb.value
        });
      });
    }

    // Show/hide section
    if (filters.length > 0) {
      mobileActiveFilters.classList.add("visible");
    } else {
      mobileActiveFilters.classList.remove("visible");
    }

    // Create pills
    filters.forEach(filter => {
      const pill = document.createElement("div");
      pill.className = "filter-pill";
      pill.innerHTML = `
        <span>${filter.label}</span>
        <div class="filter-pill-remove" data-type="${filter.type}" data-value="${filter.value}">
          <i class="fa-solid fa-xmark"></i>
        </div>
      `;

      pill.querySelector(".filter-pill-remove").addEventListener("click", () => {
        if (filter.type === "location") {
          const checkbox = mobileLocationOptions.querySelector(`input[value="${filter.value}"]`);
          if (checkbox) {
            checkbox.checked = false;

            // Sync to desktop
            if (desktopLocationOptions) {
              const desktopCheckbox = desktopLocationOptions.querySelector(`input[value="${filter.value}"]`);
              if (desktopCheckbox) {
                desktopCheckbox.checked = false;
                desktopCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }
          }
        } else if (filter.type === "type") {
          const checkbox = mobileTypeOptions.querySelector(`input[value="${filter.value}"]`);
          if (checkbox) {
            checkbox.checked = false;

            // Sync to desktop
            if (desktopTypeOptions) {
              const desktopCheckbox = desktopTypeOptions.querySelector(`input[value="${filter.value}"]`);
              if (desktopCheckbox) {
                desktopCheckbox.checked = false;
                desktopCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }
          }
        }

        updateLocationSelectedText();
        updateTypeSelectedText();
        updateMobileActiveFilters();
        syncPopularChips();
      });

      mobileActiveFilters.appendChild(pill);
    });
  }

  // Mobile popular chips (outside modal) - support multi-select
  mobilePopularChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const location = chip.dataset.location;

      // Toggle chip active state
      chip.classList.toggle("active");

      // Sync with mobile location checkboxes
      if (mobileLocationOptions) {
        const mobileCheckbox = mobileLocationOptions.querySelector(`input[value="${location}"]`);
        if (mobileCheckbox) {
          mobileCheckbox.checked = chip.classList.contains("active");
        }
      }

      // Sync with desktop
      if (desktopLocationOptions) {
        const desktopCheckbox = desktopLocationOptions.querySelector(`input[value="${location}"]`);
        if (desktopCheckbox) {
          desktopCheckbox.checked = chip.classList.contains("active");
          // Trigger desktop filter update
          desktopCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }

      updateMobileActiveFilters();
    });
  });

  // Apply filters
  applyBtn.addEventListener("click", () => {
    syncMobileToDesktop();
    closeModal();
  });

  // Clear all filters
  clearBtn.addEventListener("click", () => {
    if (mobileSearch) mobileSearch.value = "";

    if (mobileLocationOptions) {
      const checkboxes = mobileLocationOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
    }

    if (mobileTypeOptions) {
      const checkboxes = mobileTypeOptions.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
    }

    if (mobileBudgetSlider) {
      mobileBudgetSlider.value = "0";
      mobileBudgetText.textContent = "All";
    }

    // Clear mobile popular chips
    mobilePopularChips.forEach(chip => chip.classList.remove("active"));

    updateLocationSelectedText();
    updateTypeSelectedText();
    syncMobileToDesktop();

    // Trigger desktop filter update
    if (desktopSearch) {
      desktopSearch.dispatchEvent(new Event("input"));
    }

    closeModal();
  });
}


// ==================== IMAGE LIGHTBOX GALLERY ====================
function initializeLightbox() {
  const lightboxOverlay = document.getElementById("lightboxOverlay");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxThumbnails = document.getElementById("lightboxThumbnails");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const currentImageIndex = document.getElementById("currentImageIndex");
  const totalImages = document.getElementById("totalImages");

  if (!lightboxOverlay) return;

  let currentImages = [];
  let currentIndex = 0;
  let startX = 0;
  let startY = 0;

  // Open lightbox when clicking on property card images
  document.addEventListener("click", (e) => {
    if (e.target.closest(".whatsappBtn")) {
      return;
    }

    if (e.target.closest(".Property-details")) {
      return;
    }

    const propertyCard = e.target.closest(".Property-card");
    if (!propertyCard) {
      return;
    }

    if (!propertyCard.classList.contains("has-images")) {
      return;
    }

    const imagesData = propertyCard.dataset.images;
    if (!imagesData) {
      return;
    }

    try {
      currentImages = JSON.parse(imagesData).filter(img => img.trim());
      if (currentImages.length === 0) {
        return;
      }

      const titleElement = propertyCard.querySelector(".Property-details h2");
      let propertyTitle = "Property";
      if (titleElement) {
        const titleText = titleElement.childNodes[0];
        propertyTitle = titleText ? titleText.textContent.trim() : titleElement.textContent.split('\n')[0].trim();
      }

      e.preventDefault();
      e.stopPropagation();

      openLightbox(0, propertyTitle);
    } catch (error) {
      return;
    }
  });

  function openLightbox(index, title) {
    currentIndex = index;
    lightboxTitle.textContent = title;
    totalImages.textContent = currentImages.length;

    lightboxOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    showImage(currentIndex);
    createThumbnails();
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove("active");
    document.body.style.overflow = "";
    currentImages = [];
    currentIndex = 0;
  }

  function showImage(index) {
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;

    currentIndex = index;
    currentImageIndex.textContent = currentIndex + 1;

    // Fade out current image
    lightboxImage.style.opacity = "0";

    setTimeout(() => {
      lightboxImage.src = currentImages[currentIndex];
      lightboxImage.style.opacity = "1";

      // Update active thumbnail
      updateActiveThumbnail();
    }, 150);
  }

  function createThumbnails() {
    lightboxThumbnails.innerHTML = "";

    currentImages.forEach((imageSrc, index) => {
      const thumbDiv = document.createElement("div");
      thumbDiv.className = "lightbox-thumbnail";
      if (index === currentIndex) thumbDiv.classList.add("active");

      const thumbImg = document.createElement("img");
      thumbImg.src = imageSrc;
      thumbImg.alt = `Thumbnail ${index + 1}`;

      thumbDiv.appendChild(thumbImg);
      thumbDiv.addEventListener("click", () => showImage(index));

      lightboxThumbnails.appendChild(thumbDiv);
    });
  }

  function updateActiveThumbnail() {
    const thumbnails = lightboxThumbnails.querySelectorAll(".lightbox-thumbnail");
    thumbnails.forEach((thumb, index) => {
      if (index === currentIndex) {
        thumb.classList.add("active");
        // Scroll thumbnail into view
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        thumb.classList.remove("active");
      }
    });
  }

  function nextImage() {
    showImage(currentIndex + 1);
  }

  function prevImage() {
    showImage(currentIndex - 1);
  }

  // Event Listeners
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", nextImage);
  lightboxPrev.addEventListener("click", prevImage);

  // Close when clicking anywhere on the overlay background.
  // Only keep open if clicking on actual interactive content inside the container.
  lightboxOverlay.addEventListener("click", (e) => {
    const isInteractive = e.target.closest(
      ".lightbox-image, .lightbox-nav, .lightbox-thumbnails, .lightbox-close, .lightbox-counter, .lightbox-title, .lightbox-title"
    );
    if (!isInteractive) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightboxOverlay.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    }
  });

  // Touch/Swipe support for mobile
  lightboxImage.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  lightboxImage.addEventListener("touchend", (e) => {
    if (!startX || !startY) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
          // Swiped left - show next
          nextImage();
        } else {
          // Swiped right - show previous
          prevImage();
        }
      }
    }

    startX = 0;
    startY = 0;
  });
}
