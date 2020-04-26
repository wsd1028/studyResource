Vue.component('dynamic-table', {
	props: {
		// 表格的数据
		tableData: {
			type: Array,
			required: true
		},
		// 多级表头的数据
		tableHeader: {
			type: Array,
			required: true
		},
		// 表格的高度
		height: {
			type: String
		},
		showSummary: {
			type: Boolean,
			required: false
		},
		summaryMethod: {
			type: Function,
			required: false
		},
		// 多表头树节点配置选项
		props: {
			type: Object,
			required: false,
			default: function () {
				return {
					parent: 'parentId',
					value: 'id',
					label: 'label',
					children: 'children'
				};
			}
		},
		showOper: {
			type: Boolean,
			required: false,
			default: false
		},
		
	},
	computed: {
		// 是否为树状结构数据
		dataType: function () {
			const jsonStr = JSON.stringify(this.tableHeader);
			return jsonStr.indexOf(this.props.children) !== -1;
		},
		// 若非树状结构，则转化为树状结构数据
		data: function () {
			return this.dataType ? this.tableHeader : this.switchTree();
		}
	},
	watch: {
		labelModel: function (val) {
			if (!val) {
				this.valueModel = '';
			}
			this.$refs.tree.filter(val);
		},
		value: function (val) {
			this.labelModel = this.queryTree(this.data, val);
		}
	},
	created: function () {
		
	},
	methods: {
		// 偏平数组转化为树状层级结构
		switchTree: function () {
			return this.cleanChildren(this.buildTree(this.tableHeader, '0'));
		},
		// 将一维的扁平数组转换为多层级对象
		buildTree: function (data, id) {
			if (!id) {
				id = '0';
			}
			const fa = function (parentId) {
				const temp = [];
				for (let i = 0; i < data.length; i++) {
					const n = data[i];
					if (n[this.props.parent] === parentId) {
						n.children = fa(n.rowGuid);
						temp.push(n);
					}
				}
				return temp;
			};
			return fa(id);
		},
		// 清除空 children项
		cleanChildren: function (data) {
			const fa = function (list) {
				list.map(function (e) {
					if (e.children.length) {
						fa(e.children);
					} else {
						delete e.children;
					}
					return e;
				});
				return list;
			};
			return fa(data);
		}
	},
	mounted: function () {
		this.$forceUpdate();
	},
	template:
		'<div>'+
		'<el-table :data="tableData" border :height="height" :show-summary="showSummary" :summary-method="summaryMethod">' +
				'<template v-for="item in tableHeader">'+
					'<table-column v-if="item.children && item.children.length" :key="item.id" :coloumn-header="item" :min-width="item.minWidth"></table-column>'+
					'<el-table-column v-else :key="item.id" :label="item.label" :prop="item.prop" :fixed="item.fixed" :min-width="item.minWidth" align="center"></el-table-column>'+
				'</template>'+
			'</el-table >'+
		'</div>',
	components: {
		//'table-column': table-column
	}
});