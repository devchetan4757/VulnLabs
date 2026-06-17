import article from "../data/article";

export default function BlogPost() {
  return (
    <article className="blog-post">
      <div className="post-meta">
        <span>{article.author}</span>
        <span>•</span>
        <span>{article.date}</span>
      </div>

      <h2 className="post-title">
        {article.title}
      </h2>

      {article.content.map((paragraph, index) => (
        <p key={index} className="post-paragraph">
          {paragraph}
        </p>
      ))}
    </article>
  );
}
