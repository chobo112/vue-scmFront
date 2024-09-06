<template>
    <div class="backdrop">
        <div class="content">
            <div>
                <div>신규 기업</div>
            </div>
            <div>
                <span>기업명<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.cust_name">
            </div>
            <div>
                <span>사업자번호<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.biz_num"/>
            </div>
            <div>
                <span>회사연락처<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.cust_ph">
            </div>
            <div>
                <span>fax 번호<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.cust_fax">
            </div>
            <div>
                <span>산업군 입력<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.industry_cod">
            </div>
            <div class="zipDiv">
                <div class="zipInputContainer">
                    <span>우편번호<span class="font_red">*</span></span>
                    <input type="text" v-model="custInfo.cust_zip" id="user_zipcode" class="zipInput">
                </div>
                <div class="zipButtonContainer">
                    <button @click="post">우편번호찾기</button>
                </div>
            </div>
            <div>
                <span>주소<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.cust_addr" id="address">
            </div>
            <div>
                <span>상세주소</span>
                <input type="text" v-model="custInfo.cust_detail_addr">
            </div>
            <div>
                <span>담당자명</span>
                <input type="text" v-model="custInfo.cust_person">
            </div>
            <div>
                <span class="telSpan">담당자 전화번호<span class="font_red">*</span></span>
                <input type="text" v-model="custInfo.user_tel1" class="telInput">-
                <input type="text" v-model="custInfo.user_tel2" class="telInput">-
                <input type="text" v-model="custInfo.user_tel3" class="telInput">
            </div>
            <div>
                <button @click="saveCust">회원가입완료</button>
                <button @click="modalState3.setModalState3">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModalStore3 } from '@/stores/modalState';
import axios from 'axios';

const modalState3 = useModalStore3();
const custInfo = ref({});

const saveCust = () => {
    axios
        .post(`/api/cust/CustSaveJson.do`, {...custInfo.value})
        .then((res) => {
            console.log(res);
        });
};

const post = () => {
    new daum.Postcode({
        oncomplete: function (data) {
            var roadAddr = data.roadAddress; // 도로명 주소 변수

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('user_zipcode').value = data.zonecode;
            document.getElementById('address').value = roadAddr;
            
            custInfo.value.cust_zip = data.zonecode;
            custInfo.value.cust_addr = roadAddr;
        }
    }).open();
};
</script>

<style scoped>
/* 전체 배경을 어둡게 하고, 모달을 중앙에 위치시킵니다. */
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6); /* 어두운 배경 */
    z-index: 1000;
    overflow: hidden; /* 배경에서 넘치는 콘텐츠 숨기기 */
}

/* 모달의 스타일을 설정합니다. */
.content {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 500px; /* 모달의 최대 너비 */
    width: 90%;
    max-height: 80vh; /* 모달의 최대 높이 */
    overflow-y: auto; /* 콘텐츠가 넘칠 때 스크롤 가능 */
    box-sizing: border-box; /* 패딩을 너비에 포함 */
}

/* 각 입력 필드와 레이블을 정렬합니다. */
.content > div {
    margin-bottom: 5px;
}

.content span {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 4px;
}

.font_red {
    color: red;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

input[type="text"]:focus {
    border-color: #007bff;
    outline: none;
}

button {
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    width: 150px;
}

button:hover {
    background-color: #0056b3;
}

button:active {
    transform: scale(0.98);
}

button + button {
    margin-left: 10px;
}

/* 우편번호 입력과 버튼을 같은 행에 배치 */
.zipDiv {
    display: flex;
    align-items: center;
    gap: 10px;
}

.zipInputContainer {
    flex: 1;
}

.zipInput {
    width: 100%; /* 입력 필드가 공간을 가득 차도록 설정 */
}

.zipButtonContainer {
    flex: 0;
    height: 18px;
}

/* 반응형 디자인을 위한 미디어 쿼리 */
@media (max-width: 600px) {
    .content {
        max-width: 100%;
        padding: 15px;
    }

    input[type="text"] {
        padding: 8px;
    }

    button {
        font-size: 13px;
        padding: 8px 12px;
    }
}

.telInput {
    width: 144px !important;
}

.telSpan {
    display: block;
}
</style>
