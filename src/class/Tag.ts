export class Tag {
  public fullName: string;
  private _hasParentTag: boolean;
  private _parent: string;

  public constructor(name: string) {
    name = name.replace(/(,|'|")/g, '');
    const splitted = name.replace(/(,|'|")/g, '').split('/');

    if (splitted.length > 1) {
      this._hasParentTag = true;
      this._parent = splitted.slice(0, -1).join('/');
    } else {
      this._hasParentTag = false;
    }

    this.fullName = name;
  }

  public get name(): string {
    const splitted = this.fullName.split('/');
    return splitted[splitted.length - 1];
  }

  public get hasParentTag(): boolean {
    return this._hasParentTag;
  }

  public get parent(): Tag {
    return new Tag(this._parent);
  }

  public get tree(): Tag[] {
    const tree = [];
    if (this.hasParentTag) {
      tree.push(this.parent, ...this.parent.tree);
    }

    return tree;
  }
}

export default {
  Tag
};
