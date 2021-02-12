$("#form_login").bind('submit', function(e) {
    // prevent page refresh
    e.preventDefault();
    // validate form
    if (check_form()){
      $("#form_login input[type='submit']").addClass("disable");
      // post the data
      $.ajax({
          type: "POST",
          data: $("#form_login").serialize(),
          url: "/login"
      }).done(function(data){
          if (data['error']){
            $("#message").css('color', '#D5303E');
            $("#message").text(data['error']);
            setTimeout(function() {
                $("#message").css('color', 'white');
                $("#message").text('-');
                $("#form_login input[type='submit']").removeClass("disable");
            }, 1500);
          }
          else{
            window.location.href = data;
          }
      });
    }
});
// validate
function check_form(){
  is_error = true
  email = $("#email").val()
  password = $("#password").val()
  message = $("#message")
  if (email == '') {
    message.text('El campo correo se encuentra vacio');
    message.css('color', '#D5303E');
    is_error = false;
  }
  else if (password == ''){
    message.text('El campo contraseña se encuentra vacio');
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