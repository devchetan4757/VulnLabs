const SOLVED_KEY   = "lab-solved";
const SESSION_KEY  = "lab-session-id";
const PATHS_KEY    = "lab-upload-paths";

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(8)))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const sessionId = getSessionId();

const statusBox     = document.getElementById("statusBox");
const statusText    = document.getElementById("statusText");
const labStatus     = document.getElementById("labStatus");
const successBanner = document.getElementById("successBanner");
const uploadForm    = document.getElementById("uploadForm");
const uploadBtn     = document.getElementById("uploadBtn");
const uploadResult  = document.getElementById("uploadResult");
const fileInput     = document.getElementById("fileInput");
const flagForm      = document.getElementById("flagForm");
const flagInput     = document.getElementById("flag");
const flagBtn       = document.getElementById("flagBtn");
const flagError     = document.getElementById("flagError");
const resetBtn      = document.getElementById("resetBtn");

function getPaths() {
  try {
    return JSON.parse(localStorage.getItem(PATHS_KEY)) || [];
  } catch {
    return [];
  }
}

function savePath(path) {
  const paths = getPaths();
  if (!paths.includes(path)) {
    paths.push(path);
    localStorage.setItem(PATHS_KEY, JSON.stringify(paths));
  }
}

function renderPaths() {
  const paths = getPaths();
  if (paths.length === 0) {
    uploadResult.innerHTML = "";
    return;
  }
  uploadResult.style.color = "#27ae60";
  uploadResult.innerHTML = `
    <strong style="display:block;margin-bottom:6px;">Uploaded files:</strong>
    ${paths.map(p => `<code style="display:block;margin-bottom:4px;">${p}</code>`).join("")}
  `;
}

function renderSolved(solved) {
  if (solved) {
    labStatus.classList.add("solved");
    statusBox.textContent  = "✓";
    statusText.textContent = "Solved";
    successBanner.innerHTML = `
      <div class="success-banner">
        <h3>Challenge Completed</h3>
        <p>File upload restriction bypassed. Non-image file executed on server.</p>
      </div>`;
    flagForm.style.display = "none";
  } else {
    labStatus.classList.remove("solved");
    statusBox.textContent  = "";
    statusText.textContent = "Not Solved";
    successBanner.innerHTML = "";
    flagForm.style.display = "";
  }
}

renderSolved(localStorage.getItem(SOLVED_KEY) === "true");
renderPaths();

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) return;

  uploadBtn.disabled     = true;
  uploadBtn.textContent  = "Uploading...";

  try {
    const body = new FormData();
    body.append("file", file);
    body.append("sessionId", sessionId);

    const res  = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();

    if (data.success) {
      savePath(data.path);
      renderPaths();
    } else {
      uploadResult.style.color = "var(--red)";
      uploadResult.textContent = data.message || "Upload failed.";
    }
  } catch (err) {
    uploadResult.style.color = "var(--red)";
    uploadResult.textContent = "Unable to reach the server.";
  }

  uploadBtn.disabled    = false;
  uploadBtn.textContent = "Upload";
});

flagForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const flag = flagInput.value.trim();
  if (!flag) return;

  flagBtn.disabled    = true;
  flagBtn.textContent = "Checking...";
  flagError.textContent = "";

  try {
    const res  = await fetch("/api/submit-flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem(SOLVED_KEY, "true");
      renderSolved(true);
    } else {
      flagError.textContent = data.message;
    }
  } catch (err) {
    flagError.textContent = "Unable to connect to server.";
  }

  flagBtn.disabled    = false;
  flagBtn.textContent = "Submit Flag";
});

resetBtn.addEventListener("click", async () => {
  try {
    await fetch("/api/reset", { method: "POST" });
  } catch (err) {
    console.error("Reset failed:", err);
  }
  localStorage.removeItem(SOLVED_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PATHS_KEY);
  fileInput.value          = "";
  uploadResult.innerHTML   = "";
  flagInput.value          = "";
  flagError.textContent    = "";
  renderSolved(false);
  location.reload();
});
