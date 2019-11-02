# kca
한국큐브협회 사이트 리뉴얼

## config 파일 셋팅
${} 를 수정하세요.

**config/index.js**  
    ```

    module.exports = {  

        dbUrl: 'mongodb:your.db.url/db',  

        jwtKey: 'your key',

        admin: {

            id: ${your root id},

            name: ${your name},

            email: ${your email},

            birthday: ${your birthday},

            password: ${your password} //please change after create,

            lv: 0

        },

        jwt: {

            secretKey: ${secret key},

            issuer: ${issuer},

            algorithm: 'HS256', // default

            expiresIn: 60 * 3, // expires time 3 minutes

            expiresInRemember: 60 * 60 * 24 * 7, // if remember, expires time 7 days

            expiresInDiv: 3, // to calculate expired time

        },

        domain: 'domain.d'

    }

    ```
