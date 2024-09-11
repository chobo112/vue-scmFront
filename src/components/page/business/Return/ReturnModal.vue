<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">상세 코드 관리</div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">반품신청 일자</th>
                            <th scope="col">기업명</th>
                            <th scope="col">제품명</th>
                            <th scope="col">반품 수량</th>
                            <th scope="col">배송담당자</th>
                            <th scope="col">창고선택</th>
                            <th scope="col">제품번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- v-bind:key="" 또는 :key=""를 사용하여 속성의 속성값을 바꿀 수 있다. (v-bind:속성="값" 또는 :속성="값") -->
                        <td>{{ props.history.return_order_date }}</td>
                        <td>{{ props.history.cust_name }}</td>
                        <td>{{ props.history.item_name }}</td>
                        <td>{{ props.history.obtain_count }}</td>
                        <td>
                            <select v-model="person_name" onSelected="test">
                                <option v-for="(person, i) in delivery_people" :value="person.name" :key="i">
                                    {{ person.name }}
                                </option>
                            </select>
                        </td>

                        <td>
                            <select v-model="storage_loc">
                                <option v-for="stName in storageName" :value="stName.storage_name">
                                    {{ stName.storage_name }}
                                </option>
                            </select>
                        </td>
                        <td>{{ props.history.item_code }}</td>
                    </tbody>
                </table>
                <div class="button-box">
                    <button @click="info.length > 0 ? reDeliveryInsert() : deliveryInsert()">작성</button>
                    <button @click="modalState.setModalState">닫기</button>
                </div>
                <template v-if="info != undefined">
                    <table v-if="info.length > 0">
                        <thead>
                            <tr>
                                <th scope="col">배송번호</th>
                                <th scope="col">배송일자</th>
                                <th scope="col">출발지</th>
                                <th scope="col">도착지</th>
                                <th scope="col">배송담당자</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- v-bind:key="" 또는 :key=""를 사용하여 속성의 속성값을 바꿀 수 있다. (v-bind:속성="값" 또는 :속성="값") -->
                            <td>{{ info[0].delivery_num }}</td>
                            <td>{{ info[0].delivery_date }}</td>
                            <td>{{ info[0].delivery_end_loc }}</td>
                            <td>{{ storage_loc }}</td>
                            <td>{{ person_name }}</td>
                        </tbody>
                    </table>
                    <table v-else></table>
                </template>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from "@/stores/modalState";
import { useUserInfo } from "@/stores/userInfo";
import axios from "axios";

const modalState = useModalStore();
const props = defineProps(["history"]);
const info = ref();
const delivery_people = ref();
const storageName = ref();
const person_name = ref();
const storage_loc = ref();

const handlerDetail = () => {
    axios.post("/api/business/return_deliverySelect.do", { seq: props.history.seq }).then((res) => {
        info.value = res.data;
        console.log("info.");
        console.log(info.value.length);
        if (info.value.length > 0) {
            person_name.value = info.value[0].delivery_name;
        }
    });
    axios.post("/api/business/deliveryMan.do").then((res) => {
        delivery_people.value = res.data;
        if (info.value == undefined) {
            person_name.value = delivery_people.value[0].name;
        }
    });
    axios.post("/api/business/findStorage.do", { Storage_item_code: props.history.item_code }).then((res) => {
        storageName.value = res.data;
        storage_loc.value = storageName.value[0].storage_name;
    });
};

const deliveryInsert = () => {
    axios.post("/api/business/deliveryInsert.do", {
        delivery_end_loc: props.history.cust_addr,
        obtain_count: props.history.obtain_count,
        delivery_name:person_name.value,
        item_code: props.history.item_code,
        storage_code: props.history.storage_code,
        seq: props.history.seq,
    }).then((res) => {
        modalState.setModalState();
    })
};

const reDeliveryInsert = () => {
    axios
        .post("/api/business/deliveryUpdate.do", {
            delivery_end_loc: info.value[0].delivery_end_loc,
            obtain_count: info.value[0].obtain_count,
            delivery_name: person_name.value,
            delivery_num: info.value[0].delivery_num,
            storage_name: storage_loc.value,
            seq: props.history.seq
        })
        .then((res) => {
            modalState.setModalState();
        });
};

onMounted(() => {
    console.log(props.history);
    handlerDetail();
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

select,
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
    width: 1200px;
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
