from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import re
import os

# ---------------------------------------------------------------------------
# App setup — static_folder points to the React build output
# ---------------------------------------------------------------------------
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

lab_state = {
    "alerts": [],   # extracted alert() arguments from successful payloads
    "solved": False,
}

# ---------------------------------------------------------------------------
# XSS payload patterns — kept server-side only, never exposed to the client
# ---------------------------------------------------------------------------
ACCEPTED_PATTERNS = [
    re.compile(r'<img[^>]*onerror\s*=\s*alert\s*\((.*?)\)[^>]*>',     re.IGNORECASE),
    re.compile(r'<svg[^>]*onload\s*=\s*alert\s*\((.*?)\)[^>]*>',      re.IGNORECASE),
    re.compile(r'<body[^>]*onload\s*=\s*alert\s*\((.*?)\)[^>]*>',     re.IGNORECASE),
    re.compile(r'<details[^>]*ontoggle\s*=\s*alert\s*\((.*?)\)[^>]*>', re.IGNORECASE),
]

ALERT_EXTRACT = re.compile(r'alert\s*\((.*?)\)', re.IGNORECASE)
MAX_ALERTS = 2


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------

@app.route("/api/validate-payload", methods=["POST"])
def validate_payload():
    """Check if a submitted comment contains a valid XSS payload."""
    data = request.get_json(silent=True)
    if not data or "comment" not in data:
        return jsonify({"error": "Invalid request"}), 400

    comment = data["comment"]

    # Check against accepted patterns (hidden from client)
    matched = any(p.search(comment) for p in ACCEPTED_PATTERNS)
    if not matched:
        return jsonify({"matched": False})

    # Enforce payload limit
    if len(lab_state["alerts"]) >= MAX_ALERTS:
        return jsonify({"matched": True, "limitReached": True})

    # Extract the alert() argument
    m = ALERT_EXTRACT.search(comment)
    extracted = m.group(1).strip() if m else "Payload Executed"

    # Update server-side state
    lab_state["alerts"].append(extracted)
    lab_state["solved"] = True

    return jsonify({
        "matched": True,
        "limitReached": False,
        "extracted": extracted,
    })


@app.route("/api/lab-state", methods=["GET"])
def get_lab_state():
    """Returns current lab state so the frontend can sync on page load."""
    return jsonify({
        "solved": lab_state["solved"],
        "alertCount": len(lab_state["alerts"]),
        "alerts": lab_state["alerts"],
    })


@app.route("/api/reset", methods=["POST"])
def reset_lab():
    """Resets the lab back to unsolved state."""
    lab_state["alerts"].clear()
    lab_state["solved"] = False
    return jsonify({"reset": True})


@app.route("/api/health", methods=["GET"])
def health():
    """Health check — useful for Render's uptime monitoring."""
    return jsonify({"status": "ok"})


# ---------------------------------------------------------------------------
# Serve React frontend (must be LAST so API routes take priority)
# ---------------------------------------------------------------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    """
    Serve static React files.
    - If the requested file exists in /dist, return it directly (JS, CSS, images).
    - Otherwise fall back to index.html so React Router handles the route.
    """
    target = os.path.join(app.static_folder, path)
    if path and os.path.exists(target):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
