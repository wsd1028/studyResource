Vue.component('table-column', {
	props: {
		coloumnHeader: {
			type: Object,
			required: true
		}
	},
	template:
		'<div>'+
			'<el-table-column :label="coloumnHeader.label" :prop="coloumnHeader.label" :min-width="coloumnHeader.minWidth" align="center">'+
				'<template v-for="item in coloumnHeader.children">'+
					'<table-column v-if="item.children && item.children.length" :key="item.id" :coloumn-header="item"></table-column>'+
					'<el-table-column v-else :key="item.name" :label="item.label" :prop="item.prop" align="center"></el-table-column>'+
				'</template>'+
			'</el-table-column>'+
		'</div>'
});