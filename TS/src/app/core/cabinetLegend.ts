export class CabinetLegend {
    get id(): string {
        return this.Id;
    }

    set id(value: string) {
        this.Id = value;
    }

    get name(): string {
        return this.Name;
    }

    set name(value: string) {
        this.Name = value;
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
    private Id: string = "";
    private Name: string = "";
    private FillColor: string = "";
    private BorderColor: string = "";
}