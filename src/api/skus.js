import axios from '~/axios'

// 获取商品规格列表
export function getSkusList(page){
    return axios.get(`/admin/skus/${page}`)
}

// 增加商品规格
export function createSkus(data){
    return axios.post("/admin/skus",data)
}

// 修改商品规格
export function updateSkus(id,data){
    return axios.post("/admin/skus/"+id,data)
}

// 批量删除商品规格
export function deleteSkus(ids){
    ids = !Array.isArray(ids) ? [ids] : ids
    return axios.post(`/admin/skus/delete_all`,{ ids })
}