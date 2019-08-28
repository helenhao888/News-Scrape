


$(document).on("click",".scrapeLi",function(event){  
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
      
        $(".modal-content p").text(text);    
        $("#modal-info").modal("open");        
      }
      
    });

    // $.post("/scrape",reqData,function(data){
    //     console.log("return",data);
    //     // location.reload();
    //     window.location.href("/news");
    // })
});


$(document).on("click",".modal-close",function(event){ 
 
  //redirect to news page
  window.location.href = "/news" ;

});
