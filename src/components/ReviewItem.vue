<template>
    <div class="review-item">
        <div class="before">
            <div class="user">
                <img :src="avatar" alt="">
                <div class="username">{{data.user.username}}</div>
            </div>
            <div class="review">
                <div class="rate">{{data.rate}} <i class="fas fa-star" style="color:yellow"></i></div>
                <div class="content">{{data.content}}</div>
            </div>
        </div>
        <div class="date">{{data.createdAt}}</div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    computed: {
        avatar() {
            if(this.data.user.avatar != "") {
                return this.data.user.avatar
            } else {
                return "/assets/img/logo.jpg"
            }
        }
    },
    mounted() {
        console.log("hehe",this.data);
    }
}
</script>
<style scoped>
    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .before {
        display: flex;
        align-items: center;
    }
    .review-item{
        display: flex;
        justify-content: space-between;
        width: 80%;
        align-items: center;
            border-bottom: 1px solid;
    padding: 10px 0px;
    }
    .user {
        margin-right: 30px;
    }
    .user, .review, .date {
        display: flex;
        flex-direction: column;
    }
</style>