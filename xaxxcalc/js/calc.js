function proviRechner() {
    //Gewinn Eigenumsatz berechnen
    var eigenumsatzpw = parseInt($("#eigenumsatz").val());
    var gewinnzahleigenumsatz = ((eigenumsatzpw * (1 + 0.4)) - eigenumsatzpw).toFixed(2);
    $("#gewinnzahleigen").text(gewinnzahleigenumsatz);

    //Partnerumsätze (PW) in Liste speichern
    var partnerumsatzpwlist = $('.partnerumsatz').map(function(idx, elem) {
        return $(elem).val();
      }).get();

    //Partnerumsätze (PW) addieren
    var fremdumsatzpw = partnerumsatzpwlist.reduce(function(a,b) {
        return (+a)+(+b);
    });

    //Stufe (%) berechnen mithilfe des Gesamtumsatzes
    var gesamtumsatzpw = eigenumsatzpw + fremdumsatzpw;

    if (gesamtumsatzpw < 250) {
        var prozentstufe = 0;
    } else if (gesamtumsatzpw >= 250 && gesamtumsatzpw < 500) {
        var prozentstufe = 3;
    } else if (gesamtumsatzpw >= 500 && gesamtumsatzpw < 1000) {
        var prozentstufe = 6;
    } else if (gesamtumsatzpw >= 1000 && gesamtumsatzpw < 2000) {
        var prozentstufe = 9;
    } else if (gesamtumsatzpw >= 2000 && gesamtumsatzpw < 4000) {
        var prozentstufe = 11;
    } else if (gesamtumsatzpw >= 4000) {
        var prozentstufe = 16;
    }
    $("#stufeprozent1").text(prozentstufe);
    $("#stufeprozent2").text(prozentstufe);

    //Berechnen des Gewinnes an den Partnern

    var partneranzahl = parseInt($("#direkte-anzahl :selected").val());

    var sechzehner = 0;

    var partnerumsatzeurolist = [];

    for(let i=1;i<partneranzahl;i++) {
        //var partnernummer = $(this).attr("id").replace("-partner-umsatz", "");
        if ($("#"+i+"-partner-umsatz").val() < 250) {
            var prozentstufe = 0;
        } else if ($("#"+i+"-partner-umsatz").val() >= 250 && $("#"+i+"-partner-umsatz").val() < 500) {
            var prozentstufe = 3;
        } else if ($("#"+i+"-partner-umsatz").val() >= 500 && $("#"+i+"-partner-umsatz").val() < 1000) {
            var prozentstufe = 6;
        } else if ($("#"+i+"-partner-umsatz").val() >= 1000 && $("#"+i+"-partner-umsatz").val() < 2000) {
            var prozentstufe = 9;
        } else if ($("#"+i+"-partner-umsatz").val() >= 2000 && $("#"+i+"-partner-umsatz").val() < 4000) {
            var prozentstufe = 11;
        } else if ($("#"+i+"-partner-umsatz").val() >= 4000) {
            var prozentstufe = 16;
        }
        
        $("#"+i+"-partner-prozentstufe").val(prozentstufe);

        var meinestufe = parseInt($("#stufeprozent1").text());

        if (meinestufe>prozentstufe) {

            var gewinnanpartnereuro = (($("#"+i+"-partner-umsatz").val()/100)*(meinestufe-prozentstufe)).toFixed(2);


            $("."+i+"-partner-gewinnzahl").text(gewinnanpartnereuro);
            //Partnerumsätze (euro) in Liste speichern
            partnerumsatzeurolist.push(gewinnanpartnereuro);
        } else if (prozentstufe == 16) {
            sechzehner++;
        } else {
            $("."+i+"-partner-gewinnzahl").text(0);
        }
    }

    //Gewinn bei 16%er ausrechnen

    if (sechzehner == 1) {
        var sonderbonus = 8;
    } else if (sechzehner == 2 || sechzehner == 3) {
        var sonderbonus = 9;
    } else if (sechzehner == 4 || sechzehner == 5) {
        var sonderbonus = 10;
    } else if (sechzehner > 5) {
        var sonderbonus = 11;
    }
    
    var partnerprozentstufelist = $("input[name$=-partner-prozentstufe]");
    for(let i = 0; i < partnerprozentstufelist.length; i++){ 
        if ($(partnerprozentstufelist[i]).val() == 16) {
            var idnumber = i+1;

            var gewinnanpartnereuro = (($("#"+idnumber+"-partner-umsatz").val()/100)*(sonderbonus)).toFixed(2);


            $("."+idnumber+"-partner-gewinnzahl").text(gewinnanpartnereuro);
            //Partnerumsätze (euro) in Liste speichern
            partnerumsatzeurolist.push(gewinnanpartnereuro);
        }
    }

    //Partnerumsätze (euro) addieren
    var fremdumsatzeuro = partnerumsatzeurolist.reduce(function(a,b) {
        return (+a)+(+b);
    });

    //Gewinn in Euro durch Bonus (eigen)
    var gewinnzahleigenbonus = ((eigenumsatzpw/100)*(meinestufe)).toFixed(2);
    $("#gewinnzahleigenbonus").text(gewinnzahleigenbonus);
    //Gewinn in Euro durch Partner
    $("#gewinnzahlpartner").text(parseInt(fremdumsatzeuro).toFixed(2));
    //Gewinn in Euro gesamt
    $("#gewinnzahlgesamt").text((parseInt(gewinnzahleigenumsatz)+parseInt(fremdumsatzeuro)+parseInt(gewinnzahleigenbonus)).toFixed(2));

    //Speichern zu localStorage

    var dirketelinien = parseInt($("#direkte-anzahl :selected").val()) - 1;

    //Partnernamen in Liste speichern
    var partnernamen = $('.partnername').map(function(idx, elem) {
        return $(elem).val();
      }).get();

    localStorage.setItem("eigenumsatz", eigenumsatzpw);
    localStorage.setItem("dirketelinien", dirketelinien);
    localStorage.setItem("partnernamen", JSON.stringify(partnernamen));
    localStorage.setItem("partnerumsätze", JSON.stringify(partnerumsatzpwlist));
}


