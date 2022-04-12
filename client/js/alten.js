let idToUpdate=null;
let daysInUse = 0;
let maxDaysToBook = 3;
let totalDaysRecord = 0;

function setPropertiesEndDate(){
    startDate = $("#startDate").datepicker('getDate');
    if(startDate){
        $("#endDate").datepicker('update','');
        endDate = moment(startDate).add((maxDaysToBook-daysInUse)-1, 'days').toDate();
        $('#endDate').datepicker('setStartDate', startDate);
        $('#endDate').datepicker('setEndDate', endDate);
    }
}

function getDataUser(){
    daysInUse=0;
    idToUpdate=null;
    resetFields();
    getAllActiveDates("0");
    $("#saveReservation").show();
    $("#updateReservation").hide();
    if($("#cellphone").val()){
        fetch('http://localhost:9191/reservation/getDataUser/'+$("#cellphone").val())
            .then(response => response.json())
            .then(json => printReservation(json))
    }
}

function saveReservation(){
    if(validateFields()){
        data = createDataToSend();

        fetch("http://localhost:9191/reservation", {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => getDataUser());
    } else {
        alert("complete all fields");
    }

}

function createDataToSend(){
    startDate = moment($("#startDate").datepicker('getDate')).format('YYYY-MM-DD');
    if((maxDaysToBook - daysInUse) <= 1){
        endDate = startDate;
    } else {
        endDate = moment($("#endDate").datepicker('getDate')).format('YYYY-MM-DD');
    }
    var data = {
        id:(idToUpdate?idToUpdate:""),
        cellphone: $("#cellphone").val(),
        name: $("#name").val(),
        startDate: startDate,
        endDate: endDate,
        state: 1
    };

    return data;
}

function cancelReservation(reservation){
    var data = {id: reservation };
    fetch("http://localhost:9191/reservation/cancel", {
        method: 'PUT', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => getDataUser());
}

function updateReservation(){
    if(validateFields()) {
        data = createDataToSend();

        fetch("http://localhost:9191/reservation", {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => getDataUser());
    } else {
        alert("complete all fields");
    }
}

function ActivateUpdateReservation(reservation, startDate, endDate, name, days){
    daysInUse = totalDaysRecord - days;
    idToUpdate = reservation;
    validateDaysInUse();
    getAllActiveDates(reservation);
    $("#name").val(name)
    startDateFormat = moment(startDate).toDate();
    $('#startDate').datepicker('setDate', startDateFormat);

    $('#endDate').datepicker('setStartDate', startDateFormat);
    endDatelimit = moment(startDate).add((maxDaysToBook-daysInUse)-1, 'days').toDate();
    $('#endDate').datepicker('setEndDate', endDatelimit);

    endDateformat = moment(endDate).toDate();
    $('#endDate').datepicker('setDate', endDateformat);
    $("#saveReservation").hide();
    $("#updateReservation").show();
}

function printReservation(data){
    let html ="";
    let active = "<label style='color:green'>Active</label>";
    let inactive = "<label style='color:red'>Inactive</label>";
    if(data){
        data.forEach((row) =>{
            if(row.state){
                daysInUse = daysInUse + row.numberDay;
            }
            let cancelButton = '<button id="saveReservation" type="button" class="btn btn-danger" onclick="cancelReservation(\''+row.id+'\')">Cancel</button>';
            let updateButton = '<button id="saveReservation" type="button" class="btn btn-primary" onclick="ActivateUpdateReservation(\''+row.id+'\',\''+formatTime(row.startDate)+'\',\''+formatTime(row.endDate)+'\',\''+row.name+'\',\''+row.numberDay+'\')">Update</button>';
            html = html+"<tr>" +
                "       <th scope='row'>"+row.id+"</th>" +
                "       <td>"+formatTime(row.startDate)+"</td>" +
                "       <td>"+formatTime(row.endDate)+"</td>" +
                "       <td>"+row.numberDay+"</td>" +
                "       <td>"+row.name+"</td>" +
                "       <td>"+(row.state?active:inactive)+"</td>" +
                "       <td>"+(row.state?cancelButton+updateButton:"")+"</td>" +
                "    </tr>";
        });
        totalDaysRecord = daysInUse;
        validateDaysInUse();
        $("#tbodyReservations").html(html);
    }
}

function validateDaysInUse(){
    $("#daysLeft").val(maxDaysToBook-daysInUse);
    if(daysInUse>=maxDaysToBook){
        alert("you can't schedule more days");
        $("#saveReservation").hide();
    }
    if((maxDaysToBook-daysInUse) > 1){
        $("#divEndDate").show();
    } else {
        $("#divEndDate").hide();
    }
}

function formatTime(date){
    return moment(date).utcOffset("+02").format('YYYY-MM-DD');
}

function getAllActiveDates(id){
    fetch("http://localhost:9191/reservation/getAllActiveDates/"+id, {
        method: 'GET',
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => initializeDatePicker(response));
}

function initializeDatePicker(datesForDisable){
    $('#startDate').datepicker('destroy');
    $('#endDate').datepicker('destroy');
    $('#startDate').datepicker({
        startDate: '+1d',
        endDate: '+30d',
        autoclose: true,
        beforeShowDay: function (currentDate) {

            if (datesForDisable.length > 0) {
                for (var i = 0; i < datesForDisable.length; i++) {
                    if (moment(currentDate).unix()==moment(datesForDisable[i],'YYYY-MM-DD').unix()){
                        return false;
                    }
                }
            }
            return true;
        }
    });
    $('#endDate').datepicker({
        startDate: '+1d',
        endDate: '+30d',
        autoclose: true,
        beforeShowDay: function (currentDate) {

            if (datesForDisable.length > 0) {
                for (var i = 0; i < datesForDisable.length; i++) {
                    if (moment(currentDate).unix()==moment(datesForDisable[i],'YYYY-MM-DD').unix()){
                        return false;
                    }
                }
            }
            return true;
        }
    });
    startDate = $("#startDate").datepicker('getDate');
    if(startDate){
        endDate = moment(startDate).add((maxDaysToBook-daysInUse)-1, 'days').toDate();
        $('#endDate').datepicker('setStartDate', startDate);
        $('#endDate').datepicker('setEndDate', endDate);
    }
}

function resetFields(){
    $("#startDate").datepicker('update','');
    $('#endDate').datepicker('update', '');
    $("#name").val('')
}
$(function() {
    getAllActiveDates();
    $("#divEndDate").hide();
    $("#updateReservation").hide();

});

function validateFields(){
    if($("#daysLeft").val() === "1"){
        if($("#startDate").datepicker('getDate') && $("#cellphone").val() && $("#name").val()){
            return true;
        } else {
            return false;
        }
    }else {
        if($("#startDate").datepicker('getDate') && $("#endDate").datepicker('getDate') && $("#cellphone").val() && $("#name").val()){
            return true;
        } else {
            return false;
        }
    }
}