var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var tabela_civilisti = new Array();
/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}
/*global location*/
    // preusmeri vhod za civilista
function pojdi_v_civilista(){
    location.href='civilist.html';
}
    // preusmeri vhod za zdravnika
function pojdi_v_zdravnika(){
    location.href='zdravnik.html';
}

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
 var stevec = 1;
function generiraj(){
	if(stevec > 3) stevec = 1;
	generirajPodatke(stevec);
	stevec++;
}
 
function generirajPodatke(stPacienta) {
	jQuery.get('./pacienti/'+stPacienta+'.txt', function(txt){
		$('#branje').text(txt);
		var tekt = $('#branje').val();
		tekt = tekt.split("/");
		/*
		var bolnik = {
			name: tekt[0],
			surname: tekt[1],
			dateB: tekt[2],
			dateCreated: tekt[3],
			tel: tekt[10],
			bodyWeight: tekt[5],
			bodyHeight: tekt[4],
			SKrvni: tekt[6],
			DKrvni: tekt[7],
			NKrvi: tekt[8],
			bodyTemp: tekt[11],
			simptoms: "N/A",
			urgent: "false",
			sugar: "false",
			sestra: tekt[9],
			ehr: tekt[12]
		};*/
		vstavi(tekt);
		//alert(tekt.length);
	//	alert(tekt[12]);
		//var select = document.getElementById("preberiObstojeciVitalniZnak");
	//	select.innerHTML += "<option value="+bolnik.ehr+"|"+bolnik.dateCreated+"|"+bolnik.bodyHeight+"|"+bolnik.bodyWeight+"|"+bolnik.bodyTemp+"|"+bolnik.SKrvni+"|"+bolnik.DKrvni+"|"+bolnik.NKrvi+"|"+bolnik.sestra+">"+bolnik.name+" "+bolnik.surname+"</option>";
	//	select.innerHTML += "<option value="+tekt[12]+"|"+tekt[3]+"|"+tekt[4]+"|"+tekt[5]+"|"+tekt[11]+"|"+tekt[6]+"|"+tekt[7]+"|"+tekt[8]+"|"+tekt[9]+">"+tekt[0]+" "+tekt[1]+"</option>";
	});
}

function vstavi(tekt){
	var select = document.getElementById("preberiObstojeciVitalniZnak");
	select.innerHTML += "<option value="+tekt[12]+"|"+tekt[3]+"|"+tekt[4]+"|"+tekt[5]+"|"+tekt[11]+"|"+tekt[6]+"|"+tekt[7]+"|"+tekt[8]+"|"+tekt[9]+">"+tekt[0]+" "+tekt[1]+"</option>";
}

/* ============== CIVILIST.HTML ==================== */
var bolnik = {};



function kreirajDatZaZdravnika(){
	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var datumRojstva = $("#kreirajDatumRojstva").val();
	var teza = $("#dodajTezo").val();
	var temp = $("#dodajTelesnoTemp").val();
	var simptomi = $("#VnosSimptomov").val();
	var telefon = $("#dodajTelefonsko").val();
	var urgenten = false;
	var sladkor = false;
	var visina = $("#dodajTelesnoVisino").val();
	
	if(document.getElementById("izberiUrgenten").checked)
	{
    	urgenten = true;
	}
	if(document.getElementById("izberiSladkor").checked)
	{
    	sladkor = true;
	}
	if (!ime || !priimek || !datumRojstva || !teza || !temp || !simptomi || !telefon || !visina  || ime.trim().length == 0 || priimek.trim().length == 0 || datumRojstva.trim().length == 0 || teza.trim().length == 0 || temp.trim().length == 0 || simptomi.trim().length == 0|| telefon.trim().length == 0|| visina.trim().length == 0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " + "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} 
	else{
		var bolnik = {
			"name": ime,
			"surname": priimek,
			"dateB": datumRojstva,
			"dateCreated": "2016-06-02T14:50Z",
			"tel": telefon,
			"bodyWeight": teza,
			"bodyHeight": visina,
			"bodyTemp": temp,
			"simptoms": simptomi,
			"urgent": urgenten,
			"sugar": sladkor,
			"sestra": "N/A",
			"ehr": 5
		};
		ustvariEHRzaGeneriran(ime, priimek, datumRojstva, bolnik, "pacient");
	}
	
}

