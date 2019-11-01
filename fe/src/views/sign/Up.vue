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
                        main: '회원가입',
                        mainFont: 'font-size: 2.5rem;',
                        sub: 'Sign-up',
                        subFont: 'font-size: 1rem;',
                        sheet: false
                }"
                style="margin: 100px 0 50px 0;"
            />
            <v-col
                cols=12
                align="center"
            >
            <v-sheet color="white" elevation=1 class="pa-7" max-width="500px">
                <v-form
                    ref="form"
                    v-model="form.valid"
                    :lazy-validation="form.lazy"
                >
                    <v-text-field
                        v-model="form.id"
                        label="아이디"
                        :rules="form.idRules"
                        placeholder="영소문자, 숫자, 6~20자리"
                        required
                    >
                    </v-text-field>
                    <v-text-field
                        v-model="form.name"
                        label="이름"
                        :rules="form.nameRules"
                        placeholder="한글"
                        required
                    >
                    </v-text-field>
                    <v-text-field
                        v-model="form.email"
                        label="이메일"
                        :rules="form.emailRules"
                        placeholder="ex) eee@eee.eee"
                        required
                    >
                    </v-text-field>
                    <v-text-field
                        v-model="form.birthday"
                        label="생년월일"
                        :rules="form.birthdayRules"
                        placeholder="ex) 20190920"
                        required
                    >
                    </v-text-field>
                    <v-text-field
                        v-model="form.password"
                        label="비밀번호"
                        :rules="form.passwordRules"
                        placeholder="8~20자리, 영문, 숫자, 특수문자를 반드시 포함"
                        required
                        type="password"
                    >
                    </v-text-field>
                    <v-text-field
                        v-model="form.passwordC"
                        label="비밀번호 확인"
                        required
                        :error-messages="passwordMatch"
                        type="password"
                        class="mb-10"
                    >
                    </v-text-field>
                    <v-btn
                        :disabled="!form.valid"
                        color="success"
                        class="mr-4"
                        @click="submit"
                    >
                        가입신청
                    </v-btn>
                    <v-btn
                        color="error"
                        class="mr-4"
                        @click="reset"
                    >
                        초기화
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
                v => !!v || '아이디를 입력하세요!',
                v => /^[0-9a-z]{6,20}$/.test(v) || '아이디는 영소문자,숫자 조합 6~20 자리입니다.',
            ],
            name: null,
            nameRules: [
                v => !!v || '이름을 입력하세요!',
                v => /^[가-힣]{2,20}$/.test(v) || '올바른 이름이 아닙니다.'
            ],
            email: null,
            emailRules: [
                v => !!v || '이메일을 입력하세요!',
                v => /.+@.+\..+/.test(v) || '올바른 이메일이 아닙니다.'
            ],
            birthday: null,
            birthdayRules: [
                v => !!v || '생년월일을 입력하세요!',
                v => /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/.test(v) || '올바른 생년월일이 아닙니다.'
            ],
            qualifiedYear: null,
            qYearRules: [
                v => !!v || '등록년도를 입력하세요!',
                v => /^(19|20)\d{2}$/.test(v) || '올바른 등록년도가 아닙니다.'
            ],
            password: null,
            passwordRules: [
                v => !!v || '비밀번호를 입력하세요.',
                v => /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/.test(v) || '비밀번호는 8~20자리, 영문, 숫자, 특수문자를 포함해야 합니다.'
            ]
        },
        snackbar: {
            show: false,
            msg: "",
            timeout: 50000
        }
    }),
    computed: {
        passwordMatch () {
            if( this.form.password != this.form.passwordC ) {
                return '비밀번호가 일치하지 않습니다.';
            } else {
                return '';
            }
        }
    },
    methods: {
        submit () {
            if( this.$refs.form.validate() ) {
                this.$axios.post('sign/up',{
                    id: this.form.id,
                    name: this.form.name,
                    email: this.form.email,
                    birthday: this.form.birthday,
                    password: this.form.password
                }).then((r) => {
                    if(!r.data.success) throw new Error(r.data.msg)
                    this.$router.push('/signin')
                }).catch((e) => {
                    this.pop(e.message)
                })
            }
        },
        reset () {
            if( confirm('정말 초기화 하시겠습니까?') ) {
                this.$refs.form.reset();
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
