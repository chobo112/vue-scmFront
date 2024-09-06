<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">상세 코드 관리</div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">주문번호</th>
                            <th scope="col">주문일자</th>
                            <th scope="col">주문기업명</th>
                            <th scope="col">제품명</th>
                            <th scope="col">주문수량</th>
                            <th scope="col">발주회사</th>
                            <th scope="col">발주수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- v-bind:key="" 또는 :key=""를 사용하여 속성의 속성값을 바꿀 수 있다. (v-bind:속성="값" 또는 :속성="값") -->
                        <tr>
                            <td>{{ props.orderList.seq }}</td>
                            <td>{{ formatData(props.orderList.obtain_date) }}</td>
                            <td>{{ props.orderList.cust_name }}</td>
                            <td>{{ props.orderList.item_name }}</td>
                            <td>{{ props.orderList.obtain_count }}</td>
                            <td>
                                <select v-model="seq">
                                    <option v-for="comp in compList" :key="comp.company_seq" :value="comp.company_seq">
                                        {{ comp.company_name }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                {{ props.orderList.obtain_count - props.orderList.inventory_count }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <button @click="orderInsert()">작성</button>
                    <button @click="modalState.setModalState">닫기</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from "@/stores/modalState";
import { useUserInfo } from "@/stores/userInfo";
import axios from "axios";

const props = defineProps(["orderList"]);
const emit = defineEmits(["test"]);

const modalState = useModalStore();
const userInfo = useUserInfo();
const compList = ref();
const seq = ref();

const formatData = (timeStamp) => {
    const date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const findCompany = () => {
    axios.post("/api/business/findOrderCompany.do", props.orderList).then((res) => {
        compList.value = res.data;
        console.log(res.data);
    });
    console.log("compList");
    console.log(compList);
};

const orderInsert = () => {
    axios
        .post("/api/business/OrderInsert.do", {
            ...props.orderList,
            company_seq: seq.value
        })
        .then((res) => {
            console.log(res.data);
            if(res.data === 1){
                alert("발주지시서 등록 성공하였습니다.");
                location.reload(true);
            } else {
                alert("발주지시서 등록 실패했습니다.")
            }
        });
};

onMounted(() => {
    console.log(props.orderList);
    console.log(props.orderList.item_code);
    findCompany();
});
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        text-align: center;
        font-size: 16px;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
}

.backdrop {
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrep;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}
.header {
    background-color: #e0e0e0;
    padding: 10px 100% 10px 0px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 16px;
    font-size: 20px;
    margin-right: auto;
}
label {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 600px;
    height: 300px;
    align-content: center;
}

.button-box {
    text-align: center;
    margin-top: 10px;
    float: inline;
}

button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: right;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
        background-color: #45a049;
    }

    &:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}
</style>
