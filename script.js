// Fallback data in case women.json is missing or invalid
const fallbackWomen = [
  {
    name: "Ada Lovelace",
    category: "STEM",
    bio: "Often regarded as the first computer programmer. Ada Lovelace wrote the first algorithm intended to be processed by a machine, specifically Charles Babbage's Analytical Engine.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/800px-Ada_Lovelace_portrait.jpg"
  },
  {
    name: "Rosalind Franklin",
    category: "Stolen by Men",
    bio: "A chemist whose X-ray diffraction images of DNA were critical to understanding DNA's structure, but her contributions were not fully recognized during her lifetime as Watson and Crick used her data without proper attribution.",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/97/RosalinFranklinLabPhoto.jpg/440px-RosalinFranklinLabPhoto.jpg"
  }
];

async function loadWomen() {
  try {
    console.log("Attempting to fetch women.json...");
    let women;
    
    try {
      const response = await fetch("women.json");
      console.log("Fetch response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      women = await response.json();
      console.log("Women data successfully loaded from women.json");
    } catch (jsonError) {
      console.warn("Failed to load women.json, using fallback data:", jsonError);
      women = fallbackWomen;
    }
    
    if (!women || !Array.isArray(women) || women.length === 0) {
      console.warn("No valid women data found, using fallback");
      women = fallbackWomen;
    }
    
    console.log("Processing women data:", women);
    const container = document.getElementById("cards-container");
    
    // Check if container exists
    if (!container) {
      console.error("Error: #cards-container element not found in HTML");
      hideLoadingOverlay(); // Hide loading even if there's an error
      return;
    }

    // Clear any existing content
    container.innerHTML = "";

    women.forEach((woman, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${i * 100}ms`;

      const label = document.createElement("div");
      label.className = "label";
      // Check if category exists
      if (woman.category) {
        label.textContent = woman.category;
        if (woman.category.toLowerCase().includes("stolen")) {
          label.classList.add("stolen");
        }
      }
      card.appendChild(label);

      if (woman.image) {
        const imgContainer = document.createElement("div");
        imgContainer.className = "img-container";
        
        const img1 = document.createElement("img");
        // Fix spaces in image paths
        img1.src = woman.image.replace(/ /g, "%20");
        img1.alt = woman.name || "Unknown";
        img1.onerror = () => {
          console.warn(`Main image not found for ${woman.name || "Unknown"}`);
          imgContainer.classList.add("image-error");
        };
        
        imgContainer.appendChild(img1);
        card.appendChild(imgContainer);
      }

      const content = document.createElement("div");
      content.className = "card-content";

      const name = document.createElement("h3");
      name.textContent = woman.name || "Unknown";

      const bio = document.createElement("p");
      // Check if bio exists and handle splitting safely
      const bioText = woman.bio || "No biography available.";
      const sentences = bioText.split('.');
      const shortBio = sentences.length > 0 ? sentences[0] + '.' : bioText;
      const fullBio = bioText;
      
      bio.textContent = shortBio;
      bio.classList.add("short-bio");

      const expandBtn = document.createElement("button");
      expandBtn.textContent = "Learn more";
      expandBtn.className = "expand-button";
      expandBtn.addEventListener("click", () => {
        if (expandBtn.textContent === "Learn more") {
          // Expand
          if (woman.image2) {
            // Check if second image is already displayed
            if (!card.querySelector(".second-image")) {
              const img2Container = document.createElement("div");
              img2Container.className = "img-container second-image";
              
              const img2 = document.createElement("img");
              // Fix spaces in image paths
              img2.src = woman.image2.replace(/ /g, "%20");
              img2.alt = (woman.name || "Unknown") + " (2nd image)";
              img2.onerror = () => {
                console.warn(`Second image failed to load for ${woman.name || "Unknown"}`);
                img2Container.classList.add("image-error");
              };
              
              img2Container.appendChild(img2);
              card.insertBefore(img2Container, content);
            }
          }
          bio.textContent = fullBio;
          bio.classList.remove("short-bio");
          bio.classList.add("full-bio");
          expandBtn.textContent = "Show less";
        } else {
          // Collapse
          const secondImage = card.querySelector(".second-image");
          if (secondImage) {
            secondImage.remove();
          }
          bio.textContent = shortBio;
          bio.classList.add("short-bio");
          bio.classList.remove("full-bio");
          expandBtn.textContent = "Learn more";
        }
      });

      content.appendChild(name);
      content.appendChild(bio);
      content.appendChild(expandBtn);
      card.appendChild(content);
      container.appendChild(card);
    });

    // Population card (always last)
    const popCard = document.createElement("div");
    popCard.className = "card population-card";
    popCard.style.gridColumn = "1 / -1";

    const popHeading = document.createElement("h3");
    popHeading.textContent = "8,000,000,000 people";

    const popText = document.createElement("p");
    popText.textContent = "Created by all women on Earth";

    popCard.appendChild(popHeading);
    popCard.appendChild(popText);
    container.appendChild(popCard);
    
    // Hide loading overlay once everything is loaded
    hideLoadingOverlay();
  } catch (err) {
    console.error("Error in loadWomen function:", err);
    const container = document.getElementById("cards-container");
    if (container) {
      container.innerHTML = `<div class="error-message">Error loading women data. Please try refreshing the page. Details: ${err.message}</div>`;
    } else {
      console.error("Error: #cards-container element not found in HTML");
    }
    // Hide loading even if there's an error
    hideLoadingOverlay();
  }
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
  console.log("Hiding loading overlay...");
  const loadingOverlay = document.getElementById("loading");
  if (loadingOverlay) {
    loadingOverlay.style.opacity = "0";
    setTimeout(() => {
      loadingOverlay.style.display = "none";
      console.log("Loading overlay hidden");
    }, 500); // Wait for fade-out animation
  } else {
    console.error("Error: #loading element not found");
  }
}

function filterCards(category) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const label = card.querySelector(".label");
    const isPopulationCard = card.classList.contains("population-card");
    if (isPopulationCard) return; // Always show population card

    const matchesCategory =
      category === "All" ||
      (label && label.textContent.trim().toLowerCase() === category.toLowerCase());

    card.style.display = matchesCategory ? "block" : "none";
  });
}

function searchCards() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    console.error("Error: #searchInput element not found");
    return;
  }
  
  const input = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const name = card.querySelector("h3")?.textContent.toLowerCase() || "";
    const bio = card.querySelector("p")?.textContent.toLowerCase() || "";
    const isPopulationCard = card.classList.contains("population-card");
    
    if (isPopulationCard) return; // Skip population card in search
    
    card.style.display =
      name.includes(input) || bio.includes(input) ? "block" : "none";
  });
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  if (!menu) {
    console.error("Error: #menu element not found");
    return;
  }
  menu.classList.toggle("hidden");
}

function openAbout() {
  closeMenu();
  const aboutSection = document.getElementById("about-section");
  if (aboutSection) {
    aboutSection.classList.remove("hidden");
  } else {
    console.error("Error: #about-section element not found");
  }
}

function openSuggest() {
  closeMenu();
  const suggestSection = document.getElementById("suggest-section");
  if (suggestSection) {
    suggestSection.classList.remove("hidden");
  } else {
    console.error("Error: #suggest-section element not found");
  }
}

function openCredits() {
  closeMenu();
  const creditsSection = document.getElementById("credits-section");
  if (creditsSection) {
    creditsSection.classList.remove("hidden");
  } else {
    console.error("Error: #credits-section element not found");
  }
}

function closeMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.add("hidden");
  }
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.add("hidden");
  });
}

function submitSuggestion(event) {
  event.preventDefault();

  // Check if EmailJS is initialized
  if (typeof emailjs === 'undefined') {
    console.error("Error: EmailJS is not initialized or not loaded");
    const resultDiv = document.getElementById("submission-result");
    if (resultDiv) {
      resultDiv.textContent = "Error: Email service not available. Please try again later.";
      resultDiv.classList.remove("hidden");
      resultDiv.style.color = "red";
    }
    return;
  }

  const form = event.target;
  const resultDiv = document.getElementById("submission-result");
  
  if (!resultDiv) {
    console.error("Error: #submission-result element not found");
    return;
  }
  
  // Show loading indicator
  resultDiv.textContent = "Sending your suggestion...";
  resultDiv.classList.remove("hidden");
  resultDiv.classList.add("result-message");
  // Ensure EmailJS is initialized before sending the form
  if (!emailjs || typeof emailjs.sendForm !== 'function') {
    console.error("Error: EmailJS is not properly initialized");
    resultDiv.textContent = "Error: Email service not available. Please try again later.";
    resultDiv.style.color = "red";
    return;
  }

  emailjs.init('your_user_id'); // Replace 'your_user_id' with your actual EmailJS user ID
  emailjs.sendForm('service_c0ijdb5', 'template_n3qwajl', form)
    .then(() => {
      resultDiv.textContent = "Thank you! Your suggestion has been sent.";
      resultDiv.style.color = "green";
      form.reset();
      setTimeout(() => {
        closeModal();
        resultDiv.classList.add("hidden");
      }, 2000);
    }, (error) => {
      resultDiv.textContent = "Oops! Something went wrong. Please try again later.";
      resultDiv.style.color = "red";
      console.error('EmailJS Error:', error);
    });
}

// Initialize everything when DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");
  
  // Call loadWomen directly instead of waiting for full page load
  loadWomen();
  
  // Close modals when clicking outside content
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });
  
  // If page load takes too long, automatically hide loading overlay after 5 seconds
  setTimeout(() => {
    console.log("Safety timeout reached, hiding loading overlay");
    hideLoadingOverlay();
  }, 5000);
});