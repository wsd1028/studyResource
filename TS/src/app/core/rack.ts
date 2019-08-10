export class Rack {
  /**机柜的Id */
  // export virtual string Id { get; set; }
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**所在节点的Id */
  // export virtual int NodeId { get; set; }
  get nodeId(): number {
    return this.NodeId;
  }
  set nodeId(value: number) {
    this.NodeId = value;
  }
  NodeId: number = 0;
  /**机房 */
  // export virtual string NodeName { get; set; }
  get nodeName(): string {
    return this.NodeName;
  }
  set nodeName(value: string) {
    this.NodeName = value;
  }
  NodeName: string = "";
  /**机柜名称 */
  // export virtual string RackName { get; set; }
  get rackName(): string {
    return this.RackName;
  }
  set rackName(value: string) {
    this.RackName = value;
  }
  RackName: string = "";
  /**机柜容量 */
  // export virtual int Capacity { get; set; }
  get capacity(): number {
    return this.Capacity;
  }
  set capacity(value: number) {
    this.Capacity = value;
  }
  Capacity: number = 0;

  /**机柜的编码 */
  // export virtual string RackCode { get; set; }
  get rackCode(): string {
    return this.RackCode;
  }
  set rackCode(value: string) {
    this.RackCode = value;
  }
  RackCode: string = "";
  /**机柜租用的客户Id */
  // export virtual string CustId { get; set; }
  get custId(): string {
    return this.CustId;
  }
  set custId(value: string) {
    this.CustId = value;
  }
  CustId: string = "";
  /**机柜租用的客户 */
  // export virtual string CustNames { get; set; }
  get custNames(): string {
    return this.CustNames;
  }
  set custNames(value: string) {
    this.CustNames = value;
  }
  CustNames: string = "";
  /**用途id */
  // export virtual int TypeUseId { get; set; }
  get typeUseId(): number {
    return this.TypeUseId;
  }
  set typeUseId(value: number) {
    this.TypeUseId = value;
  }
  TypeUseId: number = 0;
  /**机房id */
  // export virtual string RoomId { get; set; }
  get roomId(): string {
    return this.RoomId;
  }
  set roomId(value: string) {
    this.RoomId = value;
  }
  RoomId: string = "";
  /**机房名称 */
  // export virtual string RoomName { get; set; }
  get roomName(): string {
    return this.RoomName;
  }
  set roomName(value: string) {
    this.RoomName = value;
  }
  RoomName: string = "";
}
