export abstract class Entity<Props> {
  protected readonly _id: string | number;
  protected props: Props;

  protected constructor(props: Props, id: string | number) {
    this.props = props;
    this._id = id;
  }

  get id(): string | number {
    return this._id;
  }

  public equals(entity?: Entity<Props> | null): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
