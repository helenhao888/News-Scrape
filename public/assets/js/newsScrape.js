


$(document).on("click",".scrapeNews",function(event){  
  event.preventDefault();
  let displayText;

  console.log("scrapeLi click");
  $(".modal-body-info").empty();

  $.ajax("/scrape", {
    type: "POST",
    data: ""
  }).then(
    function (response) {      
      console.log(response);
   
      if (response.status === "success"){
        if ( response.data.count === 0 ){
          displayText = "No more new articles right now, try it later !";
        }else{
          displayText = "Added "+response.data.count+" new articles !";
        }
      
        $(".modal-content p").text(displayText);    
        $("#modal-info").modal("open");        
      }
      
    });

});


$(document).on("click",".modal-close",function(event){ 
 
  //redirect to news page
  window.location.href = "/news" ;

});

$(".saveBtn").on("click", function(event){

    event.preventDefault();
    console.log("click save btn", $(this));
    //get this article's id
    let id=$(this).val();
    
    console.log("id",id);
    // $.post("/saveNews/"+id,data=>{
    $.ajax({
        method: "PUT",
        url: "/savenews/"+id,
        data: ""
    })
    // With that done
    .then(function(data) {
        console.log("data",data);
    });
})

$(".unsaveBtn").on("click", function(event){

    event.preventDefault();
    console.log("click unsave btn", $(this));
    
    //get this article's id
    let id=$(this).val();    
    console.log("id",id);

    $.ajax({
        method: "PUT",
        url: "/unsavenews/"+id,
        data: ""
    })
    // With that done
    .then(function(data) {
        console.log("data",data);
        location.reload();
    });
})
   
$(".noteBtn").on("click", function(event){

    event.preventDefault();
    //get this article's id
    let id=$(this).val();
    
    console.log("id",id);
    let newsHeader = $("#modal-note h4").text();
    $("#modal-note h4").text(newsHeader + id);
    $("#saveNote").val(id);
    $("#modal-note").modal("open");    
    $.ajax({
        method: "GET",
        url: "/notes/"+id,
        data: ""
    })
    // With that done
    .then(function(response) {
        
        if(response.status === "success"){
            console.log("success",response.data);
            for ( let i=0;i<response.data.notes.length;i++){
                let note = response.data.notes[i];               
                var card =$("<div>").addClass("card");
                let cardHeader = $("<div>").addClass("card-header").text(note.title);
                let cardBody = $("<div>").addClass("card-body").text(note.body);
                let delLink = $("<a>").attr({"href":"#","id":"deleteId"}).text("Delete").val(note.id);
               
                let iTag = $("<i>").addClass("fa fa-trash").attr("aria-hidden","true").val(note.id);
                $(delLink).append($(iTag));
                $(cardBody).append(delLink);                
                $(card).append($(cardHeader),$(cardBody))            
                $("#noteList").append($(card));
                
            }
            $("#modal-note").modal("open");   
        }
         
    });
})

$("#saveNote").on("click",function(event){

    //validate input title and body
    let title = $("#titleinput").val();
    let body = $("#bodyinput").val();
    let id = $("#saveNote").val();

    if( title !== "" &&  body !== "" && id !== ""){
        let dataInput ={
            title: title,
            body : body
        }
        
        console.log("data input",dataInput);

        $.ajax({
            method: "POST",
            url: "/addNotes/"+id,
            data: dataInput
        })
        .then(function(data) {
            console.log("data",data);
            
        });

    }else{
        console.log("input empty err");
        //add modal info here
    }

})