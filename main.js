const phoneNumber = "919033784030";

const canonicalTypeMap = {
  residential: "Residential",
  apartments: "Apartments",
  commercial: "Commercial",
  duplex: "Duplex",
  triplex: "Triplex",
  penthouse: "Penthouse",
  plot: "Plot",
  "duplex penthouse": "Duplex Penthouse",
  mixed: "Mixed",
  offices: "Offices",
  showrooms: "Showrooms",
  villas: "Villas"
};

function canonicalizeTypeToken(type = "") {
  const key = String(type).trim().toLowerCase();
  return canonicalTypeMap[key] || "";
}

function resolveEffectiveSelectedTypes(types = []) {
  const normalized = new Set(types.map(canonicalizeTypeToken).filter(Boolean));
  const finalTypes = new Set(normalized);
  
  if (normalized.has("Residential")) {
    finalTypes.add("Apartments");
    finalTypes.add("Duplex");
    finalTypes.add("Triplex");
    finalTypes.add("Penthouse");
    finalTypes.add("Mixed");
    finalTypes.add("Villas");
  }
  
  if (normalized.has("Commercial")) {
    finalTypes.add("Offices");
    finalTypes.add("Showrooms");
    finalTypes.add("Mixed");
  }
  
  return [...finalTypes];
}

function getCardFilterTypes(data = {}) {
  const typeSet = new Set();
  const baseType = canonicalizeTypeToken(data.type);
  const title = String(data.title || "").toLowerCase();

  if (baseType === "Duplex Penthouse") {
    typeSet.add("Duplex");
    typeSet.add("Penthouse");
  } else if (baseType) {
    typeSet.add(baseType);
  }

  // Only residential-family cards can gain duplex/penthouse tags from title text.
  if (baseType !== "Commercial" && baseType !== "Plot") {
    if (title.includes("duplex") && !title.includes("duplex penthouse")) typeSet.add("Duplex");
    if (title.includes("penthouse") && !title.includes("duplex penthouse")) typeSet.add("Penthouse");
    if (title.includes("duplex penthouse")) {
      typeSet.add("Duplex");
      typeSet.add("Penthouse");
    }
  }

  if (data.nestedCategories) {
    Object.keys(data.nestedCategories).forEach(key => {
      const mappedKey = canonicalizeTypeToken(key);
      if (mappedKey) {
        if (mappedKey === "Duplex Penthouse") {
          typeSet.add("Duplex");
          typeSet.add("Penthouse");
        } else {
          typeSet.add(mappedKey);
        }
      }
    });
  }

  return Array.from(typeSet);
}

function parseLocationMeta(rawLocation = "") {
  const raw = String(rawLocation || "").trim();
  if (!raw) {
    return { full: "", base: "", seq: Number.MAX_SAFE_INTEGER };
  }

  const match = raw.match(/^(.*?)(?:[-_\s]+(\d+))?$/);
  const baseRaw = (match?.[1] || raw).replace(/[-_\s]+$/, "").trim();
  const seqRaw = match?.[2];
  const seq = seqRaw ? parseInt(seqRaw, 10) : Number.MAX_SAFE_INTEGER;

  return {
    full: raw,
    base: baseRaw.toLowerCase(),
    seq: Number.isFinite(seq) ? seq : Number.MAX_SAFE_INTEGER
  };
}

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
    if (cardElement) {
      container.appendChild(cardElement);
    }
  });

  setTimeout(() => {
    initializeSlideshow();
  }, 100);
}

