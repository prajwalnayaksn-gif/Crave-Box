/**
 * Firebase Firestore Reviews Management
 * Handles loading, displaying, and submitting reviews to Firestore
 */

// Firebase Configuration
// Note: Using the existing Firebase config from your project
const firebaseConfig = {
  apiKey: "AIzaSyBL6NKQpNZ8x3q5K7m2n9p0R8s5T6u7V8w",
  authDomain: "cravebox-cafe.firebaseapp.com",
  projectId: "cravebox-cafe",
  storageBucket: "cravebox-cafe.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore reference
const db = firebase.firestore();
const REVIEWS_COLLECTION = "reviews";

/**
 * Initializes the reviews section when DOM is loaded
 * Sets up event listeners and loads existing reviews from Firestore
 */
function initializeReviews() {
  console.log("Initializing reviews system...");
  
  // Load existing reviews from Firestore
  loadReviewsFromFirestore();
  
  // Set up review submission form
  setupReviewForm();
}

/**
 * Loads all reviews from Firestore and displays them
 */
async function loadReviewsFromFirestore() {
  try {
    console.log("Loading reviews from Firestore...");
    
    // Query Firestore for all reviews, ordered by timestamp (newest first)
    const snapshot = await db.collection(REVIEWS_COLLECTION)
      .orderBy("timestamp", "desc")
      .limit(9) // Display latest 9 reviews to match the 3-column grid
      .get();
    
    const reviewsGrid = document.querySelector(".reviews-grid");
    
    if (!reviewsGrid) {
      console.warn("Reviews grid element not found");
      return;
    }
    
    // Clear existing placeholder reviews
    const existingCards = reviewsGrid.querySelectorAll(".review-card");
    existingCards.forEach(card => card.remove());
    
    // Display each review from Firestore
    if (snapshot.empty) {
      console.log("No reviews found in Firestore. Showing placeholder reviews.");
      displayPlaceholderReviews();
    } else {
      snapshot.forEach((doc) => {
        const review = doc.data();
        displayReview(review);
      });
      console.log(`Loaded ${snapshot.size} reviews from Firestore`);
    }
    
  } catch (error) {
    console.error("Error loading reviews from Firestore:", error);
    displayPlaceholderReviews();
  }
}

/**
 * Displays a single review in the reviews grid
 * @param {Object} review - Review data object containing name, rating, message, timestamp
 */
function displayReview(review) {
  const reviewsGrid = document.querySelector(".reviews-grid");
  
  if (!reviewsGrid) return;
  
  // Create review card element
  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";
  
  // Generate star rating HTML
  const starRating = generateStarRating(review.rating || 5);
  
  // Format timestamp to readable date
  const reviewDate = review.timestamp 
    ? new Date(review.timestamp.toDate()).toLocaleDateString()
    : new Date().toLocaleDateString();
  
  reviewCard.innerHTML = `
    <div class="stars">${starRating}</div>
    <p>"${review.message || ''}"</p>
    <strong>– ${review.name || 'Anonymous'}</strong>
    <small style="color: var(--muted); font-size: 0.8rem; margin-top: 0.3rem;">
      ${reviewDate}
    </small>
  `;
  
  reviewsGrid.appendChild(reviewCard);
}

/**
 * Generates star HTML based on rating number
 * @param {number} rating - Rating from 1 to 5
 * @returns {string} HTML string with stars
 */
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  let stars = "★".repeat(fullStars);
  
  if (hasHalfStar) {
    stars += "½";
  }
  
  // Fill remaining with empty stars
  const emptyStars = 5 - Math.ceil(rating);
  stars += "☆".repeat(emptyStars);
  
  return stars;
}

/**
 * Displays placeholder reviews when Firestore is empty
 * These are the original hardcoded reviews
 */
function displayPlaceholderReviews() {
  const placeholderReviews = [
    {
      name: "Riya",
      rating: 5,
      message: "Elegant presentation, rich flavors, and a wonderful atmosphere. Feels premium in every way."
    },
    {
      name: "Arjun",
      rating: 5,
      message: "The best vegetarian comfort food I've had in a long time. Every bite felt special."
    },
    {
      name: "Nisha",
      rating: 5,
      message: "Beautiful food, beautiful brand, and an unforgettable experience. Truly luxurious."
    }
  ];
  
  placeholderReviews.forEach(review => {
    displayReview(review);
  });
}

/**
 * Sets up the review submission form
 * Creates a form if it doesn't exist and handles submissions
 */
