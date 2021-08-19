export class Plan {
  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #name: string
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  public constructor(name: string) {
    this.#name = name
  }

  public get name(): string {
    return this.#name
  }
}
