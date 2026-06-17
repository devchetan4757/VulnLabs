import { useState } from "react";

export default function CommentForm({
  onSubmit
}) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim())
      return;

    onSubmit({
      name: name.trim(),
      comment: comment.trim()
    });

    setName("");
    setComment("");
  };

  return (
    <form
      className="comment-form"
      onSubmit={handleSubmit}
    >
      <label>Name</label>

      <input
        type="text"
        value={name}
        maxLength={30}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Enter your name"
      />

      <label>Comment</label>

      <textarea
        value={comment}
        maxLength={500}
        onChange={(e) =>
          setComment(e.target.value)
        }
        placeholder="Share your thoughts..."
      />

      <button type="submit">
        Post Comment
      </button>
    </form>
  );
}
