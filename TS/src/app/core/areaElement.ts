import {Room2dShape} from "./shape";
import {ToolTipItem} from "./toolTipItem";
import {Rack} from "./rack";

export class AreaElement {
    get autoCompleteName(): string {
        return this.AutoCompleteName;
    }

    set autoCompleteName(value: string) {
        this.AutoCompleteName = value;
    }
    get resource(): Rack {
        return this.Resource;
    }

    set resource(value: Rack) {
        this.Resource = value;
    }
    get toolTips(): Array<ToolTipItem> {
        return this.ToolTips;
    }

    set toolTips(value: Array<ToolTipItem>) {
        this.ToolTips = value;
    }
    get offsetY(): number {
        return this.OffsetY;
    }

    set offsetY(value: number) {
        this.OffsetY = value;
    }
    get offsetX(): number {
        return this.OffsetX;
    }

    set offsetX(value: number) {
        this.OffsetX = value;
    }
    get shape(): Room2dShape {
        return this.Shape;
    }

    set shape(value: Room2dShape) {
        this.Shape = value;
    }

    get shapeId(): string {
        return this.ShapeId;
    }

    set shapeId(value: string) {
        this.ShapeId = value;
    }

    get fillColor(): string {
        return this.FillColor;
    }

    set fillColor(value: string) {
        this.FillColor = value;
    }

    get borderColor(): string {
        return this.BorderColor;
    }

    set borderColor(value: string) {
        this.BorderColor = value;
    }

    get rotation(): number {
        return this.Rotation;
    }

    set rotation(value: number) {
        this.Rotation = value;
    }

    get zIndex(): number {
        return this.ZIndex;
    }

    set zIndex(value: number) {
        this.ZIndex = value;
    }

    get y(): number {
        return this.Y;
    }

    set y(value: number) {
        this.Y = value;
    }

    get x(): number {
        return this.X;
    }

    set x(value: number) {
        this.X = value;
    }

    get radius(): number {
        return this.Radius;
    }

    set radius(value: number) {
        this.Radius = value;
    }

    get height(): number {
        return this.Height;
    }

    set height(value: number) {
        this.Height = value;
    }

    get width(): number {
        return this.Width;
    }

    set width(value: number) {
        this.Width = value;
    }

    get name(): string {
        return this.Name;
    }

    set name(value: string) {
        this.Name = value;
    }

    get id(): string {
        return this.Id;
    }

    set id(value: string) {
        this.Id = value;
    }

    private Id: string = "";
    private Name: string = "";
    private Width: number = 0;
    private Height: number = 0;
    private Radius: number = 0;
    private X: number = 0;
    private Y: number = 0;
    private OffsetX: number = 0;
    private OffsetY: number = 0;
    private ZIndex: number = 0;
    private Rotation: number = 0;
    private BorderColor: string = "";
    private FillColor: string = "";
    private ShapeId: string = "";
    private ToolTips:Array<ToolTipItem>=[];
    // @ts-ignore
    private Shape: Room2dShape = null;
    // @ts-ignore
    private Resource:Rack=null;
    private AutoCompleteName="";
}
