export interface Customer: ResBase
	{
		/**客户id */
		export virtual string Id { get; set; }
		/**客户名称 */
		export virtual string CustName { get; set; }
		/**客户编码 */
		export virtual string CustCode { get; set; }
		/**自动code */
		export virtual int Code { get; set; }
		/**状态 */
		export virtual int State { get; set; } = 1;
		/**客户联系人 */
		export virtual string ContactPerson { get; set; } = "";
		/**客户联系人电话 */
		export virtual string ContactPhone { get; set; } = "";
		/**客户经理 */
		export virtual string ClientManager { get; set; } = "";
		/**客户经理id */
		export virtual int ClientManagerId { get; set; } = 0;
		/**客户类型 */
		export virtual string ClientType { get; set; } = "";
		/**客户类型id */
		export virtual int ClientTypeId { get; set; } = 999;
		/**客户节点 */
		export virtual int NodeId { get; set; } = 20005;
		
    }