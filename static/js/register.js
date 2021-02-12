$("#form_register").bind('submit', function(e) {
    // prevent page refresh
    e.preventDefault();
    if (check_form()){
        $("#form_register input[type='submit']").addClass("disable");
        // post the data
        $.ajax({
            type: "POST",
            data: $("#form_register").serialize(),
            url: "/register"
        }).done(function(data){
            if (data['error']){
              $("#message").css('color', '#D5303E');
              $("#message").text(data['error']);
              setTimeout(function() {
                  $("#message").css('color', 'white');
                  $("#message").text('-');
                  $("#form_register input[type='submit']").removeClass("disable");
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
  name = $("#name").val()
  email = $("#email").val()
  password = $("#password").val()
  password_r = $("#password_r").val()
  message = $("#message")
  if (name == '') {
    message.text('El campo nombre se encuentra vacio');
    message.css('color', '#D5303E');
    is_error = false;
  }
  else if (email == '') {
    message.text('El campo correo se encuentra vacio');
    message.css('color', '#D5303E');
    is_error = false;
  }
  else if (password == ''){
    message.text('El campo contraseña se encuentra vacio');
    message.css('color', '#D5303E');
    is_error = false;
  }
  else if (password_r == ''){
    message.text('El campo repita contraseña se encuentra vacio');
    message.css('color', '#D5303E');
    is_error = false;
  }
  else if (password != password_r){
    message.text('Las contraseñas no coinciden');
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