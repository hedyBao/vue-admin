<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="userName" label="账号" width="120" sortable>
				</el-table-column>
				<el-table-column prop="phone" label="电话" width="100"  sortable>
				</el-table-column>
				<el-table-column prop="roleNames" label="角色授权" width="100" sortable>
				<!--</el-table-column>-->
				<!--<el-table-column prop="birth" label="生日" width="120" sortable>-->
				<!--</el-table-column>-->
				<!--&lt;!&ndash;<el-table-column prop="addr" label="地址" min-width="180" sortable>&ndash;&gt;-->
				</el-table-column>
			</el-table>
		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					userName: ''
				},
				loading: false,
				users: [
				]
			}
		},
		methods: {

			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					this.users = res.data;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>