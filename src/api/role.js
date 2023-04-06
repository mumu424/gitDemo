
import axios from '~/axios'

// 获取菜单权限列表
export function getRoleList(page){
    return axios.get(`/admin/rule/${page}`)
}

// 增加菜单权限
export function createRole(data){
    return axios.post("/admin/rule",data)
}

// 修改菜单权限
export function updateRole(id,data){
    return axios.post("/admin/rule+id,data")
}

// 删除菜单权限
export function deleteRole(id){
    return axios.post(`/admin/rule/${id}/delete`)
}

// 修改菜单权限状态
export function updateRoleStatus(id){
    return axios.post(`/admin/rule/${id}/update_status`)
}

// 设置菜单权限状态
export function setRoleRules(id,rule_ids){
    return axios.post(`/admin/role/set_rules`,{
        id,rule_ids
    })
}

