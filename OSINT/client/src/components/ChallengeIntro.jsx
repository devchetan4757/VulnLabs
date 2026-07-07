import ghost from "../static/ghost.jpg";

export default function ChallengeIntro() {
  return (
    <section className="login-intro">

      <div className="intro-meta">
        <span>OSINT</span>
        <span>•</span>
        <span>Difficulty: Easy → Medium</span>
      </div>

      <h1 className="intro-title">
        The Haunted Trail
      </h1>

      <p className="intro-text">
        A mysterious figure has emerged from the darkness. Your task is to
        investigate the image below using publicly available information
        and answer the questions in the panel underneath it.
      </p>

      <div className="evidence-card">
        <div className="evidence-header">ghost.png</div>
        <img
          src={ghost}
          alt="Mysterious masked figure — evidence for investigation"
          className="evidence-image"
        />
      </div>

      <p className="intro-text">
        Identify the game this character originates from, its developer, and the
        country the developer is based in.
      </p>

    </section>
  );
}
