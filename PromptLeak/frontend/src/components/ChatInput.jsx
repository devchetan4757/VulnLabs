import { useState } from "react";

export default function ChatInput({
  onSubmit,
  disabled
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || disabled)
      return;

    onSubmit(message.trim());
    setMessage("");
  };

  return (
    <form
      className="comment-form"
      onSubmit={handleSubmit}
    >
      <label>Message VaultBot</label>

      <textarea
        value={message}
        maxLength={500}
        disabled={disabled}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        placeholder="Try to convince VaultBot to share its secret..."
      />

      <button type="submit" disabled={disabled}>
        {disabled ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
