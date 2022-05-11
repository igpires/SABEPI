// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require jquery
//= require datatables

const defaultSelectSubject = `<option value='null'>select topic</option>`;
const defaultSelectTopic = `<option value='null'>select topic</option>`;

$(".custom-switch").on('change', function(){
  var label = $(this).children('label')
  var input = $(this).children('input')
  var classroomId = input.prop('id')
  
  Rails.ajax({
    type: "GET",
    dataType: "json", 
    url: "/users_backoffice/classrooms/switch/" +  classroomId,
    data: "",
    success: function(data){
      console.log(data);
      if (input.is(':checked')){
        label.text('Ativada').removeClass('text-danger').addClass('text-success')
      }else{
        label.text('Desativada').removeClass('text-success').addClass('text-danger')
      }; 
    },
    error: function(data){
      console.log(data);
    }
  })
});


$("#dataTable").dataTable();


$('#dataTableOrder').dataTable({
  "order": []
} );

function disabled(element){
 $(element).removeAttr("disabled");
}
function enabled(element){
  $(element).attr("disabled", "disabled");
 }

// filter subjects by course
$(function(){
  $(".filter #course_id").on('change',function(){
    Rails.ajax({
      type: "GET",
      dataType: "json", 
      url: "/search/subjects_by_course/" + this.value,
      data: "",
      success: function(data){
        var htmlOptions = defaultSelectSubject
        for(var i = 0; i < data.length; i++){
          htmlOptions += "<option value='"+ data[i].id +"'>" + data[i].name +"</option>"
        }
        disabled('.filter #trigger #subject_id');
        if (data.length <= 0){
          htmlOptions = "<option value='null'>Empty</option>"
          $(".filter #subject_id").html(htmlOptions)
        }else {
          $(".filter #subject_id").html(htmlOptions)
        } 
      },
      error: function(){
        enabled('.filter #trigger #subject_id')
        enabled('.filter #trigger #topic_id') 
        enabled('.filter #trigger #question_id')
      }
    })
  })
})

// filter topics by subjects
$(function(){
  $(".filter #subject_id").on('change',function(){
    if($('.filter #trigger #3').length > 0){
      Rails.ajax({
        type: "GET",
        dataType: "json", 
        url: "/search/topics_by_subject/" + this.value,
        data: "",
        success: function(data){
          var htmlOptions = defaultSelectTopic
          for(var i = 0; i < data.length; i++){
            htmlOptions += "<option value='"+ data[i].id +"'>" + data[i].name +"</option>"
          }
          disabled('.filter #trigger #topic_id');
          if (data.length <= 0){
            htmlOptions = "<option value='null'>Empty</option>"
            $(".filter #topic_id").html(htmlOptions)
          }else {
            $(".filter #topic_id").html(htmlOptions)
          }
          
          
        },
        error: function(data){
          enabled('.filter #trigger #topic_id') 
        }
      })
    }else{
      disabled('.filter #trigger #topic_id');
      $('.filter #trigger #topic_id').on('keyup', () => {
       sizeInput = $('.filter #trigger #topic_id').val().length
       if(sizeInput > 4){
        $('.filter #trigger #button').show()
       }else{
        $('.filter #trigger #button').hide()
       }
      })
      
    }
    
  })
})

$(function(){
  $(".filter #topic_id").on('change',function(){
    if($('.filter #trigger #3').length > 0){
      if ($('.filter #trigger #topic_id').val() === 'null') {
        enabled('.filter #trigger #question_id');
      }else{
        disabled('.filter #trigger #question_id');
      }
    }
  })
})

