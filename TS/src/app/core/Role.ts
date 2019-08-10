export class Role {
  /**角色id */
  // export virtual string Id { get; set; }
  get id(): string {
    return this.Id;
  }
  set id(value: string) {
    this.Id = value;
  }
  Id: string = "";
  /**角色名称 */
  // export virtual string RoleName { get; set; }
  get roleName(): string {
    return this.roleName;
  }
  set roleName(value: string) {
    this.RoleName = value;
  }
  RoleName: string = "";
  /**描述 */
  // export virtual string Descr { get; set; }
  get descr(): string {
    return this.Descr;
  }
  set descr(value: string) {
    this.Descr = value;
  }
  Descr: string = "";
  /**角色状态 */
  // export virtual int State { get; set; } = 1;
  get state(): number {
    return this.State;
  }
  set state(value: number) {
    this.State = value;
  }
  State: number = 1;
  /**是否是超管 */
  // export virtual bool IsAdmin { get; set; }
  get isAdmin(): boolean {
    return this.IsAdmin;
  }
  set isAdmin(value: boolean) {
    this.IsAdmin = value;
  }
  IsAdmin: boolean = false;
}
