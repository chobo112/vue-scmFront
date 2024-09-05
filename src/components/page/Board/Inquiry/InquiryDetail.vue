<template>
    <div>
        <ContextBox>1:1문의하기</ContextBox>
        <table>
            <thead></thead>
            <tbody>
                <tr>
                    <th>작성자</th>
                    <td>
                        <template v-if="inquiryDetail">
                            <input type="text" v-model="inquiryDetail.loginID" disabled>
                            <select 
                                v-if="categoryList" 
                                v-model="inquiryDetail.category_code" 
                                :disabled="inquiryDetail.loginID !== userInfo.user.loginId || answerView">
                                <option value="" disabled>질문 카테고리</option>
                                <option 
                                    v-for="category in categoryList.categoryList" 
                                    :value=category.category_code 
                                    :key="category.category_code"
                                    >{{ category.category_name }}</option>
                            </select>
                        </template>
                    </td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td>
                        <input 
                            type="text"
                            class="title"
                            v-model="inquiryDetail.post_title"
                            :disabled="inquiryDetail.loginID !== userInfo.user.loginId || answerView">
                        </td>
                </tr>
                <tr>
                    <th>내용</th>
                    <td>
                        <textarea 
                            class="content" 
                            v-model="inquiryDetail.post_text" 
                            :disabled="inquiryDetail.loginID !== userInfo.user.loginId || answerView">
                        </textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="button-box">
            <button v-if="!answerView && props.inquirySeq !== 0" @click="answerView = true">답변달기</button>
            <button v-if="answerView && !answerDisabled" @click="answerInsert">답변등록</button>
            <button v-if="!answerView && inquiryDetail.loginID === userInfo.user.loginId" @click="props.inquirySeq > 0 ? inquiryUpdate() : inquirySave()">
                {{ props.inquirySeq > 0 ? "수정" : "저장" }}
            </button>
            <button v-if="!answerView && props.inquirySeq > 0 && inquiryDetail.loginID === userInfo.user.loginId" @click="inquiryDelete">삭제</button>
            <button @click="handlerClose">취소</button>
        </div>
        <div v-if="answerView">
            <table>
                <thead></thead>
                <tbody>
                    <tr>
                        <th>답변 제목</th>
                        <td><input type="text" class="title" v-model="answerDetail.answer_title" :disabled="answerDisabled"></td>
                    </tr>
                    <tr>
                        <th>답변 내용</th>
                        <td><textarea class="content" v-model="answerDetail.answer_text" :disabled="answerDisabled"></textarea></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import ContextBox from '@/components/common/ContextBox.vue';
import { useUserInfo } from '@/stores/userInfo';
import axios from 'axios';
import { onMounted } from 'vue';

const userInfo = useUserInfo();
const categoryList = ref();
const props = defineProps(["inquirySeq", "detailView"]);
const emit = defineEmits(["detailView",  "postSuccess"]);
const valid = ref(true);
const inquiryDetail = ref(new Object({
    category_code: "",
    loginID: userInfo.user.loginId,
    post_title: "",
    post_text: ""
}));
const answerDetail = ref(new Object({
    anwer_title: "",
    answer_text: ""
}))
const answerView = ref(false);
const answerDisabled = ref(false);

const inquiryCategoryList = () => {
    axios.post('/api/board/inquiryCategoryJson.do', {}).then(
        (res) => {
            categoryList.value = res.data;
        }
    )
}

watch(() => props.inquirySeq, () => {
    cleanUp();
    answerView.value = false;
    if(props.inquirySeq !== 0){
        searchDetail();
    }
})

onMounted(() => {
    inquiryCategoryList();
})

const searchDetail = () => {
    axios.post('/api/board/inquiryDetailJson.do', {seq:props.inquirySeq}).then((res) => {
        if(res.data.inquiryDetail !== null){
            inquiryDetail.value = res.data.inquiryDetail;
        }
        if(res.data.answerDetail !== null){
            answerDetail.value = res.data.answerDetail;
            answerView.value = true;
            answerDisabled.value = true;
        } else {
            answerDetail.value.answer_title = "";
            answerDetail.value.answer_text = "";
            answerDisabled.value = false;
        }
    })
}

