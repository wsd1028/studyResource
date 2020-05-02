export class NodeManager {
  /**主键id */
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**用户姓名 */
  get realName(): string {
    return this.RealName;
  }
  set realName(value: string) {
    this.RealName = value;
  }
  RealName: string = "";
  /**账号 */
  get login(): string {
    return this.Login;
  }
  set login(value: string) {
    this.Login = value;
  }
  Login: string = "";
  /**手机号 */
  get phoneNum(): string {
    return this.PhoneNum;
  }
  set phoneNum(value: string) {
    this.PhoneNum = value;
  }
  PhoneNum: string = "";
  /**邮箱 */
  get email(): string {
    return this.Email;
  }
  set email(value: string) {
    this.Email = value;
  }
  Email: string = "";
  /**节点名称 */
  // export string NodeName { get; set; }
  get nodeName(): string {
    return this.NodeName;
  }
  set nodeName(value: string) {
    this.NodeName = value;
  }
  NodeName: string = "";
  /**节点id */
  // export int NodeId { get; set; }
  get nodeId(): number {
    return this.NodeId;
  }
  set nodeId(value: number) {
    this.NodeId = value;
  }
  NodeId: number = 0;
  /**密码 */
  //   export string Pwd { get; set; }
  get pwd(): string {
    return this.Pwd;
  }
  set pwd(value: string) {
    this.Pwd = value;
  }
  Pwd: string = "";
}
