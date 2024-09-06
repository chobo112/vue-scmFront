<template>
    <div class="backdrop">
        <div class="content">
            <div class="title">
                <strong>회원가입</strong>
            </div>
            <div>
                <table class="table">
                    <tbody>
                        <tr v-if="provider && provider !== undefined">
                            <th>회사명<span class="font_red">*</span></th>
                            <td>
                                <input type="text" v-model="provider.cust_name" readonly class="componyInput">
                            </td>
                        </tr>
                        <tr>
                            <th>아이디<span class="font_red">*</span></th>
                                <td colspan="2">
                                    <input type="text" placeholder="숫자, 영문자 조합으로 6~20자리 " v-model="userInfo.loginID" id="loginIdInput"/>
                                    <span v-if="checkIdResult == 0" style="color: green; font-size: x-small; margin-left: 10px;">사용가능</span>
                                    <span v-if="checkIdResult == 1" style="color: red; font-size: x-small; margin-left: 10px;">사용불가</span>
                                </td>
                            <td>
                                <input type="button" value="중복확인" @click="idCheck"/>
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호<span class="font_red">*</span></th>
                            <td colspan="3">
                                <input type="password" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리" v-model="userInfo.password" id="passwordInput" />
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호 확인<span class="font_red">*</span></th>
                            <td colspan="3">
                                <input type="password" v-model="userInfo.passwordCheck"/>
                            </td>
                        </tr>
                        <tr>
                            <th>이름 <span class="font_red">*</span></th>
                            <td>
                                <input type="text" v-model="userInfo.name" id="nameInput"/>
                            </td>
                            <th>성별</th>
                            <td>
                                <select v-model="userInfo.gender_cd">
                                    <option :value="1==1 ? 'yes' : 'no'" selected="selected">선택</option>
                                    <option value="male">남자</option>
                                    <option value="female">여자</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>생년월일</th>
                            <td colspan="3"><input type="date" v-model="userInfo.birthday"/></td>
                        </tr>
                        <tr>
                            <th>이메일<span class="font_red">*</span></th>
                            <td colspan="3"><input type="text" v-model="userInfo.user_email" id="emailInput"/></td>
                        </tr>
                        <tr>
                            <th>우편번호<span class="font_red">*</span></th>
                            <td colspan="2">
                                <input type="text" id="user_zipcode" v-model="userInfo.user_zipcode" readonly/>
                            </td>
                            <td><input type="button" value="우편번호 찾기" @click="post"/></td>
                        </tr>
                        <tr>
                            <th>주소<span class="font_red">*</span></th>
                            <td colspan="3">
                                <input type="text" id="address" v-model="userInfo.user_address" readonly/>
                            </td>
                        </tr>
                        <tr>
                            <th>상세주소</th>
                            <td colspan="3">
                                <input type="text" v-model="userInfo.user_dt_address"/>
                            </td>
                        </tr>
                        <tr>
                            <th>전화번호<span class="font_red">*</span></th>
                            <td colspan="3" class="numberInputTd">
                                <div class="phone-number">
                                    <input v-model="userInfo.user_tel1" id="tel1Input1" class="numberInput"> -
                                    <input v-model="userInfo.user_tel2" id="tel1Input2" class="numberInput"> - 
                                    <input v-model="userInfo.user_tel3" id="tel1Input3" class="numberInput">
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!provider && provider == undefined">
                            <th>회원 유형<span class="font_red">*</span></th>
                            <td colspan="3" >
                                <select  v-model="userInfo.user_type">
                                    <option value="A" selected>임직원</option>
                                    <option value="C">관리 사원</option>
                                    <option value="E">구매 담당</option>
                                    <option value="D">배송 담당</option>
                                    <option value="B">고객</option>
                                </select>
                            </td>
                        </tr>
                        <tr v-else>
                            <input v-model="userInfo.user_type" type="hidden" value="B">
                        </tr>
                    </tbody>
                </table>
                <div class="buttons">
                    <button @click="join">회원가입완료</button>
                    <button @click="modalState.setModalState">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModalStore } from '@/stores/modalState';
import axios from 'axios';

const modalState = useModalStore();
 const userInfo = ref({
    user_type: 'A'
    });
const checkIdResult = ref();
const provider = inject("providedValue");

const idCheck = () => {
    const idRules = /^[a-z0-9]{6,20}$/g;
    if (!idRules.test(userInfo.value.loginID)) {
        alert("아이디는 숫자,영문자 조합으로 6~20자리를 사용해야 합니다.");
        return;
    }
    if (userInfo.value.loginID == null) {
        alert("아이디를 입력해주세요.");
        return;
    }
    axios
        .post(`/api/check_loginIDJson.do`, { loginID: userInfo.value.loginID })
        .then((res) => {
            checkIdResult.value = res.data;
        });
}

