$("#form_forgot").bind('submit', function(e) {
    // prevent page refresh
    e.preventDefault();
    if (check_form()){
        $("#form_forgot input[type='submit']").addClass("disable");
        // post the data
        $.ajax({
            type: "POST",
            data: $("#form_forgot").serialize(),
            url: "/forgot/forgot_mail"
        }).done(function(data){
            $("#message").css('color', '#2a882a');
            $("#message").text(data);
            $("#form_forgot input[type='email']").val('');
            setTimeout(function() {
                $("#message").css('color', 'white');
                $("#message").text('-');
                $("#form_forgot input[type='submit']").removeClass("disable");
            }, 3000);
        });
    }
});
// validate
function check_form(){
  is_error = true
  email = $("#email").val()
  message = $("#message")
  if (email == '') {
    message.text('El campo correo se encuentra vacio');
    message.css('color', '#D5303E');
    is_error = false;
  }
  else if (ValidateEmail(email) == false){
    is_error = ValidateEmail(email);
    message.text('El email no contiene un formato correcto');
    message.css('color', '#D5303E');
  }
  return is_error
}
function ValidateEmail(mail) {
  format = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return format.test(String(mail).toLowerCase());
}