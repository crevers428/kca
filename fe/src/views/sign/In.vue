<template>
    <v-container>
        <v-row
            justify="center"
        >
            <hy-title
                v-bind="{
                        font: `font-family:'Sunflower'; font-weight:500;`,
                        position: 'relative',
                        positionOptions: ``,
                        borderLeft: 10,
                        borderColor: '#0288D1',
                        main: '로그인',
                        mainFont: 'font-size: 2.5rem;',
                        sub: 'Sign-in',
                        subFont: 'font-size: 1rem;',
                        sheet: false
                }"
                style="margin: 100px 0 50px 0;"
            />
            <v-col
                cols=12
                align="center"
            >
            <v-sheet color="white" elevation=1 class="pa-5" max-width="500px">
                <v-form
                    ref="form"
                    v-model="form.valid"
                    :lazy-validation="form.lazy"
                >
                    <v-text-field
                        v-model="form.id"
                        label="아이디"
                        :rules="form.idRules"
                        required
                    >
                    </v-text-field>
                    <v-text-field
                        v-model="form.password"
                        label="비밀번호"
                        :rules="form.passwordRules"
                        required
                        type="password"
                        class="mb-10"
                    >
                    </v-text-field>
                    <v-checkbox
                        v-model="form.remember"
                        label="로그인 유지 (최대 7일)"
                    ></v-checkbox>
                    <v-btn
                        :disabled="!form.valid"
                        color="success"
                        class="mr-4"
                        @click="signin"
                    >
                        Sign-in
                    </v-btn>
                    <v-btn
                        color="primary"
                        class="mr-4"
                        to="/signup"
                    >
                        Sign-up
                    </v-btn>
                </v-form>
            </v-sheet>
            </v-col>
        </v-row>
        <v-snackbar
            color=""
            v-model="snackbar.show"
            :timeout="snackbar.timeout"
        >
            {{snackbar.msg}}
            <v-btn color="red" text @click="snackbar.show = false">닫기</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script>
import hyTitle from '../../components/hy/Title.vue'
export default {
    data: () => ({
        form: {
            valid: true,
            lazy: false,
            id: null,
            idRules: [
                v => !!v || '아이디를 입력하세요!'
            ],
            password: null,
            passwordRules: [
                v => !!v || '비밀번호를 입력하세요!'
            ],
            remember: false
        },
        snackbar: {
            show: false,
            msg: "",
            timeout: 2000
        }
    }),
    methods: {
        signin () {
            if(this.$refs.form.validate()) {
                this.$axios.post('sign/in',
                { id: this.form.id, password: this.form.password, remember: this.form.remember })
                    .then((r) => {
                        if(!r.data.success) throw new Error(r.data.msg)
                        localStorage.setItem('token', r.data.token)
                        this.$store.commit('getToken')
                        this.$router.push('/user')
                    })
                    .catch((e) => {
                        this.pop(e.message)
                    })
            }
        },
        pop (msg) {
            this.snackbar.show = true
            this.snackbar.msg = msg
        }
    },
    components: {
        hyTitle: hyTitle
    },
    mounted () {
    }
}
</script>
