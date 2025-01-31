const jokeList = document.getElementById("jokeList");
const jokeForm = document.getElementById("jokeForm");
const jokeInput = document.getElementById("joke");
const punchlineInput = document.getElementById("punchline");

const API_URL = "https://wk5-project-server.onrender.com/jokes"; // Need to update when deploy

// Fetch and display jokes
async function fetchJokes() {
  try {
    const res = await fetch(API_URL);
    const jokes = await res.json();
    jokeList.innerHTML = ""; // Clear the current list

    // Add each joke to the list
    jokes.forEach((joke) => {
      const li = document.createElement("li");
      li.innerHTML = `<p class="joke-setup">${joke.joke}</p>
      <p class="joke-punchline">${joke.punchline}</p>
      <button class="delete-btn" data-id="${joke.id}">🗑 Delete</button>`;

      jokeList.appendChild(li);

      // Add event listener to delete button for this joke
      li.querySelector(".delete-btn").addEventListener(
        "click",
        async (event) => {
          const jokeId = event.target.dataset.id;

          try {
            const response = await fetch(`${API_URL}/${jokeId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              li.remove(); // Remove the joke from the UI
            }
          } catch (error) {
            console.error("Error deleting joke:", error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error fetching jokes:", error);
  }
}

// Handle form submission
jokeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const joke = jokeInput.value;
  const punchline = punchlineInput.value;

  try {
    // Submit the new joke to the server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joke, punchline }),
    });

    if (response.ok) {
      jokeInput.value = ""; // Clear the input fields
      punchlineInput.value = "";

      // Fetch the latest jokes after adding the new one
      fetchJokes();
    }
  } catch (error) {
    console.error("Error adding joke:", error);
  }
});

// Fetch jokes when the page loads
fetchJokes();
