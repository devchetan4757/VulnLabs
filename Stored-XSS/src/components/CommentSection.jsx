import { useEffect, useState } from "react";

import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import SuccessBanner from "./SuccessBanner";

const COMMENTS_KEY = "cybervulnx-comments";
const SOLVED_KEY = "cybervulnx-solved";
const ALERTS_KEY = "cybervulnx-alerts";

export default function CommentSection({
  solved,
  setSolved,
}) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const defaultComments = [
      {
        name: "Rahul",
        comment:
          "Great workshop. Looking forward to the next session.",
        date: "06/06/2026",
      },
      {
        name: "Priya",
        comment:
          "The practical examples were very helpful.",
        date: "06/06/2026",
      },
    ];

    const savedComments =
      JSON.parse(
        localStorage.getItem(COMMENTS_KEY)
      ) || defaultComments;

    const solvedStatus =
      localStorage.getItem(SOLVED_KEY) ===
      "true";

    const savedAlerts =
      JSON.parse(
        localStorage.getItem(ALERTS_KEY)
      ) || [];

    setComments(savedComments);
    setSolved(solvedStatus);

    if (solvedStatus && savedAlerts.length) {
      savedAlerts.forEach(
        (message, index) => {
          setTimeout(() => {
            alert(message);
          }, (index + 1) * 300);
        }
      );
    }
  }, [setSolved]);

  const handleCommentSubmit = (
    newComment
  ) => {
    const comment = {
      ...newComment,
      date:
        new Date().toLocaleDateString(),
    };

    const updatedComments = [
      comment,
      ...comments,
    ];

    setComments(updatedComments);

    localStorage.setItem(
      COMMENTS_KEY,
      JSON.stringify(updatedComments)
    );

    const acceptedPatterns = [
      /<img[^>]*onerror\s*=\s*alert\s*\((.*?)\)[^>]*>/i,
      /<svg[^>]*onload\s*=\s*alert\s*\((.*?)\)[^>]*>/i,
      /<body[^>]*onload\s*=\s*alert\s*\((.*?)\)[^>]*>/i,
      /<details[^>]*ontoggle\s*=\s*alert\s*\((.*?)\)[^>]*>/i,
    ];

    const matchedPattern =
      acceptedPatterns.find((pattern) =>
        pattern.test(newComment.comment)
      );

    if (!matchedPattern) {
      return;
    }

    const alerts =
      JSON.parse(
        localStorage.getItem(ALERTS_KEY)
      ) || [];

    if (alerts.length >= 2) {
      alert(
        "Only two successful payloads are allowed."
      );
      return;
    }

    const match =
      newComment.comment.match(
        /alert\s*\((.*?)\)/i
      );

    const extracted =
      match?.[1]?.trim() ||
      "Payload Executed";

    const updatedAlerts = [
      ...alerts,
      extracted,
    ];

    localStorage.setItem(
      ALERTS_KEY,
      JSON.stringify(updatedAlerts)
    );

    localStorage.setItem(
      SOLVED_KEY,
      "true"
    );

    setSolved(true);

    alert(extracted);
  };

  const resetLab = () => {
    localStorage.removeItem(
      COMMENTS_KEY
    );

    localStorage.removeItem(
      SOLVED_KEY
    );

    localStorage.removeItem(
      ALERTS_KEY
    );

    setSolved(false);

    window.location.reload();
  };

  return (
    <section className="comments-section">
      {solved && <SuccessBanner />}

      <div className="comments-header">
        <h3>Comments</h3>

        <button
          className="reset-btn"
          onClick={resetLab}
        >
          Reset
        </button>
      </div>

      <CommentForm
        onSubmit={handleCommentSubmit}
      />

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="empty-comments">
            No comments yet.
          </p>
        ) : (
          comments.map(
            (comment, index) => (
              <CommentCard
                key={index}
                name={comment.name}
                comment={comment.comment}
                date={comment.date}
              />
            )
          )
        )}
      </div>
    </section>
  );
}
