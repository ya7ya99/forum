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
                // Success handling
                successMessage.textContent = "Post Created Successfully";
                successMessage.style.display = "block";
                errorMessage.style.display = "none";
                
                // Clear form fields
                resetFormFields()
                
                LoadData('', 0)
                // Reapply close button
                setupMessageClose(successMessage);
                
                
            } catch (error) {
                // Error handling
                errorMessage.textContent = error.message;
                errorMessage.style.display = "block";
                successMessage.style.display = "none";
                
                // Reapply close button
                setupMessageClose(errorMessage);
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
