(function() {
    var item_id = null;
    var count = 0;
    var str;
    var access_token;

    var CLIENT_ID = "928604158353929";
    var CLIENT_SECRET = "6exMvwCVkDZ9hDHqikcyZjmkbrSwjeWg";

    var BROWSER = "CHROME";
    var VERSION = "1.5.2";

    if ($(".contactarInferior").length || $("#tabNavigator").length || $("#productDescription").length) {
        while (!validItem(item_id) && count < 3) {
            count++;
            switch (count) {
                case 1: // Sirve con todos los productos de todos los paises
                    str = window.location.pathname.replace("/", "").replace("-", "");
                    str = str.substr(0, str.indexOf("-"));
                    if (str) item_id = str;
                    break;
                case 2:  // Es buena pero solo sirve si esta la publicación activa, porque ahi tiene el boton de favoritos
                    item_id = $(".socialOptions a.favorite:first").attr("data-id");
                    break;
                case 3: // Sirve pero no se puede saber el pais
                    str = $(".denounce-wrap .id-item").html();
                    if (str) item_id = "MLA" + str.substr(str.indexOf("#") + 1, str.length).split(" ")[0];
                    break;
                default:
                    break;
            }
        }
    }

    if (validItem(item_id)) {
        var offset = 0;
        var questions = [];

        //doLogin
        var url = "https://api.mercadolibre.com/oauth/token";
        var queryString = "?grant_type=" + encodeURIComponent("client_credentials") + "&client_id=" + encodeURIComponent(CLIENT_ID) + "&client_secret=" + encodeURIComponent(CLIENT_SECRET);
        url = url + queryString;
        $.ajax({
            type: 'POST',
            url: url,
            dataType:"json",
            success: function(data) {
                access_token = data.access_token;
                getQuestions();
            },
            error: doLogger,
            jsonp: false,
            jsonpCallback: function() { return false; }
        });
    }

    function getQuestions() {
        var url = "https://api.mercadolibre.com/questions/search";
        var queryString = "?item_id=" + encodeURIComponent(item_id) + "&offset=" + encodeURIComponent(offset) + "&access_token=" + encodeURIComponent(access_token);
        url = url + queryString;
        $.ajax({
            type: 'GET',
            url: url,
            dataType:"json",
            success: function(data) {
                var total = data.total;
                var limit = data.limit; // 50
                questions = questions.concat(data.questions);

                offset += !isNaN(limit) ? limit : 50;
                if (offset >= total) {
                    $(function() {
                        if (!$(".new-questions").length) {
                            if ($(".contactarInferior").length) $(".contactarInferior").after(getQuestionsHTML(questions));
                            else if ($("#tabNavigator").length) $("#tabNavigator").after(getQuestionsHTML(questions));
                            else if ($("#productDescription").length) $("#productDescription").append($("<div>", { "class": "vip-bounds" }).append(getQuestionsHTML(questions)));


                            doLogger();
                        }
                    });
                }
                else getQuestions(); 
            },
            error: doLogger,
            jsonp: false,
            jsonpCallback: function() { return false; }
        });
    }

    function getQuestionsHTML(questions) {
        var node = $("<div>", { id: "questions", "class": "hidden-questions ch-box-lite new-questions" })
                        .append($("<form>", { action: "https://www.paypal.com/cgi-bin/webscr", method: "post", target:"_top" })
                                .append($("<input>", { type: "hidden", name: "cmd", value: "_s-xclick" }))
                                .append($("<input>", { type: "hidden", name: "hosted_button_id", value: "7Z8VU5GP8BLY2" }))
                                .append($("<input>", { type: "image", src: "https://www.paypalobjects.com/es_XC/i/btn/btn_donate_SM.gif", border: "0", name: "submit", alt: "PayPal, la forma más segura y rápida de pagar en línea." }))
                                .append($("<img>", { alt: "", border: "0", src: "https://www.paypalobjects.com/en_US/i/scr/pixel.gif", width: "1", height: "1" })))
                        .append($("<h5>", { "class": "seoH5 typo", html: "Preguntas al vendedor" }))
                        .append($("<ol>", { id: "otherQuestions", "class": "list-questions" }));

        if (!questions.length) {
            $(node).find("h5")
                .after($("<div>", { id: "divPersonalQuestions", "class": "wrap-personal-questions" })
                    .append($("<p>", { "class": "no-questions", style: "display: block;", html: "Nadie hizo preguntas todavía. ¡Sé el primero!" }))
                    .append($("<p>", { id: "statusQuestion", "class": "ch-box-ok", style:"display:none;" })));
        }
        
        var quest;
        $.each(questions, function(index){
            quest = $("<li>", { id: "Quest" + this.id  })
                        .append($("<dl>", { "class": "question", id: index + 1 })
                            .append($("<dt>", { "class": "title" })
                                .append($("<i>", { "class": "vip-icon ch-icon-comment" }))
                                .append($("<label>", { "class": "ch-hide", title: "Pregunta", html: "Pregunta:"})))
                            .append($("<dd>", { "class": "txt" })
                                .append($("<span>", { html: this.text }))
                                .append($("<a>", { id: "denouncequestion", "class": "denouncequestion", href: "#", "aria-label": "ch-modal-27", style: "visibility: hidden;", html: "Denunciar" }))));

            if (this.answer != null) {
                $(quest).find(".question")
                            .append($("<dt>", { "class": "answer" })
                                .append($("<i>", { "class": "vip-icon ch-icon-comments" }))
                                .append($("<label>", { "class": "ch-hide", title: "Respuesta", html: "Respuesta:"})))
                            .append($("<dd>", { "class": "txt answer-txt" })
                                .append($("<span>", { html: this.answer.text }))
                                .append($("<span>", { "class": "time", html: " - Hace " + Math.round(Number((new Date() - new Date(this.answer.date_created)) / 3600000 / 24)) + " días. " }))
                                .append($("<a>", { id: "denounceanswer", "class": "denounceanswer", href: "#", "aria-label": "ch-modal-28", style: "visibility: hidden;", html: "Denunciar" })));
            }

            $(node).find("#otherQuestions").append(quest);
        });

        return node;
    }

    function validItem(item_id) {
        if (!item_id) return false;
        if (isNaN(item_id.substr(3))) return false;
        if (item_id.substr(0, 1) != "M") return false;
        return true;
    }

    function doLogger(err) {
        var data = "from=" + encodeURIComponent(BROWSER) + "&url=" + encodeURIComponent(window.location.href) + "&item=" + encodeURIComponent(item_id) + "&version=" + encodeURIComponent(VERSION); 
        if (err) data += "&data=" + encodeURIComponent(JSON.stringify(err));
        $.ajax({
            type: 'POST',
            url: "http://mlquestions.host22.com/add.php",
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            jsonp: false,
            jsonpCallback: function() { return false; }
        });
    }
})();