// Show loading animation
document.addEventListener("DOMContentLoaded", () => {
  // Set active state for the "All" filter button by default
  document.querySelector('.filter-btn').classList.add('active');
  
  // Load women data
  loadWomen();
});

async function loadWomen() {
  try {
    // Show loading animation
    const loadingOverlay = document.getElementById("loading");
    
    const response = await fetch("women.json");
    const women = await response.json();
    const container = document.getElementById("cards-container");
    
    // Clear any existing content
    container.innerHTML = '';

    women.forEach((woman, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.category = woman.category;
      card.style.animationDelay = `${i * 100}ms`;

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = woman.category;
      if (woman.category.toLowerCase().includes("stolen")) {
        label.classList.add("stolen");
      }
      card.appendChild(label);

      if (woman.image) {
        // Create image container to prevent stretching
        const imgContainer = document.createElement("div");
        imgContainer.className = "img-container";
        
        const img1 = document.createElement("img");
        // Fix spaces in image paths
        img1.src = woman.image.replace(/ /g, "%20");
        img1.alt = woman.name;
        img1.loading = "lazy"; // Add lazy loading for better performance
        img1.onerror = () => {
          console.warn(`Main image not found for ${woman.name}`);
          imgContainer.style.height = "120px"; // Reduce height if image fails
          imgContainer.innerHTML = `<div class="placeholder-img">${woman.name.charAt(0)}</div>`;
        };
        
        imgContainer.appendChild(img1);
        card.appendChild(imgContainer);
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
            // Create second image container
            const img2Container = document.createElement("div");
            img2Container.className = "img-container secondary-img";
            
            const img2 = document.createElement("img");
            // Fix spaces in image paths
            img2.src = woman.image2.replace(/ /g, "%20");
            img2.alt = woman.name + " (2nd image)";
            img2.loading = "lazy"; // Add lazy loading
            img2.onerror = () => {
              console.warn(`Second image failed to load for ${woman.name}`);
              img2Container.style.height = "120px"; // Reduce height if image fails
              img2Container.innerHTML = `<div class="placeholder-img">${woman.name.charAt(0)}</div>`;
            };
            
            img2Container.appendChild(img2);
            card.insertBefore(img2Container, content);
          }
          bio.textContent = fullBio;
          expandBtn.textContent = "Show less";
        } else {
          // Collapse
          const secondaryImgContainer = card.querySelector(".secondary-img");
          if (secondaryImgContainer) {
            secondaryImgContainer.remove();
          }
          bio.textContent = shortBio;
          expandBtn.textContent = "Learn more";