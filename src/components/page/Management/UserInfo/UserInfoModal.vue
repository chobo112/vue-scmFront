<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="header">기업고객/직원정보 관리</div>

                <div class="select-container">
                    <select id="type" v-if="props.userType === 'B' || props.custPerson != null" disabled>
                        <option>기업고객</option>
                    </select>
                    <select id="type" v-else disabled>
                        <option>내부 직원</option>
                    </select>
                </div>

                <table class="row">
                    <colgroup>
                        <col width="120px" />
                        <col />
                        <col width="120px" />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td><input type="text" v-model="userInfoDetail.loginID" /></td>
                            <th>비밀번호</th>
                            <td><input type="password" v-model="userInfoDetail.password" /></td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td><input type="text" id="phone" name="phone" v-model="userInfoDetail.hp" /></td>
                            <th>이메일</th>
                            <td><input type="text" id="email" name="email" v-model="userInfoDetail.email" /></td>
                        </tr>
                        <tr>
                            <th>직원명</th>
                            <td><input type="text" id="clerk" name="clerk" v-model="userInfoDetail.name" /></td>
                            <th>담당업무</th>
                            <td>
                                <select v-model="userInfoDetail.user_type">
                                    <option value="A">임원</option>
                                    <option value="B">고객</option>
                                    <option value="C">SCM 관리자</option>
                                    <option value="D">배송 담당자</option>
                                    <option value="E">구매 담당자</option>
                                    <option value="">기타</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>우편번호</th>
                            <td>
                                <input
                                    type="text"
                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                    id="zipCode"
                                    name="zipCode"
                                    maxlength="5"
                                    v-model="userInfoDetail.zip_code"
                                />
                            </td>
                            <th>주소</th>
                            <td><input type="text" id="address" name="address" v-model="userInfoDetail.addr" /></td>
                        </tr>
                        <tr>
                            <th>상세주소</th>
                            <td colspan="3">
                                <input
                                    type="text"
                                    id="addressDetail"
                                    name="addressDetail"
                                    v-model="userInfoDetail.addr_detail"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-box">
                    <!-- 수정 / 등록 조건에 따라 버튼 텍스트 변경 -->
                    <button
                        @click="props.custName && props.custName.trim() !== '' ? userInfoUpdate() : userInfoInsert()"
                    >
                        {{ props.custName && props.custName.trim() !== "" ? "수정" : "등록" }}
                    </button>

                    <button @click="modalState.setModalState">취소</button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useModalStore } from "@/stores/modalState";
import axios from "axios";

const modalState = useModalStore();
//const props = defineProps(["loginID", "userType"]); //1행 클릭 후 loginID로 불러오기
const emit = defineEmits(["modalClose", "postSuccess"]);
onUnmounted(() => {
    emit("modalClose");
});

const props = defineProps({
    loginID: String,
    userType: String,
    custPerson: String,
    custName: String
});
//const userDetail = ref();
//const userInfoDetail = ref();

const userInfoDetail = ref(
    new Object({
        loginID: "",
        password: "",
        hp: "",
        email: "",
        name: "",
        zip_code: "",
        addr: "",
        job_code: "", //mapper => userType = job_code로 받는중
        addr_detail: ""
    })
);

const searhUserInfoListDetail = async () => {
    //custName비어있을때는 빈객체로 만들어주자
    if (props.custName && props.custName.trim() !== "") {
        let param = { loginID: props.loginID };
        const response = await axios.post("/api/management/userDetailJson", param);
        userInfoDetail.value = response.data.userInfoListDetail[0];
    } else {
        userInfoDetail.value = {
            loginID: "",
            password: "",
            hp: "",
            email: "",
            name: "",
            zip_code: "",
            addr: "",
            user_type: "",
            addr_detail: ""
        };
    }
    emit("postSuccess");
};

onMounted(() => {
    //props.custName ? searhUserInfoListDetail() : null;
    searhUserInfoListDetail();
});

const userInfoUpdate = () => {
    //console.log("userInfoDetail.value  2번 @@@@@@@@@@@@@@@@@@@@");
    /*
    [[Target]]: Object
    addr: "영국"  addr_detail:"zzz"  email:"son@daum.net"  hp:"010-1212-1212"  loginID:"000001"
    name:"손흥민" password:"12345" user_type:"E" zip_code: "12345" job_code: "E"  값 잘 들어가 있음
    */
    //console.log(userInfoDetail.value);

    const textData = {
        loginID: userInfoDetail.value.loginID,
        password: userInfoDetail.value.password,
        hp: userInfoDetail.value.hp,
        email: userInfoDetail.value.email,
        name: userInfoDetail.value.name,
        zip_code: userInfoDetail.value.zip_code,
        addr: userInfoDetail.value.addr,
        job_code: userInfoDetail.value.user_type, //담당업무
        addr_detail: userInfoDetail.value.addr_detail
    };

    console.log(textData);

    axios.post("/api/management/userAjustJson.do", textData).then((res) => {
        console.log(res.data);
        modalState.setModalState();
        emit("postSuccess");
    });
};

const userInfoInsert = () => {
    if (
        !userInfoDetail.value.loginID ||
        !userInfoDetail.value.password ||
        !userInfoDetail.value.hp ||
        !userInfoDetail.value.email ||
        !userInfoDetail.value.name ||
        !userInfoDetail.value.zip_code ||
        !userInfoDetail.value.addr ||
        !userInfoDetail.value.user_type ||
        !userInfoDetail.value.addr_detail
    ) {
        alert("모든 필수 입력 항목을 입력해주세요.");
        return;
    }
    const insertData = {
        loginID: userInfoDetail.value.loginID,
        password: userInfoDetail.value.password,
        hp: userInfoDetail.value.hp,
        email: userInfoDetail.value.email,
        name: userInfoDetail.value.name,
        zip_code: userInfoDetail.value.zip_code,
        addr: userInfoDetail.value.addr,
        job_code: userInfoDetail.value.user_type, //담당업무
        addr_detail: userInfoDetail.value.addr_detail
    };

    // 등록 API 호출
    axios.post("/api/management/userSaveVue.do", insertData).then((res) => {
        modalState.setModalState();
        emit("postSuccess");
    });
};
</script>

<style lang="scss" scoped>
.backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    font-weight: bold;
    animation: fadeIn 0.3s ease;
}

.container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    position: relative;
    width: 600px;
    max-width: 90%;
    overflow-x: auto;
}

.header {
    background: #007bff;
    color: #fff;
    padding: 15px;
    border-radius: 8px 8px 0 0;
    font-size: 18px;
    text-align: center;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.table-container {
    margin: 20px 0;
}

select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    background-color: #fff;
    color: #333;
}

.select-container {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    table-layout: fixed;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
    color: #333;
}

td input,
td select {
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.button-box {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    transition:
        background-color 0.3s,
        box-shadow 0.3s;
    box-shadow: 0 4px #999;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        background-color: #004494;
        box-shadow: 0 2px #666;
        transform: translateY(2px);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
