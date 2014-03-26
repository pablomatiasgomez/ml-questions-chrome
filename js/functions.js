var item_id;
var count = 0;
var str;

while (!item_id && count<3) {
    count++;
    switch (count) {
        case 1: // Es buena pero solo sirve si esta la publicación activa, porque ahi tiene el boton de favoritos
            item_id = $("a.favorite:first").attr("data-id");
            break;
        case 2: // Sirve solo con productos MLA, se puede adaptar a otros igual
            str = window.location.href;
            str = str.substr(str.indexOf("MLA") + 4, str.length);
            if (str) item_id = "MLA" + str.substr(0, str.indexOf("-"));
            break;
        case 3: // Sirve pero no se puede saber el pais
            str = $(".denounce-wrap .id-item").html();
            if (str) item_id = "MLA" + str.substr(str.indexOf("#") + 1, str.length).split(" ")[0];
            break;
        default:
            break;
    }
}

if (item_id) {
    var offset = -50;
    var questions = [];
    getQuestions();
}

function getQuestions() {
    offset += 50;
    $.ajax({
        type: 'GET',
        url: "https://api.mercadolibre.com/questions/search?item_id=" + item_id + "&offset=" + offset,
        dataType:"json",
        success: function(data) {
            var total = data.total;
            var limit = data.limit; // 50
            questions = questions.concat(data.questions);

            if (!data.questions.length) {
                if ($(".contactarInferior").length) $(".contactarInferior").after(getQuestionsHTML(questions));
                else $("#tabNavigator").after(getQuestionsHTML(questions));
            }
            else getQuestions(); 
        },
        error: function() {
            console.error("error");
        }
    });
}

function getQuestionsHTML(questions) {
	/*var html = "";
	html += "<div id='questions' class='hidden-questions ch-box-lite new-questions'>";
	html += "    <h5 class='seoH5 typo'>Preguntas al vendedor</h5>";
    if (!questions.length) {
        html += "<div id='divPersonalQuestions' class='wrap-personal-questions'>";
        html += "   <p class='no-questions' style='display: block;'>Nadie hizo preguntas todavía. ¡Sé el primero!</p>";
        html += "   <p id='statusQuestion' class='ch-box-ok' style='display:none;'></p>";
        html += "</div>";
    }
	html += "    <ol id='otherQuestions' class='list-questions'>";
	$.each(questions, function(index){
		html += "    <li id='Quest" + this.id + "'>";
        html += "		<dl class='question' id='" + index + 1 + "'>";
        html += "			<dt class='title'>";
        html += "				<i class='vip-icon ch-icon-comment'></i>";
        html += "				<label class='ch-hide' title='Pregunta'>Pregunta:</label>";
        html += "			</dt>"	
        html += "			<dd class='txt'>";
        html += "				<span>" + this.text + "</span>";
        html += "				<a id='denouncequestion' class='denouncequestion' href='#' aria-label='ch-modal-27' style='visibility: hidden;'>Denunciar</a>";
        html += "			</dd>";
        if (this.answer != null) {
        	html += "		<dt class='answer'>";
        	html += "			<i class='vip-icon ch-icon-comments'></i>";
       		html += "			<label class='ch-hide' title='Respuesta'>Respuesta:</label>";
        	html += "		</dt>";
        	html += "		<dd class='txt answer-txt'>";
        	html += "			<span>" + this.answer.text + "</span>";
        	html += "			<span class='time'> - Hace " + Math.round(Number((new Date() - new Date(this.answer.date_created)) / 3600000 / 24)) + " días. </span>";
        	html += "			<a id='denounceanswer' class='denounceanswer' href='#' aria-label='ch-modal-28' style='visibility: hidden;'>Denunciar</a>";
        	html += "		</dd>";
        }
        html += "		</dl>";
        html += "   </li>";
	});
	html += "	</ol>";
	html += "</div>";
	return html;*/

    var node = $("<div>", { id: "questions", "class": "hidden-questions ch-box-lite new-questions" })
                    .append($("<h5>", { "class": "seoH5 typo", text: "Preguntas al vendedor" }))
                    .append($("<ol>", { id: "otherQuestions", "class": "list-questions" }));

    if (!questions.length) {
        $(node).find("h5")
            .after($("<div>", { id: "divPersonalQuestions", "class": "wrap-personal-questions" })
                .append($("<p>", { "class": "no-questions", style: "display: block;", text: "Nadie hizo preguntas todavía. ¡Sé el primero!" }))
                .append($("<p>", { id: "statusQuestion", "class": "ch-box-ok", style:"display:none;" })));
    }
    
    var quest;
    $.each(questions, function(index){
        quest = $("<li>", { id: "Quest" + this.id  })
                    .append($("<dl>", { "class": "question", id: index + 1 })
                        .append($("<dt>", { "class": "title" })
                            .append($("<i>", { "class": "vip-icon ch-icon-comment" }))
                            .append($("<label>", { "class": "ch-hide", title: "Pregunta", text: "Pregunta:"})))
                        .append($("<dd>", { "class": "txt" })
                            .append($("<span>", { text: this.text }))
                            .append($("<a>", { id: "denouncequestion", "class": "denouncequestion", href: "#", "aria-label": "ch-modal-27", style: "visibility: hidden;", text: "Denunciar" }))));

        if (this.answer != null) {
            $(quest).find(".question")
                        .append($("<dt>", { "class": "answer" })
                            .append($("<i>", { "class": "vip-icon ch-icon-comments" }))
                            .append($("<label>", { "class": "ch-hide", title: "Respuesta", text: "Respuesta:"})))
                        .append($("<dd>", { "class": "txt answer-txt" })
                            .append($("<span>", { text: this.answer.text }))
                            .append($("<span>", { "class": "time", text: " - Hace " + Math.round(Number((new Date() - new Date(this.answer.date_created)) / 3600000 / 24)) + " días. " }))
                            .append($("<a>", { id: "denounceanswer", "class": "denounceanswer", href: "#", "aria-label": "ch-modal-28", style: "visibility: hidden;", text: "Denunciar" })));
        }

        $(node).find("#otherQuestions").append(quest);
    });

    return node;
}