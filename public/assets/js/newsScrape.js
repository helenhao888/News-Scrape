// $(".scrapeLi").on("click",event => {

$(document).on("click",".scrapeLi",function(event){  
  event.preventDefault();
  console.log("scrapeLi click");

  $.ajax("/scrape", {
    type: "POST",
    data: ""
  }).then(
    function (response) {
      //should recieve a response of success, if it works
      console.log(response);
      //reload news page
      location.reload();
    //   window.location.href = "/news";
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