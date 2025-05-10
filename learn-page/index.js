import {
  cardsData,
  MOST_WATCHED_CATEGORY,
  ACTUAL_CATEGORY,
  INTERNET_VIDEOS,
  LOREM_CATEGORY,
  PRIVACY,
} from "./cardsData.js";
import {
  getLearnPageFilters,
  isUserAuthenticated,
  getAuthenticatedUserActiveFiltersKey,
  getAuthenticatedUser,
} from "../starter files/sessionHelper.js";

let activeFilters = [
  MOST_WATCHED_CATEGORY,
  ACTUAL_CATEGORY,
  INTERNET_VIDEOS,
  LOREM_CATEGORY,
  PRIVACY,
];

export const renderCards = () => {
  const cardsContainer = document.querySelector("#cards-container");
  cardsContainer.innerHTML = "";

  //Authenticated user, use the previously saved in session filters
  if (isUserAuthenticated()) {
    const savedFilters = getLearnPageFilters();
    if (savedFilters) {
      activeFilters = savedFilters;
    }
  }

  const filteredCards = cardsData.filter((card) =>
    activeFilters.length ? activeFilters.includes(card.category) : true
  );

  const renderedCards = filteredCards.map(
    (card, index) => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 ">
      <div class="card custom-card" data-index="${index}" data-category="${card.category}">
        <div class="card-img" style="background-image: url('${card.image}');">
          <div class="custom-card-body d-flex flex-column gap-2">
            <h5 class="card-info-title">${card.title}</h5>
            <p class="card-text">${card.description}</p>
            <p class="text-secondary">${card.publishDate}</p>
          </div>
        </div>
      </div>
    </div>`
  );

  cardsContainer.innerHTML = renderedCards.join("");

  document.querySelectorAll(".custom-card").forEach((cardElement) => {
    cardElement.addEventListener("click", () => {
      const index = parseInt(cardElement.getAttribute("data-index"));
      const cardData = cardsData[index];

      document.getElementById("modalTitle").textContent = cardData.title;
      document.getElementById("modalDescription").textContent =
        cardData.description;
      document.getElementById("modalImage").src = cardData.image;

      const modalImage = document.getElementById("modalImage");
      modalImage.onclick = () => {
        if (cardData.videoUrl) {
          window.open(cardData.videoUrl, "_blank");
        } else {
          alert("No video linked to this card.");
        }
      };

      // If user logged in, show their info
      if (isUserAuthenticated()) {
        const user = getAuthenticatedUser();
        document.getElementById("user-image").src = user.image;
        document.getElementById(
          "user-name"
        ).textContent = `${user.firstName} ${user.lastName}`;
      } else {
        document.getElementById("user-image").src = "../images/user-icon.png";
        document.getElementById("user-name").textContent = "Guest";
      }

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById("cardModal"));
      modal.show();
    });
  });
};

export const setFiltersFunctionality = () => {
  const filterButtons = [
    { id: "#most-watched-filter", category: MOST_WATCHED_CATEGORY },
    { id: "#actual-category-filter", category: ACTUAL_CATEGORY },
    { id: "#lorem-filter", category: LOREM_CATEGORY },
    { id: "#internet-videos-filter", category: INTERNET_VIDEOS },
    { id: "#privacy-filter", category: PRIVACY },
  ];

  filterButtons.forEach(({ id, category }) => {
    const button = document.querySelector(id);

    if (activeFilters.includes(category)) {
      button.classList.remove("inactive-filter");
    } else {
      button.classList.add("inactive-filter");
    }

    button.addEventListener("click", function () {
      if (activeFilters.includes(category)) {
        activeFilters = activeFilters.filter((f) => f !== category);
        this.classList.add("inactive-filter");
      } else {
        activeFilters.push(category);
        this.classList.remove("inactive-filter");
      }

      if (isUserAuthenticated) {
        localStorage.setItem(
          getAuthenticatedUserActiveFiltersKey(),
          JSON.stringify(activeFilters)
        );
      }
      renderCards();
    });
  });
};

document.querySelectorAll(".btn-custom").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".btn-custom").forEach((btn) => {
      btn.classList.remove("active");
      btn.classList.add("inactive");
    });
    this.classList.remove("inactive");
    this.classList.add("active");
  });
});

document.getElementById("submit-comment").addEventListener("click", () => {
  if (!isUserAuthenticated()) {
    window.location.href = "#login";
  }

  const commentText = document.getElementById("modalComment").value.trim();
  if (commentText) {
    const user = getAuthenticatedUser();
    const commentList = document.getElementById("comments-list");

    const newComment = document.createElement("div");
    newComment.className = "comment mb-3 p-3 border rounded bg-white";
    newComment.innerHTML = `
      <p>${commentText}</p>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <div class="d-flex align-items-center">
          <img src="${
            user.image
          }" class="rounded-circle me-2" width="30" height="30">
          <div><small><strong>${user.firstName} ${
      user.lastName
    }</strong></small></div>
        </div>
        <small class="text-muted">${new Date().toLocaleString()}</small>
      </div>
    `;
    commentList.prepend(newComment);

    document.getElementById("modalComment").value = "";
  }
});

/*import {
  cardsData,
  MOST_WATCHED_CATEGORY,
  ACTUAL_CATEGORY,
  INTERNET_VIDEOS,
  LOREM_CATEGORY,
  PRIVACY,
} from "./cardsData.js";
import {
  getLearnPageFilters,
  isUserAuthenticated,
  getAuthenticatedUserActiveFiltersKey,
} from "../starter files/sessionHelper.js";

let activeFilters = [
  MOST_WATCHED_CATEGORY,
  ACTUAL_CATEGORY,
  INTERNET_VIDEOS,
  LOREM_CATEGORY,
  PRIVACY,
];

const INITIAL_VISIBLE_CARDS = 8;
let currentVisibleCount = INITIAL_VISIBLE_CARDS;

export const renderCards = () => {
  const cardsContainer = document.querySelector("#cards-container");
  cardsContainer.innerHTML = "";

  //Authenticated user, use the previously saved in session filters
  if (isUserAuthenticated()) {
    const savedFilters = getLearnPageFilters();
    if (savedFilters) {
      activeFilters = savedFilters;
    }
  }

  const filteredCards = cardsData.filter((card) =>
    activeFilters.length ? activeFilters.includes(card.category) : true
  );

  const visibleCards = filteredCards.slice(0, currentVisibleCount);

  const renderedCards = visibleCards.map(
    (card) => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card custom-card" data-category="${card.category}">
        <div class="card-img" style="background-image: url('${card.image}');">
          <div class="custom-card-body">
            <h2>${card.title}</h2>
            <p class="card-text">${card.description}</p>
            <p><i>${card.publishDate}</i></p>
          </div>
        </div>
      </div>
    </div>
  `
  );

  cardsContainer.innerHTML = renderedCards.join("");

  const seeMoreButton = document.getElementById("see-more");
  if (filteredCards.length > currentVisibleCount) {
    seeMoreButton.style.display = "block";
  } else {
    seeMoreButton.style.display = "none";
  }
};

