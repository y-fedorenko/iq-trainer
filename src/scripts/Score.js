export default class Score {
  #date;
  #hits;
  #percentage;

  constructor(date, hits, percentage) {
    this.#date = date;
    this.#hits = hits;
    this.#percentage = percentage;
  }

  getDate() {
    return this.#date;
  }

  getHits() {
    return this.#hits;
  }

  getPercentage() {
    return this.#percentage;
  }
}
