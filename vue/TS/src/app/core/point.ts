/***
 * 节点树元素
 */
export class AreaPoint {
    constructor(x:number,y:number){
        this._x=x;
        this._y=y;
    }
    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }
    private _x:number=0;
    private _y:number=0;
}