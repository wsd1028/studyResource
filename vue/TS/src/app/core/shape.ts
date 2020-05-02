export class Room2dShape {
    get base64(): string {
        return this._base64;
    }

    set base64(value: string) {
        this._base64 = value;
    }
    get svgPath(): string {
        return this.SvgPath;
    }

    set svgPath(value: string) {
        this.SvgPath = value;
    }

    get type(): string {
        return this.Type;
    }

    set type(value: string) {
        this.Type = value;
    }

    get id(): string {
        return this.Id;
    }

    set id(value: string) {
        this.Id = value;
    }

    private Id: string = "";
    private Type: string = "";
    private SvgPath: string = "";
    private _base64:string="";
}