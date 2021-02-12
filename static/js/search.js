var date = $("input[type='date']");
$(date).change(function(){
      $.ajax({
          type: "POST",
          data: {'date': $(date).val()},
          url: "/search"
      }).done(function(data){
          is_empty = $.isEmptyObject(data);
          html = '';
          if (!is_empty){
            $.each(data, function() {
              html += "<tr>";
              html += "<th>" + this[1] + "</th>";
              html += "<td>" + this[2] + "</td>";
              html += "<td>" + moment(this[3]).format('MM/DD/YYYY HH:MM:SS') + "</td>";
              html += "</tr>";
            });
          }
          else{
            html = "<tr><td colspan='3' style='text-align: center'>No se han encontrado registros</td></tr>";
          }
        $("tbody").html(html)
      });
});
$(document).ready(function() {
  $(".format").each(function(index) {
    format = moment($(this).text()).format('MM/DD/YYYY HH:MM:SS');
    $(this).text(format)
  });
})