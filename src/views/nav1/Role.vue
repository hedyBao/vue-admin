<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getRoles">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="100">
            </el-table-column>
            <el-table-column prop="roleId" label="角色编号" align="center"  width="130">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" align="center" width="230" sortable>
            </el-table-column>

            <el-table-column prop="permissionName" label="权限名称" align="center" width="300" sortable>
            </el-table-column>

            <el-table-column label="操作" align="center" width="280">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="角色编号" prop="roleId">
                    <el-input v-model="editForm.roleId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限设置">
                    <el-checkbox-group v-model="editForm.permissionIds"  >
                        <el-checkbox v-for="permission in permissions"   :key="permission.permissionId" :label="permission.permissionId"
                                     @change="checked=>checkRow(checked, permission.permissionId)">{{permission.permissionName,permission.url}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增账号" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :role="addForm" ref="addForm">
                <el-form-item label="角色编号" prop="roleId">
                    <el-input v-model="addForm.roleId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName" ></el-input>
                </el-form-item>

                <!--<el-form-item label="密码" prop="passWord">-->
                    <!--<el-input v-model="addForm.passWord" ></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="角色授权">-->
                <!--<el-checkbox-group v-model="editForm.roleIds"  >-->
                <!--<el-checkbox v-for="role in roles"   :key="role.roleId" :label="role.roleId">{{role.roleName}}</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <!--</el-form-item>-->

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getRoleListPage, removeRole, batchRemoveRole, editRole, addRole, queryAllPermissions } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    roleName:[]
                },
                roles: [],
                permissions: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        // trigger: ‘blur’ 表示“当失去焦点时（光标不显示的时候），触发此提示
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    userName: '',
                    phone: '',
                    roleNames:'',
                    permissionIds : [],

                    rules: {

                        type: [
                            { type: 'array', required: true, message: '请至少选择一个角色授权', trigger: 'change' }

                        ],

                    }

                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                // addFormRules: {
                // 	name: [
                // 		{ required: true, message: '请输入账号', trigger: 'blur' }
                // 	]
                // },
                //新增界面数据
                addForm: {
                    roleId: '',
                    roleName:'',

                }

            }
        },
        methods: {
            checkRow: function (checked, roleId){
                //debugger;
                if(checked.target.checked){
                    var find =false;
                    this.editForm.roleIds.forEach((e, index, self) => {
                        if(e == roleId){
                            find = true;
                        }
                    });
                    if(find != true){
                        this.editForm.roleIds.push(roleId)
                        console.log();
                    }
                }else{
                    this.editForm.roleIds.forEach((e, index, self) => {
                        if(e == roleId){
                            this.editForm.roleIds.splice(index, roleId);
                        }
                    });
                }
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取角色列表
            getRoles() {
                let para = {
                    page: this.page,
                    roleName: this.filters.roleName
                };
                this.listLoading = true;
                //NProgress.start();
                getRoleListPage(para).then((res) => {
                    //this.total = res.data.total;
                    this.roles = res.data;

                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            // 这里是获取所有权限名称的
            getAllPermissions(){
                queryAllPermissions().then((res) => {
                    this.permissions = res.data;
                }) ;
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { roleId: row.roleId };
                    removeRole(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRoles();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    roleId: '',
                    roleName: '',
                    // phone:'',

                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editRole(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getRoles();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addRole(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getRoles();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var roleIds = this.sels.map(item => item.roleId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { roleIds: roleIds };
                    batchRemoveRole(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRoles();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getRoles();
            this.getAllPermissions();
        }
    }

</script>

<style scoped>

</style>