class ScraperError<T = unknown> extends Error {
  data?: T;

  constructor(message: string, data?: T) {
    super(message);
    this.name = "ScraperError";
    this.data = data;

    Object.setPrototypeOf(this, ScraperError.prototype);
  }
}

export { ScraperError };
