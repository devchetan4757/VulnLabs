export default function ChatBubble({
  role,
  text
}) {
  const isBot = role === "bot";

  return (
    <div className={`comment-card chat-bubble chat-bubble--${role}`}>
      <div className="comment-header">
        <strong>{isBot ? "VaultBot" : "You"}</strong>
      </div>

      <p className="comment-text">
        {text}
      </p>
    </div>
  );
}