function createPropertyCard(data) {
  // Set defaults for all cards
  data.toggleLayout = "nested";
  data.statusBadge = "LOAN READY";
  
  const card = document.createElement("div");
  card.className = "Property-card";
  if (data.id) card.setAttribute("data-id", data.id);
  if (data.type) card.setAttribute("data-type", data.type);
  if (data.latest) card.setAttribute("data-latest", data.latest);
  if (data.price) card.setAttribute("data-price", data.price);
  if (data.images) card.setAttribute("data-images", JSON.stringify(data.images));

  const locationMeta = parseLocationMeta(data.propertyLocation || data.locationTag || data.location || data.latest || "");
  if (locationMeta.full) card.setAttribute("data-location", locationMeta.full);
  if (locationMeta.base) card.setAttribute("data-location-base", locationMeta.base);
  if (locationMeta.seq !== Number.MAX_SAFE_INTEGER) card.setAttribute("data-location-seq", String(locationMeta.seq));

  if (data.soldOut) {
    card.classList.add("sold-out");
  }

  const hasImages = data.images && data.images.length > 0;
  if (hasImages) {
    card.classList.add("has-images");
  }

  const firstImage = hasImages ? data.images[0] : '';
  const location = locationMeta.full || '';
  const status = data.soldOut ? 'Sold Out' : (data.type === 'Residential' ? 'Ready to Move' : 'New Launch');
  
  if (!data) return null;
  const badStr = ((data.title || '') + ' ' + (data.schemeName || '')).toLowerCase();
  const badKeywords = ['fully furnished', 'pre-leased', 'pre leased', 'ground floor showroom', 'investment property', 'corporate house', 'ready to move fully furnished'];
  const isBad = badKeywords.some(bw => badStr.includes(bw));
  if (isBad) return null;

  const scheme = typeof data.schemeName === 'string' ? data.schemeName.trim() : '';
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const projectName = scheme || title || 'Property';

  
  
  // Build Configs
  let configs = [];
  if (data.categories && data.categories.length > 0) {
    const cleanText = (val) => {
      if (val == null) return '-';
      return String(val)
        .replace(/\(.*?\)/g, '')
        .replace(/box\s*price\*?/ig, '')
        .replace(/\*?inc\.?all\*?/ig, '')
        .replace(/onwards\*?/ig, '')
        .replace(/\s+/g, ' ')
        .replace(/\.+$/g, '')
        .trim();
    };

    configs = data.categories.map((c, idx) => ({
      label: c.bhk,
      sqft: cleanText(c.sqft),
      price: cleanText(c.price),
      sqftType: c.sqftType || ''
    }));
  } else {
    // Advanced parsing from title/features
    let labels = [];
    const t = ((data.title || "") + " " + (data.schemeName || "") + " " + (data.features ? data.features.join(" ") : "")).toLowerCase();
    
    if (data.type === "Commercial") {
        if (t.includes("office")) labels.push("Offices");
        if (t.includes("showroom")) labels.push("Showrooms");
        if (t.includes("shop")) labels.push("Shops");
        if (labels.length === 0) labels.push("Commercial");
    } else {
        const bhkRegex = /((?:\d+(?:\.\d+)?[^a-zA-Z\d]*)+bhk(?:\s*(?:duplex\s*penthouse|duplex|penthouse))?)/g;
        const matches = [...t.matchAll(bhkRegex)].map(m => m[1]);
        
        let foundDigits = false;
        for (const phrase of matches) {
            const suffixMatch = phrase.match(/(duplex\s*penthouse|duplex|penthouse)/);
            const suffix = suffixMatch ? suffixMatch[1].split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";
            
            const digits = phrase.match(/\d+(?:\.\d+)?/g) || [];
            for (const d of digits) {
                let text = d + " BHK";
                if (suffix) text += " " + suffix;
                labels.push(text);
                foundDigits = true;
            }
        }
        
        if (!foundDigits) {
            if (t.includes("duplex penthouse")) labels.push("Duplex Penthouse");
            else if (t.includes("penthouse")) labels.push("Penthouse");
            else if (t.includes("duplex")) labels.push("Duplex");
        } else if (t.includes("penthouse") && !labels.some(l => l.includes("Penthouse"))) {
            labels[labels.length - 1] += " Penthouse";
        } else if (t.includes("duplex") && !labels.some(l => l.includes("Duplex"))) {
            labels[labels.length - 1] += " Duplex";
        }

        if (labels.length === 0) labels.push("Residential");

        // Remove duplicates
        labels = [...new Set(labels)];
    }

    const splitRange = (val, count) => {
      if (typeof val === 'string') {
        val = val
          .replace(/\(.*?\)/g, '')
          .replace(/box\s*price\*?/ig, '')
          .replace(/\*?inc\.?all\*?/ig, '')
          .replace(/onwards\*?/ig, '')
          .replace(/\s+/g, ' ')
          .replace(/\.+$/g, '')
          .trim();
      }

        if (!val) return Array(count).fill('-');
        let p = String(val).split(/\s*-\s*|\s+to\s+/i).filter(Boolean);
        if (p.length === 1) return Array(count).fill(val);
        let sufMatch = p[p.length-1].match(/[a-zA-Z\.%]+(?:\*[\s\S]*)?$/);
        let suf = sufMatch ? sufMatch[0] : '';
        p[0] = p[0].trim();
        if (!p[0].match(/[a-zA-Z]/) && suf) p[0] += " " + suf.replace(/\*/g, '');
        return Array(count).fill('').map((_, i) => p[i] !== undefined ? p[i].trim() : p[p.length-1].trim());
    };
    const priceArr = splitRange(data.priceText, labels.length);
    const sqftArr = splitRange(data.sqft, labels.length);

    configs = labels.map((lbl, idx) => ({
      label: lbl,
      sqft: sqftArr[idx],
      price: priceArr[idx],
      sqftType: data.sqftType || ''
    }));
  }
  
  // Truncate USPs to 4
  const visibleUsps = (data.features || []).slice(0, 4);
  const uspsHTML = visibleUsps.map(usp => `
    <li class="uspItem">
      <span class="uspIcon">★</span>
      <span class="uspText" title="${usp}">${usp}</span>
    </li>
  `).join('');

  const filterTypes = getCardFilterTypes(data);
  const allTypes = filterTypes.join("+");
  card.setAttribute("data-filter-types", allTypes);

  let toggleHTML = '';
  let initialConfig = configs[0] || {};
  let configsJSON = "[]";

  if (data.nestedCategories) {
    const keys = Object.keys(data.nestedCategories);
    
    // If only one category, show as single pill
    if (keys.length === 1) {
      toggleHTML = `<div class="categoryPill">${keys[0]}</div>`;
      const secConfigs = data.nestedCategories[keys[0]];
      // Create a secondary toggle only if multiple sub-categories
      if (secConfigs.length > 1) {
        const secOptionsStr = secConfigs.map((c, i) => `
          <div class="toggleOption secToggleOption ${i === 0 ? 'toggleOptionActive' : ''}" data-index="${i}">
            ${c.bhk}
          </div>
        `).join('');
        toggleHTML += `
          <div class="toggleContainer custom-center custom-small sec-container-margin">
            <div class="toggleThumb secThumb" style="width: ${100 / secConfigs.length}%; transform: translateX(0%);"></div>
            ${secOptionsStr}
          </div>
        `;
      } else {
        toggleHTML += `<div class="singleSizeTag">${secConfigs[0].bhk}</div>`;
      }
    } else {
      // Multiple categories - show as toggle container
      const primaryOptions = keys.map((k, i) => `
        <div class="toggleOption primaryToggleOption ${i === 0 ? 'toggleOptionActive' : ''}" data-index="${i}" data-key="${k}">
          ${k}
        </div>
      `).join('');
      
      toggleHTML = `
        <div class="nestedToggleWrapper">
          <div class="toggleContainer custom-center custom-small">
            <div class="toggleThumb primaryThumb" style="width: ${100 / keys.length}%; transform: translateX(0%);"></div>
            ${primaryOptions}
          </div>
          <div class="secondaryToggleContainer"></div>
        </div>
      `;
    }
    initialConfig = data.nestedCategories[keys[0]][0];
  } else if (configs.length > 0) {
    // Standard toggles (full-width, center, pill)
    configsJSON = JSON.stringify(configs).replace(/"/g, '&quot;');
    const layoutClass = data.toggleLayout === 'full-width' ? 'toggle-full-width' : data.toggleLayout === 'center' ? 'custom-center' : '';
    
    if (configs.length === 1 || data.toggleLayout === 'pill') {
      toggleHTML = `
        <div class="singleSizeTag">
          ${configs[0].bhk || configs[0].label}
        </div>
      `;
    } else {
      const toggleOptions = configs.map((c, i) => `
        <div class="toggleOption ${i === 0 ? 'toggleOptionActive' : ''}" data-index="${i}">
          ${c.bhk || c.label}
        </div>
      `).join('');
      toggleHTML = `
        <div class="toggleContainer ${layoutClass}">
          <div class="toggleThumb" style="width: ${100 / configs.length}%; transform: translateX(0%);"></div>
          ${toggleOptions}
        </div>
      `;
    }
  }

  card.innerHTML = `
    <div class="imageSection slideshow-img">
      <!-- Image is set via initializeSlideshow -->
      ${location ? `<div class="locationBadge">${location}</div>` : ''}
      <div class="loanReadyBadge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        LOAN READY
      </div>
      
    </div>

    <div class="cardBody">
      <div class="nameRow">
        <div class="projectName" title="${projectName}">${projectName}</div>
      </div>
      
      ${toggleHTML}
      <div class="detailsContainer" data-configs="${configsJSON}">
        <div class="detailsRow">
          <div class="detailCol">
            <span class="detailValue price-val">${initialConfig.price || '-'}</span>
            <span class="detailLabel">Box Price</span>
          </div>
          <div class="divider"></div>
          <div class="detailCol">
            <div style="display: flex; align-items: baseline; gap: 4px; justify-content: center;">
              <span class="detailValue sqft-val">${initialConfig.sqft || '-'}</span>
              <span class="detailLabel" style="margin:0; text-transform: lowercase; font-size: 0.85em;">sq.ft</span>
            </div>
            <span class="sqftTypeValue" style="${initialConfig.sqftType ? '' : 'display:none;'}; font-size: 11px; color: #666; font-weight: 500; margin-top: 2px;">${initialConfig.sqftType || ''}</span>
          </div>
        </div>
      </div>

      ${visibleUsps.length > 0 ? `<ul class="uspsList">${uspsHTML}</ul>` : ''}
    </div>

    <a href="https://wa.me/${phoneNumber}?text=I'm interested in ${projectName}" target="_blank" class="whatsappFab" data-type="${data.location}" aria-label="Contact on WhatsApp">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    </a>
  `;

  // Attach toggle listener
  const priceVal = card.querySelector('.price-val');
  const sqftVal = card.querySelector('.sqft-val');
  const sqftTypeValue = card.querySelector('.sqftTypeValue');
  

  const updateSqftType = (config = {}) => {
    if (!sqftTypeValue) return;
    const typeValue = (config.sqftType || '').trim();
    if (typeValue) {
      sqftTypeValue.textContent = typeValue;
      sqftTypeValue.style.display = '';
      
    } else {
      sqftTypeValue.textContent = '';
      sqftTypeValue.style.display = 'none';
      
    }
  };

  if (data.nestedCategories) {
    const keys = Object.keys(data.nestedCategories);
    if (keys.length > 1) {
      const primOptions = card.querySelectorAll('.primaryToggleOption');
      const primThumb = card.querySelector('.primaryThumb');
      const secContainer = card.querySelector('.secondaryToggleContainer');

      const renderSecondary = (keyIndex) => {
        if (!secContainer) return;
        const catKey = keys[keyIndex];
        const secConfigs = data.nestedCategories[catKey];

        if (secConfigs.length === 1) {
          secContainer.innerHTML = `<div class="singleSizeTag">${secConfigs[0].bhk}</div>`;
          priceVal.innerHTML = secConfigs[0].price || '-';
          sqftVal.innerHTML = secConfigs[0].sqft || '-';
          updateSqftType(secConfigs[0]);
        } else {
          const secOptionsStr = secConfigs.map((c, i) => `
            <div class="toggleOption secToggleOption ${i === 0 ? 'toggleOptionActive' : ''}" data-index="${i}">
              ${c.bhk}
            </div>
          `).join('');

          secContainer.innerHTML = `
            <div class="toggleContainer custom-center custom-small sec-container-margin">
              <div class="toggleThumb secThumb" style="width: ${100 / secConfigs.length}%; transform: translateX(0%);"></div>
              ${secOptionsStr}
            </div>
          `;

          priceVal.innerHTML = secConfigs[0].price || '-';
          sqftVal.innerHTML = secConfigs[0].sqft || '-';
          updateSqftType(secConfigs[0]);

          const secOptions = secContainer.querySelectorAll('.secToggleOption');
          const secThumb = secContainer.querySelector('.secThumb');
          secOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
              e.stopPropagation();
              document.dispatchEvent(new Event('toggleInteraction'));
              secOptions.forEach(o => o.classList.remove('toggleOptionActive'));
              opt.classList.add('toggleOptionActive');
              const idx = parseInt(opt.getAttribute('data-index'));
              if (secThumb) secThumb.style.transform = `translateX(${idx * 100}%)`;
              priceVal.innerHTML = secConfigs[idx].price || '-';
              sqftVal.innerHTML = secConfigs[idx].sqft || '-';
              updateSqftType(secConfigs[idx]);
            });
          });
        }
      };

      renderSecondary(0);

      primOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          document.dispatchEvent(new Event('toggleInteraction'));
          primOptions.forEach(o => o.classList.remove('toggleOptionActive'));
          opt.classList.add('toggleOptionActive');
          const idx = parseInt(opt.getAttribute('data-index'));
          if (primThumb) primThumb.style.transform = `translateX(${idx * 100}%)`;
          renderSecondary(idx);
        });
      });
    } else {
      const secConfigs = data.nestedCategories[keys[0]] || [];
      if (secConfigs.length > 1) {
        const secOptions = card.querySelectorAll('.secToggleOption');
        const secThumb = card.querySelector('.secThumb');
        secOptions.forEach(opt => {
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            document.dispatchEvent(new Event('toggleInteraction'));
            secOptions.forEach(o => o.classList.remove('toggleOptionActive'));
            opt.classList.add('toggleOptionActive');
            const idx = parseInt(opt.getAttribute('data-index'));
            if (secThumb) secThumb.style.transform = `translateX(${idx * 100}%)`;
            priceVal.innerHTML = secConfigs[idx].price || '-';
            sqftVal.innerHTML = secConfigs[idx].sqft || '-';
            updateSqftType(secConfigs[idx]);
          });
        });
      }
    }
  } else {
    // Normal toggle listener
    const toggleOptions = card.querySelectorAll('.toggleOption');
    if (toggleOptions.length > 0) {
      const thumb = card.querySelector('.toggleThumb');
      
      toggleOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          document.dispatchEvent(new Event('toggleInteraction'));
          toggleOptions.forEach(o => o.classList.remove('toggleOptionActive'));
          opt.classList.add('toggleOptionActive');
          const idx = parseInt(opt.getAttribute('data-index'));
          thumb.style.transform = `translateX(${idx * 100}%)`;
          priceVal.innerHTML = configs[idx].price || '-';
          sqftVal.innerHTML = configs[idx].sqft || '-';
          updateSqftType(configs[idx]);
        });
      });
    }
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

  if(container.querySelector('.slider-wrapper')) return; // do not overwrite badges

  const wrapper = document.createElement("div");
    wrapper.className = "slider-wrapper";

    const sliderTrack = document.createElement("div");
    sliderTrack.className = "slider-track";

    images.forEach((img, index) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.backgroundImage = `url('${img}')`;
      sliderTrack.appendChild(slide);
    });

    wrapper.appendChild(sliderTrack);
    container.insertBefore(wrapper, container.firstChild);

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
  const DESKTOP_GAP = 20;
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
    // On desktop, clear mobile-specific inline styles.
    const allCards = document.querySelectorAll(".Property-card");
    allCards.forEach(card => {
      card.style.margin = "";
    });
  }

  function applyDesktopCardSizes() {
    if (isMobile() || !sliderWindow) return;

    const W = sliderWindow.clientWidth;
    const cardWidth = (W - (DESKTOP_GAP * 2)) / 3;

    container.style.gap = DESKTOP_GAP + "px";

    const allCards = document.querySelectorAll(".Property-card");
    allCards.forEach(card => {
      card.style.flex = "0 0 " + cardWidth + "px";
      card.style.minWidth = cardWidth + "px";
      card.style.maxWidth = cardWidth + "px";
      card.style.width = cardWidth + "px";
      card.style.margin = "0";
    });
  }

  function getScrollDistance() {
    if (isMobile()) {
      return mobileSlotPx; // whole pixel, no drift
    }
    const firstVisible = getVisibleCards()[0];
    if (!firstVisible) return 0;
    const computedGap = parseFloat(window.getComputedStyle(container).gap) || DESKTOP_GAP;
    const cardWidth = firstVisible.getBoundingClientRect().width;
    return cardWidth + computedGap;
  }

  function moveSlider() {
    const dist = getScrollDistance();
    container.style.transform = `translateX(-${index * dist}px)`;
  }

  // Apply sizes on init
  if (isMobile()) {
    applyMobileCardSizes();
  } else {
    applyDesktopCardSizes();
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

  // Listen for toggle interactions from card toggles
  document.addEventListener("toggleInteraction", () => {
    handleUserInteraction();
  });

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
        applyDesktopCardSizes();
      }

      const maxIndex = isMobile() ? visibleCards.length - 1 : Math.max(0, visibleCards.length - 3);
      if (index > maxIndex) {
        index = 0;
      }
      moveSlider();

      if (!userInteracted) {
        startAutoScroll();
      }
    }, 1000);
  });

  const observer = new MutationObserver(() => {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;

    // Re-apply card sizes after filter changes (new cards may be visible)
    if (isMobile()) {
      applyMobileCardSizes();
    } else {
      applyDesktopCardSizes();
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

  // startAutoScroll();
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
  let userSelectedTypes = []; // Track what user directly clicked (for display only)

  const normalizeTypeToken = canonicalizeTypeToken;
  const getEffectiveSelectedTypes = resolveEffectiveSelectedTypes;

  function getUserSelectedTypesFromDOM() {
    if (!typeOptions) return [];
    return [...typeOptions.querySelectorAll('input[type="checkbox"]:checked')]
      .map((cb) => normalizeTypeToken(cb.value));
  }

  function getSelectedTypesFromDOM() {
    if (!typeOptions) return [];
    const checked = [...typeOptions.querySelectorAll('input[type="checkbox"]:checked')]
      .map((cb) => normalizeTypeToken(cb.value));
    return getEffectiveSelectedTypes(checked);
  }

  function getSelectedTypesForCardFilter() {
    // Primary source: active type pills the user can see.
    const fromPills = [...(activeFiltersContainer?.querySelectorAll('.filter-pill-remove[data-type="type"]') || [])]
      .map((el) => normalizeTypeToken(el.dataset.value))
      .filter(Boolean);

    if (fromPills.length > 0) {
      return getEffectiveSelectedTypes(fromPills);
    }

    // Fallback: currently checked desktop checkboxes.
    return getSelectedTypesFromDOM();
  }

  function enforceTypeSelectionRules(changedValue = "") {
    // DISABLED: Allow users to select any combination of types (multiselect enabled)
  }

  function syncTypeCheckboxesFromSelected() {
    if (!typeOptions) return;
    const selectedSet = new Set(selectedTypes);
    typeOptions.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = selectedSet.has(normalizeTypeToken(cb.value));
    });
  }

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
    const rawSelectedTypes = getUserSelectedTypesFromDOM();
    selectedTypes = getSelectedTypesFromDOM();
    const placeholder = typeDisplay.querySelector(".multiselect-placeholder");

    const existingBadge = typeDisplay.querySelector(".multiselect-count-badge");
    if (existingBadge) existingBadge.remove();

    if (rawSelectedTypes.length === 0) {
      placeholder.textContent = "All Types";
      typeHiddenInput.value = "";
    } else if (rawSelectedTypes.length === 1) {
      const checkbox = typeOptions.querySelector(`input[value="${rawSelectedTypes[0]}"]`);
      placeholder.textContent = checkbox?.dataset?.label || rawSelectedTypes[0];
      typeHiddenInput.value = rawSelectedTypes[0];
    } else {
      placeholder.textContent = "Multiple Types";
      typeHiddenInput.value = rawSelectedTypes.join(",");

      const badge = document.createElement("span");
      badge.className = "multiselect-count-badge";
      badge.textContent = rawSelectedTypes.length;
      typeDisplay.appendChild(badge);
    }
  }

  // Handle type checkbox changes
  if (typeOptions) {
    typeOptions.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        enforceTypeSelectionRules(e.target.value);
        userSelectedTypes = getUserSelectedTypesFromDOM();
        selectedTypes = getSelectedTypesFromDOM();
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
        cb.checked = true;
      });
      userSelectedTypes = getUserSelectedTypesFromDOM();
      selectedTypes = getSelectedTypesFromDOM();
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
      userSelectedTypes = getUserSelectedTypesFromDOM();
      selectedTypes = getSelectedTypesFromDOM();
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

    // Add type filters (display user-selected types, not expanded versions)
    userSelectedTypes.forEach(type => {
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
        userSelectedTypes = getUserSelectedTypesFromDOM();
        selectedTypes = getSelectedTypesFromDOM();
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
    return String(val)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
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
    const selectedEffective = getSelectedTypesForCardFilter();
    selectedTypes = selectedEffective;

    priceText.innerText = priceRange.label;

    let visible = 0;
    const visibleCards = [];

    cards.forEach((card) => {
      const cardLocationBase = normalize(card.dataset.locationBase || card.dataset.latest || card.dataset.location || "");
      const cardType = card.dataset.filterTypes || "";
      const price = parseInt(card.dataset.price || 0);
      const title = normalize(card.querySelector(".projectName")?.innerText || "");

      let show = true;

      // Text search filter
      if (searchValue && !title.includes(searchValue)) {
        show = false;
      }

      // Multi-location filter
      if (selectedLocations.length > 0) {
        const matchesLocation = selectedLocations.some(loc =>
          normalize(loc) === cardLocationBase
        );
        if (!matchesLocation) show = false;
      }

      // Multi-type filter
      if (selectedEffective.length > 0) {
        const cardTypes = (cardType.includes("+")
          ? cardType.split("+").map(t => normalizeTypeToken(t))
          : [normalizeTypeToken(cardType)]).filter(Boolean);
        const matchesType = selectedEffective.some(sel => cardTypes.includes(sel));
        if (!matchesType) show = false;
      }

      if (show) {
        card.style.setProperty("display", "flex", "important");
        visible++;
        visibleCards.push(card);
      } else {
        card.style.setProperty("display", "none", "important");
      }
    });

    // When location filter is active, keep cards ordered by base location then sequence:
    // e.g. gota-01, gota-02, gota-03...
    if (selectedLocations.length > 0) {
      const propertyContainer = document.querySelector(".property-container");
      if (propertyContainer && visibleCards.length > 1) {
        const selectedSet = new Set(selectedLocations.map(loc => normalize(loc)));

        visibleCards.sort((a, b) => {
          const aBase = normalize(a.dataset.locationBase || "");
          const bBase = normalize(b.dataset.locationBase || "");

          const aSelectedPriority = selectedSet.has(aBase) ? 0 : 1;
          const bSelectedPriority = selectedSet.has(bBase) ? 0 : 1;
          if (aSelectedPriority !== bSelectedPriority) return aSelectedPriority - bSelectedPriority;

          if (aBase !== bBase) return aBase.localeCompare(bBase);

          const aSeq = parseInt(a.dataset.locationSeq || "999999", 10);
          const bSeq = parseInt(b.dataset.locationSeq || "999999", 10);
          if (aSeq !== bSeq) return aSeq - bSeq;

          const aId = parseInt(a.dataset.id || "0", 10);
          const bId = parseInt(b.dataset.id || "0", 10);
          return aId - bId;
        });

        visibleCards.forEach(card => propertyContainer.appendChild(card));
      }
    }

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
      userSelectedTypes = [];
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

  // Hide immediately — page is already loaded when this runs
  offlinePage.style.display = "none";

  function updateOnlineStatus() {
    // iOS Safari can incorrectly report offline — only show if truly offline
    if (!navigator.onLine) {
      offlinePage.style.display = "flex";
    } else {
      offlinePage.style.display = "none";
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // Only show for unhandled fetch/network promise rejections — NOT JS errors
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason && event.reason.message &&
      (event.reason.message.includes("Failed to fetch") ||
        event.reason.message.includes("Network"))) {
      offlinePage.style.display = "flex";

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

    const imageSection = e.target.closest(".imageSection");
    if (!imageSection) {
      return;
    }

    const propertyCard = imageSection.closest(".Property-card");
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

      const titleElement = propertyCard.querySelector(".projectName");
      let propertyTitle = "Property";
      if (titleElement) {
        propertyTitle = titleElement.textContent.trim();
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
