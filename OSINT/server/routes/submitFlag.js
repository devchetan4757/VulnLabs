import express from "express";

const router = express.Router();

// Expected answers (server-side only — never exposed to the client)
const ANSWERS = {
  game: "visage",
  developer: "sadsquare studio",
  country: "canada"
};

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

router.post("/", (req, res) => {
  const { game, developer, country } = req.body;

  if (!game || !developer || !country) {
    return res.status(400).json({
      success: false,
      message: "Please answer all three questions before submitting."
    });
  }

  const results = {
    game: normalize(game) === ANSWERS.game,
    developer: normalize(developer) === ANSWERS.developer,
    country: normalize(country) === ANSWERS.country
  };

  const allCorrect = results.game && results.developer && results.country;

  if (allCorrect) {
    return res.json({
      success: true,
      message: "Correct. Investigation complete.",
      results
    });
  }

  return res.status(401).json({
    success: false,
    message: "One or more answers are incorrect. Keep investigating.",
    results
  });
});

export default router;
