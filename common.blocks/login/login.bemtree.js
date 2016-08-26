block("login")(
    content()(function () {
        return [
            {
                block: "popup",
                mods : { theme : 'islands', target : 'anchor', type: 'warning', autoclosable: true },
                directions : ['top-center'],
                content : "Неправильный логин или пароль"
            },
            {
                elem: 'login',
                content: [
                    {
                        block: "input",
                        name: "login",
                        mods: {theme: 'islands', width: 'available', size: 'm'},
                        placeholder: "Логин"
                    },
                    {
                        block : 'popup',
                        mods : { theme : 'islands', target : 'anchor', autoclosable: true },
                        directions : ['right-center'],
                        content : "Заполните это поле"
                    }
                ]
            },
            {
                elem : 'password',
                content: [
                    {
                        block : "input",
                        name : "password",
                        mods : { type : "password", theme: 'islands', width: 'available', size: 'm' },
                        placeholder : "Пароль"
                    },
                    {
                        block : 'popup',
                        mods : { theme : 'islands', target : 'anchor', autoclosable: true },
                        directions : ['right-center'],
                        content : "Заполните это поле"
                    }
                ]
            },
            {
                elem : 'submit',
                content :
                {
                    block : "button",
                    mods : { buttontype : "submit", theme: 'islands', size: 'm' },
                    text : "Войти"
                }
            }
        ];
    })
);