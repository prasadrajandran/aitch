export class Listeners extends Array<() => unknown> {
  cancel() {
    this.forEach((listener) => listener());
    this.splice(0, this.length);
  }
}