function izracunajBMI(){
	var teza = $("#dodajTezo").val();
	var visina = $("#dodajTelesnoVisino").val();
	if (teza  && visina   && teza.trim().length != 0 && visina.trim().length != 0) {
		visina = visina / 100;
		var bmi = (teza/(visina*visina));
		if(!bmi.isNaN ){
			var image = document.getElementById('razocaranZdravnik');
			if(bmi > 35 || bmi < 20){
				var image = document.getElementById('razocaranZdravnik');
				image.src = "./knjiznice/img/Unhappy-doctor.jpg";
				image.style.visibility = 'visible';
			}
			else{
				image.style.visibility = 'hidden';
			}
		}
	} 
}
function ustvariEHRzaGeneriran(ime, priimek, datumRojstva, bolnik, nacin){
	sessionId = getSessionId();

	$.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        var partyData = {
	            firstNames: ime,
	            lastNames: priimek,
	            dateOfBirth: datumRojstva,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                    $("#kreirajSporocilo").html("<span class='obvestilo " + "label label-success fade-in'>Uspešno kreiran EHR '" + ehrId + "'.</span>");
	                    $("#preberiEHRid").val(ehrId);
	                    bolnik.ehr = ehrId;
	                    
	                   // $("#preberiObstojeciVitalniZnak").append("<option value="+bolnik.ehr+"|"+bolnik.dateCreated+"|"+bolnik.bodyHeight+"|"+bolnik.bodyWeight+"|"+bolnik.bodyTemp+"|"+"118|92|98|N/A"+">"+bolnik.name+" "+bolnik.surname+"</option>");
	                   // tabela_civilisti.push(bolnik);
	                    	// kar dodaj ga ze na un sraje
	                    /*
	                    var novo = document.createElement("option");
	                    novo.value = bolnik.ehr+"|"+bolnik.dateCreated+"|"+bolnik.bodyHeight+"|"+bolnik.bodyWeight+"|"+bolnik.bodyTemp+"|"+"118|92|98|N/A";
	                    novo.innerHTML = bolnik.name+" "+bolnik.surname;
	                    select.add(novo);*/
	                //    alert("SITUKAJ");
	            	//	vstaviPacientaPrekoPrijave(bolnik);
	                //	document.getElementById("branje").text("<option value="+bolnik.ehr+"|"+bolnik.dateCreated+"|"+bolnik.bodyHeight+"|"+bolnik.bodyWeight+"|"+bolnik.bodyTemp+"|"+"118|92|98|N/A"+">"+bolnik.name+" "+bolnik.surname+"</option>");
	                //	document.getElementById("branje").text("</option>");
	                //	$('#branje').text("</option>");
	                	if(nacin == "pacient")	
	                	{
	                		window.name = "<option value="+bolnik.ehr+"|"+bolnik.dateCreated+"|"+bolnik.bodyHeight+"|"+bolnik.bodyWeight+"|"+bolnik.bodyTemp+"|"+"118|92|98|N/A"+">"+bolnik.name+" "+bolnik.surname+"</option>";
	                	}
	                	
	                }
	            },
	            error: function(err) {
	            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                "label-danger fade-in'>Napaka '" +
                JSON.parse(err.responseText).userMessage + "'!");
	            }
	        });
	    }
	});
}

/* ============== ZDRAVNIK.HTML ==================== */

function vstaviPaciente(){
	if(window.name != "")
	{
		var select = document.getElementById("preberiObstojeciVitalniZnak");
		select.innerHTML += window.name;
	}
}

/**
 * Kreiraj nov EHR zapis za pacienta in dodaj osnovne demografske podatke.
 * V primeru uspešne akcije izpiši sporočilo s pridobljenim EHR ID, sicer
 * izpiši napako.
 */
function kreirajEHRzaBolnika() {
	sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var datumRojstva = $("#kreirajDatumRojstva").val();

	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreirajSporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
}


/**
 * Za podan EHR ID preberi demografske podrobnosti pacienta in izpiši sporočilo
 * s pridobljenimi podatki (ime, priimek in datum rojstva).
 */
