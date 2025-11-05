/**
 * BLS API Client
 * Fetches labor statistics for career matching
 *
 * - API key is read from environment variable BLS_API_KEY by default.
 * - For tests, pass { apiKey, fetch } to constructor.
 *
 * Implements O*NET SOC -> BLS series ID mapping per TECHNICAL_SPECS_ISSUE_19.md
 *
 * [HUMAN REVIEW NEEDED]: Confirm Cloudflare env binding name and whether non-national area series are needed.
 */

class BLSClient {
  constructor(options = {}) {
    this.fetch = options.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    this.apiKey = options.apiKey || (typeof process !== 'undefined' && process.env && process.env.BLS_API_KEY) || null;
    this.baseURL = 'https://api.bls.gov/publicAPI/v2/';
    this.lastRequestAt = 0;
    this.minIntervalMs = options.minIntervalMs ?? 150;
  }

  async _call(endpoint, body = {}) {
    if (!this.fetch) throw new Error('No fetch available for BLSClient');
    if (!this.apiKey) throw new Error('BLS API key not provided. Set BLS_API_KEY env var or pass apiKey to constructor.');

    const now = Date.now();
    const elapsed = now - this.lastRequestAt;
    if (elapsed < this.minIntervalMs) {
      await new Promise((r) => setTimeout(r, this.minIntervalMs - elapsed));
    }
    this.lastRequestAt = Date.now();

    const url = `${this.baseURL}${endpoint}`;
    const payload = { ...body, registrationkey: this.apiKey };

    const res = await this.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`BLS API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (!json || json.status === 'REQUEST_NOT_PROCESSED' || (json.Results == null && json.series == null)) {
      throw new Error(`BLS API returned unexpected payload: ${JSON.stringify(json)}`);
    }

    return json.Results ?? json;
  }

  onetToBLSSeriesId(onetCode, type = 'employment') {
    const cleanCode = (onetCode || '').replace(/[-\.]/g, '');
    if (type === 'employment') return `OEUN${cleanCode}`;
    if (type === 'salary') return `OEUM0000000${cleanCode}`;
    throw new Error(`Unknown BLS series type: ${type}`);
  }

  async getOccupationData(onetCode) {
    if (!onetCode) throw new Error('onetCode required');

    const employmentSeriesId = this.onetToBLSSeriesId(onetCode, 'employment');
    const salarySeriesId = this.onetToBLSSeriesId(onetCode, 'salary');

    try {
      const results = await this._call('timeseries/data/', {
        seriesid: [employmentSeriesId, salarySeriesId],
        startyear: new Date().getFullYear() - 1,
        endyear: new Date().getFullYear()
      });
      return { raw: results };
    } catch (err) {
      return { error: err.message };
    }
  }

  async getSalaryData(onetCode) {
    const data = await this.getOccupationData(onetCode);
    if (data.error) return { error: data.error };
    return { median: null, mean: null, p10: null, p90: null, raw: data.raw };
  }

  async getGrowthOutlook(onetCode) {
    const data = await this.getOccupationData(onetCode);
    if (data.error) return { error: data.error };
    return { growthRate: null, outlook: null, demand: null, raw: data.raw };
  }
}

export default BLSClient;