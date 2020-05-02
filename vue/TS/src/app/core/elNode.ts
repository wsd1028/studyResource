/***
 * 节点树元素
 */
import {Area} from "./area";
import {INode} from "./iNode";

export class ElNode {
    get areas(): Array<INode> {
        return this._areas;
    }

    set areas(value: Array<INode>) {
        this._areas = value;
    }
    /***
     * 获取子树
     */
    get children(): Array<INode> {
        return this._children;
    }

    /***
     * 设置子树数据
     * @param value
     */
    set children(value: Array<INode>) {
        this._children = value;
    }

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

    private _areas:Array<INode>=[];
    private _children:Array<INode>=[];
    private _id: number = 0;
    private _label: string = "";
}