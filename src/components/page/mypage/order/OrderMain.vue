<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>제품코드</th> 
                    <th>제품명</th>
                    <th>주문일자</th>
                    <th>수량</th>
                    <th>금액</th>
                    <th>배송일자</th>
                    <th>반품신청</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isLoading">
                    <td colspan="7">로딩 중...</td>
                </tr>
                <template v-else-if="cnt > 0">
                    <tr v-for="list in orderList" :key="list.seq">
                        <td>{{ list.item_code}}</td>
                        <td>{{ list.item_name }}</td>
                        <td>{{ formatDate(list.obtain_date) }}</td>
                        <td>{{ list.obtain_count }}</td>
                        <td>{{ formatWon(list.item_price * list.obtain_count) }}</td>
                        <td v-if="list.delivery_date">{{ formatDate(list.delivery_date) }}</td>
                        <td v-else>{{ list.delivery_date }}</td>
                        <td v-if="list.returnYN === 'N' "><button @click="returnOrder(list)">반품</button></td>
                        <td v-else><button disabled>반품</button></td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="7">구매내역이 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
                :totalItems="cnt"
                :itemsPerPage="5"
                :maxPagesShown="5"
                :onClick="refetch"
                v-model="cpage"
            />
        </div>
        <ReturnOrder v-if="modalState.modalState" :props="props"/>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useModalStore } from '@/stores/modalState';
import ReturnOrder from './ReturnOrder.vue';
import Pagination from '@/components/common/Pagination.vue';
import { useQuery } from '@tanstack/vue-query';

    const cpage = ref(1);
    const orderList = ref([]);
    const cnt = ref(1);
    const modalState = useModalStore();
    const props = ref();
    const provider = inject("providedValue");
    

    const orderHistoryList = async () => {
        const result = await axios
            .post(`/api/mypage/orderHistoryJson.do`, {
                cpage: cpage.value || 1,
                pageSize: 5,
                ...provider.value
            })
        return result.data;
    };

    const formatDate = (timeStamp) => {
        const date = new Date(timeStamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const formatWon = (price) => {
        const price1 = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${price1}` + `원`;
    };

    watch(provider, async ()=>{
        const data = await orderHistoryList();
        if(data){
            orderList.value = data.orderList;
            cnt.value = data.cnt;
        }
    })

    const {isLoading ,refetch} = useQuery({
        queryKey : ["orderHistoryQuery", provider.value],
        queryFn: orderHistoryList,
        select: (data)=>{
            orderList.value = data.orderList;
            cnt.value = data.cnt;
        }
    })

    const returnOrder = (list)=>{
        if(list.delivery_date === undefined){
            alert('아직 배송전입니다')
        }else{
            if(confirm("반품하시겠습니까?")){
                props.value = list;
                modalState.setModalState();
            }
        }
    }
</script>

<style scoped>
/* Container style */
.container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

/* Table styles */
table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    text-align: center;
}

thead {
    background-color: #333;
    color: #fff;
}

th, td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
}

th {
    font-weight: bold;
    border: 1px solid #fff;
}

tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}

tbody tr:hover {
    background-color: #ddd;
}

input[type="checkbox"] {
    cursor: pointer;
}

td {
    vertical-align: middle;
}

/* Empty message style */
.empty-message {
    text-align: center;
    padding: 20px;
    color: #777;
}

.empty-message td {
    border: none;
    background-color: #f9f9f9;
}

/* Additional styles */
.totalDiv {
    text-align: center;
    margin-top: 20px;
}

.bottomSpan {
    margin: 3px;
}

.countInput {
    width: 50px;
    text-align: center;
}

a {
    cursor: pointer;
}

/* Form styles */
.conTitle {
    font-size: 18px;
    margin-bottom: 20px;
    float: right;
}

.fr {
    display: flex;
    align-items: center;
    gap: 10px;
}

input[type="date"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

button:hover {
    background-color: #0056b3;
    color: white;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

</style>
