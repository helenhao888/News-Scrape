// $(".scrapeLi").on("click",event => {

$(document).on("click",".scrapeLi",function(event){  
  event.preventDefault();
  console.log("scrapeLi click");

  $.ajax("/scrape", {
    type: "POST",
    data: ""
  }).then(
    function (response) {      
      console.log(response);
      //redirect to news page
      window.location.href = "/news";
    }).
    fail(function(err){
      console.log("err",err);
    });
    // $.post("/scrape",reqData,function(data){
    //     console.log("return",data);
    //     // location.reload();
    //     window.location.href("/news");
    // })
});