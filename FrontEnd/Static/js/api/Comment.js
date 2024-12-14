import { PostLoader } from './Post.js';

class CommentManager {
    constructor() {
        this.successMessage = document.getElementById("successMessage");
        this.errorMessage = document.getElementById("errorMessage");
        this.commentComponent = document.getElementById("comment-component");
    }

    async init() {
        try {
            await this.checkUserAuthentication();
            this.renderCommentForm();
            this.setupCreateCommentListener();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async checkUserAuthentication() {
        const response = await fetch("/api/isloged");
        if (!response.ok) {
            throw new Error("User not authenticated");
        }
    }

    renderCommentForm() {
        this.commentComponent.innerHTML = `
            <div class="header">
                <p>Create New Comment</p>
            </div>
            <div class="fieldsets">
                <div>
                    <fieldset>
                        <legend>Comment Content:</legend>
                        <textarea 
                            id="commentcontent" 
                            style="resize: none; width: 100%;" 
                            rows="5"
                        ></textarea>
                    </fieldset>
                    <button id="createcomment">Create Comment</button>
                </div>
            </div>
        `;
    }

    setupCreateCommentListener() {
        const createCommentButton = document.getElementById("createcomment");
        createCommentButton.addEventListener("click", () => this.createComment());
    }

    async createComment() {
        const commentContentElement = document.getElementById("commentcontent");
        const content = commentContentElement.value.trim();

        if (!content) {
            this.showError("Comment content cannot be empty");
            return;
        }

        try {
            const postId = +document.getElementById("post-container").getAttribute("data-id");
            const response = await this.submitComment(postId, content);
            
            this.showSuccess("Comment Posted Successfully");
            commentContentElement.value = "";
            PostLoader();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async submitComment(postId, content) {
        const response = await fetch("api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                PostId: postId,
                Content: content
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create comment");
        }

        return response.json();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = "block";
        this.successMessage.style.display = "none";
        setupMessageClose(this.errorMessage);
    }

    showSuccess(message) {
        this.successMessage.textContent = message;
        this.successMessage.style.display = "block";
        this.errorMessage.style.display = "none";
        setupMessageClose(this.successMessage);
    }
}

function setupMessageClose(messageElement, duration = 3000) {
    messageElement.style.display = 'block'
    const closeTimeout = setTimeout(() => {
        messageElement.style.display = 'none'
        clearTimeout(closeTimeout)
    }, duration)
}

// Initialize the comment creation process
const commentManager = new CommentManager();
commentManager.init();