onMounted(()=>{
    console.log(provider.value)
   
    if(provider && provider.value !== undefined){
        userInfo.value.user_type = 'B'
    }
})
const join = () => {
    if (checkIdResult.value !== 0) {
        document.getElementById("loginIdInput").focus();
        alert("아이디를 확인하세요");
        return;
    }

    const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    if (userInfo.value.password !== userInfo.value.passwordCheck || userInfo.value.password == null || userInfo.value.passwordCheck == null) {
        document.getElementById("passwordInput").focus();
        alert("비밀번호를 확인하세요");
        return;
    }
    if (!passwordRules.test(userInfo.value.password)) {
        document.getElementById("passwordInput").focus();
        alert('비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.');
        return;
    }
    
    if (userInfo.value.name == '' || userInfo.value.name == null) {
        document.getElementById("nameInput").focus();
        alert("이름을 확인하세요");
        return;
    }

    const emailRules = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if (userInfo.value.user_email == '' || userInfo.value.user_email == null) {
        document.getElementById("emailInput").focus();
        alert("메일을 확인하세요");
        return;
    }

    if (!emailRules.test(userInfo.value.user_email)) {
        document.getElementById("emailInput").focus();
        alert("이메일 형식을 확인해주세요.");
        return;
    }
    
    if (userInfo.value.user_zipcode == null || userInfo.value.user_zipcode == '' || userInfo.value.user_address == '' || userInfo.value.user_address == null) {
        alert("주소를 확인하세요");
        return;
    }

    const tel1Rules = /^\d{2,3}$/;
    const tel2Rules = /^\d{3,4}$/;
    const tel3Rules = /^\d{4}$/;

    if (!tel1Rules.test(userInfo.value.user_tel1)) {
        document.getElementById("tel1Input1").focus();
        alert("전화번호 형식을 확인해주세요.");
        return;
    }
    if (!tel2Rules.test(userInfo.value.user_tel2)) {
        document.getElementById("tel1Input2").focus();
        alert("전화번호 형식을 확인해주세요.");
        return;
    }
    if (!tel3Rules.test(userInfo.value.user_tel3)) {
        document.getElementById("tel1Input3").focus();
        alert("전화번호 형식을 확인해주세요.");
        return;
    }
    
    if (userInfo.value.user_tel1 == null || userInfo.value.user_tel1 == '') {
        document.getElementById("tel1Input1").focus();
        alert("전화번호를 확인하세요");
        return;
    }
    if (userInfo.value.user_tel2 == null || userInfo.value.user_tel2 == '') {
        document.getElementById("tel1Input2").focus();
        alert("전화번호를 확인하세요");
        return;
    }
    
    if (userInfo.value.user_tel3 == null || userInfo.value.user_tel3 == '') {
        document.getElementById("tel1Input3").focus();
        alert("전화번호를 확인하세요");
        return;
    }
    if (userInfo.value.user_type == null || userInfo.value.user_type == '') {
        alert('회원유형을 확인하세요');
        return;
    }
    
    axios
        .post(`/api/registerJson.do`, {
            ...userInfo.value
            ,hidden_cust_id: provider.value?.cust_id
        })
        .then((res) => {
            if (res.data.result === "SUCCESS") {
                alert('회원가입 완료');
                modalState.setModalState()
            }
        })
        .catch((err) => {
            alert('회원가입 실패');
            console.error(err);
        });
}

const post = () => {
    new daum.Postcode({
        oncomplete: function (data) {
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== '' && data.apartment === 'Y') {
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraRoadAddr !== '') {
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('user_zipcode').value = data.zonecode;
            document.getElementById('address').value = roadAddr;
            
            userInfo.value.user_zipcode = data.zonecode;
            userInfo.value.user_address = roadAddr;
        }
    }).open();
}
</script>

<style scoped>
.backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    font-weight: bold;
}

.content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
}

.title {
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.5em;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 10px;
    text-align: left;
    vertical-align: middle;
}

.table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.table td {
    border-bottom: 1px solid #ddd;
}

.table input[type="text"],
.table input[type="password"],
.table input[type="date"],
.table select {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.table input[type="button"],
.table button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 4px;
    margin-right: 10px;
}

.table input[type="button"]:hover,
.table button:hover {
    background-color: #0056b3;
}

.font_red {
    color: red;
}

.phone-number input {
    width: calc(33% - 8px);
    display: inline-block;
    margin-right: 5px;
    box-sizing: border-box;
}

.buttons {
    margin-top: 20px;
    text-align: center;
}

.buttons button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 5px;
}

.buttons button:hover {
    background-color: #218838;
}

.buttons button:last-child {
    background-color: #dc3545;
}

.buttons button:last-child:hover {
    background-color: #c82333;
}
input.numberInput{
    width: 65px;
}
.componyInput{
    background-color: #e9ecef;
}

</style>