export const setupSeeMoreButton = () => {
  const seeMoreButton = document.getElementById("see-more");

  seeMoreButton.addEventListener("click", () => {
    currentVisibleCount +=INITIAL_VISIBLE_CARDS;
    renderCards();
  });
};


export const setFiltersFunctionality = () => {
  const filterButtons = [
    { id: "#most-watched-filter", category: MOST_WATCHED_CATEGORY },
    { id: "#actual-category-filter", category: ACTUAL_CATEGORY },
    { id: "#lorem-filter", category: LOREM_CATEGORY },
    { id: "#internet-videos-filter", category: INTERNET_VIDEOS },
    { id: "#privacy-filter", category: PRIVACY },
  ];

  filterButtons.forEach(({ id, category }) => {
    const button = document.querySelector(id);

    if (activeFilters.includes(category)) {
      button.classList.remove("inactive-filter");
    } else {
      button.classList.add("inactive-filter");
    }

    button.addEventListener("click", function () {
      if (activeFilters.includes(category)) {
        activeFilters = activeFilters.filter((f) => f !== category);
        this.classList.add("inactive-filter");
      } else {
        activeFilters.push(category);
        this.classList.remove("inactive-filter");
      }

      if (isUserAuthenticated()) {
        localStorage.setItem(
          getAuthenticatedUserActiveFiltersKey(),
          JSON.stringify(activeFilters)
        );
      }

      currentVisibleCount = INITIAL_VISIBLE_CARDS;
      renderCards();
    });
  });
};

document.querySelectorAll(".btn-custom").forEach((button) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".btn-custom").forEach((btn) => {
      btn.classList.remove("active");
      btn.classList.add("inactive");
    });
    this.classList.remove("inactive");
    this.classList.add("active");
  });
}); */
