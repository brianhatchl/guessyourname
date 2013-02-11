var apikey = "AIzaSyADIJfIELDuoquRbeHRBRim299rwt5sElI";
var table = "1gHlGT7lHD-6p4-YndpiAhgdC2ySsYBZBnnE";
var fusionurl = "https://www.googleapis.com/fusiontables/v1/query?";
var gender;
var url;
var year;
var letter;
var maleNames, femaleNames, names;
var numGuess = 1;


$(document).ready( function() {
    
    $("#year").hide();
    $("#letter").hide();
    $("#guess").hide();
    $("#gender").hide();
    $("#male").hide();
    $("#female").hide();
    $("#answer").hide();
    $("#startover").hide();
   
    url = fusionurl + "sql=SELECT 'Male name' FROM " + table + " WHERE rank = 1 AND year >= '1/1/1940' AND year <= '12/31/2011' GROUP BY 'Male name'&key=" + apikey;
    $.get(url, function (data) {
        maleNames = $.parseJSON(data);
        $("#gender").show();
        $("#male").show();
    });
    
    url = fusionurl + "sql=SELECT 'Female name' FROM " + table + " WHERE rank = 1 AND year >= '1/1/1940' AND year <= '12/31/2011' GROUP BY 'Female name'&key=" + apikey;
    $.get(url, function (data) {
        femaleNames = $.parseJSON(data);
        $("#gender").show();
        $("#female").show();
    });
        
    $(".gender").click( function() {
        gender = $(this).text();

        var randomIndex;
        switch (gender) {
        case "Male":
            randomIndex = Math.floor(maleNames["rows"].length * Math.random());
            $("#name").text(maleNames["rows"][randomIndex][0]);
            break;
        default:
            randomIndex = Math.floor(femaleNames["rows"].length * Math.random());
            $("#name").text(femaleNames["rows"][randomIndex][0]);
            break;
        }
        $("#guess").show();
        $("#gender").hide();

    });

    $(".year").change( function() {
        year = $(this).val();
        if (year > 2008) year = 2008;
        limit = 5;
        url = fusionurl + "sql=SELECT '" + gender + " name', 'rank' FROM " + table + " WHERE year >= '1/1/" + year + "' AND year <= '12/31/" + year + "' ORDER BY rank LIMIT " + limit + "&key=" + apikey;
        
        $.get(url, function (data) {
            names = $.parseJSON(data);
            randomIndex = Math.floor(names["rows"].length * Math.random());
            $("#name").text(names["rows"][randomIndex][0]);
            $("#guess").show();
            $("#year").hide();
        });
    });

    $(".letter").change( function() {
        letter = $(this).val();
        limit = 25;
        url = fusionurl + "sql=SELECT '" + gender + " name', 'rank' FROM " + table + " WHERE year >= '1/1/" + year + "' AND year <= '12/31/" + year + "' AND '" + gender + " name' STARTS WITH '" + letter + "' ORDER BY rank LIMIT " + limit + "&key=" + apikey;
        
        $.get(url, function (data) {
            names = $.parseJSON(data);
            //randomIndex = Math.floor(name["rows"].length * Math.random());
            //$("#name").text(name["rows"][randomIndex][0]);
            $("#name").text(names["rows"][0][0]);
            $("#guess").show();
            $("#letter").hide();
        });
    });

    $("#yes").click( function() {
        $("#answer").show();
        $("#correct").text("It took me " + numGuess + " guesses.")
        $("#guess").hide();
        
        url = fusionurl + "sql=SELECT '" + gender + " name', 'rank' FROM " + table + " WHERE '" + gender + " name' = '" + $("#name").text() + "' ORDER BY year&key=" + apikey;
        
        $.get(url, function (data) {
            var namePopularity = $.parseJSON(data);
            //Show popularity graph
            $("#startover").show();
        });
    });

    $("#no").click( function() {
        if (numGuess === 1) {
            $("#year").show();
            $("#gender").hide();
            $("#guess").hide();
        } else if (numGuess === 2) {
            $("#gender").hide();
            $("#year").hide();
            $("#letter").show();
            $("#guess").hide();
        } else if (numGuess-2 > names["rows"].length-1) {
            $("#answer").show();
            $("#correct").text("I give up :-(")
            $("#guess").hide();
            $("#startover").show();
        } else {
            $("#name").text(names["rows"][numGuess-2][0]);
            $("#guess").show();
            $("#letter").hide();
        }
        numGuess++;
    });

    $("#startover").click( function() {
        $("#answer").hide();
        $("#gender").show();
        numGuess = 1;
    });
});