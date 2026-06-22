export default function SuccessBanner({ flag }) {
  return (
    <div className="success-banner">
      <h3>Challenge Complete</h3>

      <p>
        VaultBot leaked its secret. Flag captured:
      </p>

      <p className="success-flag">
        {flag}
      </p>
    </div>
  );
}