function preberiEHRodBolnika() {
	sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-success fade-in'>Bolnik '" + party.firstNames + " " +
          party.lastNames + "', ki se je rodil '" + party.dateOfBirth +
          "'.</span>");
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
			}
		});
	}
}


/**
 * Za dodajanje vitalnih znakov pacienta je pripravljena kompozicija, ki
 * vključuje množico meritev vitalnih znakov (EHR ID, datum in ura,
 * telesna višina, telesna teža, sistolični in diastolični krvni tlak,
 * nasičenost krvi s kisikom in merilec).
 */
function dodajMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var datumInUra = $("#dodajVitalnoDatumInUra").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
	var telesnaTemperatura = $("#dodajVitalnoTelesnaTemperatura").val();
	var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
	var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
	var nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val();
	var merilec = $("#dodajVitalnoMerilec").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
		    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		    committer: merilec
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}


/**
 * Pridobivanje vseh zgodovinskih podatkov meritev izbranih vitalnih znakov
 * (telesna temperatura, filtriranje telesne temperature in telesna teža).
 * Filtriranje telesne temperature je izvedena z AQL poizvedbo, ki se uporablja
 * za napredno iskanje po zdravstvenih podatkih.
 */
function preberiMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	var tip = $("#preberiTipZaVitalneZnake").val();

	if (!ehrId || ehrId.trim().length == 0 || !tip || tip.trim().length == 0) {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#rezultatMeritveVitalnihZnakov").html("<br/><span>Pridobivanje " +
          "podatkov za <b>'" + tip + "'</b> bolnika <b>'" + party.firstNames +
          " " + party.lastNames + "'</b>.</span><br/><br/>");
				if (tip == "telesna temperatura") {
					$.ajax({
  					    url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	var results = "<table class='table table-striped " +
                    "table-hover'><tr><th>Datum in ura</th>" +
                    "<th class='text-right'>Telesna temperatura</th></tr>";
						        for (var i in res) {
						            results += "<tr><td>" + res[i].time +
                          "</td><td class='text-right'>" + res[i].temperature +
                          " " + res[i].unit + "</td>";
						        }
						        results += "</table>";
						        $("#rezultatMeritveVitalnihZnakov").append(results);
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				} else if (tip == "telesna teža") {
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	var results = "<table class='table table-striped " +
                    "table-hover'><tr><th>Datum in ura</th>" +
                    "<th class='text-right'>Telesna teža</th></tr>";
						        for (var i in res) {
						            results += "<tr><td>" + res[i].time +
                          "</td><td class='text-right'>" + res[i].weight + " " 	+
                          res[i].unit + "</td>";
						        }
						        results += "</table>";
						        $("#rezultatMeritveVitalnihZnakov").append(results);
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				} else if (tip == "telesna temperatura AQL") {
					var AQL =
						"select " +
    						"t/data[at0002]/events[at0003]/time/value as cas, " +
    						"t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as temperatura_vrednost, " +
    						"t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as temperatura_enota " +
						"from EHR e[e/ehr_id/value='" + ehrId + "'] " +
						"contains OBSERVATION t[openEHR-EHR-OBSERVATION.body_temperature.v1] " +
						"where t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude<35 " +
						"order by t/data[at0002]/events[at0003]/time/value desc " +
						"limit 10";
					$.ajax({
					    url: baseUrl + "/query?" + $.param({"aql": AQL}),
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	var results = "<table class='table table-striped table-hover'>" +
                  "<tr><th>Datum in ura</th><th class='text-right'>" +
                  "Telesna temperatura</th></tr>";
					    	if (res) {
					    		var rows = res.resultSet;
						        for (var i in rows) {
						            results += "<tr><td>" + rows[i].cas +
                          "</td><td class='text-right'>" +
                          rows[i].temperatura_vrednost + " " 	+
                          rows[i].temperatura_enota + "</td>";
						        }
						        results += "</table>";
						        $("#rezultatMeritveVitalnihZnakov").append(results);
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}

					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				}
	    	},
	    	error: function(err) {
	    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
}


$(document).ready(function() {

  /**
   * Napolni testne vrednosti (ime, priimek in datum rojstva) pri kreiranju
   * EHR zapisa za novega bolnika, ko uporabnik izbere vrednost iz
   * padajočega menuja (npr. Pujsa Pepa).
   */
  $('#preberiPredlogoBolnika').change(function() {
    $("#kreirajSporocilo").html("");
    var podatki = $(this).val().split(",");
    $("#kreirajIme").val(podatki[0]);
    $("#kreirajPriimek").val(podatki[1]);
    $("#kreirajDatumRojstva").val(podatki[2]);
  });

  /**
   * Napolni testni EHR ID pri prebiranju EHR zapisa obstoječega bolnika,
   * ko uporabnik izbere vrednost iz padajočega menuja
   * (npr. Dejan Lavbič, Pujsa Pepa, Ata Smrk)
   */
	$('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});

  /**
   * Napolni testne vrednosti (EHR ID, datum in ura, telesna višina,
   * telesna teža, telesna temperatura, sistolični in diastolični krvni tlak,
   * nasičenost krvi s kisikom in merilec) pri vnosu meritve vitalnih znakov
   * bolnika, ko uporabnik izbere vrednosti iz padajočega menuja (npr. Ata Smrk)
   */
	$('#preberiObstojeciVitalniZnak').change(function() {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("");
		var podatki = $(this).val().split("|");
		$("#dodajVitalnoEHR").val(podatki[0]);
		$("#dodajVitalnoDatumInUra").val(podatki[1]);
		$("#dodajVitalnoTelesnaVisina").val(podatki[2]);
		$("#dodajVitalnoTelesnaTeza").val(podatki[3]);
		$("#dodajVitalnoTelesnaTemperatura").val(podatki[4]);
		$("#dodajVitalnoKrvniTlakSistolicni").val(podatki[5]);
		$("#dodajVitalnoKrvniTlakDiastolicni").val(podatki[6]);
		$("#dodajVitalnoNasicenostKrviSKisikom").val(podatki[7]);
		$("#dodajVitalnoMerilec").val(podatki[8]);
	});

  /**
   * Napolni testni EHR ID pri pregledu meritev vitalnih znakov obstoječega
   * bolnika, ko uporabnik izbere vrednost iz padajočega menuja
   * (npr. Ata Smrk, Pujsa Pepa)
   */
	$('#preberiEhrIdZaVitalneZnake').change(function() {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("");
		$("#rezultatMeritveVitalnihZnakov").html("");
		$("#meritveVitalnihZnakovEHRid").val($(this).val());
	});


	$("CivilistShrani").click(function(){
		alert("LA");
		var ime = $("#kreirajIme").val();
		var priimek = $("#kreirajPriimek").val();
		var datumRojstva = $("#kreirajDatumRojstva").val();
		var teza = $("#dodajTezo").val();
		var temp = $("#dodajTelesnoTemp").val();
		var simptomi = $("#VnosSimptomov").val();
		var telefon = $("#dodajTelefonsko").val();
		var urgenten = false;
		var sladkor = false;
		var visina = $("#dodajTelesnoVisino").val();
		
		if(document.getElementById("izberiUrgenten").checked)
		{
	    	urgenten = true;
		}
		if(document.getElementById("izberiSladkor").checked)
		{
	    	sladkor = true;
		}
		if (!ime || !priimek || !datumRojstva || !teza || !temp || !simptomi || !telefon || !visina  || ime.trim().length == 0 || priimek.trim().length == 0 || datumRojstva.trim().length == 0 || teza.trim().length == 0 || temp.trim().length == 0 || simptomi.trim().length == 0|| telefon.trim().length == 0|| visina.trim().length == 0) {
			$("#kreirajSporocilo").html("<span class='obvestilo label " + "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
		} 
		else{
			ustvariEHRzaGeneriran(ime, priimek, datumRojstva);
			var ehrId = kreiranEHR;
			alert("SSSem v civilistu - BEREM IZ INPUTA "+($("#preberiEHRid").val()));
			
			var bolnik = {
				name: ime,
				surname: priimek,
				dateB: datumRojstva,
				tel: telefon,
				bodyWeight: teza,
				bodyHeight: visina,
				bodyTemp: temp,
				simptoms: simptomi,
				urgent: urgenten,
				sugar: sladkor,
				ehr: $("#preberiEHRid").val()
			};
			alert(bolnik.ehr);
			tabela_civilisti.push(bolnik);
		}
	});


});