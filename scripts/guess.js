var apikey = "AIzaSyADIJfIELDuoquRbeHRBRim299rwt5sElI";
var table = "1gHlGT7lHD-6p4-YndpiAhgdC2ySsYBZBnnE";
var fusionurl = "https://www.googleapis.com/fusiontables/v1/query?";
var gender;
var url;
var year;
var letter;
var maleNames, femaleNames;


$(document).ready( function() {
    
    url = fusionurl + "sql=SELECT 'Male name' FROM " + table + " WHERE rank = 1 AND year >= '1/1/1940' AND year <= '12/31/2011' GROUP BY 'Male name'&key=" + apikey;
    $.get(url, function (data) {
        maleNames = $.parseJSON(data);
    });
    
    url = fusionurl + "sql=SELECT 'Female name' FROM " + table + " WHERE rank = 1 AND year >= '1/1/1940' AND year <= '12/31/2011' GROUP BY 'Female name'&key=" + apikey;
    $.get(url, function (data) {
        femaleNames = $.parseJSON(data);
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
    });

    $(".year").change( function() {
        year = $(this).val();
        limit = 5;
        url = fusionurl + "sql=SELECT '" + gender + " name', 'rank' FROM " + table + " WHERE year >= '1/1/" + year + "' AND year <= '12/31/" + year + "' ORDER BY rank LIMIT " + limit + "&key=" + apikey;
        
        $.get(url, function (data) {
            var name = $.parseJSON(data);
            randomIndex = Math.floor(name["rows"].length * Math.random());
            $("#name").text(name["rows"][randomIndex][0]);
        });
    });

    $(".letter").change( function() {
        letter = $(this).val();
        limit = 3;
        url = fusionurl + "sql=SELECT '" + gender + " name', 'rank' FROM " + table + " WHERE year >= '1/1/" + year + "' AND year <= '12/31/" + year + "' AND '" + gender + " name' STARTS WITH '" + letter + "' ORDER BY rank LIMIT " + limit + "&key=" + apikey;
        
        $.get(url, function (data) {
            var name = $.parseJSON(data);
            randomIndex = Math.floor(name["rows"].length * Math.random());
            $("#name").text(name["rows"][randomIndex][0]);
        });
    });

});