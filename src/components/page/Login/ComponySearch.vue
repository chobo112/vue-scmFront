<template>
    <div class="backdrop">
        <div class="content">
            <div>
                <div>기업검색</div>
                <div @click="closeModal">X</div>
            </div>
            <div>
                <span>기업을 선택해 주세요</span>
                <select v-model="selectedCust">
                    <option disabled selected value="">기업을 선택하세요</option>
                    <option v-for="cust in custList" :key="cust.cust_id" :value="cust" >
                        {{ cust.cust_name }}
                    </option>
                </select>
            </div>
            <div class="buttonDiv">
                <button @click="componySelect" v-if="selectedCust" class="cho">선택</button>
                <button @click="newCompony">신규 기업 등록</button>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { useModalStore, useModalStore2, useModalStore3 } from '@/stores/modalState';
import axios from 'axios';



    const custList = ref({});
    const modalState = useModalStore()
    const modalState2 = useModalStore2();
    const modalState3 = useModalStore3();
    const selectedCust = ref('');
    const emit = defineEmits(["componySelect"]);
    const provider = inject("providedValue");
   

    const fetchCustList = ()=>{
        axios
            .post(`/api/cust/custListJson.do`)
            .then((res)=>{
                custList.value = res.data
            })
    }

    const closeModal = ()=>{
        modalState2.setModalState2()
    }

    onMounted(()=>{
        fetchCustList();
    })

    const componySelect = ()=>{
        modalState2.setModalState2();
        modalState.setModalState();
        provider.value = selectedCust.value;
    }
    
    onUnmounted(() => {
        emit("componySelect");
    });

    const newCompony = ()=>{
        modalState2.setModalState2();
        modalState3.setModalState3();
    }

</script>

<style scoped>
/* 전체 배경 */
.backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000; /* z-index를 높여 다른 요소들 위에 표시되도록 함 */
    font-family: Arial, sans-serif; /* 기본 폰트 설정 */
}

/* 모달 내용 */
.content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 헤더 부분 */
.content > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    font-size: 18px;
}

.content > div:first-child > div:first-child {
    font-weight: bold;
}

.content > div:first-child > div:last-child {
    cursor: pointer;
    font-size: 20px;
    color: #888;
}

/* 선택박스 및 버튼 */
.content > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.content select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.content button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    color: white;
    background-color: #007bff; /* 버튼 배경색 */
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.content button:hover {
    background-color: #0056b3; /* 버튼 호버 색상 */
}

/* 신규 기업 등록 버튼에 약간의 스타일링 추가 */
.content button:last-of-type {
    background-color: #28a745; /* 다른 버튼 배경색 */
}

.content button:last-of-type:hover {
    background-color: #218838; /* 다른 버튼 호버 색상 */
}
.buttonDiv{
    margin: 0 auto;
}
.cho{
    margin: 4px;
}

</style>