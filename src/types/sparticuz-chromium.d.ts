declare module "@sparticuz/chromium" {
  class Chromium {
    static get args(): string[];
    static executablePath(input?: string): Promise<string>;
  }

  export default Chromium;
}
