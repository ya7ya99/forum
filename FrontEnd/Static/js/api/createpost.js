import { LoadData } from "./Allposts.js";

document.addEventListener("elementReady", () => {
    const PostButton = document.getElementById("createpost");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    // Setup close buttons for messages
    if (successMessage || errorMessage) {
        successMessage.style.display = 'block'
        successMessage.style.display = 'none';
    }

    if (PostButton) {
        PostButton.addEventListener("click", async () => {
            const PostTitle = document.getElementById("Posttitle").value;
            const PostContent = document.getElementById("Postcontent").value;
            const PostTopics = document.getElementById("Postopic").value.split(" ");
            try {
                validateInputs(PostTitle, PostContent, PostTopics);
                await createPost(PostTitle, PostContent, PostTopics);           
                showSuccess("Post Created Successfully")
                resetFormFields()
                LoadData('', 0)

            } catch (error) {
                showError(error.message)
            }
        });
    }
})



function resetFormFields() {
    document.getElementById("Posttitle").value = "";
    document.getElementById("Postcontent").value = "";
    document.getElementById("Postopic").value = "";
}
// Validate input fields
function validateInputs(title, content, topics) {
    if (!title.trim()) throw new Error("Title cannot be empty");
    if (!content.trim()) throw new Error("Content cannot be empty");
    if (topics.length === 0 || topics[0] === '') throw new Error("At least one topic is required");
}


function setupMessageClose(messageElement, duration = 3000) {
    messageElement.style.display = 'block'
    const closeTimeout = setTimeout(() => {
        messageElement.style.display = 'none'
        clearTimeout(closeTimeout)
    }, duration)
}

async function createPost(title, content, topics) {
    const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Title: title,
            Content: content,
            Categories: topics
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
    }

    return await response.json();
}

function showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
    this.successMessage.style.display = "none";
    setupMessageClose(this.errorMessage);
}

function showSuccess(message) {
    this.successMessage.textContent = message;
    this.successMessage.style.display = "block";
    this.errorMessage.style.display = "none";
    setupMessageClose(this.successMessage);
}

export { setupMessageClose }