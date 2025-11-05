/**
 * Career Enrichment Service
 * Adds real-time data to career recommendations
 *
 * - Uses Cloudflare Workers KV when kvBinding is provided (expects KV namespace object with get/put/delete).
 * - KV key format: bls:{onetCode}
 * - TTL: 86400 seconds (24 hours)
 * - Falls back to in-memory Map cache when KV is not provided.
 */

class CareerEnrichmentService {
  constructor(blsClient, databaseHelper, options = {}) {
    this.bls = blsClient;
    this.db = databaseHelper;
    this.kv = options.kvBinding || null;
    this.inMemoryCache = new Map();
    this.ttlSeconds = options.ttlSeconds ?? 86400;
    this.maxConcurrent = options.maxConcurrent ?? 5;
  }

  async enrichMatches(matches) {
    const results = [];
    const executing = [];

    for (const match of matches) {
      const p = this._enrichSingle(match).then((enriched) => results.push(enriched)).catch((err) => {
        results.push({
          ...match,
          salary_median: null,
          salary_min: null,
          salary_max: null,
          growth_outlook: null,
          enrichment_error: err.message
        });
      });

      executing.push(p);

      if (executing.length >= this.maxConcurrent) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
    results.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0));
    return results;
  }

  async _enrichSingle(match) {
    const careerId = match.career_id ?? match.onet_code ?? match.title;
    const onetCode = match.onet_code ?? match.onetCode ?? null;
    const cacheKey = onetCode ? `bls:${onetCode}` : `career:${careerId}`;

    const cached = await this._getCached(cacheKey);
    if (cached) {
      return { ...match, ...cached };
    }

    let salary = null;
    let growth = null;
    if (onetCode) {
      try {
        salary = await this.bls.getSalaryData(onetCode);
        growth = await this.bls.getGrowthOutlook(onetCode);
      } catch (err) {
        salary = { error: err.message };
        growth = { error: err.message };
      }
    } else {
      salary = { error: 'No O*NET code for career' };
      growth = { error: 'No O*NET code for career' };
    }

    const median = salary?.median ?? null;
    let min = null;
    let max = null;
    if (typeof median === 'number') {
      min = Math.round(median * 0.8);
      max = Math.round(median * 1.2);
    }

    const enriched = {
      salary_median: median,
      salary_min: min,
      salary_max: max,
      growth_outlook: growth,
      salary_raw: salary,
      holland_codes: match.holland_codes ?? match.hollandCode ?? null,
      career_id,
      title: match.title,
      fit_score: match.fit_score,
      rationale: match.rationale,
      education_required: match.education_required ?? match.education ?? null,
      skills_required: match.skills_required ?? match.skills ?? null,
      onet_code: onetCode ?? null
    };

    await this.cacheCareerData(cacheKey, enriched);
    return enriched;
  }

  async _getCached(key) {
    if (!key) return null;
    if (this.kv) {
      try {
        const raw = await this.kv.get(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const now = Date.now();
        if (parsed.expiresAt && parsed.expiresAt < now) {
          await this.kv.delete(key);
          return null;
        }
        return parsed.data ?? null;
      } catch (err) {
        return null;
      }
    } else {
      const entry = this.inMemoryCache.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        this.inMemoryCache.delete(key);
        return null;
      }
      return entry.data;
    }
  }

  async cacheCareerData(key, data) {
    if (!key) return;
    const payload = { data, expiresAt: Date.now() + (this.ttlSeconds * 1000) };
    if (this.kv) {
      try {
        await this.kv.put(key, JSON.stringify(payload));
        return;
      } catch (err) {
      }
    }
    this.inMemoryCache.set(key, payload);
  }
}

export default CareerEnrichmentService;