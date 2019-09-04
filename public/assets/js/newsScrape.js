$(document).ready(function(){

    //initialize modal
    $(".modal").modal();

    // initialize materialized sidenav. after click, close the sidenav. 
    
    $('.sidenav').sidenav()
    .on('click tap', 'li a', () => {
        $('.sidenav').sidenav('close');
    });

    $(document).on("click",".scrapeNews",function(event){  
    event.preventDefault();
    var displayText;

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


    $(document).on("click",".news-modal-close",function(event){ 
    
    //redirect to news page

        window.location.href = "/";
    });

    $(".saveBtn").on("click", function(event){

        event.preventDefault();
        console.log("click save btn", $(this));
        //get this article's id
        var saveButton = $(this);
        var id=$(this).val();
        
        $.ajax({
            method: "PUT",
            url: "/savenews/"+id,
            data: ""
        })
        .then(function(data) {
            console.log("data",data);
            $(saveButton).prop('disabled',true).css('opacity',0.5);
           
        });
    })

    $(".unsaveBtn").on("click", function(event){

        event.preventDefault();
        
        //get this article's id
        var id=$(this).val();    
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
        var id=$(this).val();
        
        console.log("id",id);
        var newsHeader = $("#modal-note h4").text();
        $("#modal-note h4").text(newsHeader + id);
        $("#saveNote").val(id);
        // $("#modal-note").modal("open");  
        getNotes(id);  
    
    })

    function getNotes(id){
    //use news id to get all the notes associated with this news
        $("#noteList").empty();
        $.ajax({
            method: "GET",
            url: "/notes/"+id,
            data: ""
        })
        .then(function(response) {
            
            if(response.status === "success"){
                console.log("success",response.data);
                for ( let i=0;i<response.data.notes.length;i++){
                    let note = response.data.notes[i];           
                    console.log("id",id);
                    console.log("note id",note._id)    
                    var card =$("<div>").addClass("card").attr("data-id",id);
                    let cardHeader = $("<div>").addClass("card-header").text(note.title);
                    let cardBody = $("<div>").addClass("card-body").text(note.body);
                    let delLink = $("<a>").attr({"href":"#","data-news-id":id,"data-id":note._id})
                                .addClass("deleteLink").text("Delete");
                    
                    let iTag = $("<i>").addClass("fa fa-trash").attr("aria-hidden","true").val(note._id);
                    $(delLink).append($(iTag));
                    $(cardBody).append(delLink);                
                    $(card).append($(cardHeader),$(cardBody))            
                    $("#noteList").append($(card));
                    
                }
                $("#modal-note").modal("open");   
            }
            
        });
    }


    $("#saveNote").on("click",function(event){

        //validate input title and body
        let title = $("#titleinput").val();
        let body = $("#bodyinput").val();
        let id = $("#saveNote").val();   
        $("#inputMsg").empty();

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
            .then(function(response) {

                if(response.status === "success"){
                $("#titleinput").val("");
                $("#bodyinput").val("");
                getNotes(id);
                }else{
                $("#inputMsg").append($("<p>").text(response.data));
                }       
                
            });

        }else{
    
            console.log("input empty err");
            //add err message to modal info
            $("#inputMsg").append($("<p>").text("Please input note title and body!"));
        }

    })


    $(document).on("click",".deleteLink",function(event){

        event.preventDefault();
        //get note id
        let delId = $(this).attr("data-id");
        let newsId = $(this).attr("data-news-id");
        console.log("delid",delId);
        $.ajax({
            method: "DELETE",
            url: "/deleteNotes/"+delId,
            data: ""
        })
        .then(function(response) {

            if(response.status === "success"){
            //get news id
            getNotes(newsId);
            }       
            
        });
    });


})