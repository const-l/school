block("login")(
    tag()("form"),
    js()(true),
    attrs()({
        method: "post",
        action: "login"
    })
);