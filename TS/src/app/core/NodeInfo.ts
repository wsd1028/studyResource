export class NodeInfo {
  /**节点名称 */
  // export virtual string NodeName { get; set; }
  get nodeName(): string {
    return this.NodeName;
  }
  set nodeName(value) {
    this.NodeName = value;
  }
  NodeName: string = "";
  /**节点id */
  // export virtual int NodeId { get; set; }
  get nodeId(): number {
    return this.NodeId;
  }
  set nodeId(value) {
    this.NodeId = value;
  }
  NodeId: number = 0;
  /**父节点id */
  // export virtual int FatherNodeId { get; set; }
  get fatherNodeId(): number {
    return this.FatherNodeId;
  }
  set fatherNodeId(value) {
    this.FatherNodeId = value;
  }
  FatherNodeId: number = 0;
  /**父节点名称 */
  // export virtual string FatherNodeName { get; set; }
  get fatherNodeName(): string {
    return this.FatherNodeName;
  }
  set fatherNodeName(value) {
    this.FatherNodeName = value;
  }
  FatherNodeName: string = "";
  /**节点类型 1 省公司 2 市公司 3  数据中心 */
  get nodeType(): number {
    return this.NodeType;
  }
  set nodeType(value) {
    this.NodeType = value;
  }
  NodeType: number = 0;
  /**状态 */
  // export virtual int State { get; set; }
  get state(): number {
    return this.State;
  }
  set state(value) {
    this.State = value;
  }
  State: number = 0;
  /**编码 */
  // export virtual string Code { get; set; }
  get code(): string {
    return this.Code;
  }
  set code(value) {
    this.Code = value;
  }
  Code: string = "";
  /**别名 */
  // export virtual string Alias { get; set; }
  get alias(): string {
    return this.Alias;
  }
  set alias(value) {
    this.Alias = value;
  }
  Alias: string = "";
}
