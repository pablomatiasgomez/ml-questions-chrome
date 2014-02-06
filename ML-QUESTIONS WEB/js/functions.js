


$(function(){ //ready function 
	MELI.init({client_id: 8140621585014991, client_secret: "UjLEwsOBMlck59ONqgLyf2h3pKoP8AIe"});

	$("#btnURL").click(function(){

		$("#divAjaxLoading").show();

		item_id = "";

		url = $("#txtURL").val();
		i = url.indexOf("MLA");
		url = url.substr(i + 4, url.length);
		//i = url.indexOf("-");
		//url = url.substr(i, url.length);
		i = url.indexOf("-");
		item_id = "MLA" + url.substr(0, i);

		MELI.get("/questions/search?item_id=" + item_id, {}, function(data){ 

			$("#ulQuestions").html('');
			$.each(data[2].questions, function(){
				pregunta = this.text;
				if (this.answer != null)
					respuesta = this.answer.text;
				else
					respuesta = "Sin respuesta";

				$("#divMain").show();
				$("#ulQuestions").append("<li>     <ul> <li class='liQuestion'>" + pregunta + "</li> <li class='liAnswer'>" + respuesta + "</li>   </ul>   </li>")

			});

			$("#divAjaxLoading").hide();
		});

	});
});

