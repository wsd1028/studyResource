/***
 * 节点树元素
 */
export class Area {
    /***
     * 获取树节点的显示值
     */
    get label(): string {
        return this._label;
    }

    /***
     * 设置树节点的显示值
     * @param value
     */
    set label(value: string) {
        this._label = value;
    }

    /***
     *获取树节点的ID
     */
    get id(): number {
        return this._id;
    }

    /***
     *设置树节点的ID
     * @param value
     */
    set id(value: number) {
        this._id = value;
    }

    constructor() {
    }

    private _id: number = 0;
    private _label: string = "";
}