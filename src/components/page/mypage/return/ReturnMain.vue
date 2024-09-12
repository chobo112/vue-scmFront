<template>
    <div>
        <p class="conTitle">
            <span class="fr">
                <button @click="setToday">오늘</button>
                <button @click="setWeek">일주일</button>
                <button @click="setMonth">한달</button>
                
                <input type="date" id="startDate" v-model="returnParam.startDate">
                ~
                <input type="date" id="endDate" v-model="returnParam.endDate">
                <button @click="returnHistory">검색</button>
            </span>
        </p>
    </div>
    <div>
        <table>
            <thead>
                <tr>
                    <th>제품코드</th> 
                    <th>제품명</th>
                    <th>주문일자</th>
                    <th>수량</th>
                    <th>금액</th>
                    <th>반품신청일</th>
                    <th>반품완료일</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="cnt > 0">
                    <tr v-for="list in returnList" :key="list.seq">
                        <td>{{ list.item_code}}</td>
                        <td>{{ list.item_name }}</td>
                        <td>{{ formatDate(list.obtain_date) }}</td>
                        <td>{{ list.return_count }}</td>
                        <td>{{ formatWon(list.item_price * list.return_count) }}</td>
                        <td>{{ formatDate(list.return_order_date) }}</td>
                        <td>{{ formatDate(list.return_processing_date) }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td>반품이력이 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            :totalItems="cnt"
            :itemsPerPage="5"
            :maxPagesShown="5"
            :onClick="returnHistory"
            v-model="cpage"

            />
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Pagination from '@/components/common/Pagination.vue';

    const cpage = ref(1);
    const returnList = ref();
    const cnt = ref(0);
    const returnParam = ref({
        startDate :'',
        endDate :''
    });

    const formatDate = (timeStamp) => {
        const date = new Date(timeStamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const returnHistory = ()=>{
        axios
            .post(`/api/mypage/returnHistoryJson.do`,{
                cpage: cpage.value || 1,
                pageSize: 5,
                ...returnParam.value,
            })
            .then((res)=>{
                returnList.value = res.data.list;
                cnt.value = res.data.cnt;
            })
    }

    const formatWon = (price) => {
        const price1 = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${price1}` + `원`;
    };

    const initializeDates = () => {
        const today = new Date();
        returnParam.value.startDate = formatDate(today);
        returnParam.value.endDate = formatDate(today);
    };

    const setToday = () => {
        const today = new Date();
        returnParam.value.startDate = formatDate(today);
        returnParam.value.endDate = formatDate(today);
    };

    const setWeek = () => {
        const today = new Date();
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        returnParam.value.startDate = formatDate(weekAgo);
        returnParam.value.endDate = formatDate(new Date());
    };

    const setMonth = () => {
        const today = new Date();
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        returnParam.value.startDate = formatDate(monthAgo);
        returnParam.value.endDate = formatDate(new Date());
    };

    onMounted(() => {
        initializeDates(); 
        returnHistory();
    });

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
