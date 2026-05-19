function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\bthe\b|\ba\b|\ban\b/g, ' ')
    .replace(/s\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => i);
  for (let j = 1; j <= b.length; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[a.length];
}

export function matchAnswer(guess: string, answers: string[]): number {
  const ng = normalize(guess);
  if (!ng) return -1;
  let best = -1;
  let bestScore = Infinity;
  answers.forEach((ans, i) => {
    const na = normalize(ans);
    if (!na) return;
    if (na === ng || na.includes(ng) || ng.includes(na)) {
      if (0 < bestScore) { best = i; bestScore = 0; }
      return;
    }
    const d = levenshtein(ng, na);
    const tol = Math.max(2, Math.floor(na.length * 0.25));
    if (d <= tol && d < bestScore) { best = i; bestScore = d; }
  });
  return best;
}