function setupReviewForm() {
  // Create review submission form HTML
  const formHTML = `
    <div class="review-form-container" style="margin-top: 2rem;">
      <div class="panel" style="background: var(--surface); padding: 2rem;">
        <h3 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Share Your Experience</h3>
        
        <form id="reviewForm" class="review-form">
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label for="reviewName" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">
              Your Name
            </label>
            <input 
              type="text" 
              id="reviewName" 
              placeholder="Enter your name" 
              required 
              maxlength="100"
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid var(--border);
                border-radius: 12px;
                background: rgba(255,255,255,0.08);
                color: var(--text);
                font-size: 1rem;
                font-family: Inter, sans-serif;
                transition: border-color 0.3s ease, background 0.3s ease;
              "
            />
          </div>
          
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label for="reviewRating" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">
              Rating
            </label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select 
                id="reviewRating"
                style="
                  padding: 0.75rem 1rem;
                  border: 1px solid var(--border);
                  border-radius: 12px;
                  background: rgba(255,255,255,0.08);
                  color: var(--text);
                  font-size: 1rem;
                  font-family: Inter, sans-serif;
                  cursor: pointer;
                  min-width: 120px;
                "
              >
                <option value="5">⭐ 5 Stars</option>
                <option value="4">⭐ 4 Stars</option>
                <option value="3">⭐ 3 Stars</option>
                <option value="2">⭐ 2 Stars</option>
                <option value="1">⭐ 1 Star</option>
              </select>
              <span id="ratingDisplay" style="color: var(--accent); font-weight: 600;">★★★★★</span>
            </div>
          </div>
          
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label for="reviewMessage" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text);">
              Your Review
            </label>
            <textarea 
              id="reviewMessage" 
              placeholder="Share your experience at CraveBox Cafe..." 
              required 
              maxlength="500"
              rows="4"
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid var(--border);
                border-radius: 12px;
                background: rgba(255,255,255,0.08);
                color: var(--text);
                font-size: 1rem;
                font-family: Inter, sans-serif;
                resize: vertical;
                transition: border-color 0.3s ease, background 0.3s ease;
              "
            ></textarea>
            <small style="color: var(--muted); display: block; margin-top: 0.3rem;">
              <span id="charCount">0</span>/500 characters
            </small>
          </div>
          
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button 
              type="submit" 
              class="btn btn-primary"
              style="flex: 1; min-width: 150px;"
            >
              Submit Review
            </button>
            <button 
              type="reset" 
              class="btn btn-ghost"
              style="flex: 1; min-width: 150px;"
            >
              Clear
            </button>
          </div>
          
          <div id="formMessage" style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 12px; display: none;"></div>
        </form>
      </div>
    </div>
  `;
  
  // Insert form after the reviews grid
  const reviewsSection = document.querySelector("#reviews");
  if (reviewsSection) {
    const reviewsGrid = reviewsSection.querySelector(".reviews-grid");
    if (reviewsGrid && !document.querySelector("#reviewForm")) {
      reviewsGrid.insertAdjacentHTML("afterend", formHTML);
      
      // Set up form event listeners
      const form = document.querySelector("#reviewForm");
      const ratingSelect = document.querySelector("#reviewRating");
      const messageInput = document.querySelector("#reviewMessage");
      const charCount = document.querySelector("#charCount");
      const ratingDisplay = document.querySelector("#ratingDisplay");
      
      // Update rating display when selection changes
      if (ratingSelect) {
        ratingSelect.addEventListener("change", (e) => {
          const rating = parseInt(e.target.value);
          ratingDisplay.textContent = generateStarRating(rating);
        });
      }
      
      // Update character count
      if (messageInput) {
        messageInput.addEventListener("input", (e) => {
          if (charCount) {
            charCount.textContent = e.target.value.length;
          }
        });
      }
      
      // Handle form submission
      if (form) {
        form.addEventListener("submit", handleReviewSubmit);
      }
    }
  }
}

/**
 * Handles review form submission
 * Validates data and saves to Firestore
 * @param {Event} e - Form submission event
 */
async function handleReviewSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.querySelector("#reviewName");
  const ratingSelect = document.querySelector("#reviewRating");
  const messageInput = document.querySelector("#reviewMessage");
  const formMessage = document.querySelector("#formMessage");
  const submitBtn = document.querySelector("#reviewForm button[type='submit']");
  
  try {
    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }
    
    // Validate inputs
    const name = nameInput.value.trim();
    const rating = parseInt(ratingSelect.value);
    const message = messageInput.value.trim();
    
    if (!name || !message) {
      throw new Error("Please fill in all fields");
    }
    
    if (message.length < 10) {
      throw new Error("Review must be at least 10 characters long");
    }
    
    console.log("Submitting review to Firestore...");
    
    // Create review object
    const reviewData = {
      name: name,
      rating: rating,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent // For analytics
    };
    
    // Save to Firestore
    const docRef = await db.collection(REVIEWS_COLLECTION).add(reviewData);
    console.log("Review saved to Firestore with ID:", docRef.id);
    
    // Show success message
    if (formMessage) {
      formMessage.style.display = "block";
      formMessage.style.background = "rgba(76, 175, 80, 0.2)";
      formMessage.style.border = "1px solid rgba(76, 175, 80, 0.5)";
      formMessage.style.color = "#4caf50";
      formMessage.textContent = "✓ Review submitted successfully! Thank you for your feedback.";
    }
    
    // Reset form
    e.target.reset();
    if (charCount) {
      document.querySelector("#charCount").textContent = "0";
    }
    document.querySelector("#ratingDisplay").textContent = "★★★★★";
    
    // Reload reviews to show the new one
    setTimeout(() => {
      loadReviewsFromFirestore();
    }, 1000);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      if (formMessage) {
        formMessage.style.display = "none";
      }
    }, 5000);
    
  } catch (error) {
    console.error("Error submitting review:", error);
    
    if (formMessage) {
      formMessage.style.display = "block";
      formMessage.style.background = "rgba(244, 67, 54, 0.2)";
      formMessage.style.border = "1px solid rgba(244, 67, 54, 0.5)";
      formMessage.style.color = "#f44336";
      formMessage.textContent = `✗ Error: ${error.message}`;
    }
  } finally {
    // Reset button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Review";
    }
  }
}

/**
 * Initialize reviews when the DOM is fully loaded
 * This runs after the main script.js
 */
document.addEventListener("DOMContentLoaded", () => {
  // Wait a moment to ensure Firebase is fully loaded
  setTimeout(() => {
    if (typeof firebase !== "undefined" && firebase.firestore) {
      initializeReviews();
    } else {
      console.error("Firebase not loaded. Please ensure Firebase CDN script is included.");
    }
  }, 500);
});
