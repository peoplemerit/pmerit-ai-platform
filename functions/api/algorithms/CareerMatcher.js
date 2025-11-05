/**
 * Career Matching Algorithm
 * Matches Big Five personality traits and Holland Code to careers
 *
 * @module CareerMatcher
 * @requires DatabaseHelper for career queries (expects searchCareersByPersonality)
 * @version 1.1.0
 *
 * Applied decisions:
 * - Uses DatabaseHelper.searchCareersByPersonality(bigFive, hollandCode, limit)
 * - Holland code order-weighting: 1st 50%, 2nd 30%, 3rd 20%
 */

class CareerMatcher {
  constructor(databaseHelper) {
    this.db = databaseHelper;
    this.defaultTraitWeights = { openness: 0.2, conscientiousness: 0.2, extraversion: 0.2, agreeableness: 0.2, neuroticism: 0.2 };
    this.hollandAdjacency = { R: { R: 0, I: 1, A: 2, S: 3, E: 2, C: 1 }, I: { R: 1, I: 0, A: 1, S: 2, E: 3, C: 2 }, A: { R: 2, I: 1, A: 0, S: 1, E: 2, C: 3 }, S: { R: 3, I: 2, A: 1, S: 0, E: 1, C: 2 }, E: { R: 2, I: 3, A: 2, S: 1, E: 0, C: 1 }, C: { R: 1, I: 2, A: 3, S: 2, E: 1, C: 0 } };
    this.hollandPositionWeights = [0.5, 0.3, 0.2];
  }
  async findMatches(assessmentData, limit = 10) {
    if (!assessmentData || !assessmentData.bigFive || !assessmentData.hollandCode) throw new Error('Invalid assessment data: bigFive and hollandCode required');
    let careers = [];
    if (typeof this.db.searchCareersByPersonality === 'function') careers = await this.db.searchCareersByPersonality(assessmentData.bigFive, assessmentData.hollandCode, Math.max(limit * 5, 50));
    else if (typeof this.db.getAllCareers === 'function') careers = await this.db.getAllCareers();
    careers = Array.isArray(careers) ? careers : [];
    const scored = careers.map((career) => {
      const fitScore = this.calculateFitScore(assessmentData.bigFive, assessmentData.hollandCode, career);
      const rationale = this.generateRationale(assessmentData.bigFive, assessmentData.hollandCode, career, fitScore);
      return { career_id: career.career_id ?? career.id ?? career.onet_code ?? career.onetCode ?? null, title: career.title ?? career.name ?? 'Unknown Career', fit_score: fitScore, rationale, career };
    });
    scored.sort((a, b) => b.fit_score - a.fit_score);
    const unique = []; const seen = new Set();
    for (const s of scored) { if (unique.length >= limit) break; const id = s.career_id ?? s.title; if (!seen.has(id)) { seen.add(id); unique.push(s); } }
    return unique.map((m) => ({ career_id: m.career_id, title: m.title, fit_score: m.fit_score, rationale: m.rationale, ...m.career }));
  }
  calculateFitScore(bigFive, userHollandCode, career) { const traitScore = this.calculateTraitMatch(bigFive, career); const hollandScore = this.calculateHollandCompatibility(userHollandCode, career.holland_codes ?? career.hollandCode ?? ''); const finalScore = (traitScore * 0.6) + (hollandScore * 0.4); return Math.max(0, Math.min(100, Math.round(finalScore))); }
  calculateTraitMatch(bigFive, careerTraits) { const weights = { openness: careerTraits.openness_importance ?? this.defaultTraitWeights.openness, conscientiousness: careerTraits.conscientiousness_importance ?? this.defaultTraitWeights.conscientiousness, extraversion: careerTraits.extraversion_importance ?? this.defaultTraitWeights.extraversion, agreeableness: careerTraits.agreeableness_importance ?? this.defaultTraitWeights.agreeableness, neuroticism: careerTraits.neuroticism_importance ?? this.defaultTraitWeights.neuroticism };
    if (!careerTraits.openness_importance && careerTraits.personality_fit && careerTraits.personality_fit.openness) { const map = { very_high: 0.28, high: 0.25, medium: 0.2, low: 0.15, very_low: 0.12 }; weights.openness = map[careerTraits.personality_fit.openness] ?? weights.openness; }
    const preferred = { openness: careerTraits.openness ?? careerTraits.openness_preference ?? 50, conscientiousness: careerTraits.conscientiousness ?? careerTraits.conscientiousness_preference ?? 50, extraversion: careerTraits.extraversion ?? careerTraits.extraversion_preference ?? 50, agreeableness: careerTraits.agreeableness ?? careerTraits.agreeableness_preference ?? 50, neuroticism: careerTraits.neurotic ?? careerTraits.neuroticism_preference ?? 50 };
    const userPct = { openness: this._extractPercentile(bigFive.openness), conscientiousness: this._extractPercentile(bigFive.conscientiousness), extraversion: this._extractPercentile(bigFive.extraversion), agreeableness: this._extractPercentile(bigFive.agreeableness), neuroticism: this._extractPercentile(bigFive.neurotic) };
    let scoreSum = 0; let weightSum = 0; for (const trait of Object.keys(weights)) { const w = weights[trait] ?? 0; const p = preferred[trait] ?? 50; const u = userPct[trait] ?? 50; const traitScore = Math.max(0, 100 - Math.abs(u - p)); scoreSum += traitScore * w; weightSum += w; }
    if (weightSum <= 0) return 50; const normalized = (scoreSum / weightSum); return Math.max(0, Math.min(100, Math.round(normalized))); }
  _extractPercentile(traitObjOrNumber) { if (traitObjOrNumber == null) return 50; if (typeof traitObjOrNumber === 'number') return traitObjOrNumber; if (typeof traitObjOrNumber === 'object') { if (typeof traitObjOrNumber.percentile === 'number') return traitObjOrNumber.percentile; if (typeof traitObjOrNumber.raw === 'number') { const raw = traitObjOrNumber.raw; const scaled = ((raw - 1) / 4) * 100; return Math.round(Math.max(0, Math.min(100, scaled))); } } return 50; }
  calculateHollandCompatibility(userCode, careerCode) { if (!userCode || !careerCode) return 50; userCode = ('' + userCode).toUpperCase().replace(/[^RIASEC]/g, ''); careerCode = ('' + careerCode).toUpperCase().replace(/[^RIASEC]/g, ''); if (userCode.length === 0 || careerCode.length === 0) return 50; const userLetters = userCode.split('').slice(0, 3); const careerLetters = careerCode.split('').slice(0, 3); let weightedScore = 0; let totalWeight = 0; for (let i = 0; i < userLetters.length; i++) { const u = userLetters[i]; const posWeightUser = this.hollandPositionWeights[i] ?? 0; let minWeightedScoreForUserLetter = 0; let careerWeightTotal = 0; for (let j = 0; j < careerLetters.length; j++) { const c = careerLetters[j]; const posWeightCareer = this.hollandPositionWeights[j] ?? 0; const dist = (this.hollandAdjacency[u] && this.hollandAdjacency[u][c] !== undefined) ? this.hollandAdjacency[u][c] : 3; const similarity = Math.max(0, Math.min(100, 100 - (dist * 20))); minWeightedScoreForUserLetter += similarity * posWeightCareer; careerWeightTotal += posWeightCareer; } const avgCareerWeighted = careerWeightTotal > 0 ? (minWeightedScoreForUserLetter / careerWeightTotal) : 0; weightedScore += avgCareerWeighted * posWeightUser; totalWeight += posWeightUser; } if (totalWeight <= 0) return 50; const hollandScore = Math.round(weightedScore / totalWeight); return Math.max(0, Math.min(100, hollandScore)); }
  generateRationale(bigFive, hollandCode, career, fitScore) { const userPct = { openness: this._extractPercentile(bigFive.openness), conscientiousness: this._extractPercentile(bigFive.conscientiousness), extraversion: this._extractPercentile(bigFive.extraversion), agreeableness: this._extractPercentile(bigFive.agreeableness), neuroticism: this._extractPercentile(bigFive.neurotic) }; const topTraits = Object.entries(userPct).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} (${v}th percentile)`); const hollandCareer = career.holland_codes ?? career.hollandCode ?? 'N/A'; const hollandScore = this.calculateHollandCompatibility(hollandCode, hollandCareer); let rationale = `Fit ${fitScore}/100. `; if (topTraits.length) { rationale += `Your prominent traits: ${topTraits.join(' and ')}. `; } rationale += `Holland: ${hollandCareer} (compatibility ${hollandScore}/100). `; if (career.description) rationale += `${career.description.split('.').slice(0,2).join('.')} `; rationale += `This match uses role-specific trait importance when available.`; return rationale; }
}

export default CareerMatcher;