const cleanUp = () => {
    inquiryDetail.value.loginID = userInfo.user.loginId;
    inquiryDetail.value.category_code = "";
    inquiryDetail.value.post_title = "";
    inquiryDetail.value.post_text = "";
}


const validChk = () => {
    if(inquiryDetail.value.category_code === ''){
        alert('질문 카테고리를 선택해주세요.');
        return !valid;
    }
    if(inquiryDetail.value.post_title.trim() === ''){
        alert('제목을 입력하세요.');
        return !valid;
    }
    if(inquiryDetail.value.post_text.trim() === ''){
        alert('내용을 입력하세요.');
        return !valid;
    }
    return valid;
}

const inquirySave = () => {
    if(validChk()){
        if(window.confirm('1:1문의를 등록하시겠습니까?')){
           axios.post('/api/board/inquiryInsertJson.do', {
            title: inquiryDetail.value.post_title,
            content: inquiryDetail.value.post_text,
            category_code: inquiryDetail.value.category_code
           }).then((res) => {
            if(res.data.result === 'success'){
                alert('1:1문의가 등록되었습니다.');
                window.location.reload();
            } else {
                alert('등록 중 오류가 발생하였습니다.');
            }
           })
    
        } else {
            alert('등록을 취소하였습니다.');
        }
    }
}

const inquiryUpdate = () => {
    if(validChk()){
        if(window.confirm('1:1문의를 수정하시겠습니까?')){
            axios.post('/api/board/inquiryUpdateJson.do', {
                title: inquiryDetail.value.post_title,
                content: inquiryDetail.value.post_text,
                category_code: inquiryDetail.value.category_code,
                seq: props.inquirySeq
            }).then((res) => {
                if(res.data.result === 'success'){
                    alert('1:1문의가 수정되었습니다.');
                    window.location.reload();
                } else {
                    alert('수정 중 오류가 발생하였습니다.');
                }
            })
        }
    } else {
        alert('수정을 취소하였습니다.');
    }
}

const inquiryDelete = () => {
    if(window.confirm('해당 문의를 삭제하시겠습니까?')){
        axios.post('/api/board/inquiryDeleteJson.do', {seq: props.inquirySeq}).then((res) => {
            if(res.data.result === 'success'){
                alert('1:1문의가 삭제되었습니다.');
                window.location.reload();
            } else {
                alert('삭제 중 오류가 발생하였습니다.');
            }
        })
    } else {
        alert('삭제를 취소하였습니다.');
    }
}

const answerInsert = () => {
    if(answerDetail.value.answer_title.trim() === ''){
        alert('답변 제목을 입력하세요.');
        return;
    }
    if(answerDetail.value.answer_text.trim() === ''){
        alert('답변 내용을 입력하세요.');
        return;
    }
    if(window.confirm('답변 등록 후 수정 및 삭제가 불가합니다. 등록하시겠습니까?')){
        axios.post('/api/board/answerInsertJson.do', {
            seq: props.inquirySeq,
            answer_title: answerDetail.value.answer_title,
            answer_content: answerDetail.value.answer_text
        }).then((res) => {
            if(res.data.result === 'success'){
                alert('답변이 등록되었습니다.');
                window.location.reload();
            } else {
                alert('답변 등록 중 오류가 발생하였습니다.');
            }
        })
    } else {
        alert('답변 등록을 취소하였습니다.');
    }
}

const handlerClose = () => {
    emit("detailView");
};

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
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #2676bf;
        color: #ddd;
    }

    td {
        text-align:left;
    }

    .title {
        width:99%;
    }

    .content {
        width:100%;
        height:100px;
        resize:none;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    select,
    input {
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-right: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
}

button {
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border: none;
    color: white;
    width: 70px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px #999;
    background-color: #3bb2ea;

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