$(document).ready(function() {
    $("#direkte-anzahl").on("input", function() {
        // Number of inputs to create
        var number = parseInt($("#direkte-anzahl :selected").val()) - 1;
        // Container <div> where dynamic content will be placed
        var container = document.getElementById("direkte-container");
        // Clear previous contents of the container
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
        for (i = 0; i < number; i++) {
            var idnumber = i+1;
            container.innerHTML += '<div class="grid-item"><div class="form-group"><label for="'+idnumber+'-partnername">Name (Partner)</label><input type="text" class="form-control partnername" name="'+idnumber+'-partnername" id="'+idnumber+'-partnername"></div></div>';

            container.innerHTML += '<div class="grid-item"><div class="form-group"><label for="'+idnumber+'-partner-prozentstufe">Prozentstufe (%)</label><input type="number" class="form-control" name="'+idnumber+'-partner-prozentstufe" access="false" id="'+idnumber+'-partner-prozentstufe" disabled></div></div>';

            container.innerHTML += '<div class="grid-item"><div class="form-group"><label for="'+idnumber+'-partner-umsatz">Umsatz (PW)<span>*</span></label><input type="number" class="form-control partnerumsatz" name="'+idnumber+'-partner-umsatz" access="false" id="'+idnumber+'-partner-umsatz" required="required" aria-required="true"></div></div>';

            container.innerHTML += '<div class="grid-item"><div class="innertext">Gewinn: <span class="'+idnumber+'-partner-gewinnzahl">0</span>€</div></div>';

        }
    });

    //Hier abfragen ob eine val in localStorage vorhanden ist, dann alle PWs adden und von func berechnen lassen
    if (localStorage.getItem('eigenumsatz')) {
        $('#eigenumsatz').val(localStorage.getItem('eigenumsatz'));
        $('#direkte-anzahl').val(parseInt(localStorage.getItem('dirketelinien'))+1).trigger("input");
        for (i = 0; i < localStorage.getItem('dirketelinien'); i++) {
            var idnumber = i+1;
            $('#'+idnumber+'-partnername').val(JSON.parse(localStorage.getItem("partnernamen"))[i]);
            $('#'+idnumber+'-partner-umsatz').val(JSON.parse(localStorage.getItem("partnerumsätze"))[i]);
        }
    };

});

function clearLocalStorage() {

    localStorage.clear();
    location.reload();

}

function formCheck() {

    var required = $('input,textarea,select').filter('[required]:visible');

    var allRequired = true;
    required.each(function(){
        if($(this).val() == ''){
            allRequired = false;
            $(this).addClass("error");
        }
    });

    if(!allRequired){
        alert("Nicht alle erforderlichen Felder (*) wurden ausgefüllt");
    } else {
        proviRechner();
    }

}
