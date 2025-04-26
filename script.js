async function loadWomen() {
  try {
    const response = await fetch("women.json");
    const women = await response.json();
    const container = document.getElementById("cards-container");

    women.forEach((woman, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${i * 100}ms`;

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = woman.category;
      if (woman.category.toLowerCase().includes("stolen")) {
        label.classList.add("stolen");
      }
      card.appendChild(label);

      if (woman.image) {
        const img1 = document.createElement("img");
        // Fix spaces in image paths
        img1.src = woman.image.replace(/ /g, "%20");
        img1.alt = woman.name;
        img1.onerror = () => console.warn(`Main image not found for ${woman.name}`);
        card.appendChild(img1);
      }

      const content = document.createElement("div");
      content.className = "card-content";

      const name = document.createElement("h3");
      name.textContent = woman.name;

      const bio = document.createElement("p");
      // Store both short and full bio
      const shortBio = woman.bio.split('.')[0] + '.'; // Just the first sentence
      const fullBio = woman.bio;
      bio.textContent = shortBio;
      bio.classList.add("short-bio");

      const expandBtn = document.createElement("button");
      expandBtn.textContent = "Learn more";
      expandBtn.className = "expand-button";
      expandBtn.addEventListener("click", () => {
        if (expandBtn.textContent === "Learn more") {
          // Expand
          if (woman.image2) {
            const img2 = document.createElement("img");
            // Fix spaces in image paths
            img2.src = woman.image2.replace(/ /g, "%20");
            img2.alt = woman.name + " (2nd image)";
            img2.onerror = () => console.warn(`Second image failed to load for ${woman.name}`);
            card.insertBefore(img2, content);
          }
          bio.textContent = fullBio;
          expandBtn.textContent = "Show less";
        } else {
          // Collapse
          const allImages = card.querySelectorAll("img");
          if (allImages.length > 1) {
            allImages[1].remove();
          }
          bio.textContent = shortBio;
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
  } catch (err) {
    console.error("Error loading women.json:", err);
  }
}

function filterCards(category) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const label = card.querySelector(".label");
    const isPopulationCard = card.classList.contains("population-card");
    if (isPopulationCard) return;

    const matchesCategory =
      category === "All" ||
      (label && label.textContent.trim().toLowerCase() === category.toLowerCase());

    card.style.display = matchesCategory ? "block" : "none";
  });
}

function searchCards() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const name = card.querySelector("h3")?.textContent.toLowerCase();
    const bio = card.querySelector("p")?.textContent.toLowerCase();
    const isPopulationCard = card.classList.contains("population-card");
    if (isPopulationCard) return;
    card.style.display =
      name.includes(input) || bio.includes(input) ? "block" : "none";
  });
}

// Add the missing functions from your HTML
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}

function openAbout() {
  const aboutSection = document.getElementById("about-section");
  aboutSection.classList.remove("hidden");
}

function openSuggest() {
  const suggestSection = document.getElementById("suggest-section");
  suggestSection.classList.remove("hidden");
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.add("hidden");
  });
}

function submitSuggestion(event) {
  event.preventDefault();

  const form = event.target;
  const resultDiv = document.getElementById("submission-result");

  emailjs.sendForm('service_c0ijdb5', 'template_n3qwajl', form)
    .then(() => {
      resultDiv.textContent = "Thank you! Your suggestion has been sent.";
      resultDiv.classList.remove("hidden");
      resultDiv.style.color = "green";
      form.reset();
      closeModal();
    }, (error) => {
      resultDiv.textContent = "Oops! Something went wrong. Please try again later.";
      resultDiv.classList.remove("hidden");
      resultDiv.style.color = "red";
      console.error('EmailJS Error:', error);
    });
}

window.addEventListener("DOMContentLoaded", loadWomen);