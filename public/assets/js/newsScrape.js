


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
    // console.log(" savebtn",$(".saveBtn"));
    //get this article's id
    let id=$(this).val();
    
    console.log("id",id);
    // $.post("/saveNews/"+id,data=>{
    $.ajax({
        method: "POST",
        url: "/saveNews/"+id,
        data: ""
    })
    // With that done
    .then(function(data) {
        console.log("data",data);
    });
})

   
// $(document).on("click",".noteBtn",function(event) {  

//     $.post("/",reqData,function(data){
//         console.log("return",data);
//         // location.reload();
//         window.location.href("/news");
//     })

// })    