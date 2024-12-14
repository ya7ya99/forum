import { setupMessageClose } from './createpost.js'
import { PostLoader } from './Post.js'


const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

async function CreateComment() {

    const IsLogged = await fetch("/api/isloged")
    if (IsLogged.status != 200) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
        successMessage.style.display = "none";

        setupMessageClose(errorMessage);
        return
    }
    document.getElementById("comment-component").innerHTML =
        `
                <div class="header">
                <p>Create New Comment</p>
            </div>
            <div class="fieldsets">
                <div>
                    <fieldset>
                        <legend>Comment Content :</legend>
                        <textarea id="commentcontent" style="resize: none; width: 100%;" rows="5" id="registeremail" ></textarea>
                    </fieldset>
                    <button id="createcomment">Create Comment</button>
                </div>
            </div>
    `

    document.getElementById("createcomment").addEventListener("click", async (e) => {
        const Content = e.target.parentElement.querySelectorAll("textarea")[0].value

        const res = await fetch("api/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                PostId: +document.getElementById("post-container").getAttribute("data-id"),
                Content: Content,
            }
            )
        })

        const Data = await res.json()

        if (res.status != 200) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
            successMessage.style.display = "none";

            setupMessageClose(errorMessage);
            return
        }
        successMessage.textContent = "Post comment Successfully";
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
        setupMessageClose(successMessage);
        document.getElementById('commentcontent').value = ""
        PostLoader()
    })
}

CreateComment()
