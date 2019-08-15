var cc = {
     
      // On like click 
      likeVideoRating: function () {
              console.log( "This was liked!" );
            }
};

$( ".like" ).click(function() {
    cc.likeVideoRating();
});

