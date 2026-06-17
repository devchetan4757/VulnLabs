export default function CommentCard({
  name,
  comment,
  date
}) {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <strong>{name}</strong>

        <span>{date}</span>
      </div>

      <p className="comment-text">
        {comment}
      </p>
    </div>
  );
}
